"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  layouts = {},
  nodes,
  labs = {},
}: {
  foundationLayout: CurriculumLayout;
  layouts?: Record<string, CurriculumLayout>;
  nodes: readonly KnowledgeNodeMetadata[];
  labs?: Record<string, Lab>;
}) {
  const { t, locale } = useI18n();
  const { progress, markStarted } = useProgressContext();
  const searchParams = useSearchParams();
  const rawViewParam = searchParams.get("view");
  const viewParam =
    rawViewParam && isGraphViewActive(rawViewParam as GraphViewMode)
      ? (rawViewParam as GraphViewMode)
      : null;

  const [prevViewParam, setPrevViewParam] = useState(viewParam);
  const [activeView, setActiveView] = useState<GraphViewMode>(viewParam ?? "networking");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<readonly string[]>([]);

  if (viewParam !== prevViewParam) {
    setPrevViewParam(viewParam);
    if (viewParam) {
      setActiveView(viewParam);
    }
  }

  const visibleNodes = useMemo(
    () => (isGraphViewActive(activeView) ? filterNodesByView(nodes, activeView) : []),
    [activeView, nodes],
  );

  const nodesById = useMemo(
    () => new Map(visibleNodes.map((node) => [node.id, node])),
    [visibleNodes],
  );

  const nodeStatuses = useMemo(() => resolveAllNodeStatuses(nodes, progress), [nodes, progress]);

  const defaultFocusNodeId = useMemo(() => {
    if (visibleNodes.length === 0) {
      return null;
    }
    const inProgress = visibleNodes.find((n) => nodeStatuses.get(n.id) === "IN_PROGRESS");
    if (inProgress) {
      return inProgress.id;
    }
    const partiallyDone = visibleNodes.find((n) => {
      const s = nodeStatuses.get(n.id);
      return s === "THEORY_COMPLETE" || s === "PRACTICE_COMPLETE";
    });
    if (partiallyDone) {
      return partiallyDone.id;
    }
    const available = visibleNodes.find((n) => nodeStatuses.get(n.id) === "AVAILABLE");
    if (available) {
      return available.id;
    }
    return visibleNodes[0]?.id ?? null;
  }, [visibleNodes, nodeStatuses]);

  const activeSelectedNodeId =
    (selectedNodeId && nodesById.has(selectedNodeId) ? selectedNodeId : null) ?? defaultFocusNodeId;
  const activeHighlightedNodeIds = activeSelectedNodeId ? highlightedNodeIds : [];

  const currentRawLayout = layouts[activeView] ?? foundationLayout;
  const localizedLayout = useMemo(
    () => ({
      ...currentRawLayout,
      nodes: currentRawLayout.nodes.map((node) => ({
        ...node,
        title: localizedNodeTitle(
          nodes.find((item) => item.id === node.id),
          locale,
          node.title,
        ),
      })),
    }),
    [currentRawLayout, locale, nodes],
  );

  const selectedNode = activeSelectedNodeId ? nodesById.get(activeSelectedNodeId) : undefined;

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
            onSelectNode={handleNodeSelect}
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
