import type { GraphViewMode } from "@plp/domain";

import { Button } from "@/components/ui/button";

const graphViewOptions: Array<{ mode: GraphViewMode; label: string }> = [
  { mode: "foundation", label: "Foundation" },
  { mode: "infrastructure", label: "Infrastructure" },
  { mode: "security", label: "Security" },
  { mode: "osint", label: "OSINT" },
  { mode: "full", label: "Full map" },
  { mode: "my-path", label: "My path" },
];

type GraphViewToggleProps = {
  activeView: GraphViewMode;
  onViewChange: (view: GraphViewMode) => void;
};

export function GraphViewToggle({ activeView, onViewChange }: GraphViewToggleProps) {
  return (
    <div
      aria-label="Graph view modes"
      className="flex flex-wrap gap-2"
      data-testid="graph-view-toggle"
      role="group"
    >
      {graphViewOptions.map(({ mode, label }) => {
        const isActive = activeView === mode;

        return (
          <Button
            key={mode}
            aria-pressed={isActive}
            data-testid={`graph-view-${mode}`}
            onClick={() => {
              onViewChange(mode);
            }}
            size="sm"
            type="button"
            variant={isActive ? "default" : "outline"}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}
