# Handoff / TODO

Карта проекта, чтобы продолжить с другого устройства без пересказа чата.
Не храни здесь секреты.

## Статус

Bootstrap-итерация закрывается PR `chore/bootstrap-ci-pipeline` → `main`.
После merge все новые задачи — **новые ветки от `main`**. В эту bootstrap-ветку ничего больше не класть.

Это персональная learning-platform на knowledge graph.
Практика VM / Packet Tracer — отдельно, руками. Приложение = теория + визуализации + checkpoint.

## Уже решено, не переобсуждать

- Порядок учёбы: сети → OS → Linux → sysadmin → сети II → web → storage → automation → integration lab. DevOps/Security/OSINT после фундамента.
- Стек: pnpm monorepo, Turborepo, Next.js, shadcn/ui (тёмная нейтральная серо-чёрная тема), Zod, Vitest, Playwright, Lefthook, GitHub Actions.
- Контент в Git (`content/**/*.mdx`), не в БД. Progress через `ProgressRepository`.
- Ветки + PR. В `main` не пушить напрямую.
- Conventional Commits. Pre-commit: format/lint. Pre-push: typecheck/unit/graph/architecture. CI: то же + build + e2e + a11y.
- Graph UI (React Flow) не входит в bootstrap.

## Что уже в репозитории

- `apps/web` — Next.js 16, тёмный shell Knowledge map, shadcn button/badge/card/separator
- `packages/domain` — Zod-схемы узлов, `isMastered`
- `packages/graph` — валидатор DAG / `requires`
- `packages/content` — парсер MDX frontmatter
- `scripts/validate-graph.ts` — `pnpm graph:validate` (0 узлов сейчас — ок)
- CI, хуки, `AGENTS.md`, `CONTRIBUTING.md`

Локально зелёные: lint, typecheck, architecture, graph validate, unit, knip, build, Playwright e2e + axe.

## Что делать дальше (следующие PR)

Один PR = одна задача. Не смешивать.

1. **После зелёного CI этого PR** — включить branch protection на `main`: required PR, required checks (`Quality`, `Unit tests`, `Build`, `E2E and a11y`), без прямого пуша.
2. **`feat/knowledge-graph-canvas`** — React Flow + ELK. Граф читает данные из `@plp/graph` / сгенерированных узлов, не JSX-моки. Клик по узлу открывает панель (Theory / Visualization / Practice / Checkpoint как заглушки).
3. **`feat/local-progress`** — `LocalProgressRepository` + IndexedDB. Статусы на узлах. UI не знает про storage.
4. **`feat/networking-i-content`** — 10–15 узлов Networking I в `content/foundation/networking/`. Короткие тексты, валидный frontmatter, `pnpm graph:validate` зелёный.
5. **`feat/packet-journey-viz`** — первый visualization widget по id (`network.packet-journey`). Урок ссылается на id, не содержит реализацию.

Не делать, пока нет фундамента-среза на графе: Supabase/D1, деплой Cloudflare, Security/OSINT контент, VM-labs в рантайме приложения.

## Старт с другого устройства

Node >= 22, pnpm 10, `gh`.

```bash
git clone git@github.com:GANSGX/personal-learning-platform.git
cd personal-learning-platform
git checkout main
pnpm install
pnpm check
pnpm dev
```

Если PR ещё не влит: `git checkout chore/bootstrap-ci-pipeline`.

GitHub: `GANSGX`. Если auth мёртвый — `gh auth login`.

Локальный npmjs.org с машины агента давал ECONNRESET; у хозяина обычно npmmirror. В репо registry не запинен. CI ходит в npmjs.

## Команды

| Команда               | Зачем                          |
| --------------------- | ------------------------------ |
| `pnpm dev`            | UI на :3000                    |
| `pnpm check`          | локальный гейт без e2e         |
| `pnpm test`           | unit                           |
| `pnpm graph:validate` | учебный граф                   |
| `pnpm e2e`            | Playwright + axe               |
| `pnpm architecture`   | запрет domain/graph → React/UI |

## Правила для агента

`AGENTS.md` + `CONTRIBUTING.md`. Не пушить в `main`. Одна задача = одна ветка = один PR.
