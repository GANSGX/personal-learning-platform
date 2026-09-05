import type { ReactElement } from "react";

import { PacketJourneyVisualization, type VisualizationLocale } from "./packet-journey.tsx";
import { VISUALIZATION_IDS } from "./registry-ids.ts";
import { SubnetCalculatorVisualization } from "./subnet-calculator.tsx";
import { TcpHandshakeVisualization } from "./tcp-handshake.tsx";

export { VISUALIZATION_IDS } from "./registry-ids.ts";
export type { VisualizationLocale } from "./packet-journey.tsx";

const visualizationComponents: Record<string, (locale: VisualizationLocale) => ReactElement> = {
  "network.packet-journey": (locale) => <PacketJourneyVisualization locale={locale} />,
  "network.tcp-handshake": (locale) => <TcpHandshakeVisualization locale={locale} />,
  "network.subnet-calculator": (locale) => <SubnetCalculatorVisualization locale={locale} />,
};

export function isKnownVisualizationId(id: string): boolean {
  return VISUALIZATION_IDS.has(id);
}

export function renderVisualization(id: string, locale: VisualizationLocale = "ru"): ReactElement {
  const render = visualizationComponents[id];

  if (render === undefined) {
    throw new Error(`Unknown visualization id: ${id}`);
  }

  return render(locale);
}

export { PacketJourneyVisualization } from "./packet-journey.tsx";
export { TcpHandshakeVisualization } from "./tcp-handshake.tsx";
export { SubnetCalculatorVisualization } from "./subnet-calculator.tsx";
