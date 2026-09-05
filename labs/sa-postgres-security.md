---
id: sa-postgres-security
title: "Изоляция и резервное копирование PostgreSQL"
titleEn: "PostgreSQL Security Isolation and Logical Backup"
environment: "Ubuntu Server"
goal: "Настроить привязку PostgreSQL только к внутреннему интерфейсу (127.0.0.1 / private subnet), разграничить доступ в pg_hba.conf и настроить создание резервной копии базы данных через pg_dump."
topology: |
  [Public Web Client] ---> [Nginx / App Server] ---> [PostgreSQL (:5432)]
                                                      (Blocked from Public Internet)
checklist:
  - "Установите сервер СУБД PostgreSQL (apt install postgresql)"
  - "Настройте listen_addresses в /etc/postgresql/*/main/postgresql.conf"
  - "Ограничьте разрешенные IP-адреса клиентов в /etc/postgresql/*/main/pg_hba.conf"
  - "Создайте служебного пользователя приложения и целевую базу данных через createuser и createdb"
  - "Проверьте блокировку прямого внешнего подключения с хоста вне разрешенного пула"
  - "Выполните создание логического дампа базы данных утилитой pg_dump"
---

## Цель работы

Освоить базовый инфраструктурный стандарт безопасности баз данных: СУБД никогда не должна иметь публичного доступа из глобального интернета. Доступ разрешается строго приложениям из доверенной локальной сети.

## Топология сети

```text
[Public Web Client] ---> [Nginx / App Server] ---> [PostgreSQL (:5432)]
                                                    (Blocked from Public Internet)
```

## Чеклист выполнения

1. Установите СУБД:

   ```bash
   sudo apt update && sudo apt install -y postgresql postgresql-contrib
   ```

2. Проверьте сокеты, которые слушает база:

   ```bash
   sudo ss -tulpn | grep 5432
   ```

3. Убедитесь, что параметр `listen_addresses` в файле `postgresql.conf` настроен на `localhost` или доверенный внутренний IP-адрес подсети (например, `10.0.0.5`), а не на открытый внешний интерфейс без файрвола.
4. В файле `pg_hba.conf` настройте метод аутентификации `scram-sha-256` для выделенного пользователя приложения:

   ```text
   host    app_db          app_user        10.0.0.0/24             scram-sha-256
   ```

5. Создайте базу и пользователя:

   ```bash
   sudo -u postgres psql -c "CREATE USER app_user WITH PASSWORD 'secure_password';"
   sudo -u postgres psql -c "CREATE DATABASE app_db OWNER app_user;"
   ```

6. Создайте резервную копию базы данных:

   ```bash
   pg_dump -U app_user -h 127.0.0.1 app_db > backup_app_db.sql
   ```
