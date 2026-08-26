# AGENTS.md

Черновик законов проекта. Пока обсуждается, не считается финальным.

## Назначение

Агенты не придумывают архитектуру заново. Любое изменение этих правил — через ADR в `docs/adr/`.

## Слои

- UI не обращается к хранилищу напрямую. Только через repository/use-cases.
- Graph algorithms не зависят от React.
- Контент уроков не живёт внутри React-компонентов. Источник — `content/`.
- Domain-пакет не импортирует UI.
- Пакет контента не зависит от React.
- Любые внешние данные проходят schema validation (Zod).

## Контент и граф

- Учебный контент и структура roadmap хранятся в Git, не в БД.
- БД (когда появится) — только mutable state: progress, notes, bookmarks, settings.
- Каждый curriculum node проходит graph validation.
- Циклы в `requires` запрещены (DAG).

## Качество

- TypeScript strict. В domain/core не использовать `any`, `as unknown as`, non-null assertion без причины.
- Не добавлять dependency без явной причины.
- Не подавлять ESLint без комментария.
- Новая domain-фича — с тестами.
- Изменение архитектуры — ADR.

## Что не делать на старте

Не тащить в core: multi-user, AI tutor, отдельный backend, Security/OSINT-контент, реальные VM-labs. Архитектура должна позволять добавить это позже без переписывания ядра.
