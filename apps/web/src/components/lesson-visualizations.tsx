"use client";

import { renderVisualization } from "@plp/visualizations";

type LessonVisualizationsProps = {
  visualizationIds: readonly string[];
};

export function LessonVisualizations({ visualizationIds }: LessonVisualizationsProps) {
  if (visualizationIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visualizationIds.map((visualizationId) => (
        <div key={visualizationId}>{renderVisualization(visualizationId)}</div>
      ))}
    </div>
  );
}
