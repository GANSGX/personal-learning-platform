"use client";

import type { Progress } from "@plp/domain";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { LOCAL_USER_ID, PROGRESS_DB_NAME, PROGRESS_STORE_NAME } from "./constants.ts";
import {
  createIndexedDbProgressStorage,
  LocalProgressRepository,
} from "./local-progress-repository.ts";
import {
  markCheckpointComplete,
  markNodeStarted,
  markPracticeComplete,
  markTheoryComplete,
} from "./progress-mutations.ts";

type ProgressContextValue = {
  ready: boolean;
  progress: Progress;
  markStarted: (nodeId: string) => Promise<void>;
  markTheoryComplete: (nodeId: string) => Promise<void>;
  markPracticeComplete: (nodeId: string) => Promise<void>;
  markCheckpointComplete: (nodeId: string) => Promise<void>;
};

const defaultProgress: Progress = {
  userId: LOCAL_USER_ID,
  nodes: {},
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const repository = useMemo(
    () =>
      new LocalProgressRepository(
        createIndexedDbProgressStorage(PROGRESS_DB_NAME, PROGRESS_STORE_NAME),
      ),
    [],
  );

  useEffect(() => {
    let cancelled = false;

    void repository.getProgress(LOCAL_USER_ID).then((loaded) => {
      if (!cancelled) {
        setProgress(loaded);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [repository]);

  const updateProgress = useCallback(
    async (updater: (current: Progress) => Progress) => {
      const nextProgress = updater(progressRef.current);
      await repository.saveProgress(nextProgress);
      setProgress(nextProgress);
    },
    [repository],
  );

  const markStarted = useCallback(
    async (nodeId: string) => {
      await updateProgress((current) => markNodeStarted(current, nodeId));
    },
    [updateProgress],
  );

  const markTheoryCompleteForNode = useCallback(
    async (nodeId: string) => {
      await updateProgress((current) => markTheoryComplete(current, nodeId));
    },
    [updateProgress],
  );

  const markPracticeCompleteForNode = useCallback(
    async (nodeId: string) => {
      await updateProgress((current) => markPracticeComplete(current, nodeId));
    },
    [updateProgress],
  );

  const markCheckpointCompleteForNode = useCallback(
    async (nodeId: string) => {
      await updateProgress((current) => markCheckpointComplete(current, nodeId));
    },
    [updateProgress],
  );

  const value = useMemo(
    () => ({
      ready,
      progress,
      markStarted,
      markTheoryComplete: markTheoryCompleteForNode,
      markPracticeComplete: markPracticeCompleteForNode,
      markCheckpointComplete: markCheckpointCompleteForNode,
    }),
    [
      ready,
      progress,
      markStarted,
      markTheoryCompleteForNode,
      markPracticeCompleteForNode,
      markCheckpointCompleteForNode,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressContextValue {
  const context = useContext(ProgressContext);

  if (context === null) {
    throw new Error("useProgressContext must be used within ProgressProvider");
  }

  return context;
}
