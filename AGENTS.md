# AGENTS.md

These rules are mandatory for every agent working in this repository.

## Product

This is a knowledge-graph learning platform. The core entity is a `KnowledgeNode`.
Hands-on VM / Packet Tracer practice is out of scope for the app runtime. The app
teaches via theory, visualizations, and checkpoints.

## Layers

- UI never talks to storage directly. Use a `ProgressRepository`.
- `packages/domain` does not import React, Next.js, or UI packages.
- `packages/graph` does not import React, Next.js, or UI packages.
- `packages/content` does not import React, Next.js, or UI packages.
- Lesson text lives in `content/**/*.mdx`, never inside React components.
- Visualizations are referenced by id, not inlined into MDX.
- External data is parsed with Zod. No `any`. No `as unknown as`. No non-null `!`.

## Workflow

- Never push straight to `main`.
- One task, one branch, one PR.
- Conventional Commits only.
- Do not add a dependency without a reason recorded in the PR.
- Do not disable ESLint or TypeScript without an explanation comment.
- Domain/graph/content changes require tests.
- Architecture changes require an ADR in `docs/adr/`.
- Every curriculum node must pass `pnpm graph:validate`.

## Local commands before push

```bash
pnpm check
```

Hooks already run a subset. CI repeats the full gate and adds build + E2E + a11y.

## Coverage

- `@plp/domain` ≥ 90%
- `@plp/graph` ≥ 90%
- `@plp/content` ≥ 85%
- UI: behavioral tests, not coverage chasing
