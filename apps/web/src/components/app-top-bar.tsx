"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloudIcon, LogOutIcon, MenuIcon, UserIcon } from "lucide-react";

import { AppSidebarNav } from "@/components/app-sidebar-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthContext } from "@/lib/auth/auth-context";
import { useProgressContext } from "@/lib/progress/progress-context";

function getPageTitle(pathname: string): string {
  if (pathname === "/") {
    return "Knowledge map";
  }

  if (pathname.startsWith("/nodes/")) {
    return "Lesson";
  }

  if (pathname.startsWith("/login")) {
    return "Sign in";
  }

  return "Personal Learning Platform";
}

function getUserLabel(email: string | undefined): string {
  if (email === undefined || email.length === 0) {
    return "Signed in";
  }

  const atIndex = email.indexOf("@");
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}

export function AppTopBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { ready: authReady, user, cloudEnabled, signOut } = useAuthContext();
  const { cloudSync } = useProgressContext();

  return (
    <header
      className="border-border bg-background/95 supports-backdrop-filter:bg-background/80 sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur"
      data-testid="app-top-bar"
    >
      <Sheet onOpenChange={setMobileNavOpen} open={mobileNavOpen}>
        <SheetTrigger
          render={<Button className="md:hidden" size="icon-sm" type="button" variant="outline" />}
        >
          <MenuIcon aria-hidden="true" />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent className="bg-sidebar text-sidebar-foreground w-[18rem] p-0" side="left">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Application sections and graph views</SheetDescription>
          </SheetHeader>
          <AppSidebarNav
            className="min-h-full"
            onNavigate={() => {
              setMobileNavOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      <Separator className="hidden h-6 md:block" orientation="vertical" />

      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground text-xs">Personal Learning Platform</p>
        <h1 className="text-foreground truncate text-sm font-medium">{title}</h1>
      </div>

      {authReady && cloudEnabled ? (
        <div className="flex items-center gap-2">
          {cloudSync ? (
            <span
              className="text-muted-foreground hidden items-center gap-1 text-xs sm:inline-flex"
              data-testid="cloud-sync-badge"
            >
              <CloudIcon aria-hidden="true" className="size-3.5" />
              Cloud sync
            </span>
          ) : null}

          {user === null ? (
            <Button
              data-testid="sign-in-link"
              nativeButton={false}
              render={<Link href="/login" />}
              size="sm"
              variant="outline"
            >
              Sign in
            </Button>
          ) : (
            <>
              <span
                className="text-muted-foreground hidden items-center gap-1 text-xs sm:inline-flex"
                data-testid="signed-in-label"
              >
                <UserIcon aria-hidden="true" className="size-3.5" />
                {getUserLabel(user.email)}
              </span>
              <Button
                data-testid="sign-out-button"
                onClick={() => {
                  void signOut();
                }}
                size="sm"
                type="button"
                variant="ghost"
              >
                <LogOutIcon aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Sign out</span>
              </Button>
            </>
          )}
        </div>
      ) : null}
    </header>
  );
}
