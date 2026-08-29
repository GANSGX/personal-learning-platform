"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers3, Map, Network, Route, Shield, Sparkles, Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const stubViews = [
    t("sidebar.infrastructure"),
    t("sidebar.security"),
    t("sidebar.osint"),
    t("sidebar.fullMap"),
    t("sidebar.myPath"),
  ];
  const tracks = [
    { label: t("sidebar.networkingI"), icon: Network },
    { label: t("sidebar.linuxI"), icon: Layers3 },
    { label: t("sidebar.systemsI"), icon: Sparkles },
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
          <Button
            className="w-full justify-start"
            nativeButton={false}
            onClick={onNavigate}
            render={
              <Link
                href="/"
                {...linkClickProps}
                className={cn(
                  pathname === "/" && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              />
            }
            variant={pathname === "/" ? "secondary" : "ghost"}
          >
            <Map aria-hidden="true" />
            {t("chrome.knowledgeMap")}
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">
            {t("sidebar.graphViews")}
          </p>
          <Button
            className="w-full justify-start"
            nativeButton={false}
            onClick={onNavigate}
            render={<Link href="/" {...linkClickProps} />}
            variant={pathname === "/" ? "secondary" : "ghost"}
          >
            <Waypoints aria-hidden="true" />
            {t("sidebar.foundation")}
          </Button>
          {stubViews.map((label) => (
            <Button
              key={label}
              aria-disabled="true"
              className="w-full justify-start opacity-60"
              disabled
              variant="ghost"
            >
              <Waypoints aria-hidden="true" />
              {label}
              <Badge className="ml-auto" variant="secondary">
                {t("sidebar.soon")}
              </Badge>
            </Button>
          ))}
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">
            {t("sidebar.tracks")}
          </p>
          {tracks.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              aria-disabled="true"
              className="w-full justify-start opacity-60"
              disabled
              variant="ghost"
            >
              <Icon aria-hidden="true" />
              {label}
              <Badge className="ml-auto" variant="secondary">
                {t("sidebar.soon")}
              </Badge>
            </Button>
          ))}
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
