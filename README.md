# Personal Learning Platform

Interactive knowledge-graph learning platform. Curriculum lives in Git. Mutable progress stays out of Git.

This repository is a **trunk-based** monorepo: short-lived branches, pull requests into `main`, no direct feature dumps onto `main`.

## Commands

```bash
pnpm install
pnpm dev
pnpm check          # format, lint, typecheck, architecture, graph, unit, knip
pnpm test
pnpm e2e
```

## Workflow

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).

## Stack

pnpm · Turborepo · Next.js · shadcn/ui · Zod · Vitest · Playwright · GitHub Actions
