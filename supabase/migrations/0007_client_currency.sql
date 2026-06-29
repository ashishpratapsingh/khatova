-- Per-client wallet currency. Amounts stay in minor units (1/100) — INR paise,
-- USD cents, AED fils, GBP pence all use 2 decimal places.
create type currency_code as enum ('INR', 'USD', 'AED', 'GBP');

alter table clients add column currency currency_code not null default 'INR';

-- Recreate create_client with a currency argument.
drop function if exists create_client(text, text, text, bigint, wallet_policy);
create or replace function create_client(
  p_company   text,
  p_contact   text default '',
  p_email     text default '',
  p_threshold bigint default 0,
  p_policy    wallet_policy default 'BLOCK',
  p_currency  currency_code default 'INR'
) returns uuid
  language plpgsql security definer set search_path = public as $$
declare cid uuid; ini text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if coalesce(trim(p_company), '') = '' then raise exception 'company name is required'; end if;
  ini := upper(left(trim(p_company), 1)) ||
         upper(coalesce(substr(split_part(trim(p_company), ' ', 2), 1, 1), ''));
  insert into clients (company, contact, email, initials, threshold_paise, policy, currency, balance_paise)
  values (trim(p_company), coalesce(p_contact, ''), lower(coalesce(p_email, '')),
          ini, coalesce(p_threshold, 0), coalesce(p_policy, 'BLOCK'), coalesce(p_currency, 'INR'), 0)
  returning id into cid;
  return cid;
end;
$$;
grant execute on function create_client(text, text, text, bigint, wallet_policy, currency_code) to authenticated;

-- Recreate update_client with a currency argument.
drop function if exists update_client(uuid, text, text, text, bigint, wallet_policy);
create or replace function update_client(
  p_id        uuid,
  p_company   text,
  p_contact   text,
  p_email     text,
  p_threshold bigint,
  p_policy    wallet_policy,
  p_currency  currency_code default 'INR'
) returns void
  language plpgsql security definer set search_path = public as $$
declare ini text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if coalesce(trim(p_company), '') = '' then raise exception 'company name is required'; end if;
  ini := upper(left(trim(p_company), 1)) ||
         upper(coalesce(substr(split_part(trim(p_company), ' ', 2), 1, 1), ''));
  update clients set
    company         = trim(p_company),
    contact         = coalesce(p_contact, ''),
    email           = lower(coalesce(p_email, '')),
    initials        = ini,
    threshold_paise = coalesce(p_threshold, 0),
    policy          = coalesce(p_policy, 'BLOCK'),
    currency        = coalesce(p_currency, 'INR')
  where id = p_id;
  if not found then raise exception 'client not found'; end if;
end;
$$;
grant execute on function update_client(uuid, text, text, text, bigint, wallet_policy, currency_code) to authenticated;
