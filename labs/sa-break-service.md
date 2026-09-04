---
id: sa-break-service
title: "Диагностика и восстановление упавшего сервиса"
titleEn: "Service Troubleshooting: Break and Fix"
environment: "Ubuntu Server"
goal: "Найти причину сбоя запущенного systemd-сервиса через journalctl и systemctl status, исправить конфигурацию и восстановить работу."
topology: |
  [Workstation: Mac] <===== SSH =====> [Ubuntu Server: demo-service.service]
checklist:
  - "Подключитесь к виртуальному серверу Ubuntu по SSH"
  - "Проверьте статус сервиса: systemctl status demo-service"
  - "Проанализируйте журналы аварийного завершения: journalctl -u demo-service -e"
  - "Найдите ошибку в Unit-файле (/etc/systemd/system/demo-service.service) или конфигурации"
  - "Исправьте конфигурацию и выполните systemctl daemon-reload"
  - "Запустите сервис (systemctl start demo-service) и убедитесь в статусе active (running)"
---

## Цель работы

Освоить методику траблшутинга серверных служб под управлением Systemd: анализ кодов возврата, чтение логов в Journalctl, перезагрузка конфигураций демона и проверка работоспособности.

## Топология сети

```text
[Workstation: Mac] <===== SSH =====> [Ubuntu Server: demo-service.service]
```

## Чеклист выполнения

1. Подключитесь к тестовой виртуальной машине Ubuntu Server по SSH.
2. Смоделируйте или проверьте сбойный сервис:

   ```bash
   sudo systemctl status demo-service
   ```

3. Изучите детальные сообщения об ошибке через `journalctl`:

   ```bash
   sudo journalctl -u demo-service -n 50 --no-pager
   ```

4. Определите причину сбоя (например, неверные права доступа, опечатка в пути бинарного файла или невалидный порт).
5. Отредактируйте Unit-файл `/etc/systemd/system/demo-service.service`.
6. Примените изменения в systemd:

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl restart demo-service
   ```

7. Убедитесь, что сервис перешел в состояние `active (running)`.
