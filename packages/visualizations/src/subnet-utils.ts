export type SubnetCalculationResult = {
  ip: string;
  cidr: number;
  netmask: string;
  wildcard: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  totalAddresses: number;
  usableHosts: number;
  ipBinary: string;
  maskBinary: string;
  isPrivate: boolean;
};

export function parseIpv4(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) {
    return null;
  }

  let result = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      return null;
    }
    const val = Number.parseInt(part, 10);
    if (val < 0 || val > 255) {
      return null;
    }
    result = (result << 8) | val;
  }

  return result >>> 0;
}

export function formatIpv4(num: number): string {
  const unsigned = num >>> 0;
  return [
    (unsigned >>> 24) & 255,
    (unsigned >>> 16) & 255,
    (unsigned >>> 8) & 255,
    unsigned & 255,
  ].join(".");
}

export function cidrToMask(cidr: number): number {
  if (cidr <= 0) {
    return 0;
  }
  if (cidr >= 32) {
    return 0xff_ff_ff_ff >>> 0;
  }
  return (~0 << (32 - cidr)) >>> 0;
}

export function toBinaryOctets(num: number): string {
  const unsigned = num >>> 0;
  const b1 = ((unsigned >>> 24) & 255).toString(2).padStart(8, "0");
  const b2 = ((unsigned >>> 16) & 255).toString(2).padStart(8, "0");
  const b3 = ((unsigned >>> 8) & 255).toString(2).padStart(8, "0");
  const b4 = (unsigned & 255).toString(2).padStart(8, "0");
  return `${b1}.${b2}.${b3}.${b4}`;
}

export function isPrivateIpv4(ipNum: number): boolean {
  const octet1 = (ipNum >>> 24) & 255;
  const octet2 = (ipNum >>> 16) & 255;

  // 10.0.0.0/8
  if (octet1 === 10) {
    return true;
  }
  // 172.16.0.0/12
  if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
    return true;
  }
  // 192.168.0.0/16
  if (octet1 === 192 && octet2 === 168) {
    return true;
  }
  // 127.0.0.0/8 Loopback
  if (octet1 === 127) {
    return true;
  }
  return false;
}

export function calculateSubnet(ipStr: string, cidr: number): SubnetCalculationResult | null {
  const clampedCidr = Math.max(1, Math.min(32, Math.floor(cidr)));
  const ipNum = parseIpv4(ipStr);
  if (ipNum === null) {
    return null;
  }

  const mask = cidrToMask(clampedCidr);
  const wildcard = ~mask >>> 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  const totalAddresses = Math.pow(2, 32 - clampedCidr);
  let usableHosts: number;
  let firstUsable: number;
  let lastUsable: number;

  if (clampedCidr === 32) {
    usableHosts = 1;
    firstUsable = network;
    lastUsable = network;
  } else if (clampedCidr === 31) {
    // RFC 3021 point-to-point links
    usableHosts = 2;
    firstUsable = network;
    lastUsable = broadcast;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstUsable = network + 1;
    lastUsable = broadcast - 1;
  }

  return {
    ip: formatIpv4(ipNum),
    cidr: clampedCidr,
    netmask: formatIpv4(mask),
    wildcard: formatIpv4(wildcard),
    networkAddress: formatIpv4(network),
    broadcastAddress: formatIpv4(broadcast),
    firstUsableHost: formatIpv4(firstUsable),
    lastUsableHost: formatIpv4(lastUsable),
    totalAddresses,
    usableHosts,
    ipBinary: toBinaryOctets(ipNum),
    maskBinary: toBinaryOctets(mask),
    isPrivate: isPrivateIpv4(ipNum),
  };
}
