---
id: sa-nginx-reverse-proxy
title: "Настройка Nginx Reverse Proxy для веб-приложения"
titleEn: "Configuring Nginx as a Reverse Proxy for Web Applications"
environment: "Ubuntu Server"
goal: "Развернуть веб-сервер Nginx, настроить проксирование запросов с внешнего порта 80 на внутренний сервис (127.0.0.1:3000) с передачей заголовков Host и X-Forwarded-For."
topology: |
  [Client: Browser / curl] ---> [Ubuntu Server: Nginx (:80)] ---> [Backend: Node.js/Python (127.0.0.1:3000)]
checklist:
  - "Установите веб-сервер Nginx через apt install nginx"
  - "Запустите тестовое приложение на внутреннем порту 3000"
  - "Создайте конфигурационный файл /etc/nginx/sites-available/app.conf"
  - "Настройте блок location / с директивой proxy_pass http://127.0.0.1:3000"
  - "Добавьте проксирование заголовков: Host, X-Real-IP, X-Forwarded-For, X-Forwarded-Proto"
  - "Создайте символическую ссылку в /etc/nginx/sites-enabled/ и проверьте синтаксис (nginx -t)"
  - "Перезагрузите конфигурацию Nginx (systemctl reload nginx) и проверьте ответ curl http://localhost"
---

## Цель работы

Освоить классический паттерн развертывания веб-сервисов в продакшене: изоляция внутреннего бэкенда за обратным прокси-сервером Nginx, маршрутизация HTTP-запросов и сохранение метаданных оригинального клиентского подключения.

## Топология сети

```text
[Client: Browser / curl] ---> [Ubuntu Server: Nginx (:80)] ---> [Backend: Node.js/Python (127.0.0.1:3000)]
```

## Чеклист выполнения

1. Установите Nginx:

   ```bash
   sudo apt update && sudo apt install -y nginx
   ```

2. Запустите простой HTTP-сервер на порту 3000 (например, с помощью встроенного модуля Python или Node.js):

   ```bash
   python3 -m http.server 3000 --bind 127.0.0.1 &
   ```

3. Создайте конфигурацию виртуального хоста `/etc/nginx/sites-available/demo-app`:

   ```nginx
   server {
       listen 80;
       server_name localhost;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host \$host;
           proxy_set_header X-Real-IP \$remote_addr;
           proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto \$scheme;
       }
   }
   ```

4. Активируйте сайт и проверьте конфигурацию:

   ```bash
   sudo ln -s /etc/nginx/sites-available/demo-app /etc/nginx/sites-enabled/
   sudo rm -f /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. Проверьте результат локальным запросом к порту 80:

   ```bash
   curl -I http://localhost/
   ```
