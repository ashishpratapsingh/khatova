-- Khatova schema: usage-based billing / wallet platform
-- Money is stored in paise (integer) everywhere.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type user_role       as enum ('admin', 'staff', 'client');
create type contract_type   as enum ('HOURLY', 'MILESTONE', 'SUBSCRIPTION', 'METERED');
create type contract_status as enum ('ACTIVE', 'PAUSED', 'ENDED');
create type approval_mode   as enum ('MANUAL', 'AUTO');
create type event_status    as enum ('PENDING', 'BILLED', 'REJECTED');
create type wallet_policy   as enum ('BLOCK', 'ALLOW', 'PAUSE');
create type ledger_type     as enum ('CREDIT', 'DEBIT', 'ADJUSTMENT');
create type rate_kind       as enum ('roles', 'sub', 'milestones', 'units');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table clients (
  id             uuid primary key default gen_random_uuid(),
  company        text not null,
  contact        text not null default '',
  email          text not null default '',
  initials       text not null default '',
  threshold_paise bigint not null default 0,
  policy         wallet_policy not null default 'BLOCK',
  balance_paise  bigint not null default 0,
  created_at     timestamptz not null default now()
);

create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  email      text not null default '',
  role       user_role not null,
  client_id  uuid references clients(id) on delete set null,
  initials   text not null default '',
  created_at timestamptz not null default now()
);

create table contracts (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  client_id      uuid not null references clients(id) on delete cascade,
  client_company text not null default '',
  type           contract_type not null,
  status         contract_status not null default 'ACTIVE',
  approval       approval_mode not null default 'MANUAL',
  start_date     date,
  end_date       date,
  rate_summary   text not null default '',
  staff_count    int not null default 0,
  created_at     timestamptz not null default now()
);

create table contract_rates (
  id          uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts(id) on delete cascade,
  kind        rate_kind not null,
  label       text not null default '',
  rate_key    text not null default '',
  sub         text,
  amount_paise bigint not null default 0,
  done        boolean not null default false,
  interval    text,
  day         int,
  sort        int not null default 0
);

create table contract_staff (
  contract_id uuid not null references contracts(id) on delete cascade,
  staff_id    uuid not null references profiles(id) on delete cascade,
  primary key (contract_id, staff_id)
);

create table usage_events (
  id             uuid primary key default gen_random_uuid(),
  contract_id    uuid not null references contracts(id) on delete cascade,
  client_id      uuid not null references clients(id) on delete cascade,
  staff_id       uuid references profiles(id) on delete set null,
  staff_name     text not null default '',
  client_company text not null default '',
  type           contract_type not null,
  unit           text not null default '',
  qty            numeric not null default 0,
  amount_paise   bigint not null default 0,
  status         event_status not null default 'PENDING',
  event_date     date not null default current_date,
  description    text not null default '',
  reason         text,
  created_at     timestamptz not null default now()
);

create table ledger_entries (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references clients(id) on delete cascade,
  entry_type    ledger_type not null,
  description   text not null default '',
  amount_paise  bigint not null default 0,
  balance_paise bigint not null default 0,
  neg           boolean not null default false,
  created_at    timestamptz not null default now()
);

create index on contracts (client_id);
create index on contract_rates (contract_id);
create index on usage_events (client_id);
create index on usage_events (contract_id);
create index on usage_events (staff_id);
create index on ledger_entries (client_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so they bypass RLS when reading profiles)
-- ---------------------------------------------------------------------------
create or replace function auth_role() returns user_role
  language sql stable security definer set search_path = public as $$
  select role from profiles where id = auth.uid();
$$;

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from profiles where id = auth.uid()), false);
$$;

create or replace function current_client_id() returns uuid
  language sql stable security definer set search_path = public as $$
  select client_id from profiles where id = auth.uid();
$$;

create or replace function can_see_contract(cid uuid) returns boolean
  language sql stable security definer set search_path = public as $$
  select is_admin()
      or exists (select 1 from contracts c where c.id = cid and c.client_id = current_client_id())
      or exists (select 1 from contract_staff cs where cs.contract_id = cid and cs.staff_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table clients        enable row level security;
alter table profiles       enable row level security;
alter table contracts      enable row level security;
alter table contract_rates enable row level security;
alter table contract_staff enable row level security;
alter table usage_events   enable row level security;
alter table ledger_entries enable row level security;

-- profiles
create policy profiles_select on profiles for select using (id = auth.uid() or is_admin());
create policy profiles_admin_write on profiles for all using (is_admin()) with check (is_admin());

-- clients
create policy clients_select on clients for select using (is_admin() or id = current_client_id());
create policy clients_admin_write on clients for all using (is_admin()) with check (is_admin());

-- contracts
create policy contracts_select on contracts for select using (can_see_contract(id));
create policy contracts_admin_write on contracts for all using (is_admin()) with check (is_admin());

-- contract_rates
create policy rates_select on contract_rates for select using (can_see_contract(contract_id));
create policy rates_admin_write on contract_rates for all using (is_admin()) with check (is_admin());

-- contract_staff
create policy cstaff_select on contract_staff
  for select using (is_admin() or staff_id = auth.uid() or can_see_contract(contract_id));
create policy cstaff_admin_write on contract_staff for all using (is_admin()) with check (is_admin());

-- usage_events
create policy events_select on usage_events for select using (
  is_admin()
  or staff_id = auth.uid()
  or (client_id = current_client_id() and status = 'BILLED')
);
-- staff may create events for themselves; admin too (RPCs run as definer regardless)
create policy events_staff_insert on usage_events for insert with check (
  is_admin() or (staff_id = auth.uid() and auth_role() = 'staff')
);
create policy events_admin_update on usage_events for update using (is_admin()) with check (is_admin());

-- ledger_entries (read only for clients/admin; writes happen via RPC definer)
create policy ledger_select on ledger_entries for select using (is_admin() or client_id = current_client_id());
