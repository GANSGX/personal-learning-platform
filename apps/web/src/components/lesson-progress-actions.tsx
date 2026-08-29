"use client";

import { useProgressContext } from "@/lib/progress/progress-context";
import { useI18n } from "@/lib/i18n/i18n-context";

import { Button } from "@/components/ui/button";

type LessonProgressActionsProps = {
  nodeId: string;
};

export function LessonProgressActions({ nodeId }: LessonProgressActionsProps) {
  const { t } = useI18n();
  const { progress, markTheoryComplete } = useProgressContext();
  const nodeProgress = progress.nodes[nodeId];
  const theoryComplete = nodeProgress?.theoryComplete ?? false;

  return (
    <div className="border-border bg-card/40 mt-8 space-y-3 rounded-lg border p-4">
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
        {t("lesson.progress")}
      </p>
      <Button
        type="button"
        data-testid="lesson-mark-theory-complete"
        disabled={theoryComplete}
        onClick={() => {
          void markTheoryComplete(nodeId);
        }}
      >
        {theoryComplete ? t("lesson.theoryComplete") : t("lesson.markTheory")}
      </Button>
    </div>
  );
}
