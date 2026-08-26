# Personal Learning Platform

## 1. Идея проекта

Это не просто сайт с конспектами и не обычный roadmap.

Цель — создать **персональную интерактивную learning-platform**, основанную на **графе знаний**, которая будет развиваться вместе с обучением:

- сначала фундамент;
- затем инфраструктура;
- позже DevOps / SRE;
- затем Security / Cybersecurity;
- параллельно можно развивать OSINT и смежные направления;
- каждый блок содержит теорию, визуализации, практику и checkpoint;
- зависимости между знаниями представлены как граф.

Основная идея:

```text
                    KNOWLEDGE GRAPH
                           │
                           │
              ┌────────────┴─────────────┐
              │                          │
         FOUNDATION                 SPECIALIZATIONS
              │                          │
    ┌─────────┼─────────┐        ┌───────┼─────────┐
    │         │         │        │       │         │
 Networks    Linux    Systems   Infra  Security  OSINT
    │         │         │        │       │         │
    └─────────┴─────────┘        └───────┴─────────┘
              │
              ↓
           Practice
              │
              ↓
          Checkpoints
```

Главная сущность проекта — не страница и не курс.

Главная сущность:

```text
KnowledgeNode
```

Например:

```text
IPv4
  │
  ├── требует → Binary / addressing basics
  ├── нужен для → Routing
  ├── связан с → ARP
  ├── связан с → ICMP
  └── практика → Packet Tracer lab #4
```

---

# 2. Учебная модель

На первом этапе **не нужно учить DevOps, ИБ, КБ, pentest и т.д.**

Сначала должен быть один общий фундаментальный ствол.

```text
                     FUNDAMENTALS

                         START
                           │
                           ↓
                 01. NETWORKING I
                           │
                           ↓
                  02. OS + LINUX
                           │
                           ↓
                03. SYSTEM ADMIN
                           │
                           ↓
                 04. NETWORKING II
                           │
                           ↓
             05. WEB / SERVICES / DNS
                           │
                           ↓
               06. STORAGE / DATABASES
                           │
                           ↓
               07. AUTOMATION BASICS
                           │
                           ↓
                08. INTEGRATION LAB
                           │
                           ↓
                 FUNDAMENT COMPLETE
```

После закрытия фундамента появляется развилка направлений.

---

# 3. Блок 1 — Networking I

Начало буквально от нуля:

```text
что такое сеть
↓
network interface
↓
Ethernet
↓
MAC
↓
switch
↓
ARP
↓
IPv4
↓
subnet / mask / CIDR
↓
gateway
↓
router
↓
ICMP
↓
TCP
↓
UDP
↓
ports
↓
DNS
↓
DHCP
↓
NAT
```

Практика:

```text
Packet Tracer

PC ─ switch ─ PC

↓

несколько subnet

↓

router

↓

DHCP

↓

DNS

↓

NAT
```

Плюс реальные сетевые инструменты macOS:

```bash
ping
traceroute
arp
dig
netstat
curl
nc
```

---

# 4. Блок 2 — Operating Systems + Linux

Linux не должен изучаться как набор команд.

Сначала нужно понять:

```text
hardware
↓
kernel
↓
process
↓
thread
↓
memory
↓
filesystem
↓
user space / kernel space
↓
syscalls
↓
files
↓
permissions
```

После этого уже Linux:

```text
filesystem hierarchy
users/groups
permissions
processes
signals
packages
services
systemd
logs
SSH
environment
```

Практика:

```text
Mac
 │
 │ SSH
 ↓
Ubuntu Server VM
```

---

# 5. Блок 3 — System Administration

На этом этапе начинается настоящее системное администрирование.

```text
Ubuntu Server
├── users
├── permissions
├── SSH
├── systemd
├── processes
├── logs
├── cron
├── firewall
├── storage
├── mounts
├── backups
└── troubleshooting
```

Практика:

```text
Mac
 │
 ├──────── SSH ───────→ server-1
 │
 └──────── SSH ───────→ server-2
```

Пример заданий:

```text
создай пользователя
↓
запрети root SSH
↓
подними сервис
↓
сломай сервис
↓
найди причину через logs
↓
почини
```

---

# 6. Блок 4 — Networking II

После базового Linux и sysadmin нужно вернуться к сетям глубже:

```text
routing
VLAN
trunk
ACL
firewall
DNS глубже
TCP глубже
IPv6 basics
VPN
TLS
network troubleshooting
```

Packet Tracer здесь становится основным практическим инструментом.

---

# 7. Блок 5 — Web / Service Infrastructure

Frontend-опыт здесь помогает.

То, что раньше выглядело:

```text
fetch("/api")
```

нужно раскрутить до:

```text
Browser
   ↓
DNS
   ↓
IP
   ↓
TCP
   ↓
TLS
   ↓
HTTP
   ↓
reverse proxy
   ↓
application
   ↓
database
```

Изучаем:

```text
DNS
HTTP
HTTPS
TLS
certificates
reverse proxy
nginx
load balancing basics
cookies
headers
WebSocket
CDN
caching
```

Практика — вручную поднять собственный сайт на Linux VM.

---

# 8. Блок 6 — Storage / Databases Fundamentals

Не требуется становиться DBA.

Нужно понимать:

```text
disk
filesystem
block storage
object storage
database
indexes
transactions
backup
restore
replication concept
```

Для практики достаточно PostgreSQL.

---

# 9. Блок 7 — Automation Fundamentals

Автоматизация должна идти **после ручной практики**.

```text
Bash
Python scripts
Git
cron
JSON
YAML
environment variables
HTTP APIs
```

Принцип:

> Я десять раз сделал это руками. Теперь автоматизирую.

---

# 10. Финальный фундаментальный lab

После всех базовых блоков нужен интеграционный проект.

```text
                        Mac
                         │
                         │ SSH
                         ↓
                    Gateway VM
                         │
             ┌───────────┴───────────┐
             │                       │
          Web VM                  DB VM
             │                       │
          nginx                  PostgreSQL
             │
             ↓
        application
```

Самостоятельно:

```text
строишь сеть
настраиваешь IP
настраиваешь routing
SSH
users
firewall
nginx
DNS
TLS
services
logs
backup
restore
```

После этого:

```text
FOUNDATION COMPLETE
```

---

# 11. Развилки после фундамента

После фундаментального ствола обучение становится графом.

```text
                            FOUNDATION
                                │
                                ↓
                        INFRASTRUCTURE
                                │
                  ┌─────────────┼─────────────┐
                  │             │             │
                  ↓             ↓             ↓
               DevOps          SRE        Cloud/Systems
                  │
                  │
         ┌────────┴───────────┐
         ↓                    ↓
     Security              deeper Infra
         │
   ┌─────┼─────────┐
   ↓     ↓         ↓
 AppSec Blue     Offensive
         │
         ↓
       DFIR

OSINT ──────────────────────────────┐
 │                                  │
 ├──── Threat Intelligence          │
 ├──── Recon                        │
 ├──── Investigations               │
 └──── Security Research ────────────┘
```

---

# 12. ИБ, КБ и OSINT

ИБ и КБ — не две полностью независимые области.

Удобная модель:

```text
Security
│
├── Information Security
│   ├── risk
│   ├── policies
│   ├── security architecture
│   ├── IAM
│   ├── data protection
│   └── cryptography
│
└── Cybersecurity
    ├── network security
    ├── AppSec
    ├── pentest
    ├── blue team
    ├── DFIR
    ├── malware
    ├── cloud security
    └── container security
```

OSINT лучше делать отдельной поперечной дисциплиной.

Он используется в:

```text
cyber threat intelligence
recon
pentest
fraud investigations
corporate intelligence
journalism
law enforcement
investigations
```

Поэтому OSINT в knowledge graph должен иметь связи с разными областями, а не быть просто дочерней папкой Cybersecurity.

---

# 13. Концепция интерфейса

Проект можно описать как:

> **Interactive Knowledge Graph Learning Platform**

Главный экран — интерактивный граф.

```text
                           [Networking]
                               │
                 ┌─────────────┼─────────────┐
                 ↓             ↓             ↓
              [MAC]           [IP]          [DNS]
                 │             │              │
                 ↓             ↓              │
               [ARP]       [Routing]          │
                               │              │
                               ↓              ↓
                             [TCP]──────────[HTTP]
                               │              │
                               └──────┬───────┘
                                      ↓
                                    [TLS]
```

При клике на node:

```text
┌────────────────────────────────────┐
│ TCP                                │
│                                    │
│ Status: In progress                │
│ Difficulty: Foundation             │
│                                    │
│ Requires                           │
│ • IP                               │
│ • Ports                            │
│                                    │
│ Unlocks                            │
│ • HTTP                             │
│ • TLS                              │
│ • Reverse proxy                    │
│                                    │
│ [Theory]                           │
│ [Visualization]                    │
│ [Practice]                         │
│ [Checkpoint]                       │
└────────────────────────────────────┘
```

---

# 14. Граф, а не дерево

Knowledge graph должен быть настоящим графом зависимостей.

Например:

```text
            Processes
               │
               ↓
Linux ─────→ Docker ←──── Networking
               ↑
               │
           Filesystems
```

Для prerequisite-связей лучше использовать DAG:

> Directed Acyclic Graph

Дополнительные типы связей:

```text
requires
unlocks
related-to
used-by
practice-for
part-of
alternative-to
```

---

# 15. Визуальный движок

Для графа можно использовать:

```text
React Flow
+
ELK.js
```

Архитектура:

```text
Knowledge data
      ↓
Graph Engine
      ↓
ELK layout
      ↓
React Flow
      ↓
interactive graph
```

Режимы отображения:

```text
Foundation View
Infrastructure View
Security View
OSINT View
Full Knowledge Map
My Current Path
```

---

# 16. Контент не хранить в БД

Это должно быть строгим правилом.

```text
Git
└── content/
    ├── networking/
    ├── linux/
    ├── systems/
    ├── databases/
    ├── infrastructure/
    ├── security/
    └── osint/
```

Пример:

```text
content/networking/tcp.mdx
```

Metadata:

```yaml
id: networking.tcp
title: TCP
level: foundation

requires:
  - networking.ip
  - networking.ports

unlocks:
  - web.http
  - security.network.tcp

visualizations:
  - tcp-handshake

labs:
  - networking.tcp.basic
```

Преимущества Git:

```text
version control
history
diff
rollback
review
branches
backup
```

---

# 17. Graph Validator

CI должен проверять учебный граф.

Пример ошибки:

```text
TCP requires HTTP
HTTP requires TCP
```

CI должен сообщать:

```text
ERROR:
Curriculum dependency cycle detected

networking.tcp
→ web.http
→ networking.tcp
```

Дополнительные проверки:

```text
duplicate IDs
missing prerequisites
broken references
orphan lessons
invalid tracks
invalid labs
invalid visualization IDs
cycles
missing required metadata
broken internal links
```

---

# 18. Архитектура репозитория

Рекомендуемая структура — monorepo, но без микросервисов ради микросервисов.

```text
learning-platform/
│
├── apps/
│   └── web/
│
├── packages/
│   ├── domain/
│   │   ├── curriculum/
│   │   ├── progress/
│   │   └── labs/
│   │
│   ├── graph/
│   │   ├── algorithms/
│   │   ├── validation/
│   │   └── layout/
│   │
│   ├── graph-ui/
│   │
│   ├── content/
│   │
│   ├── ui/
│   │
│   ├── data/
│   │
│   └── testing/
│
├── content/
│   ├── foundation/
│   ├── infrastructure/
│   ├── security/
│   └── osint/
│
├── labs/
│
├── public/
│
├── scripts/
│
├── docs/
│   ├── architecture/
│   └── adr/
│
├── .github/
│   └── workflows/
│
├── AGENTS.md
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

# 19. AGENTS.md как закон проекта

Codex/агенты не должны каждый раз придумывать архитектуру.

Примеры строгих правил:

```text
UI не обращается напрямую к DB.

Graph algorithms не зависят от React.

Lesson content не хранится внутри React components.

Domain package не импортирует UI.

Любые external данные проходят schema validation.

Нельзя добавлять dependency без причины.

Нельзя использовать any.

Нельзя подавлять ESLint без комментария.

Каждая новая domain feature должна иметь tests.

Любое изменение архитектуры требует ADR.

Каждый curriculum node должен пройти graph validation.
```

---

# 20. TypeScript strict mode

Нужен максимально строгий TypeScript.

Не только:

```json
"strict": true
```

Дополнительно:

```text
noUncheckedIndexedAccess
exactOptionalPropertyTypes
noImplicitOverride
noFallthroughCasesInSwitch
noPropertyAccessFromIndexSignature
noUnusedLocals
noUnusedParameters
```

В domain/core по возможности не допускать:

```text
any
as unknown as
!
```

без причины.

---

# 21. Linting / Formatting / Static Analysis

Рекомендуемый набор:

```text
ESLint
├── typescript-eslint type-aware
├── react-hooks
├── jsx-a11y
├── import rules
├── boundaries
└── unicorn

Prettier

Stylelint — если будет свой CSS

remark / markdownlint — MDX

Knip — dead code / unused dependencies
```

Архитектурные зависимости:

```text
dependency-cruiser
```

Пример:

```text
domain → graph        OK
graph → ui            ❌
ui → domain           OK
content → React       ❌
```

---

# 22. Git hooks

Перед commit:

```text
lint-staged
↓
Prettier
↓
ESLint
```

Перед push:

```text
typecheck
unit tests
```

Полный E2E локально перед каждым commit не нужен.

---

# 23. GitHub CI

Pull Request pipeline:

```text
Pull Request
      │
      ↓
┌─────────────────────┐
│ format check        │
│ lint                │
│ typecheck           │
│ architecture check  │
│ graph validation    │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ unit tests          │
│ integration tests   │
└──────────┬──────────┘
           ↓
         build
           ↓
     Playwright E2E
           ↓
   accessibility tests
           ↓
        SUCCESS
           ↓
       merge allowed
```

Для `main`:

```text
CI
↓
deploy preview/production
↓
smoke test
```

Nightly workflow:

```text
broken links
dependency check
DB backup
backup validation
long E2E
```

---

# 24. Автотесты

## Unit

Vitest.

Покрываем:

```text
graph algorithms
dependency resolver
progress calculations
validators
content parsers
cache key generation
```

## Integration

Например:

```text
MDX
 ↓
parser
 ↓
Zod validation
 ↓
KnowledgeNode
 ↓
graph
 ↓
render
```

Также тестируются data repositories.

## E2E

Playwright.

Пример сценария:

```text
открыть roadmap
↓
выбрать TCP
↓
увидеть prerequisites
↓
открыть lesson
↓
закончить practice
↓
mark complete
↓
вернуться на roadmap
↓
node стал completed
```

## Accessibility

```text
axe
+
Playwright
```

## Visual Regression

Playwright screenshots для:

```text
graph
lesson
sidebar
mobile
dark theme
```

---

# 25. Coverage

Не нужно бессмысленное 100%.

Например:

```text
packages/domain      ≥ 90%
packages/graph       ≥ 90%
packages/content     ≥ 85%

UI:
не гонимся за процентом,
тестируем поведение
```

---

# 26. Кеширование

Кеширование должно существовать на нескольких уровнях.

## CI cache

```text
pnpm store
.next/cache
turbo cache
Playwright binaries где разумно
```

## Build cache

MDX-компиляция и graph generation зависят от hash контента.

```text
content unchanged
       ↓
reuse cached result
```

## Browser cache

Статические файлы:

```text
JS
CSS
fonts
images
```

Используют immutable cache благодаря content hashes.

## CDN cache

```text
Browser
   ↓
Cloudflare edge cache
   ↓
origin
```

## Dynamic state

Для состояния пользователя позже:

```text
TanStack Query
```

Использовать для:

```text
progress
notes
bookmarks
lab results
```

Локально можно хранить данные в IndexedDB.

---

# 27. БД не нужна на первом этапе

Начальная версия:

```text
Lessons → Git/MDX

Graph → generated JSON

Progress → IndexedDB / localStorage
```

Нужно сразу абстрагировать data layer.

Например:

```ts
interface ProgressRepository {
  getProgress(userId: string): Promise<Progress>;
  saveProgress(progress: Progress): Promise<void>;
}
```

Сегодня:

```text
LocalProgressRepository
```

Позже:

```text
CloudProgressRepository
```

UI не должен зависеть от реализации.

---

# 28. Что хранить в БД позже

Только mutable state:

```text
users
progress
lesson attempts
lab results
notes
bookmarks
settings
learning sessions
```

Не хранить в БД:

```text
TCP lesson
Linux lesson
roadmap structure
```

Контент и roadmap остаются в Git.

---

# 29. Отдельный backend не нужен на старте

Нет необходимости делать:

```text
frontend repo
+
NestJS
+
Docker API
+
VPS
+
24/7 server
```

Можно использовать:

```text
Frontend
   ↓
serverless / BaaS
   ↓
database
```

---

# 30. Data backend варианты

## Вариант A — Supabase

```text
Browser
   ↓
Supabase SDK
   ↓
Auth + RLS
   ↓
PostgreSQL
```

Подходит для:

```text
users
progress
notes
bookmarks
settings
```

## Вариант B — Cloudflare

```text
Browser
    ↓
Cloudflare
    ↓
tiny Worker API
    ↓
D1
```

Worker содержит небольшое API:

```text
GET progress
PUT progress
GET notes
PUT note
DELETE note
```

Это не отдельный backend-сервер.

---

# 31. Автобэкапы

## Контент

Контент уже резервируется через:

```text
Git history
+
GitHub
+
локальный clone
```

## Database short-term

Если используется D1:

```text
Time Travel
```

## Database long-term

Nightly workflow:

```text
02:00 UTC
   ↓
export DB
   ↓
validate dump
   ↓
compress
   ↓
encrypt
   ↓
SHA-256 checksum
   ↓
upload object storage
```

---

# 32. Backup retention

Пример:

```text
daily
× 7

weekly
× 4

monthly
× 12
```

Старые backup удаляются автоматически.

Раз в неделю:

```text
take latest backup
↓
restore into temporary/local DB
↓
run integrity checks
↓
SUCCESS
```

Важно проверять не только создание backup, но и возможность восстановления.

---

# 33. Физическая архитектура системы

```text
                     YOU / CODEX
                          │
                          ↓
                       GitHub
                          │
                          │ push / PR
                          ↓
                   GitHub Actions
                          │
         ┌────────────────┼────────────────┐
         │                │                │
      lint/test       graph validate      build
         │                │                │
         └────────────────┼────────────────┘
                          ↓
                        deploy
                          ↓
                 Cloudflare CDN
                          │
                          ↓
                       Browser
                 ┌────────┴────────┐
                 │                 │
            static lessons      user state
                 │                 │
                 │                 ↓
                 │          tiny serverless API
                 │                 │
                 │                 ↓
                 │                DB
                 │
                 ↓
               Git
```

Backups:

```text
DB
 │
 │ nightly
 ↓
encrypted export
 │
 ↓
Object Storage
```

---

# 34. Визуализации

Визуализации должны быть отдельным переиспользуемым слоем.

```text
packages/visualizations/
```

Например:

```text
TcpHandshake
DnsResolution
PacketJourney
SubnetCalculator
RoutingVisualizer
LinuxProcessTree
FilesystemExplorer
HttpRequestJourney
TlsHandshake
DependencyGraph
CiCdPipeline
```

Урок хранит только ссылку на визуализацию:

```text
use visualization:
network.tcp-handshake
```

---

# 35. Возможности knowledge graph

Пример: пользователь открывает `Kubernetes` и нажимает:

> Show prerequisites

```text
Networking
    ↓
Linux
    ↓
Processes
    ↓
Namespaces
    ↓
Containers
    ↓
Docker
    ↓
Service Discovery
    ↓
Load Balancing
    ↓
Kubernetes
```

Или:

> Why is this locked?

```text
Kubernetes locked

Missing:
✓ Networking
✓ Linux
✓ Docker
✗ DNS advanced
✗ Load balancing
```

Или:

> Show path to Network Security

Система строит кратчайший учебный путь по графу.

---

# 36. Статусы knowledge nodes

Например:

```text
LOCKED
AVAILABLE
IN_PROGRESS
THEORY_COMPLETE
PRACTICE_COMPLETE
MASTERED
```

`MASTERED` не выставляется вручную.

Можно использовать правило:

```text
theory ✓
+
practice ✓
+
checkpoint ✓
=
mastered
```

---

# 37. Единая структура KnowledgeNode

Каждый фундаментальный node должен иметь одинаковую структуру:

```text
Concept
│
├── What
├── Why
├── How it works
├── Visualization
├── Examples
├── Commands
├── Practice
├── Common mistakes
├── Checkpoint
├── Related concepts
└── Next
```

Это упрощает:

- UI;
- генерацию контента агентами;
- валидацию;
- навигацию;
- тестирование;
- переиспользование компонентов.

---

# 38. Основная domain model

С первого дня должны существовать универсальные сущности:

```text
Node
Edge
Track
Lesson
Visualization
Lab
Checkpoint
Progress
```

Не нужно делать:

```ts
interface NetworkingLesson {}
interface LinuxLesson {}
interface DockerLesson {}
```

Нужны универсальные типы.

---

# 39. Что не нужно реализовывать сразу

Не требуется сразу добавлять:

```text
Security
OSINT
Kubernetes
Cloud
multi-user
AI tutor
Postgres
backend
```

Но архитектура должна позволять добавить их позже без переписывания core.

---

# 40. Итоговая модель проекта

```text
                   PERSONAL LEARNING PLATFORM

                             │
                             ↓
                    KNOWLEDGE GRAPH CORE
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
       Lessons          Visualizations         Labs
          │                  │                  │
          └──────────────────┼──────────────────┘
                             ↓
                          Progress
                             │
                             ↓
                       Learning paths
```

Curriculum:

```text
Foundation
    ↓
Infrastructure
    ↓
┌─────────────────┬──────────────────┐
↓                 ↓                  ↓
DevOps          Security            OSINT
↓                 ↓
SRE             Cybersecurity
                  ↓
          ┌───────┼─────────┐
          ↓       ↓         ↓
        AppSec   Blue      Offensive
```

Engineering stack:

```text
TypeScript strict
pnpm monorepo
Git
MDX
Zod schemas
React Flow
ELK
Vitest
Playwright
ESLint
Prettier
dependency rules
GitHub Actions
automatic deployment
automatic caching
automatic backups
automatic validation
```

---

# 41. Главный принцип проекта

Сначала нужно проектировать:

```text
domain model
↓
knowledge graph schema
↓
architecture rules
↓
validation
↓
CI
↓
UI
```

А не наоборот.

Это должно позволить Codex и другим агентам активно помогать с реализацией, не превращая проект со временем в архитектурную кашу.
