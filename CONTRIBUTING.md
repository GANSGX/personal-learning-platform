# Contributing

## Branching

`main` is protected. Do not push features directly to `main`.

1. Create a short-lived branch from latest `main`:
   - `feat/...` new behavior
   - `fix/...` bug
   - `chore/...` tooling
   - `ci/...` pipeline
   - `docs/...` documentation
   - `test/...` tests only
2. Open a pull request.
3. CI must be green.
4. Squash-merge into `main`. GitHub allows squash only and deletes the head
   branch after merge. Do not leave merged branches around.

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
