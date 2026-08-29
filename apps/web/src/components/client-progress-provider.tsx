"use client";

import { Suspense, type ReactNode } from "react";

import { AuthGate } from "@/components/auth-gate";
import { AuthProvider } from "@/lib/auth/auth-context";
import { I18nProvider } from "@/lib/i18n/i18n-context";

export function ClientProgressProvider({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <Suspense>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </AuthProvider>
    </I18nProvider>
  );
}
