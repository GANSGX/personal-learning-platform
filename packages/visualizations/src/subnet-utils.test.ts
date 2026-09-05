import { describe, expect, it } from "vitest";

import {
  calculateSubnet,
  cidrToMask,
  formatIpv4,
  isPrivateIpv4,
  parseIpv4,
  toBinaryOctets,
} from "./subnet-utils.ts";

describe("subnet-utils", () => {
  it("parses valid IPv4 addresses", () => {
    expect(parseIpv4("192.168.1.1")).toBe(3_232_235_777);
    expect(parseIpv4("0.0.0.0")).toBe(0);
    expect(parseIpv4("255.255.255.255")).toBe(4_294_967_295);
  });

  it("returns null for invalid IPv4 strings", () => {
    expect(parseIpv4("")).toBeNull();
    expect(parseIpv4("192.168.1")).toBeNull();
    expect(parseIpv4("192.168.1.256")).toBeNull();
    expect(parseIpv4("192.168.1.abc")).toBeNull();
    expect(parseIpv4("192.168.1.-1")).toBeNull();
  });

  it("formats unsigned integers to IPv4 strings", () => {
    expect(formatIpv4(3_232_235_777)).toBe("192.168.1.1");
    expect(formatIpv4(0)).toBe("0.0.0.0");
    expect(formatIpv4(4_294_967_295)).toBe("255.255.255.255");
  });

  it("converts CIDR prefixes to masks", () => {
    expect(formatIpv4(cidrToMask(0))).toBe("0.0.0.0");
    expect(formatIpv4(cidrToMask(8))).toBe("255.0.0.0");
    expect(formatIpv4(cidrToMask(16))).toBe("255.255.0.0");
    expect(formatIpv4(cidrToMask(24))).toBe("255.255.255.0");
    expect(formatIpv4(cidrToMask(30))).toBe("255.255.255.252");
    expect(formatIpv4(cidrToMask(32))).toBe("255.255.255.255");
    expect(formatIpv4(cidrToMask(35))).toBe("255.255.255.255");
  });

  it("converts numbers to binary octets string", () => {
    expect(toBinaryOctets(cidrToMask(24))).toBe("11111111.11111111.11111111.00000000");
  });

  it("identifies private IPv4 addresses correctly", () => {
    expect(isPrivateIpv4(parseIpv4("10.50.1.1") ?? 0)).toBe(true);
    expect(isPrivateIpv4(parseIpv4("172.16.0.5") ?? 0)).toBe(true);
    expect(isPrivateIpv4(parseIpv4("172.31.255.255") ?? 0)).toBe(true);
    expect(isPrivateIpv4(parseIpv4("192.168.1.1") ?? 0)).toBe(true);
    expect(isPrivateIpv4(parseIpv4("127.0.0.1") ?? 0)).toBe(true);
    expect(isPrivateIpv4(parseIpv4("8.8.8.8") ?? 0)).toBe(false);
    expect(isPrivateIpv4(parseIpv4("1.1.1.1") ?? 0)).toBe(false);
  });

  it("calculates subnet parameters for standard /24 subnet", () => {
    const result = calculateSubnet("192.168.1.50", 24);
    expect(result).not.toBeNull();
    expect(result?.netmask).toBe("255.255.255.0");
    expect(result?.wildcard).toBe("0.0.0.255");
    expect(result?.networkAddress).toBe("192.168.1.0");
    expect(result?.broadcastAddress).toBe("192.168.1.255");
    expect(result?.firstUsableHost).toBe("192.168.1.1");
    expect(result?.lastUsableHost).toBe("192.168.1.254");
    expect(result?.totalAddresses).toBe(256);
    expect(result?.usableHosts).toBe(254);
    expect(result?.isPrivate).toBe(true);
  });

  it("calculates subnet parameters for point-to-point /31 and /32 host", () => {
    const p2p = calculateSubnet("10.0.0.0", 31);
    expect(p2p?.usableHosts).toBe(2);
    expect(p2p?.firstUsableHost).toBe("10.0.0.0");
    expect(p2p?.lastUsableHost).toBe("10.0.0.1");

    const host = calculateSubnet("10.0.0.1", 32);
    expect(host?.usableHosts).toBe(1);
    expect(host?.firstUsableHost).toBe("10.0.0.1");
    expect(host?.lastUsableHost).toBe("10.0.0.1");
  });

  it("returns null for invalid inputs", () => {
    expect(calculateSubnet("invalid", 24)).toBeNull();
  });
});
