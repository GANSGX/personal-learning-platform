"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/lib/auth/auth-context";
import { ProgressProvider } from "@/lib/progress/progress-context";

export function ClientProgressProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </AuthProvider>
  );
}
