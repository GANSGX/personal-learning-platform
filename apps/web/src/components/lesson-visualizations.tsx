"use client";

import { renderVisualization } from "@plp/visualizations";

import { VisualizationErrorBoundary } from "@/components/visualization-error-boundary";
import { useI18n } from "@/lib/i18n/i18n-context";

type LessonVisualizationsProps = {
  visualizationIds: readonly string[];
};

export function LessonVisualizations({ visualizationIds }: LessonVisualizationsProps) {
  const { locale } = useI18n();

  if (visualizationIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visualizationIds.map((visualizationId) => (
        <VisualizationErrorBoundary key={visualizationId} visualizationId={visualizationId}>
          {renderVisualization(visualizationId, locale)}
        </VisualizationErrorBoundary>
      ))}
    </div>
  );
}
