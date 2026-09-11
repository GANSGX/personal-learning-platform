import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { TcpHandshakeVisualization } from "./tcp-handshake.tsx";

afterEach(cleanup);

describe("TcpHandshakeVisualization", () => {
  it("starts from the initial closed state", () => {
    render(<TcpHandshakeVisualization />);

    expect(screen.getByTestId("visualization-network-tcp-handshake")).toBeTruthy();
    expect(screen.getByText("CLOSED")).toBeTruthy();
    expect(screen.getByText("LISTEN")).toBeTruthy();
    expect(screen.getByText("Исходное состояние")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Назад" })).toHaveProperty("disabled", true);
    expect(screen.queryByText("SYN")).toBeNull();
  });

  it("advances through the handshake on Next", () => {
    render(<TcpHandshakeVisualization />);

    fireEvent.click(screen.getByRole("button", { name: "Далее" }));
    expect(screen.getByText("Шаг 1: Пакет SYN (Синхронизация)")).toBeTruthy();
    expect(screen.getByText("SYN_SENT")).toBeTruthy();
    expect(screen.getByText("SYN")).toBeTruthy();
    expect(screen.getByText("Seq: 1000")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Назад" })).toHaveProperty("disabled", false);
  });

  it("reaches the established state and disables Next at the last step", () => {
    render(<TcpHandshakeVisualization />);

    const next = screen.getByRole("button", { name: "Далее" });
    fireEvent.click(next);
    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByText("Шаг 3: Пакет ACK (Подтверждение соединения)")).toBeTruthy();
    expect(screen.getAllByText("ESTABLISHED")).toHaveLength(2);
    expect(screen.getByText("ACK")).toBeTruthy();

    fireEvent.click(next);
    fireEvent.click(next);
    expect(screen.getByText("Завершение соединения (FIN Handshake)")).toBeTruthy();
    expect(screen.getByText("FIN")).toBeTruthy();
    expect(next).toHaveProperty("disabled", true);
  });

  it("jumps to a step via the step pills", () => {
    render(<TcpHandshakeVisualization />);

    fireEvent.click(screen.getByRole("button", { name: "Шаг 2" }));
    expect(screen.getByText("Шаг 2: Пакет SYN-ACK (Синхронизация и подтверждение)")).toBeTruthy();
    expect(screen.getByText("SYN_RCVD")).toBeTruthy();
    expect(screen.getByText("SYN")).toBeTruthy();
    expect(screen.getByText("ACK")).toBeTruthy();
    expect(screen.getByText("Ack: 1001")).toBeTruthy();
  });

  it("returns to the initial state on Reset", () => {
    render(<TcpHandshakeVisualization />);

    fireEvent.click(screen.getByRole("button", { name: "Шаг 3" }));
    expect(screen.getByText("Шаг 3: Пакет ACK (Подтверждение соединения)")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Сброс" }));
    expect(screen.getByText("Исходное состояние")).toBeTruthy();
    expect(screen.getByText("CLOSED")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Назад" })).toHaveProperty("disabled", true);
  });

  it("renders the english localization", () => {
    render(<TcpHandshakeVisualization locale="en" />);

    expect(
      screen.getByText(
        "Client is in CLOSED state. Server is in LISTEN state, waiting for incoming TCP connections.",
      ),
    ).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Далее" })).toBeNull();
    expect(screen.getByRole("button", { name: "Next" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Start" })).toBeTruthy();
  });
});
