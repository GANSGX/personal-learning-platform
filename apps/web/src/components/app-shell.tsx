"use client";

import type { ReactNode } from "react";

import { AppSidebarNav } from "@/components/app-sidebar-nav";
import { AppTopBar } from "@/components/app-top-bar";
import { Separator } from "@/components/ui/separator";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-svh w-full" data-testid="app-shell">
      <aside
        aria-label="Sidebar"
        className="border-sidebar-border bg-sidebar hidden w-64 shrink-0 border-r md:flex"
      >
        <AppSidebarNav className="w-full" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopBar />
        <Separator />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
