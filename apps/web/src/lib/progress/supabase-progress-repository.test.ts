import { describe, expect, it, vi } from "vitest";

import { LOCAL_USER_ID } from "./constants.ts";
import {
  createMemoryProgressStorage,
  LocalProgressRepository,
} from "./local-progress-repository.ts";
import { SupabaseProgressRepository } from "./supabase-progress-repository.ts";

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

describe("SupabaseProgressRepository", () => {
  it("returns empty progress when no row exists", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const repository = new SupabaseProgressRepository({ from } as never);

    await expect(repository.getProgress("user-123")).resolves.toEqual({
      userId: "user-123",
      nodes: {},
    });
  });

  it("loads stored nodes for a user", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: {
        user_id: "user-123",
        nodes: {
          "fixture.alpha": {
            started: true,
            theoryComplete: false,
            practiceComplete: false,
            checkpointComplete: false,
          },
        },
      },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    const repository = new SupabaseProgressRepository({ from } as never);

    await expect(repository.getProgress("user-123")).resolves.toEqual({
      userId: "user-123",
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: false,
          practiceComplete: false,
          checkpointComplete: false,
        },
      },
    });
  });

  it("upserts validated progress", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ upsert });
    const repository = new SupabaseProgressRepository({ from } as never);

    await repository.saveProgress({
      userId: "user-123",
      nodes: {
        "fixture.alpha": {
          started: true,
          theoryComplete: true,
          practiceComplete: false,
          checkpointComplete: false,
        },
      },
    });

    expect(upsert).toHaveBeenCalledWith(
      {
        user_id: "user-123",
        nodes: {
          "fixture.alpha": {
            started: true,
            theoryComplete: true,
            practiceComplete: false,
            checkpointComplete: false,
          },
        },
      },
      { onConflict: "user_id" },
    );
  });
});
