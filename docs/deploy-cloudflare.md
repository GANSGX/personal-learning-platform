# Deploy to Cloudflare (M2 / #80)

Production target: **Cloudflare Workers** via [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare/get-started). Supabase stays the auth/progress backend.

## Prerequisites

1. Cloudflare account with Workers enabled.
2. Supabase project configured (`docs/supabase-setup.md`).
3. GitHub repo connected to Cloudflare (recommended) or Wrangler CLI locally.

## Environment variables (Cloudflare dashboard)

Set these for **Production** and **Preview**:

| Variable                        | Notes                                            |
| ------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable/anon key (public; RLS protects data) |

Do **not** set `SUPABASE_SERVICE_ROLE_KEY` in the Pages/Workers UI unless you add server-only admin routes.

Optional:

| Variable                           | Notes                                    |
| ---------------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_ALLOW_LOCAL_PROGRESS` | `true` only for dev/preview without auth |

## Supabase Auth redirect URLs

Add your Cloudflare URL(s) under **Authentication → URL configuration**:

- `https://<your-worker>.workers.dev/**`
- `https://<custom-domain>/**`
- Keep `http://localhost:3000/**` for local dev

## Local preview (optional)

From repo root after `.env.local` is configured:

```bash
pnpm --filter @plp/web cf:preview
```

Requires `wrangler login` once.

## Deploy via CLI

```bash
pnpm --filter @plp/web cf:deploy
```

## Deploy via Cloudflare Git integration

1. **Workers & Pages → Create → Connect GitHub** → select this repo.
2. **Root directory:** `/` (monorepo).
3. **Build command:** `pnpm install --frozen-lockfile && pnpm --filter @plp/web build && pnpm --filter @plp/web cf:build`
4. **Deploy command:** `pnpm --filter @plp/web cf:deploy`
5. Add env vars from the table above.
6. On each push to `main`, Cloudflare builds and deploys.

## Files in repo

| Path                           | Purpose                                        |
| ------------------------------ | ---------------------------------------------- |
| `apps/web/wrangler.jsonc`      | Worker name, compatibility date, asset binding |
| `apps/web/open-next.config.ts` | OpenNext Cloudflare adapter config             |
| `apps/web/package.json`        | `cf:*` scripts                                 |

## Troubleshooting

- **Auth redirect mismatch:** URL must exactly match Supabase redirect allow-list.
- **Empty progress after login:** run SQL migration (`docs/supabase-setup.md`).
- **Build fails on content paths:** graph is generated in `prebuild`; ensure build runs from monorepo root with pnpm.
