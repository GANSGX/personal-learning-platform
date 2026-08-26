# Learning Roadmap

## Общая логика

Финальный порядок обучения:

```text
1. Networking Foundation        ← вся базовая сетевуха
2. OS Fundamentals
3. Linux Fundamentals
4. System Administration
5. Networking Advanced          ← глубокая/админская сетевуха
6. Web Infrastructure
7. Storage / Databases
8. Automation
9. Integration Lab

──────── FOUNDATION CLOSED ────────

10. DevOps / Infrastructure

──────── INFRA BASE ────────────────

11. Security / Cybersecurity
12. OSINT
13. DevSecOps / дальнейшие ветки
```

Главный принцип:

- сначала закрывается фундамент;
- DevOps начинается только после фундамента;
- Security / Cybersecurity и OSINT подключаются после появления нормальной Infra-базы;
- глубокие направления развиваются параллельно через knowledge graph.

---

# 01. Networking Foundation

## Цель

Понять, как компьютеры вообще обмениваются данными.

Это не просто введение, а полноценная базовая сетевуха, которую нужно закрыть **до Linux**.

## Физическая и канальная база

```text
что такое сеть
LAN / WAN
NIC
Ethernet
frame
MAC address
switch
broadcast
broadcast domain
ARP
```

## IPv4 и адресация

```text
IPv4
binary basics
IP address
network / host parts
subnet mask
CIDR
subnetting
private/public IP
loopback
default gateway
```

## Маршрутизация — основа

```text
router
routing
routing table
default route
next hop
ICMP
ping
traceroute
```

## Transport Layer

```text
TCP
├── connection-oriented
├── 3-way handshake
├── reliability
├── sequence numbers — концептуально
├── ACK
└── connection close

UDP

ports
source/destination ports
socket — концептуально
client/server model
```

## Базовые сетевые сервисы

### DNS

```text
зачем нужен
hostname → IP
основные записи концептуально
```

### DHCP

```text
выдача IP
gateway
DNS
```

### NAT / PAT

```text
NAT
PAT
private → public addressing
```

## Базовая фильтрация

```text
firewall concept
inbound / outbound
allow / deny
stateful firewall concept
```

## Практика

Packet Tracer:

```text
PC ─ PC
```

Потом:

```text
PC ─ Switch ─ PC
```

Потом:

```text
LAN A
  │
Router
  │
LAN B
```

Потом:

```text
PC
 │
Switch
 │
Router
 │
NAT
 │
Internet simulation
```

Дополнительная практика:

- DHCP;
- DNS;
- несколько subnet;
- static IP;
- gateway;
- ping между сетями;
- сломать mask/gateway и найти ошибку.

На macOS:

```bash
ping
traceroute
arp
netstat
route
dig
nslookup
curl
nc
```

## Результат блока

Нужно уметь объяснить путь:

```text
192.168.1.10:52341
        │
        │ HTTPS
        ▼
142.x.x.x:443
```

Что происходит:

```text
Application
↓
TCP
↓
IP
↓
определение next hop
↓
ARP
↓
Ethernet
↓
Switch
↓
Gateway
↓
NAT
↓
Router
↓
Internet
↓
Server
```

После этого можно идти дальше.

---

# 02. Operating Systems Fundamentals

## Цель

Понять, что происходит внутри компьютера и операционной системы до углубления в конкретный Linux-дистрибутив.

## Темы

```text
hardware
CPU
RAM
disk
kernel
user space
kernel space
process
thread
scheduler
virtual memory
stack / heap concept
filesystem
file
directory
file descriptor
permissions concept
system call
I/O
```

## Практика

Небольшие эксперименты:

- посмотреть процессы;
- создать процесс;
- завершить процесс;
- посмотреть использование RAM и CPU;
- открыть файл;
- посмотреть права;
- посмотреть открытые соединения.

Цель — концептуальное понимание, а не зубрёжка терминов.

---

# 03. Linux Fundamentals

## Стенд

```text
Mac
 │
 │ SSH
 ▼
Ubuntu Server VM
```

## Filesystem hierarchy

```text
/
├── etc
├── var
├── home
├── tmp
├── proc
├── sys
└── dev
```

## Темы

```text
shell
stdin/stdout/stderr
pipes
redirection

users
groups
permissions
ownership

processes
signals

environment variables

packages
apt

services
systemd

logs
journalctl

SSH

cron

network interfaces
```

Практика должна идти почти на каждую тему.

---

# 04. System Administration

## Цель

Перейти от «я знаю Linux» к «я умею администрировать сервер».

## Темы

```text
users/groups
sudo
SSH configuration
SSH keys
permissions
service management
systemd units
process management
logs
log rotation
cron
updates
packages
firewall
storage
partitions
filesystems
mounts
swap
CPU/RAM monitoring
disk monitoring
backup
restore
troubleshooting
```

## Практический стенд

```text
                Mac
                 │
           ┌─────┴─────┐
           │           │
           ▼           ▼
       server-1     server-2
        Ubuntu       Ubuntu
```

## Практические задания

```text
создать пользователей
↓
настроить SSH keys
↓
отключить root login
↓
поднять сервис
↓
настроить автозапуск
↓
сломать его
↓
найти причину
↓
починить
```

Дополнительно:

- закончить место на диске и найти причину;
- создать процесс, который грузит CPU;
- найти его;
- закрыть порт firewall;
- диагностировать недоступность сервиса;
- восстановить файл из backup.

---

# 05. Networking Advanced

После Linux и sysadmin нужно вернуться к сетям уже с реальной Linux-практикой.

## Switching

```text
VLAN
802.1Q
access port
trunk
inter-VLAN routing
STP basics
LACP basics
```

## Routing

```text
static routing deeper
routing table deeper
metrics
OSPF
BGP concepts
```

BGP пока нужен только концептуально, без уровня сетевого инженера.

## Firewall

```text
ACL
stateful firewall
nftables concepts
zones
network segmentation
```

## TCP глубже

```text
TCP states
LISTEN
ESTABLISHED
TIME_WAIT

retransmission
window
flow control
congestion control concepts
MTU
MSS
```

## DNS глубже

```text
recursive resolver
authoritative server
root
TLD
A
AAAA
CNAME
MX
TXT
NS
TTL
caching
```

## IPv6

```text
IPv6 addressing
CIDR
link-local
global
basic routing
```

## VPN

```text
tunnel concept
WireGuard
IPsec concepts
site-to-site
client-to-site
```

## Диагностика

Linux-инструменты:

```bash
ip addr
ip link
ip route
ss
dig
tcpdump
traceroute
ping
nc
curl
```

Плюс Wireshark.

## Практика

```text
             Router
               │
        ┌──────┴──────┐
        │             │
      VLAN10        VLAN20
      Users         Servers
        │             │
        └──── ACL ─────┘
```

Затем:

```text
Internet
   │
Router
   │
Firewall
   │
Switch
├── VLAN Users
├── VLAN Admin
└── VLAN Servers
```

---

# 06. Web / Service Infrastructure

Здесь frontend-бэкграунд связывается с инфраструктурой.

## Путь запроса

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
nginx
↓
application
↓
database
```

## Темы

```text
HTTP deeper
HTTPS
TLS
certificates
CA
DNS for web
nginx
reverse proxy
forward proxy concept
load balancer
CDN
caching
WebSocket
HTTP/2 concepts
HTTP/3 concepts
cookies
headers
CORS
compression
```

## Практика

Не:

```text
git push → Vercel
```

А вручную:

```text
GitHub
 ↓
Mac
 ↓
SSH
 ↓
Ubuntu
 ↓
nginx
 ↓
your application
```

Затем подключить:

```text
domain
DNS
HTTPS
certificate
reverse proxy
```

---

# 07. Storage / Databases

## Цель

Понять инфраструктурную сторону хранения данных.

## Темы

```text
disk
SSD/HDD concepts
filesystem
block storage
object storage

PostgreSQL
├── server
├── database
├── connections
├── tables
├── indexes
├── transactions
├── locks concepts
└── logs

backup
restore
replication concepts
```

## Практика

```text
Web Server
    │
    ▼
PostgreSQL Server
```

База данных:

```text
❌ Internet access
✓ доступ только из внутренней сети
```

---

# 08. Automation Fundamentals

Автоматизировать нужно только то, что уже понятно вручную.

## Bash

```text
variables
conditions
loops
functions
pipes
exit codes
grep
sed
awk
jq
```

## Python

Только как инфраструктурный инструмент:

```text
files
JSON
HTTP requests
subprocess
automation
```

## Git глубже

```text
branches
merge
rebase
tags
hooks
SSH
```

## Форматы

```text
JSON
YAML
TOML basics
.env
```

Главный принцип:

```text
MANUAL
  ↓
UNDERSTOOD
  ↓
AUTOMATED
```

---

# 09. Integration Lab

Финальный экзамен всего фундамента.

## Архитектура стенда

```text
                           Mac
                            │
                           SSH
                            │
                        Gateway
                            │
               ┌────────────┴────────────┐
               │                         │
            Web VM                    DB VM
               │                         │
             nginx                  PostgreSQL
               │
            Application
```

## Самостоятельно выполнить

```text
создаёшь VM
↓
строишь сеть
↓
делаешь subnetting
↓
routing
↓
users
↓
SSH
↓
firewall
↓
nginx
↓
application
↓
PostgreSQL
↓
DNS
↓
TLS
↓
logs
↓
monitoring basics
↓
backup
↓
restore
↓
troubleshooting
```

После этого:

```text
╔════════════════════════╗
║ FOUNDATION COMPLETE    ║
╚════════════════════════╝
```

---

# 10. DevOps / Infrastructure

Только после закрытия фундамента.

```text
Docker
↓
Docker Compose
↓
CI/CD
↓
Observability
↓
Ansible
↓
Terraform
↓
Cloud
↓
Kubernetes
↓
SRE / Advanced Infra
```

## Docker

```text
images
containers
Dockerfile
layers
registry
volumes
networks
port mapping
namespaces concepts
cgroups concepts
Docker Compose
```

## CI/CD

```text
PR
↓
lint
↓
tests
↓
build
↓
artifact
↓
Docker image
↓
registry
↓
deploy
↓
healthcheck
```

## Observability

```text
metrics
logs
traces
alerting
Prometheus
Grafana
Loki
OpenTelemetry
```

## Infrastructure as Code

```text
Ansible
Terraform
```

## Cloud

```text
VPC
subnets
routing
security groups
VM
Load Balancer
Object Storage
Managed DB
IAM
```

## Kubernetes

```text
Pod
Deployment
Service
Ingress
ConfigMap
Secret
Volume
Namespace
RBAC basics
```

## Advanced Infrastructure / SRE

```text
high availability
scaling
fault tolerance
distributed systems
SLO / SLA / SLI
incident response
capacity planning
```

---

# 11. Security / Cybersecurity

После появления нормальной Infra-базы Security можно развивать параллельно с инфраструктурой.

```text
              Infrastructure
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
     deeper Infra   ИБ/КБ      OSINT
          │          │
          └────┬─────┘
               ▼
           DevSecOps
```

## Security Foundation

До Kali и Metasploit:

```text
security principles
CIA
threat model
risk
authentication
authorization
IAM
least privilege
cryptography basics
hashing
encryption
secrets
network security
OS security
web security fundamentals
```

## Cybersecurity branches

```text
Cybersecurity
│
├── Network Security
│
├── Web / AppSec
│
├── Offensive
│   ├── recon
│   ├── enumeration
│   ├── exploitation
│   └── privilege escalation
│
├── Blue Team
│   ├── logs
│   ├── SIEM
│   ├── IDS/IPS
│   └── detection
│
├── DFIR
│
├── Cloud Security
│
└── Container / K8s Security
```

Практика:

```text
PortSwigger
TryHackMe
Hack The Box
CyberDefenders
свой cyber-range
```

---

# 12. OSINT

OSINT — отдельная поперечная ветка, а не просто подкатегория Cybersecurity.

## Темы

```text
OSINT
├── search
├── people
├── domains
├── infrastructure
├── metadata
├── social
├── geolocation
├── verification
├── graph analysis
└── reporting
```

## Связи

```text
OSINT
 ├── Recon
 ├── Threat Intelligence
 ├── Pentest
 ├── DFIR
 └── Investigations
```

---

# 13. DevSecOps и дальнейшие ветки

DevSecOps появляется естественно на пересечении инфраструктуры и безопасности.

```text
Infrastructure
     │
     ├───────────────┐
     │               │
     ▼               ▼
   DevOps         Security
     │               │
     └───────┬───────┘
             ▼
         DevSecOps
```

Темы:

```text
SAST
DAST
SCA
SBOM
secrets management
IAM
container scanning
image signing
supply-chain security
Kubernetes security
cloud security
policy as code
security in CI/CD
```

---

# Финальный roadmap

```text
START
  │
  ▼
01. Networking Foundation
  │
  ▼
02. Operating Systems Fundamentals
  │
  ▼
03. Linux Fundamentals
  │
  ▼
04. System Administration
  │
  ▼
05. Networking Advanced
  │
  ▼
06. Web / Service Infrastructure
  │
  ▼
07. Storage / Databases
  │
  ▼
08. Automation Fundamentals
  │
  ▼
09. Integration Lab
  │
  ▼
╔════════════════════════╗
║ FOUNDATION COMPLETE    ║
╚════════════════════════╝
  │
  ▼
10. DevOps / Infrastructure
  │
  ▼
╔════════════════════════╗
║ INFRA BASE COMPLETE    ║
╚════════════════════════╝
  │
  ├───────────────┬────────────────┐
  ▼               ▼                ▼
Security / КБ    OSINT        Deeper Infra
  │               │                │
  └───────┬───────┘                │
          ▼                        │
      DevSecOps ◄──────────────────┘
```
