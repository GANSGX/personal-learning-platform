"use client";

import type { NodeStatus } from "@plp/domain";

const statusClassNames: Record<NodeStatus, string> = {
  LOCKED: "border-muted-foreground/40 bg-muted/20 text-muted-foreground",
  AVAILABLE: "border-border bg-card text-card-foreground",
  IN_PROGRESS: "border-sky-500/60 bg-sky-500/10 text-card-foreground",
  THEORY_COMPLETE: "border-amber-500/60 bg-amber-500/10 text-card-foreground",
  PRACTICE_COMPLETE: "border-orange-500/60 bg-orange-500/10 text-card-foreground",
  MASTERED: "border-emerald-500/60 bg-emerald-500/10 text-card-foreground",
};

export function getNodeStatusClassName(status: NodeStatus): string {
  return statusClassNames[status];
}
