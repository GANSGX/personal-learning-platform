"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

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

function getPageTitle(pathname: string): string {
  if (pathname === "/") {
    return "Knowledge map";
  }

  if (pathname.startsWith("/nodes/")) {
    return "Lesson";
  }

  return "Personal Learning Platform";
}

export function AppTopBar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    </header>
  );
}
