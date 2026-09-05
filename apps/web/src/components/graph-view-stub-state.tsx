"use client";

import type { GraphViewMode } from "@plp/domain";

import { useI18n } from "@/lib/i18n/i18n-context";
import type { MessageKey } from "@/lib/i18n/messages";

const stubTitleKeys: Partial<Record<GraphViewMode, MessageKey>> = {
  "my-path": "map.stub.myPath",
  infrastructure: "map.stub.infrastructure",
  security: "map.stub.security",
  osint: "map.stub.osint",
  full: "map.stub.full",
};

type GraphViewStubStateProps = {
  view: GraphViewMode;
};

export function GraphViewStubState({ view }: GraphViewStubStateProps) {
  const { t } = useI18n();
  const titleKey = stubTitleKeys[view] ?? "map.stub.myPath";

  return (
    <div
      className="flex h-full min-h-[28rem] items-center justify-center p-8 text-center"
      data-testid="graph-view-stub"
    >
      <div className="max-w-md space-y-2">
        <p className="text-foreground text-sm font-medium">{t(titleKey)}</p>
        <p className="text-muted-foreground text-sm">{t("map.stub.body")}</p>
      </div>
    </div>
  );
}
