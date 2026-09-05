import { useState } from "react";

import type { VisualizationLocale } from "./packet-journey.tsx";
import { calculateSubnet } from "./subnet-utils.ts";

type SubnetCalculatorVisualizationProps = {
  locale?: VisualizationLocale;
};

export function SubnetCalculatorVisualization({
  locale = "ru",
}: SubnetCalculatorVisualizationProps) {
  const [ipInput, setIpInput] = useState("192.168.1.10");
  const [cidr, setCidr] = useState(24);

  const isRu = locale === "ru";
  const result = calculateSubnet(ipInput, cidr);

  const presets = [
    { label: "/8", cidr: 8 },
    { label: "/16", cidr: 16 },
    { label: "/24", cidr: 24 },
    { label: "/27", cidr: 27 },
    { label: "/30", cidr: 30 },
  ];

  return (
    <section
      aria-label={isRu ? "Калькулятор подсетей CIDR" : "CIDR Subnet Calculator"}
      className="border-border bg-card/40 space-y-5 rounded-lg border p-5"
      data-testid="visualization-network-subnet-calculator"
    >
      <div className="space-y-1 border-b pb-3">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {isRu ? "Сетевой уровень (L3)" : "Network Layer (L3)"}
        </p>
        <h3 className="text-foreground text-lg font-semibold">
          {isRu
            ? "Интерактивный калькулятор подсетей (CIDR)"
            : "Interactive CIDR Subnet Calculator"}
        </h3>
        <p className="text-muted-foreground text-sm">
          {isRu
            ? "Расчет маски, диапазона доступных хостов, сетевого и широковещательного адресов."
            : "Calculate netmask, host ranges, network and broadcast addresses in real time."}
        </p>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-foreground text-xs font-semibold tracking-wider uppercase">
            {isRu ? "IP-адрес хоста" : "Host IP Address"}
          </label>
          <input
            type="text"
            value={ipInput}
            onChange={(e) => {
              setIpInput(e.target.value);
            }}
            placeholder="192.168.1.10"
            className="border-border bg-background focus:ring-primary w-full rounded border px-3 py-1.5 font-mono text-sm focus:ring-1 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-foreground text-xs font-semibold tracking-wider uppercase">
              {isRu ? "Префикс CIDR" : "CIDR Prefix"}: /{cidr}
            </label>
            <div className="flex gap-1">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setCidr(p.cidr);
                  }}
                  className={`rounded px-1.5 py-0.5 font-mono text-xs font-medium ${
                    cidr === p.cidr
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={32}
            value={cidr}
            onChange={(e) => {
              setCidr(Number.parseInt(e.target.value, 10));
            }}
            className="accent-primary w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Result Display */}
      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-border/80 bg-background/80 space-y-1 rounded border p-3">
              <span className="text-muted-foreground text-xs font-medium">
                {isRu ? "Адрес сети" : "Network Address"}
              </span>
              <p className="text-foreground font-mono text-sm font-semibold">
                {result.networkAddress} /{result.cidr}
              </p>
            </div>

            <div className="border-border/80 bg-background/80 space-y-1 rounded border p-3">
              <span className="text-muted-foreground text-xs font-medium">
                {isRu ? "Маска подсети" : "Subnet Mask"}
              </span>
              <p className="text-foreground font-mono text-sm font-semibold">{result.netmask}</p>
            </div>

            <div className="border-border/80 bg-background/80 space-y-1 rounded border p-3">
              <span className="text-muted-foreground text-xs font-medium">
                {isRu ? "Широковещательный (Broadcast)" : "Broadcast Address"}
              </span>
              <p className="text-foreground font-mono text-sm font-semibold">
                {result.broadcastAddress}
              </p>
            </div>

            <div className="border-border/80 bg-background/80 space-y-1 rounded border p-3">
              <span className="text-muted-foreground text-xs font-medium">
                {isRu ? "Доступных хостов" : "Usable Hosts"}
              </span>
              <p className="text-primary font-mono text-sm font-semibold">
                {result.usableHosts.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="border-border/70 bg-muted/20 space-y-2 rounded border p-3.5 text-xs">
            <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
              <span className="text-muted-foreground">
                {isRu ? "Диапазон доступных адресов:" : "Usable Host Range:"}
              </span>
              <span className="text-foreground font-mono font-medium">
                {result.firstUsableHost} — {result.lastUsableHost}
              </span>
            </div>

            <div className="border-border/40 flex flex-wrap items-center justify-between gap-2 border-b pb-2">
              <span className="text-muted-foreground">
                {isRu ? "Обратная маска (Wildcard):" : "Wildcard Mask:"}
              </span>
              <span className="text-foreground font-mono font-medium">{result.wildcard}</span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-muted-foreground">
                {isRu ? "Категория адресного пространства:" : "Address Space Scope:"}
              </span>
              <span
                className={`rounded px-2 py-0.5 font-medium ${
                  result.isPrivate
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {result.isPrivate
                  ? isRu
                    ? "Частная сеть (RFC 1918 / Local)"
                    : "Private (RFC 1918 / Local)"
                  : isRu
                    ? "Публичный интернет (Public IP)"
                    : "Public Internet IP"}
              </span>
            </div>
          </div>

          {/* Binary Visualization */}
          <div className="border-border/60 bg-card space-y-1.5 rounded border p-3 font-mono text-xs">
            <div className="text-muted-foreground text-[11px] tracking-wider uppercase">
              {isRu ? "Двоичное представление (32 бита)" : "Binary Representation (32 bits)"}
            </div>
            <div className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-2">
              <div>
                <span className="text-muted-foreground">IP: </span>
                <span className="text-foreground">{result.ipBinary}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Mask: </span>
                <span className="text-primary">{result.maskBinary}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border-destructive/50 bg-destructive/10 text-destructive rounded border p-3 text-xs">
          {isRu
            ? "Некорректный IPv4-адрес. Введите адрес в формате 4 октетов от 0 до 255 (например, 10.0.0.1)."
            : "Invalid IPv4 address format. Provide 4 octets between 0 and 255 (e.g. 10.0.0.1)."}
        </div>
      )}
    </section>
  );
}
