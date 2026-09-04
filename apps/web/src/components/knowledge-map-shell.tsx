"use client";

import { useMemo, useState } from "react";

import type { GraphViewMode, KnowledgeNodeMetadata, Lab } from "@plp/domain";
import { resolveAllNodeStatuses } from "@plp/graph";
import { filterNodesByView, isGraphViewActive, type CurriculumLayout } from "@plp/graph";

import { GraphCanvas } from "@/components/graph-canvas";
import { GraphViewStubState } from "@/components/graph-view-stub-state";
import { GraphViewToggle } from "@/components/graph-view-toggle";
import { NodeSidePanel } from "@/components/node-side-panel";
import { useI18n } from "@/lib/i18n/i18n-context";
import { localizedNodeTitle } from "@/lib/i18n/localized-title";
import { useProgressContext } from "@/lib/progress/progress-context";

export function KnowledgeMapShell({
  foundationLayout,
  nodes,
  labs = {},
}: {
  foundationLayout: CurriculumLayout;
  nodes: readonly KnowledgeNodeMetadata[];
  labs?: Record<string, Lab>;
}) {
  const { t, locale } = useI18n();
  const { progress, ready, markStarted } = useProgressContext();
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

  const activeSelectedNodeId =
    selectedNodeId && nodesById.has(selectedNodeId) ? selectedNodeId : null;
  const activeHighlightedNodeIds = activeSelectedNodeId ? highlightedNodeIds : [];

  const selectedNode = activeSelectedNodeId ? nodesById.get(activeSelectedNodeId) : undefined;
  const localizedLayout = useMemo(
    () => ({
      ...foundationLayout,
      nodes: foundationLayout.nodes.map((node) => ({
        ...node,
        title: localizedNodeTitle(
          nodes.find((item) => item.id === node.id),
          locale,
          node.title,
        ),
      })),
    }),
    [foundationLayout, locale, nodes],
  );

  const handleNodeSelect = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    void markStarted(nodeId);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section
        aria-label={t("map.viewControls")}
        className="border-border bg-card/20 border-b px-4 py-4 lg:px-6"
      >
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">{t("map.viewHint")}</p>
          <GraphViewToggle activeView={activeView} onViewChange={setActiveView} />
        </div>
      </section>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-label={t("map.canvas")}
          className="border-border bg-card/40 m-4 min-h-[28rem] overflow-hidden rounded-lg border"
          data-testid="graph-canvas"
        >
          {isGraphViewActive(activeView) ? (
            <GraphCanvas
              layout={localizedLayout}
              selectedNodeId={activeSelectedNodeId}
              highlightedNodeIds={activeHighlightedNodeIds}
              nodeStatuses={nodeStatuses}
              onNodeSelect={handleNodeSelect}
            />
          ) : (
            <GraphViewStubState view={activeView} />
          )}
        </section>
        <aside
          aria-label={t("map.selectedNode")}
          className="border-border bg-sidebar border-t lg:border-t-0 lg:border-l"
        >
          <NodeSidePanel
            node={selectedNode}
            nodes={nodes}
            nodesById={nodesById}
            labs={labs}
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
