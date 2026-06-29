-- Reject duplicate clients (case-insensitive company name; billing email when set).
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

  if exists (select 1 from clients where lower(company) = lower(trim(p_company))) then
    raise exception 'A client named "%" already exists', trim(p_company);
  end if;
  if coalesce(trim(p_email), '') <> ''
     and exists (select 1 from clients where lower(email) = lower(trim(p_email))) then
    raise exception 'A client with email % already exists', lower(trim(p_email));
  end if;

  ini := upper(left(trim(p_company), 1)) ||
         upper(coalesce(substr(split_part(trim(p_company), ' ', 2), 1, 1), ''));
  insert into clients (company, contact, email, initials, threshold_paise, policy, currency, balance_paise)
  values (trim(p_company), coalesce(p_contact, ''), lower(coalesce(p_email, '')),
          ini, coalesce(p_threshold, 0), coalesce(p_policy, 'BLOCK'), coalesce(p_currency, 'INR'), 0)
  returning id into cid;
  return cid;
end;
$$;

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

  if exists (select 1 from clients where lower(company) = lower(trim(p_company)) and id <> p_id) then
    raise exception 'A client named "%" already exists', trim(p_company);
  end if;
  if coalesce(trim(p_email), '') <> ''
     and exists (select 1 from clients where lower(email) = lower(trim(p_email)) and id <> p_id) then
    raise exception 'A client with email % already exists', lower(trim(p_email));
  end if;

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
