-- Admin: edit a client's profile (company, contact, billing email, low-balance
-- threshold, negative-balance policy). Initials are recomputed from the company.
create or replace function update_client(
  p_id        uuid,
  p_company   text,
  p_contact   text,
  p_email     text,
  p_threshold bigint,
  p_policy    wallet_policy
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
    policy          = coalesce(p_policy, 'BLOCK')
  where id = p_id;
  if not found then raise exception 'client not found'; end if;
end;
$$;

grant execute on function update_client(uuid, text, text, text, bigint, wallet_policy) to authenticated;
