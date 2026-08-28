"use client";

import type { KnowledgeNodeMetadata, NodeStatus } from "@plp/domain";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  findLearningPath,
  getLockReasons,
  getPrerequisiteChain,
  resolveAllNodeStatuses,
} from "@plp/graph";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getNodeStatusLabel } from "@/lib/node-status-styles";
import { useProgressContext } from "@/lib/progress/progress-context";

import { cn } from "@/lib/utils";

type NodeSidePanelProps = {
  node: KnowledgeNodeMetadata | undefined;
  nodes: readonly KnowledgeNodeMetadata[];
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>;
  onShowPath: (nodeIds: readonly string[]) => void;
  onClearPath: () => void;
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

function InsightList({
  title,
  items,
  testId,
}: {
  title: string;
  items: readonly string[];
  testId: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" data-testid={testId}>
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{title}</p>
      <ol className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm">
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NodeSidePanel({
  node,
  nodes,
  nodesById,
  onShowPath,
  onClearPath,
}: NodeSidePanelProps) {
  const { ready, progress, markPracticeComplete, markCheckpointComplete } = useProgressContext();
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [showLockReasons, setShowLockReasons] = useState(false);

  const statuses = useMemo(
    () => (ready ? resolveAllNodeStatuses(nodes, progress) : new Map<string, NodeStatus>()),
    [nodes, progress, ready],
  );

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

  const status = statuses.get(node.id) ?? "LOCKED";
  const prerequisiteChain = getPrerequisiteChain(node.id, nodes)
    .slice(0, -1)
    .map((nodeId) => resolveNodeTitle(nodeId, nodesById));
  const lockReasons = getLockReasons(node.id, nodes, progress).map((reason) => ({
    label: reason.title,
    done: reason.mastered,
  }));
  const learningPath = findLearningPath(node.id, nodes, progress).map((nodeId) =>
    resolveNodeTitle(nodeId, nodesById),
  );
  const nodeProgress = progress.nodes[node.id];
  const canMarkPractice = status === "THEORY_COMPLETE";
  const canMarkCheckpoint = status === "PRACTICE_COMPLETE";

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
            {getNodeStatusLabel(status)}
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
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Graph insights</p>
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-show-prerequisites"
              onClick={() => {
                setShowPrerequisites((current) => !current);
              }}
            >
              Show prerequisites
            </Button>
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-why-locked"
              onClick={() => {
                setShowLockReasons((current) => !current);
              }}
            >
              Why is this locked?
            </Button>
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-show-path"
              onClick={() => {
                onShowPath(findLearningPath(node.id, nodes, progress));
              }}
            >
              Show path to here
            </Button>
            <Button type="button" variant="ghost" onClick={onClearPath}>
              Clear path highlight
            </Button>
          </div>
        </div>

        {showPrerequisites ? (
          <InsightList
            title="Prerequisite chain"
            items={prerequisiteChain}
            testId="node-prerequisite-chain"
          />
        ) : null}

        {showLockReasons ? (
          <div className="space-y-2" data-testid="node-lock-reasons">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Missing</p>
            {lockReasons.length === 0 ? (
              <p className="text-sm">No direct prerequisites are blocking this node.</p>
            ) : (
              <ul className="space-y-1">
                {lockReasons.map((reason) => (
                  <li key={reason.label} className="text-sm">
                    {reason.done ? "✓" : "✗"} {reason.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {learningPath.length > 0 ? (
          <InsightList title="Learning path" items={learningPath} testId="node-learning-path" />
        ) : null}

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Actions</p>
          <div className="grid gap-2">
            {nodeActions.map((action) => {
              if (action.id === "theory") {
                return (
                  <Link
                    key={action.id}
                    href={`/nodes/${node.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                    data-testid="node-action-theory"
                  >
                    {action.label}
                    {nodeProgress?.theoryComplete ? " ✓" : ""}
                  </Link>
                );
              }

              if (action.id === "practice") {
                return (
                  <Button
                    key={action.id}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canMarkPractice}
                    data-testid="node-action-mark-practice"
                    onClick={() => {
                      void markPracticeComplete(node.id);
                    }}
                  >
                    Mark practice complete
                    {nodeProgress?.practiceComplete ? " ✓" : ""}
                  </Button>
                );
              }

              if (action.id === "checkpoint") {
                return (
                  <Button
                    key={action.id}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canMarkCheckpoint}
                    data-testid="node-action-mark-checkpoint"
                    onClick={() => {
                      void markCheckpointComplete(node.id);
                    }}
                  >
                    Mark checkpoint complete
                    {nodeProgress?.checkpointComplete ? " ✓" : ""}
                  </Button>
                );
              }

              return (
                <Button key={action.id} type="button" variant="outline" disabled>
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
