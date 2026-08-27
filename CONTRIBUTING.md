# Contributing

## Branching

`main` is protected (required PR + CI checks; no direct push). Re-apply with `./scripts/protect-main.sh` if settings drift.

1. Create a short-lived branch from latest `main`:
   - `feat/...` new behavior
   - `fix/...` bug
   - `chore/...` tooling
   - `ci/...` pipeline
   - `docs/...` documentation
   - `test/...` tests only
2. Open a pull request.
3. CI must be green.
4. Squash-merge into `main`.

One PR = one task. Do not mix a CI change with a curriculum rewrite.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add TCP handshake visualization
fix: reject cyclic requires edges
chore: tighten eslint import rules
ci: cache playwright browsers
```

Lefthook rejects non-conventional commit messages.

## Local gates

Pre-commit: Prettier, ESLint, markdownlint on staged files.

Pre-push: typecheck, unit tests, graph validation, architecture check.

Do not skip hooks. Do not run Playwright on every commit.

## CI

Every PR runs format, lint, typecheck, architecture, graph validation, unit tests, knip, build, Playwright, and axe.

## Content

Lessons live in `content/` as MDX. Do not put curriculum in a database or in React components.
