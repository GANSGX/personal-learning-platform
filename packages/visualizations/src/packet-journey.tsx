const journeySteps = [
  { layer: "Application", detail: "HTTP request leaves the client process" },
  { layer: "Transport", detail: "TCP segments the payload and adds ports" },
  { layer: "Network", detail: "IP addresses the packet for routing" },
  { layer: "Data link", detail: "Ethernet frames move hop-by-hop on the LAN" },
  { layer: "Server", detail: "The service receives and handles the request" },
] as const;

export function PacketJourneyVisualization() {
  return (
    <section
      aria-label="Packet journey visualization"
      className="border-border bg-card/40 space-y-4 rounded-lg border p-4"
      data-testid="visualization-network-packet-journey"
    >
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Visualization</p>
        <h3 className="text-foreground text-lg font-medium">Packet journey</h3>
        <p className="text-muted-foreground text-sm">
          Application payload travels down the stack and reaches the server.
        </p>
      </div>
      <ol className="space-y-3">
        {journeySteps.map((step, index) => (
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
