import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { PacketJourneyVisualization } from "./packet-journey.tsx";

afterEach(cleanup);

describe("PacketJourneyVisualization", () => {
  it("renders the russian localization by default", () => {
    render(<PacketJourneyVisualization />);

    expect(screen.getByTestId("visualization-network-packet-journey")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Путь пакета" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Визуализация пути пакета" })).toBeTruthy();
    expect(
      screen.getByText("Полезная нагрузка спускается по стеку и доходит до сервера."),
    ).toBeTruthy();
  });

  it("lists the five osi stack steps in order", () => {
    render(<PacketJourneyVisualization />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(5);
    const layers = items.map((item) => item.querySelector("p")?.textContent);
    expect(layers).toEqual(["Приложение", "Транспорт", "Сеть", "Канал", "Сервер"]);
    expect(items[0]?.textContent).toContain("HTTP-запрос");
    expect(items[4]?.textContent).toContain("обрабатывает запрос");
  });

  it("numbers the steps from one to five", () => {
    render(<PacketJourneyVisualization />);

    const items = screen.getAllByRole("listitem");
    for (const [index, item] of items.entries()) {
      expect(item.textContent).toContain(String(index + 1));
    }
  });

  it("renders the english localization on request", () => {
    render(<PacketJourneyVisualization locale="en" />);

    expect(screen.getByRole("heading", { name: "Packet journey" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Packet journey visualization" })).toBeTruthy();
    expect(screen.getByText("Data link")).toBeTruthy();
    expect(screen.queryByText("Канал")).toBeNull();
  });
});
