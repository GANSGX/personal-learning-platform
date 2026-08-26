# Personal Learning Platform

Персональная интерактивная платформа обучения на knowledge graph.

Сейчас репозиторий в стадии обсуждения bootstrap: структура, автоматизация, визуальный MVP. Реализация приложения ещё не начата.

## Источники

- [Учебный roadmap](docs/learning-roadmap.md)
- [Спецификация платформы](docs/personal-learning-platform-spec.md)
- [План обсуждения bootstrap](docs/discussion/repo-bootstrap.md)

## Принцип

```text
domain model
  → knowledge graph schema
  → architecture rules
  → validation
  → CI
  → UI
```

На первом этапе практика визуальная (симуляции, схемы, интерактивные виджеты). Реальные VM / Packet Tracer labs подключаются позже как сущности `Lab`, не как ядро.
