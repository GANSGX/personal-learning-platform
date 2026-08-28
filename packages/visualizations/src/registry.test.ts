import { describe, expect, it } from "vitest";

import { isKnownVisualizationId, renderVisualization, VISUALIZATION_IDS } from "./index.tsx";
import { VISUALIZATION_IDS as IDS_FROM_REGISTRY } from "./registry-ids.ts";

describe("visualization registry", () => {
  it("lists the packet journey widget", () => {
    expect(VISUALIZATION_IDS.has("network.packet-journey")).toBe(true);
    expect(IDS_FROM_REGISTRY.has("network.packet-journey")).toBe(true);
    expect(isKnownVisualizationId("network.packet-journey")).toBe(true);
  });

  it("throws for unknown ids", () => {
    expect(() => renderVisualization("missing.viz")).toThrow("Unknown visualization id");
  });
});
