import { describe, expect, it } from "vitest";

import { isKnownVisualizationId, renderVisualization, VISUALIZATION_IDS } from "./index.tsx";
import { VISUALIZATION_IDS as IDS_FROM_REGISTRY } from "./registry-ids.ts";

describe("visualization registry", () => {
  it("lists the packet journey widget", () => {
    expect(VISUALIZATION_IDS.has("network.packet-journey")).toBe(true);
    expect(IDS_FROM_REGISTRY.has("network.packet-journey")).toBe(true);
    expect(isKnownVisualizationId("network.packet-journey")).toBe(true);
  });

  it("lists the tcp-handshake widget", () => {
    expect(VISUALIZATION_IDS.has("network.tcp-handshake")).toBe(true);
    expect(IDS_FROM_REGISTRY.has("network.tcp-handshake")).toBe(true);
    expect(isKnownVisualizationId("network.tcp-handshake")).toBe(true);
  });

  it("lists the subnet-calculator widget", () => {
    expect(VISUALIZATION_IDS.has("network.subnet-calculator")).toBe(true);
    expect(IDS_FROM_REGISTRY.has("network.subnet-calculator")).toBe(true);
    expect(isKnownVisualizationId("network.subnet-calculator")).toBe(true);
  });

  it("renders registered visualizations without errors", () => {
    for (const id of VISUALIZATION_IDS) {
      expect(renderVisualization(id, "ru")).toBeDefined();
      expect(renderVisualization(id, "en")).toBeDefined();
    }
  });

  it("throws for unknown ids", () => {
    expect(() => renderVisualization("missing.viz")).toThrow("Unknown visualization id");
  });
});
