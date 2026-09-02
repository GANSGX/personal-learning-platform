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

import { useAuthContext } from "@/lib/auth/auth-context";
import { isE2eAuthActive } from "@/lib/auth/e2e-auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
import { SupabaseProgressRepository } from "./supabase-progress-repository.ts";

type ProgressContextValue = {
  ready: boolean;
  progress: Progress;
  cloudSync: boolean;
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
  const { ready: authReady, user, cloudEnabled } = useAuthContext();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<Progress>(defaultProgress);
  const progressRef = useRef(progress);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const userId = user?.id ?? LOCAL_USER_ID;
  const cloudSync = cloudEnabled && user !== null && !isE2eAuthActive();

  const repository = useMemo(() => {
    if (cloudSync) {
      const supabase = createSupabaseBrowserClient();

      if (supabase !== null) {
        return new SupabaseProgressRepository(supabase);
      }
    }

    return new LocalProgressRepository(
      createIndexedDbProgressStorage(PROGRESS_DB_NAME, PROGRESS_STORE_NAME),
    );
  }, [cloudSync]);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    let cancelled = false;

    void repository.getProgress(userId).then((loaded) => {
      if (!cancelled) {
        setProgress(loaded);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authReady, repository, userId]);

  const updateProgress = useCallback(
    async (updater: (current: Progress) => Progress) => {
      const nextProgress = updater(progressRef.current);
      const normalizedProgress: Progress = {
        ...nextProgress,
        userId,
      };

      await repository.saveProgress(normalizedProgress);
      setProgress(normalizedProgress);
    },
    [repository, userId],
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
      ready: authReady && ready,
      progress,
      cloudSync,
      markStarted,
      markTheoryComplete: markTheoryCompleteForNode,
      markPracticeComplete: markPracticeCompleteForNode,
      markCheckpointComplete: markCheckpointCompleteForNode,
    }),
    [
      authReady,
      ready,
      progress,
      cloudSync,
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
