---
id: pt-vlan-trunk
title: "Настройка VLAN и 802.1Q Trunk на коммутаторе"
titleEn: "VLAN and 802.1Q Trunk Configuration on Switch"
environment: "Cisco Packet Tracer"
goal: "Разделить локальную сеть на два изолированных широковещательных домена (VLAN 10 и VLAN 20) и настроить Trunk-канал между коммутаторами."
topology: |
  [PC-1: VLAN 10] --\                                  /-- [PC-3: VLAN 10]
                     [Switch-0] <===== 802.1Q Trunk =====> [Switch-1]
  [PC-2: VLAN 20] --/                                  \-- [PC-4: VLAN 20]
checklist:
  - "Добавьте два коммутатора Cisco 2960 и 4 компьютера в Packet Tracer"
  - "Создайте VLAN 10 (name USERS) и VLAN 20 (name SERVERS) на обоих коммутаторах"
  - "Настройте порты доступа (Access): Fa0/1 в VLAN 10, Fa0/2 в VLAN 20"
  - "Настройте транковый порт между коммутаторами: switchport mode trunk"
  - "Проверьте связность: PC-1 пингует PC-3 (внутри VLAN 10)"
  - "Убедитесь в изоляции: PC-1 не может отправить пинг на PC-2 или PC-4 (VLAN 20)"
---

## Цель работы

Освоить сегментацию локальной сети на канальном уровне (L2) с помощью виртуальных локальных сетей (VLAN), тегирования кадров по стандарту IEEE 802.1Q и настройки магистральных каналов (Trunk).

## Топология сети

```text
[PC-1: VLAN 10] --\                                  /-- [PC-3: VLAN 10]
                   [Switch-0] <===== 802.1Q Trunk =====> [Switch-1]
[PC-2: VLAN 20] --/                                  \-- [PC-4: VLAN 20]
```

## Чеклист выполнения

1. Разместите два коммутатора Cisco 2960 (`Switch-0` и `Switch-1`) и 4 ПК.
2. Соедините порты `GigabitEthernet0/1` обоих свитчей прямым медным кабелем (Copper Straight-Through).
3. На обоих свитчах создайте VLAN:

   ```text
   Switch(config)# vlan 10
   Switch(config-vlan)# name USERS
   Switch(config)# vlan 20
   Switch(config-vlan)# name SERVERS
   ```

4. Переведите порт соединения в режим Trunk:

   ```text
   Switch(config)# interface Gi0/1
   Switch(config-if)# switchport mode trunk
   ```

5. Назначьте клиентские порты в соответствующие VLAN:

   ```text
   Switch(config)# interface Fa0/1
   Switch(config-if)# switchport mode access
   Switch(config-if)# switchport access vlan 10
   Switch(config)# interface Fa0/2
   Switch(config-if)# switchport mode access
   Switch(config-if)# switchport access vlan 20
   ```

6. Проверьте ping между компьютерами одной группы (должен быть успешным) и между разными VLAN (должен блокироваться).
