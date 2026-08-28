"use client";

import { useEffect, useMemo, useState } from "react";

import type { GraphViewMode, KnowledgeNodeMetadata } from "@plp/domain";
import { resolveAllNodeStatuses } from "@plp/graph";
import { filterNodesByView, isGraphViewActive, type CurriculumLayout } from "@plp/graph";

import { GraphCanvas } from "@/components/graph-canvas";
import { GraphViewStubState } from "@/components/graph-view-stub-state";
import { GraphViewToggle } from "@/components/graph-view-toggle";
import { NodeSidePanel } from "@/components/node-side-panel";
import { useProgressContext } from "@/lib/progress/progress-context";

type KnowledgeMapShellProps = {
  foundationLayout: CurriculumLayout;
  nodes: KnowledgeNodeMetadata[];
};

export function KnowledgeMapShell({ foundationLayout, nodes }: KnowledgeMapShellProps) {
  const { ready, progress, markStarted } = useProgressContext();
  const [activeView, setActiveView] = useState<GraphViewMode>("foundation");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<readonly string[]>([]);

  const visibleNodes = useMemo(
    () => (isGraphViewActive(activeView) ? filterNodesByView(nodes, activeView) : []),
    [activeView, nodes],
  );

  const nodesById = useMemo(
    () => new Map(visibleNodes.map((node) => [node.id, node])),
    [visibleNodes],
  );

  const nodeStatuses = useMemo(
    () => (ready ? resolveAllNodeStatuses(nodes, progress) : new Map()),
    [nodes, progress, ready],
  );

  useEffect(() => {
    if (selectedNodeId !== null && !nodesById.has(selectedNodeId)) {
      setSelectedNodeId(null);
      setHighlightedNodeIds([]);
    }
  }, [nodesById, selectedNodeId]);

  const selectedNode = selectedNodeId ? nodesById.get(selectedNodeId) : undefined;

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    void markStarted(nodeId);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section
        aria-label="Graph view controls"
        className="border-border bg-card/20 border-b px-4 py-4 lg:px-6"
      >
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Switch graph views. Foundation is the default active mode.
          </p>
          <GraphViewToggle activeView={activeView} onViewChange={setActiveView} />
        </div>
      </section>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-label="Knowledge graph canvas"
          className="border-border bg-card/40 m-4 min-h-[28rem] overflow-hidden rounded-lg border"
        >
          {isGraphViewActive(activeView) ? (
            <GraphCanvas
              layout={foundationLayout}
              selectedNodeId={selectedNodeId}
              highlightedNodeIds={highlightedNodeIds}
              nodeStatuses={nodeStatuses}
              onNodeSelect={handleNodeSelect}
            />
          ) : (
            <GraphViewStubState view={activeView} />
          )}
        </section>
        <aside
          aria-label="Selected node"
          className="border-border bg-sidebar border-t lg:border-t-0 lg:border-l"
        >
          <NodeSidePanel
            node={selectedNode}
            nodes={nodes}
            nodesById={nodesById}
            onShowPath={setHighlightedNodeIds}
            onClearPath={() => {
              setHighlightedNodeIds([]);
            }}
          />
        </aside>
      </div>
    </div>
  );
}
