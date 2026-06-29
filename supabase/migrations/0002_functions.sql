-- ---------------------------------------------------------------------------
-- User provisioning: insert directly into auth.users + auth.identities so the
-- admin can create staff/client logins without a service-role key (browser SPA).
-- Returns the new user id. Internal — wrapped by invite_user() for the API.
-- ---------------------------------------------------------------------------
create or replace function create_auth_user(
  p_email    text,
  p_password text,
  p_name     text,
  p_role     user_role,
  p_client   uuid default null
) returns uuid
  language plpgsql security definer set search_path = public, auth, extensions as $$
declare
  uid uuid := gen_random_uuid();
  ini text := upper(left(coalesce(p_name, ''), 1)) ||
              upper(coalesce(substr(split_part(p_name, ' ', 2), 1, 1), ''));
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data, is_sso_user, is_anonymous,
    confirmation_token, recovery_token, email_change,
    email_change_token_new, email_change_token_current, reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000', uid, 'authenticated', 'authenticated',
    lower(p_email), crypt(p_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', p_name),
    false, false,
    '', '', '', '', '', ''
  );

  insert into auth.identities (
    id, provider_id, user_id, identity_data, provider, created_at, updated_at, last_sign_in_at
  ) values (
    gen_random_uuid(), uid, uid, jsonb_build_object('sub', uid::text, 'email', lower(p_email)),
    'email', now(), now(), now()
  );

  insert into profiles (id, full_name, email, role, client_id, initials)
  values (uid, p_name, lower(p_email), p_role, p_client, ini);

  return uid;
end;
$$;

-- Admin-only wrapper to provision a new user from the app.
create or replace function invite_user(
  p_email    text,
  p_password text,
  p_name     text,
  p_role     user_role,
  p_client   uuid default null
) returns uuid
  language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return create_auth_user(p_email, p_password, p_name, p_role, p_client);
end;
$$;

-- ---------------------------------------------------------------------------
-- Wallet: top-up (credit)
-- ---------------------------------------------------------------------------
create or replace function topup_wallet(
  p_client uuid, p_amount bigint, p_method text default 'UPI', p_ref text default ''
) returns bigint
  language plpgsql security definer set search_path = public as $$
declare bal bigint;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;
  update clients set balance_paise = balance_paise + p_amount
    where id = p_client returning balance_paise into bal;
  if bal is null then raise exception 'client not found'; end if;
  insert into ledger_entries (client_id, entry_type, description, amount_paise, balance_paise)
  values (p_client, 'CREDIT', 'Top-up via ' || p_method ||
          case when coalesce(p_ref,'') <> '' then ' (' || p_ref || ')' else '' end,
          p_amount, bal);
  return bal;
end;
$$;

-- ---------------------------------------------------------------------------
-- Wallet: manual adjustment (credit or debit)
-- ---------------------------------------------------------------------------
create or replace function adjust_wallet(
  p_client uuid, p_amount bigint, p_dir text, p_reason text default ''
) returns bigint
  language plpgsql security definer set search_path = public as $$
declare bal bigint; signed bigint;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if p_amount <= 0 then raise exception 'amount must be positive'; end if;
  signed := case when p_dir = 'credit' then p_amount else -p_amount end;
  update clients set balance_paise = balance_paise + signed
    where id = p_client returning balance_paise into bal;
  if bal is null then raise exception 'client not found'; end if;
  insert into ledger_entries (client_id, entry_type, description, amount_paise, balance_paise, neg)
  values (p_client, 'ADJUSTMENT',
          'Adjustment — ' || coalesce(nullif(p_reason, ''), 'manual correction'),
          p_amount, bal, p_dir <> 'credit');
  return bal;
end;
$$;

-- ---------------------------------------------------------------------------
-- Approvals: approve a pending event -> BILLED + debit wallet + ledger row
-- ---------------------------------------------------------------------------
create or replace function approve_event(p_event uuid) returns bigint
  language plpgsql security definer set search_path = public as $$
declare ev usage_events; bal bigint;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  select * into ev from usage_events where id = p_event for update;
  if ev.id is null then raise exception 'event not found'; end if;
  if ev.status <> 'PENDING' then raise exception 'event not pending'; end if;

  update usage_events set status = 'BILLED' where id = p_event;
  update clients set balance_paise = balance_paise - ev.amount_paise
    where id = ev.client_id returning balance_paise into bal;
  insert into ledger_entries (client_id, entry_type, description, amount_paise, balance_paise)
  values (ev.client_id, 'DEBIT',
          'Charge: ' || ev.description || ' — ' || ev.staff_name, ev.amount_paise, bal);
  return bal;
end;
$$;

-- ---------------------------------------------------------------------------
-- Approvals: reject a pending event
-- ---------------------------------------------------------------------------
create or replace function reject_event(p_event uuid, p_reason text) returns void
  language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  update usage_events
    set status = 'REJECTED', reason = coalesce(nullif(p_reason, ''), 'No reason given')
    where id = p_event and status = 'PENDING';
  if not found then raise exception 'event not pending'; end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- Staff: log a usage event. Auto-bills if the contract is AUTO approval.
-- ---------------------------------------------------------------------------
create or replace function log_usage(
  p_contract uuid, p_unit text, p_qty numeric, p_amount bigint,
  p_type contract_type, p_desc text
) returns uuid
  language plpgsql security definer set search_path = public as $$
declare c contracts; me profiles; eid uuid; new_status event_status; bal bigint;
begin
  select * into me from profiles where id = auth.uid();
  if me.id is null or me.role <> 'staff' then raise exception 'forbidden'; end if;
  select * into c from contracts where id = p_contract;
  if c.id is null then raise exception 'contract not found'; end if;
  if not exists (select 1 from contract_staff where contract_id = p_contract and staff_id = me.id)
  then raise exception 'not assigned to this contract'; end if;

  new_status := case when c.approval = 'AUTO' then 'BILLED' else 'PENDING' end;

  insert into usage_events (
    contract_id, client_id, staff_id, staff_name, client_company,
    type, unit, qty, amount_paise, status, description
  ) values (
    p_contract, c.client_id, me.id, me.full_name, c.client_company,
    p_type, p_unit, p_qty, p_amount, new_status, p_desc
  ) returning id into eid;

  if new_status = 'BILLED' then
    update clients set balance_paise = balance_paise - p_amount
      where id = c.client_id returning balance_paise into bal;
    insert into ledger_entries (client_id, entry_type, description, amount_paise, balance_paise)
    values (c.client_id, 'DEBIT', 'Charge: ' || p_desc || ' — ' || me.full_name, p_amount, bal);
  end if;
  return eid;
end;
$$;

-- ---------------------------------------------------------------------------
-- Admin: create a contract + its rate rows (rows passed as jsonb array)
-- ---------------------------------------------------------------------------
create or replace function create_contract(
  p_name text, p_client uuid, p_type contract_type, p_approval approval_mode,
  p_start date, p_end date, p_rate_summary text, p_rates jsonb default '[]'
) returns uuid
  language plpgsql security definer set search_path = public as $$
declare cid uuid; company text; r jsonb; i int := 0;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  select company into company from clients where id = p_client;
  if company is null then raise exception 'client not found'; end if;

  insert into contracts (name, client_id, client_company, type, status, approval,
                         start_date, end_date, rate_summary)
  values (p_name, p_client, company, p_type, 'ACTIVE', p_approval,
          p_start, p_end, coalesce(p_rate_summary, ''))
  returning id into cid;

  for r in select * from jsonb_array_elements(coalesce(p_rates, '[]'::jsonb)) loop
    insert into contract_rates (contract_id, kind, label, rate_key, sub, amount_paise,
                                done, interval, day, sort)
    values (
      cid,
      coalesce((r->>'kind')::rate_kind, 'roles'),
      coalesce(r->>'label', ''),
      coalesce(r->>'rate_key', ''),
      r->>'sub',
      coalesce((r->>'amount_paise')::bigint, 0),
      coalesce((r->>'done')::boolean, false),
      r->>'interval',
      (r->>'day')::int,
      i
    );
    i := i + 1;
  end loop;
  return cid;
end;
$$;
