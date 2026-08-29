import type { ReactElement } from "react";

import { PacketJourneyVisualization, type VisualizationLocale } from "./packet-journey.tsx";
import { VISUALIZATION_IDS } from "./registry-ids.ts";

export { VISUALIZATION_IDS } from "./registry-ids.ts";
export type { VisualizationLocale } from "./packet-journey.tsx";

const visualizationComponents: Record<string, (locale: VisualizationLocale) => ReactElement> = {
  "network.packet-journey": (locale) => <PacketJourneyVisualization locale={locale} />,
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
