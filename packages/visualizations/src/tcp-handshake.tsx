import { useState } from "react";

import type { VisualizationLocale } from "./packet-journey.tsx";
import { INITIAL_TCP_STEP, TCP_HANDSHAKE_STEPS } from "./tcp-handshake-steps.ts";

type TcpHandshakeVisualizationProps = {
  locale?: VisualizationLocale;
};

export function TcpHandshakeVisualization({ locale = "ru" }: TcpHandshakeVisualizationProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = TCP_HANDSHAKE_STEPS[stepIndex] ?? INITIAL_TCP_STEP;

  const isRu = locale === "ru";
  const title = isRu ? "TCP 3-Way Handshake" : "TCP 3-Way Handshake";
  const subtitle = isRu
    ? "Интерактивная визуализация трехстороннего рукопожатия и состояний сокетов."
    : "Interactive visualization of the three-way handshake and socket states.";
  const prevLabel = isRu ? "Назад" : "Previous";
  const nextLabel = isRu ? "Далее" : "Next";
  const resetLabel = isRu ? "Сброс" : "Reset";

  return (
    <section
      aria-label={isRu ? "Визуализация TCP Handshake" : "TCP Handshake visualization"}
      className="border-border bg-card/40 space-y-5 rounded-lg border p-5"
      data-testid="visualization-network-tcp-handshake"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
        <div>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {isRu ? "Транспортный уровень (L4)" : "Transport Layer (L4)"}
          </p>
          <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setStepIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={stepIndex === 0}
            className="border-border hover:bg-accent rounded border px-3 py-1 text-xs font-medium disabled:opacity-40"
          >
            {prevLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setStepIndex((prev) => Math.min(TCP_HANDSHAKE_STEPS.length - 1, prev + 1));
            }}
            disabled={stepIndex === TCP_HANDSHAKE_STEPS.length - 1}
            className="bg-primary text-primary-foreground rounded px-3 py-1 text-xs font-medium hover:opacity-90 disabled:opacity-40"
          >
            {nextLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setStepIndex(0);
            }}
            className="text-muted-foreground hover:text-foreground rounded px-2 py-1 text-xs"
          >
            {resetLabel}
          </button>
        </div>
      </div>

      {/* Step Pills */}
      <div className="flex flex-wrap gap-1.5">
        {TCP_HANDSHAKE_STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => {
              setStepIndex(idx);
            }}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
              idx === stepIndex
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {idx === 0 ? (isRu ? "Старт" : "Start") : `${isRu ? "Шаг" : "Step"} ${String(idx)}`}
          </button>
        ))}
      </div>

      {/* Interactive Topology diagram */}
      <div className="bg-background/60 grid grid-cols-1 items-center gap-4 rounded-lg border p-4 md:grid-cols-3">
        {/* Client Host */}
        <div className="border-border/80 bg-card flex flex-col items-center justify-center space-y-1 rounded-md border p-3 text-center">
          <div className="text-primary text-xs font-bold tracking-wide uppercase">
            {isRu ? "Клиент" : "Client Host"}
          </div>
          <div className="text-muted-foreground font-mono text-xs">192.168.1.50:49152</div>
          <div className="bg-secondary/80 mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold">
            {currentStep.clientState}
          </div>
        </div>

        {/* Packet In-Flight */}
        <div className="flex flex-col items-center justify-center space-y-2 p-2 text-center">
          <div className="text-muted-foreground text-xs font-medium">
            {currentStep.direction === "left-to-right" && "→ → → [Пакет к Серверу] → → →"}
            {currentStep.direction === "right-to-left" && "← ← ← [Пакет к Клиенту] ← ← ←"}
            {currentStep.direction === "bidirectional" && "⇄ ⇄ [Полнодуплексный поток] ⇄ ⇄"}
            {currentStep.direction === "none" && "— [Ожидание отправки] —"}
          </div>

          {currentStep.flags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-1">
              {currentStep.flags.map((flag) => (
                <span
                  key={flag}
                  className="bg-primary/20 text-primary rounded px-2 py-0.5 font-mono text-xs font-bold"
                >
                  {flag}
                </span>
              ))}
            </div>
          )}

          <div className="text-muted-foreground space-y-0.5 font-mono text-xs">
            <div>Seq: {currentStep.seq}</div>
            <div>Ack: {currentStep.ack}</div>
          </div>
        </div>

        {/* Server Host */}
        <div className="border-border/80 bg-card flex flex-col items-center justify-center space-y-1 rounded-md border p-3 text-center">
          <div className="text-primary text-xs font-bold tracking-wide uppercase">
            {isRu ? "Сервер" : "Server Host"}
          </div>
          <div className="text-muted-foreground font-mono text-xs">93.184.216.34:443</div>
          <div className="bg-secondary/80 mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold">
            {currentStep.serverState}
          </div>
        </div>
      </div>

      {/* Step Description Card */}
      <div className="border-border/60 bg-muted/30 space-y-1 rounded-md border p-3.5">
        <h4 className="text-foreground text-sm font-semibold">
          {isRu ? currentStep.titleRu : currentStep.titleEn}
        </h4>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {isRu ? currentStep.descriptionRu : currentStep.descriptionEn}
        </p>
      </div>
    </section>
  );
}
