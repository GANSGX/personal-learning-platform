# Handoff / TODO

Карта проекта, чтобы продолжить с другого устройства без пересказа чата.
Не храни здесь секреты.

Бэклог живёт в **GitHub Issues**, не здесь. Агент начинает с `gh issue list`.

## Статус

Bootstrap влит в `main` (PR #1). Новые задачи — **новые ветки от `main`**, один issue = одна ветка = один PR. Naming: `feat/#N-short-slug`.

Это персональная learning-platform на knowledge graph.
Практика VM / Packet Tracer — отдельно, руками. Приложение = теория + визуализации + checkpoint.

## Уже решено, не переобсуждать

- Порядок учёбы: сети → OS → Linux → sysadmin → сети II → web → storage → automation → integration lab. DevOps/Security/OSINT после фундамента.
- Стек: pnpm monorepo, Turborepo, Next.js, shadcn/ui (тёмная нейтральная серо-чёрная тема), Zod, Vitest, Playwright, Lefthook, GitHub Actions.
- Контент в Git (`content/**/*.mdx`), не в БД. Progress через `ProgressRepository`.
- Ветки + PR. В `main` не пушить напрямую.
- Conventional Commits. Pre-commit: format/lint. Pre-push: typecheck/unit/graph/architecture. CI: то же + build + e2e + a11y.
- Graph UI (React Flow) — milestone M1, не bootstrap.

## Что уже в репозитории

- `apps/web` — Next.js 16, карта знаний (React Flow), трековые виды, панель узла, MDX-уроки, визуализации, i18n RU/EN
- `packages/domain|graph|content|visualizations` — Zod-схемы и progress-rules, DAG-валидатор/layout, MDX-парсер, виджеты. Покрытие: domain 100%, graph 99%, content 96%, visualizations 99%
- `content/` — 92 узла, 7 треков; foundation — 73 узла (networking, os, linux, windows, web, storage, automation), infrastructure/security/osint — тонкие, в расширении
- `labs/` — 11 лаб (6 Packet Tracer, 5 sysadmin), привязаны к узлам
- Supabase auth + облачный прогресс (RLS на `user_progress`), локальный IndexedDB-прогресс
- CI на PR: quality + unit + build + e2e (chromium, webkit, mobile-safari) + visual-гейт; Nightly: полный audit, `pnpm check`, стресс-тест e2e `--repeat-each=3`
- Deploy: Cloudflare Pages (static export) после зелёного CI — `docs/deploy-cloudflare.md`

## Что делать дальше

Смотри [issues](https://github.com/GANSGX/personal-learning-platform/issues) и milestones:

1. Расширение тонких треков: security (6 узлов), osint (4), infrastructure (9) — `docs/learning-roadmap.md`
2. Известные хвосты — в issues (например, a11y drawer на macOS webkit)
3. **M4** / **M5** — `blocked`, не начинать рано

Не делать, пока нет устойчивого контент-среза: VM-labs в рантайме приложения.

Как брать задачу: `CONTRIBUTING.md` → Issues.

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
