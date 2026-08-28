"use client";

import { useMemo, useState } from "react";

import type { KnowledgeNodeMetadata } from "@plp/domain";
import type { CurriculumLayout } from "@plp/graph";

import { GraphCanvas } from "@/components/graph-canvas";
import { NodeSidePanel } from "@/components/node-side-panel";

type KnowledgeMapShellProps = {
  layout: CurriculumLayout;
  nodes: KnowledgeNodeMetadata[];
};

export function KnowledgeMapShell({ layout, nodes }: KnowledgeMapShellProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const selectedNode = selectedNodeId ? nodesById.get(selectedNodeId) : undefined;

  return (
    <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section
        aria-label="Knowledge graph canvas"
        className="border-border bg-card/40 m-4 min-h-[28rem] overflow-hidden rounded-lg border"
      >
        <GraphCanvas
          layout={layout}
          selectedNodeId={selectedNodeId}
          onNodeSelect={setSelectedNodeId}
        />
      </section>
      <aside
        aria-label="Selected node"
        className="border-border bg-sidebar border-t lg:border-t-0 lg:border-l"
      >
        <NodeSidePanel node={selectedNode} nodesById={nodesById} />
      </aside>
    </main>
  );
}
