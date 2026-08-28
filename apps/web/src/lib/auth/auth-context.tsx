"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type AuthContextValue = {
  ready: boolean;
  user: User | null;
  cloudEnabled: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => !isSupabaseConfigured());
  const [user, setUser] = useState<User | null>(null);
  const cloudEnabled = isSupabaseConfigured();

  useEffect(() => {
    if (!cloudEnabled) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase === null) {
      setReady(true);
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
    if (!cloudEnabled) {
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (supabase === null) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  }, [cloudEnabled]);

  const value = useMemo(
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
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}
