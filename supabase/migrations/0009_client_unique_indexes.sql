-- Hard uniqueness guard (covers races + any direct writes). Company names are
-- always present; emails are optional, so the email index is partial.

-- Drop any pre-existing duplicates (keep the oldest) so the indexes can be built.
-- No-op on a clean database.
delete from clients c using (
  select id, row_number() over (partition by lower(company) order by created_at, id) rn from clients
) d where c.id = d.id and d.rn > 1;

delete from clients c using (
  select id, row_number() over (partition by lower(email) order by created_at, id) rn
  from clients where email <> ''
) d where c.id = d.id and d.rn > 1;

create unique index if not exists clients_company_lower_key on clients (lower(company));
create unique index if not exists clients_email_lower_key   on clients (lower(email)) where email <> '';
