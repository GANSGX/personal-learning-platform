import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { isKnownVisualizationId, renderVisualization } from "./index.tsx";

afterEach(cleanup);

describe("visualization registry", () => {
  it("recognizes known visualization ids", () => {
    expect(isKnownVisualizationId("network.packet-journey")).toBe(true);
    expect(isKnownVisualizationId("network.tcp-handshake")).toBe(true);
    expect(isKnownVisualizationId("network.subnet-calculator")).toBe(true);
  });

  it("rejects unknown visualization ids", () => {
    expect(isKnownVisualizationId("os.disk-layout")).toBe(false);
    expect(isKnownVisualizationId("")).toBe(false);
  });

  it("renders the packet journey for its id", () => {
    render(renderVisualization("network.packet-journey"));
    expect(screen.getByTestId("visualization-network-packet-journey")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Путь пакета" })).toBeTruthy();
  });

  it("renders the tcp handshake for its id", () => {
    render(renderVisualization("network.tcp-handshake"));
    expect(screen.getByTestId("visualization-network-tcp-handshake")).toBeTruthy();
    expect(screen.getByText("Исходное состояние")).toBeTruthy();
  });

  it("renders the subnet calculator for its id", () => {
    render(renderVisualization("network.subnet-calculator"));
    expect(screen.getByTestId("visualization-network-subnet-calculator")).toBeTruthy();
    expect(screen.getByText("192.168.1.0 /24")).toBeTruthy();
  });

  it("passes the locale through to the component", () => {
    render(renderVisualization("network.packet-journey", "en"));
    expect(screen.getByRole("heading", { name: "Packet journey" })).toBeTruthy();
  });

  it("throws for an unknown visualization id", () => {
    expect(() => {
      renderVisualization("os.does-not-exist");
    }).toThrow("Unknown visualization id: os.does-not-exist");
  });
});
