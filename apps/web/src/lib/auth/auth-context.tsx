"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

import { E2E_USER, isE2eAuthActive } from "./e2e-auth.ts";

type AuthContextValue = {
  ready: boolean;
  user: User | null;
  cloudEnabled: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const cloudEnabled = isSupabaseConfigured();
  const [ready, setReady] = useState(() => !cloudEnabled || isE2eAuthActive());
  const [user, setUser] = useState<User | null>(() => (isE2eAuthActive() ? E2E_USER : null));

  useEffect(() => {
    if (isE2eAuthActive() || !cloudEnabled) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase === null) {
      return;
    }

    let cancelled = false;

    void supabase.auth.getUser().then(({ data }) => {
      if (!cancelled) {
        setUser(data.user);
        setReady(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [cloudEnabled]);

  const signOut = useCallback(async () => {
    if (isE2eAuthActive()) {
      globalThis.sessionStorage.removeItem("plp-e2e-auth");
      setUser(null);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase !== null) {
      await supabase.auth.signOut();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      user,
      cloudEnabled,
      signOut,
    }),
    [ready, user, cloudEnabled, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
