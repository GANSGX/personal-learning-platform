export type VisualizationLocale = "ru" | "en";

const copy = {
  ru: {
    kicker: "Визуализация",
    title: "Путь пакета",
    subtitle: "Полезная нагрузка спускается по стеку и доходит до сервера.",
    label: "Визуализация пути пакета",
    steps: [
      { layer: "Приложение", detail: "HTTP-запрос выходит из клиентского процесса" },
      { layer: "Транспорт", detail: "TCP режет полезную нагрузку и добавляет порты" },
      { layer: "Сеть", detail: "IP адресует пакет для маршрутизации" },
      { layer: "Канал", detail: "Ethernet-кадры идут по LAN от хопа к хопу" },
      { layer: "Сервер", detail: "Сервис принимает и обрабатывает запрос" },
    ],
  },
  en: {
    kicker: "Visualization",
    title: "Packet journey",
    subtitle: "Application payload travels down the stack and reaches the server.",
    label: "Packet journey visualization",
    steps: [
      { layer: "Application", detail: "HTTP request leaves the client process" },
      { layer: "Transport", detail: "TCP segments the payload and adds ports" },
      { layer: "Network", detail: "IP addresses the packet for routing" },
      { layer: "Data link", detail: "Ethernet frames move hop-by-hop on the LAN" },
      { layer: "Server", detail: "The service receives and handles the request" },
    ],
  },
} as const;

type PacketJourneyVisualizationProps = {
  locale?: VisualizationLocale;
};

export function PacketJourneyVisualization({ locale = "ru" }: PacketJourneyVisualizationProps) {
  const text = copy[locale];

  return (
    <section
      aria-label={text.label}
      className="border-border bg-card/40 space-y-4 rounded-lg border p-4"
      data-testid="visualization-network-packet-journey"
    >
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{text.kicker}</p>
        <h3 className="text-foreground text-lg font-medium">{text.title}</h3>
        <p className="text-muted-foreground text-sm">{text.subtitle}</p>
      </div>
      <ol className="space-y-3">
        {text.steps.map((step, index) => (
          <li key={step.layer} className="flex items-start gap-3">
            <span className="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{step.layer}</p>
              <p className="text-muted-foreground text-sm">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
