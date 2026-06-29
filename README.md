# Khatova

Prepaid **wallet & usage-based billing** platform with three role-based portals:

- **Admin** — manage client wallets, contracts & rate cards, approve usage, top-ups/adjustments, reports, team
- **Staff** — log billable work against assigned contracts
- **Client** — view wallet balance, statement/ledger and contracts

Built with **React + TypeScript + Vite** on the front end and **Supabase (Postgres + Auth)** on the back end. Authentication is email/password; data access is enforced per-role with **Row Level Security**, and all money mutations go through **SECURITY DEFINER RPCs** (atomic wallet debits/credits + append-only ledger).

## Stack

- Front end: React 19, Vite, `@tanstack/react-query`, `@supabase/supabase-js`
- Back end: Supabase local stack (Postgres 17, GoTrue auth, PostgREST)
- Money is stored in **paise** (integers) throughout.

## Prerequisites

- Node 20+
- Docker Desktop (for the local Supabase stack)

## Getting started

```bash
npm install

# Start Postgres + Auth + REST locally (applies migrations + seed)
npx supabase start

# Copy the printed ANON_KEY into .env (already pre-filled for the default local key)
cp .env.example .env   # then edit if your key differs

npm run dev
```

Open the printed Vite URL and sign in with a seeded account (password **`khatova123`**):

| Role   | Email                |
|--------|----------------------|
| Admin  | `maya@khatova.app`   |
| Staff  | `priya@khatova.app`  |
| Client | `vikram@khatova.app` |

## Database

- `supabase/migrations/0001_init.sql` — tables, enums, RLS policies
- `supabase/migrations/0002_functions.sql` — RPCs (top-up, adjust, approve, reject, log usage, create contract, invite user) + direct auth-user provisioning
- `supabase/migrations/0003_grants.sql` — API role grants
- `supabase/seed.sql` — demo clients, contracts, events, ledger and the accounts above

Reset to a clean seed at any time:

```bash
npx supabase db reset
```

## Deploying to a hosted Supabase project

1. Create a project at supabase.com and `npx supabase link --project-ref <ref>`
2. `npx supabase db push` to apply migrations
3. Set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in `.env` to the hosted values
4. `npm run build` and deploy the `dist/` output to any static host
