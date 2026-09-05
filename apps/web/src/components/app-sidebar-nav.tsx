"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BookOpen, Layers3, Map, Network, Route, Shield, Sparkles, Waypoints } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/lib/i18n/i18n-context";
import { cn } from "@/lib/utils";

type AppSidebarNavProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebarNav({ className, onNavigate }: AppSidebarNavProps) {
  const { t } = useI18n();
  const pathname = usePathname();
  const linkClickProps = onNavigate ? { onClick: onNavigate } : {};
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") ?? (pathname === "/" ? "networking" : null);

  const trackItems = [
    { mode: "networking", label: t("track.networking"), icon: Network },
    { mode: "os", label: t("track.os"), icon: Sparkles },
    { mode: "linux", label: t("track.linux"), icon: Layers3 },
    { mode: "windows", label: t("track.windows"), icon: BookOpen },
    { mode: "infrastructure", label: t("track.infrastructure"), icon: Waypoints },
    { mode: "security", label: t("track.security"), icon: Shield },
    { mode: "osint", label: t("track.osint"), icon: Route },
    { mode: "full", label: t("track.all"), icon: Map },
  ];

  return (
    <nav
      aria-label={t("chrome.appNav")}
      className={cn("bg-sidebar text-sidebar-foreground flex h-full flex-col", className)}
    >
      <div className="border-sidebar-border border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Waypoints aria-hidden="true" className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{t("brand.name")}</p>
            <p className="text-sidebar-foreground/70 truncate text-xs">{t("brand.tagline")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">
            {t("sidebar.navigate")}
          </p>
          <Link
            href="/"
            {...linkClickProps}
            className={cn(
              buttonVariants({
                variant: pathname === "/" && !searchParams.get("view") ? "secondary" : "ghost",
              }),
              "w-full justify-start gap-2",
              pathname === "/" &&
                !searchParams.get("view") &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <Map aria-hidden="true" className="size-4" />
            <span>{t("chrome.knowledgeMap")}</span>
          </Link>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">
            {t("sidebar.tracks")}
          </p>
          {trackItems.map(({ mode, label, icon: Icon }) => {
            const isActive = pathname === "/" && currentView === mode;
            return (
              <Link
                key={mode}
                href={`/?view=${mode}`}
                data-testid={`sidebar-track-${mode}`}
                {...linkClickProps}
                className={cn(
                  buttonVariants({ variant: isActive ? "secondary" : "ghost" }),
                  "w-full justify-start gap-2",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-sidebar-border mt-auto border-t px-4 py-4">
        <div className="text-sidebar-foreground/70 flex items-center gap-2 text-xs">
          <BookOpen aria-hidden="true" className="size-3.5" />
          <span>{t("sidebar.footerTheory")}</span>
        </div>
        <div className="text-sidebar-foreground/70 mt-2 flex items-center gap-2 text-xs">
          <Route aria-hidden="true" className="size-3.5" />
          <span>{t("sidebar.footerFoundation")}</span>
        </div>
        <div className="text-sidebar-foreground/70 mt-2 flex items-center gap-2 text-xs">
          <Shield aria-hidden="true" className="size-3.5" />
          <span>{t("sidebar.footerTheme")}</span>
        </div>
      </div>
    </nav>
  );
}
