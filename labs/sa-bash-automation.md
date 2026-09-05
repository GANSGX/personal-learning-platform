---
id: sa-bash-automation
title: "Написание надежного скрипта автоматизации на Bash"
titleEn: "Writing Production-Grade Automation Scripts in Bash"
environment: "Ubuntu Server / macOS"
goal: "Разработать отказоустойчивый Bash-скрипт с защитным режимом set -euo pipefail, валидацией аргументов командной строки, парсингом JSON через jq и логированием с кодами возврата."
topology: |
  [Engineer: Shell / CLI] ---> [Bash Script: backup-and-notify.sh] ---> [System: curl, jq, tar]
checklist:
  - "Создайте файл скрипта backup-and-notify.sh с корректным шебангом #!/usr/bin/env bash"
  - "Включите строгий режим исполнения: set -euo pipefail"
  - "Реализуйте проверку наличия обязательных утилит (command -v jq curl)"
  - "Напишите функцию логирования log_info и log_error с временными метками ISO-8601"
  - "Реализуйте парсинг JSON-ответа тестового HTTP API с помощью утилиты jq"
  - "Обработайте аварийное завершение через trap 'error_handler' ERR"
  - "Сделайте скрипт исполняемым (chmod +x) и протестируйте успешный и сбойный сценарии"
---

## Цель работы

Освоить промышленный стандарт написания скриптов автоматизации на Bash: предотвращение неявного игнорирования ошибок, перехват сигналов, валидация окружения и надежная обработка структурированных данных (JSON).

## Топология сети

```text
[Engineer: Shell / CLI] ---> [Bash Script: backup-and-notify.sh] ---> [System: curl, jq, tar]
```

## Чеклист выполнения

1. Создайте исполняемый файл скрипта:

   ```bash
   touch backup-and-notify.sh && chmod +x backup-and-notify.sh
   ```

2. Добавьте шебанг и строгие директивы безопасности ядра оболочки:

   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   ```

3. Добавьте проверку обязательных зависимостей:

   ```bash
   for cmd in curl jq tar; do
       if ! command -v "\$cmd" >/dev/null 2>&1; then
           echo "Ошибка: утилита \$cmd не установлена." >&2
           exit 1
       fi
   done
   ```

4. Реализуйте функцию парсинга JSON:

   ```bash
   STATUS=\$(curl -s https://httpbin.org/json | jq -r '.slideshow.title')
   echo "Получен заголовок: \$STATUS"
   ```

5. Проверьте поведение скрипта при ошибке в конвейере и убедитесь, что флаг `-o pipefail` немедленно прерывает выполнение при ненулевом коде возврата любой команды.
