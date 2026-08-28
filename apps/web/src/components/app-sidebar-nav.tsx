"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Layers3, Map, Network, Route, Shield, Sparkles, Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const activeGraphViewLink = { label: "Foundation", href: "/" } as const;

const stubGraphViewLinks = ["Infrastructure", "Security", "OSINT", "Full map", "My path"] as const;

const trackLinks = [
  { label: "Networking I", icon: Network, disabled: true },
  { label: "Linux I", icon: Layers3, disabled: true },
  { label: "Systems I", icon: Sparkles, disabled: true },
] as const;

type AppSidebarNavProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebarNav({ className, onNavigate }: AppSidebarNavProps) {
  const pathname = usePathname();
  const linkClickProps = onNavigate ? { onClick: onNavigate } : {};

  return (
    <nav
      aria-label="Application"
      className={cn("bg-sidebar text-sidebar-foreground flex h-full flex-col", className)}
    >
      <div className="border-sidebar-border border-b px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg">
            <Waypoints aria-hidden="true" className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Personal Learning</p>
            <p className="text-sidebar-foreground/70 truncate text-xs">Knowledge graph</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">Navigate</p>
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
            Knowledge map
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">Graph views</p>
          <Button
            key={activeGraphViewLink.label}
            className="w-full justify-start"
            nativeButton={false}
            onClick={onNavigate}
            render={<Link href={activeGraphViewLink.href} {...linkClickProps} />}
            variant={pathname === activeGraphViewLink.href ? "secondary" : "ghost"}
          >
            <Waypoints aria-hidden="true" />
            {activeGraphViewLink.label}
          </Button>
          {stubGraphViewLinks.map((label) => (
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
                Soon
              </Badge>
            </Button>
          ))}
        </div>

        <Separator className="bg-sidebar-border" />

        <div className="space-y-1">
          <p className="text-sidebar-foreground/70 px-2 text-xs font-medium">Tracks</p>
          {trackLinks.map(({ label, icon: Icon, disabled }) => (
            <Button
              key={label}
              aria-disabled={disabled}
              className="w-full justify-start opacity-60"
              disabled={disabled}
              variant="ghost"
            >
              <Icon aria-hidden="true" />
              {label}
              <Badge className="ml-auto" variant="secondary">
                Soon
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="border-sidebar-border mt-auto border-t px-4 py-4">
        <div className="text-sidebar-foreground/70 flex items-center gap-2 text-xs">
          <BookOpen aria-hidden="true" className="size-3.5" />
          <span>Theory-first curriculum shell</span>
        </div>
        <div className="text-sidebar-foreground/70 mt-2 flex items-center gap-2 text-xs">
          <Route aria-hidden="true" className="size-3.5" />
          <span>Foundation view active</span>
        </div>
        <div className="text-sidebar-foreground/70 mt-2 flex items-center gap-2 text-xs">
          <Shield aria-hidden="true" className="size-3.5" />
          <span>Dark theme enforced</span>
        </div>
      </div>
    </nav>
  );
}
