"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOutIcon, MenuIcon, UserIcon } from "lucide-react";

import { AppSidebarNav } from "@/components/app-sidebar-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
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
import { useI18n } from "@/lib/i18n/i18n-context";

function getUserLabel(email: string | undefined, fallback: string): string {
  if (email === undefined || email.length === 0) {
    return fallback;
  }

  const atIndex = email.indexOf("@");
  return atIndex > 0 ? email.slice(0, atIndex) : email;
}

export function AppTopBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, signOut } = useAuthContext();

  const title =
    pathname === "/"
      ? t("chrome.knowledgeMap")
      : pathname.startsWith("/nodes/")
        ? t("chrome.lesson")
        : pathname.startsWith("/login")
          ? t("chrome.signIn")
          : t("brand.fullName");

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
          <span className="sr-only">{t("chrome.openNav")}</span>
        </SheetTrigger>
        <SheetContent className="bg-sidebar text-sidebar-foreground w-[18rem] p-0" side="left">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("chrome.navTitle")}</SheetTitle>
            <SheetDescription>{t("chrome.navDescription")}</SheetDescription>
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
        <p className="text-muted-foreground text-xs">{t("brand.fullName")}</p>
        <h1 className="text-foreground truncate text-sm font-medium">{title}</h1>
      </div>

      <LanguageSwitcher className="hidden items-center gap-1 sm:flex" />

      {user === null ? null : (
        <div className="flex items-center gap-2">
          <span
            className="text-muted-foreground hidden items-center gap-1 text-xs sm:inline-flex"
            data-testid="signed-in-label"
          >
            <UserIcon aria-hidden="true" className="size-3.5" />
            {getUserLabel(user.email, t("chrome.signedIn"))}
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
            <span className="sr-only sm:not-sr-only">{t("chrome.signOut")}</span>
          </Button>
        </div>
      )}
    </header>
  );
}
