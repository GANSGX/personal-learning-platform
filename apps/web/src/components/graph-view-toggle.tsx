"use client";

import type { GraphViewMode } from "@plp/domain";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/i18n-context";
import type { MessageKey } from "@/lib/i18n/messages";

const graphViewOptions: Array<{ mode: GraphViewMode; labelKey: MessageKey }> = [
  { mode: "networking", labelKey: "track.networking" },
  { mode: "os", labelKey: "track.os" },
  { mode: "linux", labelKey: "track.linux" },
  { mode: "windows", labelKey: "track.windows" },
  { mode: "infrastructure", labelKey: "track.infrastructure" },
  { mode: "security", labelKey: "track.security" },
  { mode: "osint", labelKey: "track.osint" },
  { mode: "full", labelKey: "track.all" },
  { mode: "my-path", labelKey: "sidebar.myPath" },
];

type GraphViewToggleProps = {
  activeView: GraphViewMode;
  onViewChange: (view: GraphViewMode) => void;
};

export function GraphViewToggle({ activeView, onViewChange }: GraphViewToggleProps) {
  const { t } = useI18n();

  return (
    <div
      aria-label={t("map.viewModes")}
      className="flex flex-wrap gap-2"
      data-testid="graph-view-toggle"
      role="group"
    >
      {graphViewOptions.map(({ mode, labelKey }) => {
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
            {t(labelKey)}
          </Button>
        );
      })}
    </div>
  );
}
