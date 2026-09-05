import { describe, expect, it } from "vitest";

import { TCP_HANDSHAKE_STEPS } from "./tcp-handshake-steps.ts";

describe("tcp-handshake-steps", () => {
  it("contains all handshake and teardown steps in order", () => {
    expect(TCP_HANDSHAKE_STEPS.length).toBe(6);
    expect(TCP_HANDSHAKE_STEPS[0]?.clientState).toBe("CLOSED");
    expect(TCP_HANDSHAKE_STEPS[0]?.serverState).toBe("LISTEN");

    // Step 1: SYN
    expect(TCP_HANDSHAKE_STEPS[1]?.flags).toContain("SYN");
    expect(TCP_HANDSHAKE_STEPS[1]?.clientState).toBe("SYN_SENT");

    // Step 2: SYN-ACK
    expect(TCP_HANDSHAKE_STEPS[2]?.flags).toContain("SYN");
    expect(TCP_HANDSHAKE_STEPS[2]?.flags).toContain("ACK");
    expect(TCP_HANDSHAKE_STEPS[2]?.serverState).toBe("SYN_RCVD");

    // Step 3: ACK (Established)
    expect(TCP_HANDSHAKE_STEPS[3]?.flags).toEqual(["ACK"]);
    expect(TCP_HANDSHAKE_STEPS[3]?.clientState).toBe("ESTABLISHED");
    expect(TCP_HANDSHAKE_STEPS[3]?.serverState).toBe("ESTABLISHED");
  });

  it("provides localized descriptions for each step", () => {
    for (const step of TCP_HANDSHAKE_STEPS) {
      expect(step.titleRu.length).toBeGreaterThan(0);
      expect(step.titleEn.length).toBeGreaterThan(0);
      expect(step.descriptionRu.length).toBeGreaterThan(0);
      expect(step.descriptionEn.length).toBeGreaterThan(0);
    }
  });
});
