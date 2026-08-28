# Supabase setup (M2 phase 2)

## 1. Apply database migration

**Option A — Dashboard (fastest):**

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/xkkinckqidlsbuxhhayz/sql/new)
2. Paste contents of `supabase/migrations/20250828143000_user_progress.sql`
3. Click **Run**

**Option B — CLI:**

```bash
supabase login
supabase link --project-ref xkkinckqidlsbuxhhayz
supabase db push
```

Requires your database password once.

## 2. Auth (Dashboard)

1. **Authentication → Providers → Email**: enabled, **Confirm email** optional for dev, **Magic link** ON.
2. **Authentication → Providers → GitHub**: enable after creating a GitHub OAuth App (callback URL: `https://xkkinckqidlsbuxhhayz.supabase.co/auth/v1/callback`).
3. **Authentication → URL configuration**:
   - Site URL: `https://personal-learning-platform.pages.dev`
   - Redirect URLs:
     - `http://localhost:3000/**`
     - `https://personal-learning-platform.pages.dev/**`
     - `https://*.personal-learning-platform.pages.dev/**`

   Or run `node --experimental-strip-types apps/web/scripts/configure-supabase-auth-urls.mjs` on a machine with a logged-in Supabase dashboard session.

## 3. Env (never commit real values)

Copy `.env.example` → `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xkkinckqidlsbuxhhayz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key-from-dashboard>
```

Or set the same vars in **Cursor Environment Secrets** for local dev. CI injects them during static export build (see `docs/deploy-cloudflare.md`).

## 4. Verify locally

```bash
pnpm dev
```

Open `/login`, sign in, complete a lesson checkpoint — progress should persist after refresh when logged in.

## What you do NOT need to share

- Database password (only for CLI `db push`)
- `SUPABASE_SERVICE_ROLE_KEY` (not required for app MVP)
- GitHub OAuth client secret (paste only in Supabase Dashboard, not in chat)
