import type { KnowledgeNodeMetadata } from "@plp/domain";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type NodeSidePanelProps = {
  node: KnowledgeNodeMetadata | undefined;
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>;
};

const nodeActions = [
  { id: "theory", label: "Theory" },
  { id: "visualization", label: "Visualization" },
  { id: "practice", label: "Practice" },
  { id: "checkpoint", label: "Checkpoint" },
] as const;

function resolveNodeTitle(
  nodeId: string,
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>,
): string {
  return nodesById.get(nodeId)?.title ?? nodeId;
}

function NodeRelationList({
  label,
  nodeIds,
  nodesById,
  testId,
}: {
  label: string;
  nodeIds: readonly string[];
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>;
  testId: string;
}) {
  if (nodeIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" data-testid={testId}>
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</p>
      <ul className="space-y-1">
        {nodeIds.map((nodeId) => (
          <li key={nodeId} className="text-sm">
            {resolveNodeTitle(nodeId, nodesById)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NodeSidePanel({ node, nodesById }: NodeSidePanelProps) {
  if (!node) {
    return (
      <Card
        className="h-full rounded-none border-0 bg-transparent ring-0"
        data-testid="node-side-panel"
      >
        <CardHeader>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Node</p>
          <CardTitle>No node selected</CardTitle>
          <CardDescription>
            Theory, visualization, practice, and checkpoint will open here.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-muted-foreground text-sm">Select a node on the map to inspect it.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="h-full rounded-none border-0 bg-transparent ring-0"
      data-testid="node-side-panel"
    >
      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Node</p>
          <CardTitle data-testid="node-side-panel-title">{node.title}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" data-testid="node-side-panel-status">
            Available
          </Badge>
          <Badge variant="outline">{node.level}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 pt-6">
        <NodeRelationList
          label="Requires"
          nodeIds={node.requires}
          nodesById={nodesById}
          testId="node-requires"
        />
        <NodeRelationList
          label="Unlocks"
          nodeIds={node.unlocks}
          nodesById={nodesById}
          testId="node-unlocks"
        />
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Actions</p>
          <div className="grid gap-2">
            {nodeActions.map((action) => (
              <Button key={action.id} type="button" variant="outline" disabled>
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
