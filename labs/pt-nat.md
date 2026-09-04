---
id: pt-nat
title: "Трансляция сетевых адресов (NAT / PAT)"
titleEn: "Network Address Translation (NAT / PAT)"
environment: "Cisco Packet Tracer"
goal: "Настроить Dynamic PAT (Overload) для выхода компьютеров локальной сети в публичную сеть через один внешний IP."
topology: |
  [Внутренняя LAN: 192.168.1.0/24]                [Внешняя сеть / Интернет]
  [PC-0] --- [Switch] --- G0/0 (inside) [Router] G0/1 (outside: 203.0.113.2) --- [Server: 203.0.113.100]
checklist:
  - "Соберите топологию: локальный PC, коммутатор, шлюз-маршрутизатор и внешний Web-сервер"
  - "Назначьте интерфейс G0/0 как 'ip nat inside', а интерфейс G0/1 как 'ip nat outside'"
  - "Создайте стандартный список доступа для локальной сети: access-list 1 permit 192.168.1.0 0.0.0.255"
  - "Включите трансляцию с перегрузкой портов: ip nat inside source list 1 interface G0/1 overload"
  - "Откройте Web Browser на PC-0 и перейдите по адресу http://203.0.113.100"
  - "В CLI роутера выполните 'show ip nat translations' и изучите таблицу трансляций сокетов (IP:Port)"
---

## Цель работы

Понять назначение приватных (RFC 1918) и публичных адресов, принцип работы механизма трансляции сетевых адресов и портов (NAPT / PAT / NAT Overload).

## Топология сети

```text
[Внутренняя LAN: 192.168.1.0/24]                [Внешняя сеть / Интернет]
[PC-0] --- [Switch] --- G0/0 (inside) [Router] G0/1 (outside: 203.0.113.2) --- [Server: 203.0.113.100]
```

## Чеклист выполнения

1. Разместите устройства:
   - Локальная сеть: `PC-0` (`192.168.1.10`, GW `192.168.1.1`) подключен к коммутатору, коммутатор к `G0/0` маршрутизатора.
   - Внешняя сеть: `G0/1` маршрутизатора (`203.0.113.2/24`) подключен к `Server-0` (`203.0.113.100/24`, включена служба HTTP).
2. Настройте IP-адреса на портах маршрутизатора.
3. Разметьте интерфейсы NAT:

   ```cisco
   Router(config)# interface GigabitEthernet0/0
   Router(config-if)# ip nat inside
   Router(config-if)# exit
   Router(config)# interface GigabitEthernet0/1
   Router(config-if)# ip nat outside
   Router(config-if)# exit
   ```

4. Создайте ACL и привяжите правило NAT:

   ```cisco
   Router(config)# access-list 1 permit 192.168.1.0 0.0.0.255
   Router(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload
   ```

5. Сделайте HTTP-запрос с `PC-0` на `203.0.113.100` через браузер Packet Tracer.
6. Проверьте трансляцию в роутере:

   ```cisco
   Router# show ip nat translations
   ```

   Убедитесь, что внутренний сокет `192.168.1.10:порт` преобразуется во внешний сокет `203.0.113.2:порт`.
