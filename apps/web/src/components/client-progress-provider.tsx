"use client";

import { Suspense, type ReactNode } from "react";

import { AuthGate } from "@/components/auth-gate";
import { AuthProvider } from "@/lib/auth/auth-context";

export function ClientProgressProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Suspense>
        <AuthGate>{children}</AuthGate>
      </Suspense>
    </AuthProvider>
  );
}
