"use client";

import type { ReactNode } from "react";

import { ProgressProvider } from "@/lib/progress/progress-context";

export function ClientProgressProvider({ children }: { children: ReactNode }) {
  return <ProgressProvider>{children}</ProgressProvider>;
}
