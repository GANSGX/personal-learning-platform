import type { ReactElement } from "react";

import { PacketJourneyVisualization } from "./packet-journey.tsx";
import { VISUALIZATION_IDS } from "./registry-ids.ts";

export { VISUALIZATION_IDS } from "./registry-ids.ts";

const visualizationComponents: Record<string, () => ReactElement> = {
  "network.packet-journey": () => <PacketJourneyVisualization />,
};

export function isKnownVisualizationId(id: string): boolean {
  return VISUALIZATION_IDS.has(id);
}

export function renderVisualization(id: string): ReactElement {
  const render = visualizationComponents[id];

  if (render === undefined) {
    throw new Error(`Unknown visualization id: ${id}`);
  }

  return render();
}

export { PacketJourneyVisualization } from "./packet-journey.tsx";
