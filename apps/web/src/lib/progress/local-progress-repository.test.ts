import { describe, expect, it } from "vitest";

import { LOCAL_USER_ID } from "./constants.ts";
import {
  createMemoryProgressStorage,
  LocalProgressRepository,
} from "./local-progress-repository.ts";

describe("LocalProgressRepository", () => {
  it("returns empty progress for a new user", async () => {
    const repository = new LocalProgressRepository(createMemoryProgressStorage());

    await expect(repository.getProgress(LOCAL_USER_ID)).resolves.toEqual({
      userId: LOCAL_USER_ID,
      nodes: {},
    });
  });

  it("persists progress across reads", async () => {
    const storage = createMemoryProgressStorage();
    const repository = new LocalProgressRepository(storage);

    await repository.saveProgress({
      userId: LOCAL_USER_ID,
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: true,
          practiceComplete: false,
          checkpointComplete: false,
        },
      },
    });

    await expect(repository.getProgress(LOCAL_USER_ID)).resolves.toEqual({
      userId: LOCAL_USER_ID,
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: true,
          practiceComplete: false,
          checkpointComplete: false,
        },
      },
    });
  });

  it("rejects invalid progress payloads on save", async () => {
    const repository = new LocalProgressRepository(createMemoryProgressStorage());

    await expect(
      repository.saveProgress({
        userId: "",
        nodes: {},
      }),
    ).rejects.toThrow();
  });
});
