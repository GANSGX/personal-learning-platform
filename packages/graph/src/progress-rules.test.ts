import { knowledgeNodeMetadataSchema } from "@plp/domain";
import { describe, expect, it } from "vitest";

import {
  findLearningPath,
  getLockReasons,
  getPrerequisiteChain,
  GraphPathError,
  resolveAllNodeStatuses,
  resolveNodeStatus,
} from "./progress-rules.ts";

const alpha = knowledgeNodeMetadataSchema.parse({
  id: "fixture.alpha",
  title: "Fixture Alpha",
  level: "foundation",
  unlocks: ["fixture.beta"],
});

const beta = knowledgeNodeMetadataSchema.parse({
  id: "fixture.beta",
  title: "Fixture Beta",
  level: "foundation",
  requires: ["fixture.alpha"],
});

const gamma = knowledgeNodeMetadataSchema.parse({
  id: "fixture.gamma",
  title: "Fixture Gamma",
  level: "foundation",
  requires: ["fixture.beta"],
});

const nodes = [alpha, beta, gamma];

describe("resolveNodeStatus", () => {
  it("marks root nodes as available without progress", () => {
    expect(
      resolveNodeStatus("fixture.alpha", nodes, {
        userId: "local",
        nodes: {},
      }),
    ).toBe("AVAILABLE");
  });

  it("locks nodes with unmastered prerequisites", () => {
    expect(
      resolveNodeStatus("fixture.beta", nodes, {
        userId: "local",
        nodes: {},
      }),
    ).toBe("LOCKED");
  });

  it("derives mastered from completion flags", () => {
    expect(
      resolveNodeStatus("fixture.alpha", nodes, {
        userId: "local",
        nodes: {
          "fixture.alpha": {
            started: true,
            theoryComplete: true,
            practiceComplete: true,
            checkpointComplete: true,
          },
        },
      }),
    ).toBe("MASTERED");
  });

  it("derives intermediate statuses from flags", () => {
    expect(
      resolveNodeStatus("fixture.alpha", nodes, {
        userId: "local",
        nodes: {
          "fixture.alpha": {
            started: true,
            theoryComplete: true,
            practiceComplete: false,
            checkpointComplete: false,
          },
        },
      }),
    ).toBe("THEORY_COMPLETE");
  });

  it("throws for unknown nodes", () => {
    expect(() => resolveNodeStatus("missing.node", nodes, { userId: "local", nodes: {} })).toThrow(
      GraphPathError,
    );
  });
});

describe("getPrerequisiteChain", () => {
  it("returns ordered transitive requires chain", () => {
    expect(getPrerequisiteChain("fixture.gamma", nodes)).toEqual([
      "fixture.alpha",
      "fixture.beta",
      "fixture.gamma",
    ]);
  });

  it("throws for unknown nodes", () => {
    expect(() => getPrerequisiteChain("missing.node", nodes)).toThrow(GraphPathError);
  });
});

describe("getLockReasons", () => {
  it("lists missing prerequisites", () => {
    const reasons = getLockReasons("fixture.beta", nodes, { userId: "local", nodes: {} });

    expect(reasons).toEqual([{ nodeId: "fixture.alpha", title: "Fixture Alpha", mastered: false }]);
  });

  it("throws for unknown nodes", () => {
    expect(() => getLockReasons("missing.node", nodes, { userId: "local", nodes: {} })).toThrow(
      GraphPathError,
    );
  });
});

describe("findLearningPath", () => {
  it("returns unmastered nodes on the chain to the target", () => {
    const path = findLearningPath("fixture.gamma", nodes, {
      userId: "local",
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: true,
          practiceComplete: true,
          checkpointComplete: true,
        },
      },
    });

    expect(path).toEqual(["fixture.beta", "fixture.gamma"]);
  });

  it("returns an empty path when the target is already mastered", () => {
    const masteredProgress = {
      userId: "local",
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: true,
          practiceComplete: true,
          checkpointComplete: true,
        },
        "fixture.beta": {
          started: true,
          theoryComplete: true,
          practiceComplete: true,
          checkpointComplete: true,
        },
      },
    };

    expect(findLearningPath("fixture.beta", nodes, masteredProgress)).toEqual([]);
  });
});

describe("resolveAllNodeStatuses", () => {
  it("returns a status for every node", () => {
    const statuses = resolveAllNodeStatuses(nodes, { userId: "local", nodes: {} });

    expect(statuses.get("fixture.alpha")).toBe("AVAILABLE");
    expect(statuses.get("fixture.beta")).toBe("LOCKED");
    expect(statuses.get("fixture.gamma")).toBe("LOCKED");
  });
});
