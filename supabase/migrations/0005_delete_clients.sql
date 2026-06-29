-- Admin: bulk-delete clients. Cascades to their contracts, rates, staff links,
-- usage events and ledger entries (FK ON DELETE CASCADE). Any client-user
-- profiles have client_id set to NULL (FK ON DELETE SET NULL). Returns the
-- number of clients removed.
create or replace function delete_clients(p_ids uuid[]) returns int
  language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  delete from clients where id = any(p_ids);
  get diagnostics n = row_count;
  return n;
end;
$$;

grant execute on function delete_clients(uuid[]) to authenticated;
