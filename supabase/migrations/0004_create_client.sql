-- Admin: create a new client company (wallet starts at zero).
create or replace function create_client(
  p_company   text,
  p_contact   text default '',
  p_email     text default '',
  p_threshold bigint default 0,
  p_policy    wallet_policy default 'BLOCK'
) returns uuid
  language plpgsql security definer set search_path = public as $$
declare cid uuid; ini text;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  if coalesce(trim(p_company), '') = '' then raise exception 'company name is required'; end if;
  ini := upper(left(trim(p_company), 1)) ||
         upper(coalesce(substr(split_part(trim(p_company), ' ', 2), 1, 1), ''));
  insert into clients (company, contact, email, initials, threshold_paise, policy, balance_paise)
  values (trim(p_company), coalesce(p_contact, ''), lower(coalesce(p_email, '')),
          ini, coalesce(p_threshold, 0), coalesce(p_policy, 'BLOCK'), 0)
  returning id into cid;
  return cid;
end;
$$;

grant execute on function create_client(text, text, text, bigint, wallet_policy) to authenticated;
