# Deploy to Cloudflare Pages (M2 / #80)

Production target: **Cloudflare Pages (static export, free tier)**. Supabase stays the auth/progress backend.

OpenNext Workers (`pnpm cf:deploy`) remain in the repo as an optional paid path if bundle size limits change; the default free path is static Pages.

## Live URLs

| Environment | URL                                                            |
| ----------- | -------------------------------------------------------------- |
| Production  | <https://personal-learning-platform.pages.dev>                 |
| Preview     | `https://<deployment-id>.personal-learning-platform.pages.dev` |

## Prerequisites

1. Cloudflare account (free).
2. Supabase project configured (`docs/supabase-setup.md`).
3. For CI deploy: GitHub repo secret `CLOUDFLARE_API_TOKEN` with **Cloudflare Pages — Edit** permission.

### One-time: GitHub secret for CI

1. Cloudflare Dashboard → **My Profile → API Tokens → Create Token**.
2. Use template **Edit Cloudflare Workers** (includes Pages deploy) or custom token with **Account → Cloudflare Pages → Edit**.
3. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: the token from step 1

`NEXT_PUBLIC_*` Supabase vars are public (RLS protects data) and are set in `.github/workflows/deploy.yml`.

## Supabase Auth redirect URLs

Under **Authentication → URL configuration**:

- Site URL: `https://personal-learning-platform.pages.dev`
- Redirect URLs:
  - `http://localhost:3000/**`
  - `https://personal-learning-platform.pages.dev/**`
  - `https://*.personal-learning-platform.pages.dev/**`

Helper script (requires logged-in Chrome profile on the agent VM):

```bash
node --experimental-strip-types apps/web/scripts/configure-supabase-auth-urls.mjs
```

## Local build and deploy

From repo root after `.env.local` is configured:

```bash
pnpm --filter @plp/web pages:build
pnpm --filter @plp/web pages:deploy
```

Requires `wrangler login` once locally.

Preview deploy (any branch label):

```bash
pnpm --filter @plp/web pages:deploy:preview
```

## CI/CD

| Trigger                      | Workflow                       | Result                                  |
| ---------------------------- | ------------------------------ | --------------------------------------- |
| Push to `main`               | `.github/workflows/deploy.yml` | Production deploy                       |
| Manual **workflow_dispatch** | same                           | Preview deploy with custom branch label |
| Pull request                 | `.github/workflows/ci.yml`     | Checks only (lint, test, build)         |

After merge to `main`, GitHub Actions builds static export and runs `wrangler pages deploy`.

Track deployments in **Cloudflare Dashboard → Workers & Pages → personal-learning-platform → Deployments** (commit, branch, rollback).

## Environment variables at build time

Static export bakes `NEXT_PUBLIC_*` into the JS bundle at **build** time. Set them in:

- `.env.local` for local builds
- GitHub Actions workflow `env` for CI
- Cloudflare Pages dashboard if using Git-connected Pages builds instead of Actions

Do **not** set `SUPABASE_SERVICE_ROLE_KEY` in Pages env unless you add server-only admin routes.

## Files in repo

| Path                                      | Purpose                                                  |
| ----------------------------------------- | -------------------------------------------------------- |
| `apps/web/scripts/build-static-export.sh` | Static export build (temporarily moves `proxy.ts` aside) |
| `apps/web/wrangler.jsonc`                 | Pages project name + `out/` output dir                   |
| `apps/web/package.json`                   | `pages:*` scripts                                        |
| `.github/workflows/deploy.yml`            | Auto-deploy on `main`                                    |
| `apps/web/open-next.config.ts`            | Optional paid Workers path only                          |

## Troubleshooting

- **Auth redirect mismatch:** URL must exactly match Supabase redirect allow-list.
- **Empty progress after login:** run SQL migration (`docs/supabase-setup.md`).
- **Deploy workflow fails on missing secret:** add `CLOUDFLARE_API_TOKEN` (see above).
- **Build fails on content paths:** graph is generated in `prebuild`; run build from monorepo root with pnpm.
