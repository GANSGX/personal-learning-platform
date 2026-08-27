"use client";

import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import { useMemo, useSyncExternalStore } from "react";

import "@xyflow/react/dist/style.css";

import { KnowledgeGraphNode } from "./knowledge-graph-node";

type GraphCanvasLayout = {
  nodes: Array<{
    id: string;
    title: string;
    level: string;
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

export function GraphCanvas({ layout }: { layout: GraphCanvasLayout }) {
  const isClient = useSyncExternalStore(subscribeToClient, clientSnapshot, serverSnapshot);

  const nodes = useMemo(
    () =>
      layout.nodes.map((node): Node => ({
        id: node.id,
        type: "knowledge",
        position: { x: node.x, y: node.y },
        data: { title: node.title, level: node.level },
        width: node.width,
        height: node.height,
      })),
    [layout],
  );

  const edges = useMemo(
    () =>
      layout.edges.map((edge): Edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
      })),
    [layout],
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
      fitView
      minZoom={0.4}
      nodesConnectable={false}
      nodesDraggable={false}
      panOnScroll
      colorMode="dark"
    >
      <Background gap={18} size={1} />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
}
