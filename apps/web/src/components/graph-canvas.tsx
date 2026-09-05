"use client";

import {
  Background,
  Controls,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

import "@xyflow/react/dist/style.css";

import type { KnowledgeLevel, NodeStatus } from "@plp/domain";

import { KnowledgeGraphNode } from "./knowledge-graph-node";

type GraphCanvasLayout = {
  nodes: Array<{
    id: string;
    title: string;
    level: KnowledgeLevel;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  edges: Array<{ id: string; source: string; target: string }>;
};

const nodeTypes = {
  knowledge: KnowledgeGraphNode,
} satisfies NodeTypes;

function subscribeToClient() {
  return () => {
    // React Flow measures the pane after mount; server HTML cannot match.
  };
}

function clientSnapshot() {
  return true;
}

function serverSnapshot() {
  return false;
}

function GraphCameraController({
  targetNodeId,
  layoutNodes,
}: {
  targetNodeId: string | null;
  layoutNodes: GraphCanvasLayout["nodes"];
}) {
  const { setCenter } = useReactFlow();
  const prevTargetRef = useRef<string | null>(null);

  useEffect(() => {
    const target =
      (targetNodeId ? layoutNodes.find((n) => n.id === targetNodeId) : null) ?? layoutNodes[0];
    if (!target) {
      return;
    }

    const isInitial = prevTargetRef.current === null;
    prevTargetRef.current = target.id;

    const centerX = target.x + target.width / 2;
    const centerY = target.y + target.height / 2;

    void setCenter(centerX, centerY, {
      zoom: 1.05,
      duration: isInitial ? 0 : 500,
    });
  }, [targetNodeId, layoutNodes, setCenter]);

  return null;
}

type GraphCanvasProps = {
  layout: GraphCanvasLayout;
  selectedNodeId?: string | null;
  highlightedNodeIds?: readonly string[];
  nodeStatuses: ReadonlyMap<string, NodeStatus>;
  onNodeSelect?: (nodeId: string) => void;
};

export function GraphCanvas({
  layout,
  selectedNodeId = null,
  highlightedNodeIds = [],
  nodeStatuses,
  onNodeSelect,
}: GraphCanvasProps) {
  const isClient = useSyncExternalStore(subscribeToClient, clientSnapshot, serverSnapshot);
  const highlightedSet = useMemo(() => new Set(highlightedNodeIds), [highlightedNodeIds]);

  const nodes = useMemo(
    () =>
      layout.nodes.map((node): Node => ({
        id: node.id,
        type: "knowledge",
        position: { x: node.x, y: node.y },
        data: {
          title: node.title,
          level: node.level,
          status: nodeStatuses.get(node.id) ?? "LOCKED",
          highlighted: highlightedSet.has(node.id),
          onSelect: () => {
            onNodeSelect?.(node.id);
          },
        },
        width: node.width,
        height: node.height,
        selected: node.id === selectedNodeId,
      })),
    [layout, onNodeSelect, selectedNodeId, nodeStatuses, highlightedSet],
  );

  const edges = useMemo(
    () =>
      layout.edges.map((edge): Edge => {
        const highlighted = highlightedSet.has(edge.source) && highlightedSet.has(edge.target);

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          ...(highlighted ? { style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } } : {}),
        };
      }),
    [layout, highlightedSet],
  );

  if (layout.nodes.length === 0) {
    return (
      <div className="flex h-full min-h-[28rem] items-center justify-center p-8 text-center">
        <div className="max-w-md space-y-2">
          <p className="text-foreground text-sm font-medium">Empty graph</p>
          <p className="text-muted-foreground text-sm">
            Add MDX lessons under <code className="text-foreground">content/</code> and they will
            appear here after validation.
          </p>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return <div className="h-full min-h-[28rem]" aria-busy="true" />;
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      minZoom={0.2}
      maxZoom={2}
      nodesConnectable={false}
      nodesDraggable={false}
      panOnScroll
      colorMode="dark"
      onNodeClick={(_event, node) => {
        onNodeSelect?.(node.id);
      }}
    >
      <GraphCameraController targetNodeId={selectedNodeId} layoutNodes={layout.nodes} />
      <Background gap={18} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
