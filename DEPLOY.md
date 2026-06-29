# Deploying Khatova (Supabase Cloud + Vercel)

This is the production runbook. Local dev still uses `npx supabase start` (see README).

## 1. Create the hosted database

1. Go to https://supabase.com → **New project**. Pick a name, region and a strong
   **database password** (save it). Wait for it to provision.
2. From **Project Settings → General**, copy the **Reference ID** (`<project-ref>`).
3. From **Project Settings → API**, copy the **Project URL** and the **anon public** key.
4. Create a CLI access token at https://supabase.com/dashboard/account/tokens.

## 2. Push the schema + seed

From the repo root:

```bash
export SUPABASE_ACCESS_TOKEN=<your-access-token>
npx supabase link --project-ref <project-ref>     # prompts for the DB password
npx supabase db push                              # applies all migrations
```

Then seed once — open **SQL Editor** in the dashboard, paste the contents of
`supabase/seed.sql`, and run it. (Seeds only auto-run locally on `db reset`; on the
hosted DB you run them once by hand.) This creates the demo accounts
(`maya@ / priya@ / vikram@ khatova.app`, password `khatova123`).

> The seeded/invited accounts are created already-confirmed, so login works even with
> "Confirm email" enabled.

## 3. Deploy the front end (Vercel)

1. Push this repo to GitHub (already done).
2. At https://vercel.com → **Add New → Project**, import the `khatova` repo.
   Framework preset auto-detects **Vite** (see `vercel.json`).
3. Add two **Environment Variables**:
   - `VITE_SUPABASE_URL` = your Project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
4. **Deploy**. Every push to `master` redeploys automatically.

## 4. Lock down auth (recommended)

In **Authentication → Providers → Email**, keep email/password on. Optionally turn
**off** public sign-ups so only admins can create users via the in-app "Create user"
flow. Add your Vercel domain under **Authentication → URL Configuration**.

---

### Netlify / Cloudflare Pages instead

Same idea: build command `npm run build`, publish directory `dist`, and set the two
`VITE_SUPABASE_*` env vars. `vercel.json`'s rewrite has equivalents
(`_redirects` for Netlify: `/* /index.html 200`).
