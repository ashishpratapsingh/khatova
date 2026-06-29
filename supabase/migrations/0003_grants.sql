-- PostgREST uses the `authenticated` / `anon` roles. New public objects are not
-- auto-exposed, so grant table + function privileges explicitly. RLS still applies.

grant usage on schema public to anon, authenticated;

grant select on
  clients, profiles, contracts, contract_rates, contract_staff, usage_events, ledger_entries
  to authenticated;

grant insert on usage_events to authenticated;

-- Business RPCs: callable by signed-in users (each enforces its own role checks).
grant execute on function
  topup_wallet(uuid, bigint, text, text),
  adjust_wallet(uuid, bigint, text, text),
  approve_event(uuid),
  reject_event(uuid, text),
  log_usage(uuid, text, numeric, bigint, contract_type, text),
  create_contract(text, uuid, contract_type, approval_mode, date, date, text, jsonb),
  invite_user(text, text, text, user_role, uuid)
  to authenticated;

-- The raw user-provisioning helper has no role guard — keep it off the API entirely.
revoke execute on function create_auth_user(text, text, text, user_role, uuid) from public, anon, authenticated;
