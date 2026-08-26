# Bootstrap: что поднимаем в репозитории

Документ для обсуждения, не backlog и не решение. Цель — согласовать порядок, границы первого этапа и автоматизацию до того, как появится код приложения.

## 1. Что уже решено спецификацией

Это не предлагается пересматривать на старте, если нет сильной причины.

| Решение | Следствие |
| --- | --- |
| Главная сущность — `KnowledgeNode`, не страница курса | UI строится вокруг графа |
| Контент в Git (MDX + metadata), не в БД | парсер + валидатор графа обязательны рано |
| Prerequisite-связи — DAG | CI ловит циклы |
| Progress сначала локально (IndexedDB), UI через `ProgressRepository` | data layer абстрагируем с дня 1 |
| Backend / Postgres / multi-user — не на старте | не проектируем Nest/VPS |
| Domain не зависит от React | monorepo с пакетами, не один `src/` |
| Сначала фундамент (Networking → Integration Lab) | в `content/` кладём только Foundation |
| Практика пока визуальная | `Lab` как сущность есть, исполнение — виджеты, не VM |

## 2. Что значит «визуальная практика» на старте

Не путать с «красивый сайт с конспектами».

**Входит в визуальный этап**

- интерактивный граф (клик → панель узла);
- статусы узлов (locked / available / in progress / …);
- визуализации концептов: путь пакета, TCP handshake, subnetting, DNS resolution;
- checkpoint как проверка понимания в браузере (сценарий, квиз, «объясни путь запроса»);
- ссылка из урока на visualization id, не виджет, захардкоженный в MDX-разметке.

**Не входит**

- автоматический стенд Ubuntu VM;
- интеграция Packet Tracer как исполняемой среды;
- SSH-лаборатории, nginx/PostgreSQL на реальных машинах;
- проверка «ты действительно починил сервис».

Реальные labs остаются в модели (`labs/` + metadata у node), но на визуальном этапе это карточки: цель, топология ASCII, чеклист «сделай руками», без автопроверки.

Так мы не ломаем спецификацию: `Lab` существует, меняется только runtime практики.

## 3. Напряжение, которое надо явно выбрать

Спека говорит:

```text
domain → schema → rules → validation → CI → UI
```

Запрос на старт: обучение + визуальная практика, то есть хочется увидеть граф и виджеты относительно рано.

Предлагаемый компромисс, не «сначала нарисовать React»:

1. Схема домена и 8–15 настоящих networking-узлов в `content/` (не моки в компонентах).
2. Парсер + валидатор (хотя бы locally + один CI job).
3. Только потом React Flow: граф читает сгенерированные данные.
4. Параллельно 1–2 visualization-виджета, привязанных к id, не к странице.

Если начать с захардкоженного графа в JSX, потом придётся вычищать. Если начать с полного CI/E2E/a11y/Knip — застрянем до первого экрана.

## 4. Предлагаемые слои репозитория (когда начнём кодить)

Не создавать всё из спеки в первый день. Скелет — да, пустые пакеты «на будущее» — нет.

```text
personal-learning-platform/
├── AGENTS.md
├── README.md
├── docs/                    # уже есть: спека, roadmap, это обсуждение
│   ├── adr/                 # пустая папка + README «как писать ADR»
│   └── architecture/
├── content/                 # source of truth уроков
│   └── foundation/
│       └── networking/
├── labs/                    # пока markdown-описания, без runner
├── packages/
│   ├── domain/              # Node, Edge, Track, Progress, Zod
│   ├── graph/               # DAG, requires/unlocks, validation
│   ├── content/             # MDX/frontmatter → domain objects
│   └── visualizations/      # реестр виджетов по id
├── apps/
│   └── web/                 # граф + lesson shell + node panel
├── scripts/                 # generate-graph, validate-graph
└── .github/workflows/       # сначала узкий CI
```

Пакеты `graph-ui`, `ui`, `data`, `testing` — во вторую очередь, когда появится реальный код, который туда выносить.

`packages/data` на старте может быть просто `LocalProgressRepository` внутри `apps/web` за интерфейсом из `domain`. Вынос в пакет — когда появится второй потребитель.

## 5. Стек: что зафиксировать, что оставить развилкой

### Скорее да (совпадает со спекой и визуальным MVP)

- TypeScript strict (включая флаги из §20 спеки)
- pnpm workspaces
- Zod для Node/Edge/Lab metadata
- React Flow + ELK.js для графа
- Vitest для domain/graph (это дёшево и защищает ядро)
- Prettier + ESLint
- GitHub Actions позже, но валидатор графа — как script с дня появления `content/`

### Развилки, которые надо решить до первой установки пакетов

**A. Next.js App Router vs Vite SPA**

- Спека намекает на Next (`.next/cache`, MDX, Cloudflare).
- Для чисто визуального графа Vite проще и быстрее.
- Если цель — Cloudflare Pages + MDX-уроки + потом serverless progress, Next (или OpenNext к Cloudflare) ближе к финалу.
- Предложение к обсуждению: **Next.js**, потому что уроки — маршруты, MDX нативный, деплой ближе к спеке. Минус: тяжелее на старте.

**B. pnpm + Turborepo vs только pnpm**

- Turbo оправдан, когда есть несколько пакетов и CI cache.
- На 2–3 пакетах можно жить без Turbo.
- Предложение: **pnpm workspaces сразу, Turbo — когда появится второй package build**. Не ставить инфраструктуру ради инфраструктуры.

**C. Как хранить граф**

Вариант 1 — всё в frontmatter MDX (`requires`, `unlocks`, `visualizations`).
Вариант 2 — `content/**/*.mdx` + отдельный `graph.yml` со рёбрами.
Вариант 3 — каждый node = папка: `tcp.mdx`, `tcp.meta.yml`, `practice.md`.

Для агентов и валидации удобнее **frontmatter как контракт** (вариант 1), с жёсткой Zod-схемой. Если frontmatter раздуется — вынесем meta в yaml, не наоборот.

**D. Где живёт сгенерированный граф**

- в CI/dev: `scripts/generate-graph` → `packages/data/generated/graph.json`
- в git: либо коммитим артефакт (проще деплой), либо генерируем на build (один источник правды — content)

Предложение: **не коммитить generated**, генерировать на build. Валидатор гоняет и то и другое.

**E. Хостинг**

На визуальном этапе достаточно Cloudflare Pages / GitHub Pages / даже `pnpm dev`.
BaaS (Supabase / D1) не поднимать, пока progress не понадобится вне браузера.

## 6. Автоматизация: наращивать слоями, не стеной

Спека описывает зрелый контур (format, lint, typecheck, architecture, graph, unit, integration, build, Playwright, a11y, nightly backups). Это целевое состояние, не день 1.

### Слой 0 — ещё до приложения (можно сделать сразу после согласия)

- `.gitignore`
- `AGENTS.md`
- `docs/` + ADR-шаблон
- хук только на секреты? необязательно

### Слой 1 — как только появляется `content/` и domain-схема

```text
validate-graph
  - duplicate IDs
  - missing requires
  - cycles in requires
  - unknown visualization ids
  - unknown lab ids
```

Локально: `pnpm graph:validate`
В CI: один job, без тестов UI.

### Слой 2 — как только есть TypeScript-пакеты

```text
lint-staged → Prettier + ESLint   # pre-commit
typecheck + unit (domain/graph)   # pre-push или CI
```

E2E на каждый commit — нет, как в спеке.

### Слой 3 — когда есть кликабельный граф

- Playwright: открыть граф → клик TCP → видны prerequisites
- axe на этот же сценарий
- visual regression графа — только когда layout стабилен, иначе будет шум

### Слой 4 — не раньше облачного state

- backups, D1 Time Travel, restore checks
- nightly broken links

**dependency-cruiser / Knip / Stylelint / remark** — полезны, но не блокер визуального MVP. Включить, когда появятся реальные границы пакетов, иначе правила будет не на чем проверить.

## 7. Учебный контент на старте: узкий вертикальный срез

Не импортировать весь roadmap в `content/` сразу.

Первый вертикальный срез (хватит, чтобы граф был настоящим, а не демо из трёх кружков):

```text
networking.what-is-a-network
networking.ethernet
networking.mac
networking.switch
networking.arp
networking.ipv4
networking.subnetting
networking.gateway
networking.routing
networking.icmp
networking.tcp
networking.udp
networking.dns
networking.dhcp
networking.nat
```

Связи `requires` / `related-to` — по roadmap §01.
Один track: `foundation.networking-i`.
Одна visualization: например `network.packet-journey` или `network.tcp-handshake`.
Один lab-stub: Packet Tracer «PC — Switch — PC».

OS / Linux / Security в контент не кладём, пока срез Networking I не выглядит и не валидируется.

## 8. Domain model с дня появления кода (универсальный)

Не делать `NetworkingLesson`. Сразу:

```text
Node
Edge (type: requires | unlocks | related-to | used-by | practice-for | part-of)
Track
Lesson
Visualization
Lab
Checkpoint
Progress
NodeStatus
```

Статусы — как в спеке. `MASTERED` только правилом (theory + practice + checkpoint), не ручным кликом.

Структура урока в MDX — фиксированные секции (§37): What / Why / How / Visualization / Examples / Commands / Practice / Mistakes / Checkpoint / Related / Next. Валидатор может проверять наличие секций у foundation-узлов.

## 9. Порядок работ после этого обсуждения

Имеется в виду логический порядок, не оценка в днях.

1. Согласовать развилки из §5 (Next vs Vite, Turbo, формат контента).
2. Поднять monorepo-скелет: pnpm, strict TS, ESLint/Prettier, `apps/web` hello-graph.
3. `packages/domain` + Zod. Без UI.
4. `content/foundation/networking/*` на 10–15 узлов.
5. `packages/content` + `packages/graph` + `scripts/validate-graph`.
6. React Flow читает сгенерированный граф. Панель узла. Режимы пока один: Foundation View.
7. `packages/visualizations` + первый виджет, урок ссылается по id.
8. `ProgressRepository` + IndexedDB. Статусы на графе.
9. CI: validate-graph + typecheck + unit.
10. Только потом: остальные foundation-блоки, view-переключатели, E2E.

## 10. Открытые вопросы к решению

1. Next.js или Vite для `apps/web`?
2. Коммитим generated `graph.json` или только собираем на build?
3. Первый visualization-виджет: packet journey, TCP handshake или subnet calculator?
4. Нужен ли GitHub remote / Actions на этом шаге или сначала только локальный git?
5. Контент пишем руками узким срезом или сразу пробуем генерацию агентом под валидатор?
6. Язык интерфейса и уроков на старте: русский, английский, оба?
7. Темы (dark по умолчанию?) — не блокер, но влияет на visual regression позже.

## 11. Чего сознательно не делаем, пока не закроем визуальный срез Networking I

- Security / OSINT / DevOps контент
- Supabase / D1 / auth
- Docker / k8s в самом репозитории платформы
- Playwright visual regression на нестабильный ELK-layout
- «полный» набор пакетов из §18 спеки
- AI tutor, multi-user, облачный progress
