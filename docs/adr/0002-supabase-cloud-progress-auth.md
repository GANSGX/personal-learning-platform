# ADR 0002: Supabase cloud progress and auth

## Status

Accepted — implemented in M2 phase 2 (#71–#80).

## Context

- Curriculum and graph remain in Git (generated artifact at build time).
- Mutable per-user state (progress, later notes/bookmarks) must sync across devices.
- Platform may later be opened to other users; design multi-tenant from day one with RLS.
- Russian Federation constraints: avoid Google (and similar restricted) OAuth; prefer GitHub OAuth for developers and **email registration** for general users.
- Strict infosec: no project or personal secrets in the repository.

## Decision

1. **Supabase** (Auth + Postgres + RLS) as the BaaS for mutable state.
2. **Single Supabase project** — do not shard across multiple free-tier accounts.
3. **Auth providers (initial):**
   - GitHub OAuth (primary for owner/dev workflow)
   - Email + password sign-up and sign-in (RF-friendly baseline)
   - Magic link — optional follow-up after deliverability/legal review; not blocking MVP
4. **`ProgressRepository` abstraction unchanged** — add `SupabaseProgressRepository`; UI never talks to Supabase directly.
5. **Security:**
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` only in env (anon key is public; RLS enforces access).
   - `SUPABASE_SERVICE_ROLE_KEY` — server/CI only, never bundled in client.
   - All user tables protected with `auth.uid()` RLS policies.
   - No secrets, tokens, or service keys in Git, issues, PRs, or agent transcripts.
6. **Authentication is required** to enter the app. Unauthenticated visitors see only the sign-in
   screen (GitHub, email/password, magic link). There is no guest map.
7. **Cloud progress** is the source of truth for signed-in users. IndexedDB remains an
   implementation fallback (e2e / missing Supabase client), not a guest mode.

## Consequences

- New env vars and `.env.example` (placeholders only).
- Supabase migrations in repo (SQL), not manual dashboard-only schema.
- Login UI, session-aware `ProgressProvider`, and a client `AuthGate` around the app chrome.
- M5 issues #35–#36 superseded by M2 phase 2 work.
- Google/Apple OAuth explicitly out of scope until legal/product review.

## Alternatives considered

| Option                                 | Rejected because                                                |
| -------------------------------------- | --------------------------------------------------------------- |
| Multiple Supabase free projects merged | Ops nightmare, ToS risk, broken auth                            |
| Local-only progress                    | No cross-device sync                                            |
| Google OAuth                           | RF restriction / user policy                                    |
| NestJS + VPS                           | Overkill for current scale                                      |
| Cloudflare D1 only                     | Viable later; Supabase gives Auth + Postgres + RLS in one place |
