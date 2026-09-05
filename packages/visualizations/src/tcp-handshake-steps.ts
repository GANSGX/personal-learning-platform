export type TcpStep = {
  id: number;
  titleRu: string;
  titleEn: string;
  descriptionRu: string;
  descriptionEn: string;
  sender: "client" | "server" | "both" | "none";
  direction: "left-to-right" | "right-to-left" | "bidirectional" | "none";
  clientState: string;
  serverState: string;
  flags: string[];
  seq: string;
  ack: string;
};

export const INITIAL_TCP_STEP: TcpStep = {
  id: 0,
  titleRu: "Исходное состояние",
  titleEn: "Initial State",
  descriptionRu:
    "Клиент в состоянии CLOSED. Сервер находится в состоянии LISTEN, ожидая входящих TCP-запросов на порт.",
  descriptionEn:
    "Client is in CLOSED state. Server is in LISTEN state, waiting for incoming TCP connections.",
  sender: "none",
  direction: "none",
  clientState: "CLOSED",
  serverState: "LISTEN",
  flags: [],
  seq: "-",
  ack: "-",
};

export const TCP_HANDSHAKE_STEPS: readonly TcpStep[] = [
  INITIAL_TCP_STEP,
  {
    id: 1,
    titleRu: "Шаг 1: Пакет SYN (Синхронизация)",
    titleEn: "Step 1: SYN (Synchronize)",
    descriptionRu:
      "Клиент отправляет флаг SYN и выбирает случайный начальный номер последовательности (ISN Client = 1000). Клиент переходит в SYN_SENT.",
    descriptionEn:
      "Client sends SYN flag with a random initial sequence number (Client ISN = 1000). Transitions to SYN_SENT.",
    sender: "client",
    direction: "left-to-right",
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    flags: ["SYN"],
    seq: "1000",
    ack: "-",
  },
  {
    id: 2,
    titleRu: "Шаг 2: Пакет SYN-ACK (Синхронизация и подтверждение)",
    titleEn: "Step 2: SYN-ACK (Synchronize-Acknowledgment)",
    descriptionRu:
      "Сервер подтверждает получение SYN от клиента (Ack = 1001) и отправляет свой начальный номер (Server ISN = 5000). Сервер переходит в SYN_RCVD.",
    descriptionEn:
      "Server acknowledges Client SYN (Ack = 1001) and sends its own ISN (Server ISN = 5000). Transitions to SYN_RCVD.",
    sender: "server",
    direction: "right-to-left",
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
    flags: ["SYN", "ACK"],
    seq: "5000",
    ack: "1001",
  },
  {
    id: 3,
    titleRu: "Шаг 3: Пакет ACK (Подтверждение соединения)",
    titleEn: "Step 3: ACK (Acknowledgment - Established)",
    descriptionRu:
      "Клиент подтверждает получение SYN от сервера (Ack = 5001). Соединение успешно установлено на обоих концах (ESTABLISHED).",
    descriptionEn:
      "Client acknowledges Server SYN (Ack = 5001). TCP 3-Way Handshake complete! Connection ESTABLISHED on both sides.",
    sender: "client",
    direction: "left-to-right",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    flags: ["ACK"],
    seq: "1001",
    ack: "5001",
  },
  {
    id: 4,
    titleRu: "Передача полезной нагрузки (Data Transfer)",
    titleEn: "Payload Exchange (Data Transfer)",
    descriptionRu:
      "Полнодуплексный обмен данными. Клиент отправляет HTTP-запрос, сервер возвращает ответ с флагами PSH и ACK.",
    descriptionEn:
      "Full-duplex data streaming. Client issues HTTP request, server responds with PSH and ACK flags set.",
    sender: "both",
    direction: "bidirectional",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    flags: ["PSH", "ACK"],
    seq: "1001..1500",
    ack: "5001..6200",
  },
  {
    id: 5,
    titleRu: "Завершение соединения (FIN Handshake)",
    titleEn: "Connection Teardown (FIN Handshake)",
    descriptionRu:
      "Клиент инициирует закрытие (FIN). Сервер отвечает ACK, затем шлет свой FIN, закрывая соединение.",
    descriptionEn:
      "Client initiates graceful teardown with FIN. Server ACKs, issues own FIN, transitioning to CLOSED.",
    sender: "both",
    direction: "bidirectional",
    clientState: "TIME_WAIT / CLOSED",
    serverState: "CLOSED",
    flags: ["FIN", "ACK"],
    seq: "1501",
    ack: "6201",
  },
];
