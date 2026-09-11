import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SubnetCalculatorVisualization } from "./subnet-calculator.tsx";

afterEach(cleanup);

describe("SubnetCalculatorVisualization", () => {
  it("calculates the default 192.168.1.10/24 network", () => {
    render(<SubnetCalculatorVisualization />);

    expect(screen.getByTestId("visualization-network-subnet-calculator")).toBeTruthy();
    expect(screen.getByText("192.168.1.0 /24")).toBeTruthy();
    expect(screen.getByText("255.255.255.0")).toBeTruthy();
    expect(screen.getByText("192.168.1.255")).toBeTruthy();
    expect(screen.getByText("Частная сеть (RFC 1918 / Local)")).toBeTruthy();
  });

  it("recalculates when a cidr preset is chosen", () => {
    render(<SubnetCalculatorVisualization />);

    fireEvent.click(screen.getByRole("button", { name: "/30" }));
    expect(screen.getByText("192.168.1.8 /30")).toBeTruthy();
    expect(screen.getByText("255.255.255.252")).toBeTruthy();
    expect(screen.getByText("192.168.1.9 — 192.168.1.10")).toBeTruthy();
  });

  it("marks public addresses as public internet", () => {
    render(<SubnetCalculatorVisualization />);

    fireEvent.change(screen.getByPlaceholderText("192.168.1.10"), {
      target: { value: "8.8.8.8" },
    });

    expect(screen.getByText("8.8.8.0 /24")).toBeTruthy();
    expect(screen.getByText("Публичный интернет (Public IP)")).toBeTruthy();
    expect(screen.queryByText("Частная сеть (RFC 1918 / Local)")).toBeNull();
  });

  it("shows an error for an invalid ip address", () => {
    render(<SubnetCalculatorVisualization />);

    fireEvent.change(screen.getByPlaceholderText("192.168.1.10"), {
      target: { value: "192.168.1.999" },
    });

    expect(
      screen.getByText(
        "Некорректный IPv4-адрес. Введите адрес в формате 4 октетов от 0 до 255 (например, 10.0.0.1).",
      ),
    ).toBeTruthy();
    expect(screen.queryByText("192.168.1.0 /24")).toBeNull();
  });

  it("renders the english localization", () => {
    render(<SubnetCalculatorVisualization locale="en" />);

    expect(screen.getByText("Network Address")).toBeTruthy();
    expect(screen.queryByText("Адрес сети")).toBeNull();
  });
});
