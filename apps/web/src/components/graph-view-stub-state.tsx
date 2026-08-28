import type { GraphViewMode } from "@plp/domain";

const stubTitles: Record<Exclude<GraphViewMode, "foundation">, string> = {
  infrastructure: "Infrastructure view",
  security: "Security view",
  osint: "OSINT view",
  full: "Full knowledge map",
  "my-path": "My current path",
};

type GraphViewStubStateProps = {
  view: Exclude<GraphViewMode, "foundation">;
};

export function GraphViewStubState({ view }: GraphViewStubStateProps) {
  return (
    <div
      className="flex h-full min-h-[28rem] items-center justify-center p-8 text-center"
      data-testid="graph-view-stub"
    >
      <div className="max-w-md space-y-2">
        <p className="text-foreground text-sm font-medium">{stubTitles[view]}</p>
        <p className="text-muted-foreground text-sm">
          This view mode is not available yet. Foundation view is active for curriculum nodes with{" "}
          <code className="text-foreground">level: foundation</code>.
        </p>
      </div>
    </div>
  );
}
