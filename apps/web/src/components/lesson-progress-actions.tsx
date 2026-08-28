"use client";

import { useProgressContext } from "@/lib/progress/progress-context";

import { Button } from "@/components/ui/button";

type LessonProgressActionsProps = {
  nodeId: string;
};

export function LessonProgressActions({ nodeId }: LessonProgressActionsProps) {
  const { progress, markTheoryComplete } = useProgressContext();
  const nodeProgress = progress.nodes[nodeId];
  const theoryComplete = nodeProgress?.theoryComplete ?? false;

  return (
    <div className="border-border bg-card/40 mt-8 space-y-3 rounded-lg border p-4">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Lesson progress</p>
      <Button
        type="button"
        data-testid="lesson-mark-theory-complete"
        disabled={theoryComplete}
        onClick={() => {
          void markTheoryComplete(nodeId);
        }}
      >
        {theoryComplete ? "Theory complete" : "Mark theory complete"}
      </Button>
    </div>
  );
}
