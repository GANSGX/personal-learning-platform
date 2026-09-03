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

[Conventional Commits](https://www.conventionalcommits.org/) for the **subject** (first line). The subject stays in **English**.

The **body** (optional lines after a blank line) is in **Russian**: a detailed list of what changed, why, and what is out of scope.

```text
feat: add TCP handshake visualization

- Добавлена интерактивная визуализация трёхстороннего рукопожатия
- Подключён виджет из packages/visualizations по id из frontmatter
- Unit-тесты на переключение состояний SYN / SYN-ACK / ACK
```

Single-line commits without a body are fine for trivial changes; use a Russian body when the change is non-trivial.

Lefthook rejects non-conventional commit **subjects**.

## Pull requests

- **Title**: English, same style as the squash commit subject (`feat: …`, `fix: …`, …).
- **Description**: Russian. Include:
  - краткое резюме (зачем и что изменилось);
  - список изменений по пунктам;
  - test plan с отмеченными галочками;
  - ссылку на issue (`Closes #N`).
- Squash-merge title becomes the commit subject; put the detailed Russian explanation in the PR body (GitHub uses it as the squash commit body when you edit before merge).

## Local gates

Pre-commit: Prettier, ESLint, markdownlint on staged files.

Pre-push: typecheck, unit tests, graph validation, architecture check, test-per-file gate.

Do not skip hooks. Do not run Playwright on every commit.

## CI

Every PR runs format, lint, typecheck, architecture, graph validation, unit tests, knip, test-per-file gate, build, Playwright, and axe.

Merging to `main` requires a pull request and 5 green checks: Quality, Unit tests, Build, E2E and a11y, Validate PR title. Only squash-merge is permitted. Direct pushes, force-pushes, and deleting `main` are blocked. Reviews are not required (solo repo).

### Actions cache

GitHub Actions cache is limited to **10 GB per repository**. CI caches the pnpm store, Turborepo (`.turbo`), Playwright browsers, and build artifacts (E2E reuses the Build job output).

**Cache cleanup** runs automatically on every push to `main`, weekly on Sunday 04:00 UTC, and manually via Actions → **Cache cleanup** → **Run workflow**. It deletes entries older than 7 days (1 day after pushes to `main`) and, if usage exceeds ~8 GB, keeps only the newest Playwright/pnpm/Turbo caches.

## Issues

Take **one** open issue. One issue = one branch = one PR.

1. `gh issue list --milestone "M0 — Git and CI hardening"` (then M1, M2, …). Skip `blocked`.
2. Branch from latest `main` as `feat/#N-short-slug` (or `fix/`, `chore/`, `ci/`, `docs/`, `test/`).
3. Open a PR whose body includes `Closes #N`.
4. Squash-merge when CI is green. Do not push to `main`.

Milestones: [M0](https://github.com/GANSGX/personal-learning-platform/milestone/1) Git and CI,
[M1](https://github.com/GANSGX/personal-learning-platform/milestone/2) graph canvas,
[M2](https://github.com/GANSGX/personal-learning-platform/milestone/3) progress,
[M3](https://github.com/GANSGX/personal-learning-platform/milestone/4) Networking I,
[M4](https://github.com/GANSGX/personal-learning-platform/milestone/5) rest of foundation,
[M5](https://github.com/GANSGX/personal-learning-platform/milestone/6) later (deploy, cloud, specializations).

The issue tracker is the source of truth for work. `TODO.md` is a short handoff, not the backlog.

## Content

Lessons live in `content/` as MDX. Do not put curriculum in a database or in React components.
