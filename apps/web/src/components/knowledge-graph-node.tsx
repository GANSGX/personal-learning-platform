"use client";

import { type Node, type NodeProps, Handle, Position } from "@xyflow/react";

type KnowledgeGraphNodeData = {
  title: string;
  level: string;
};

export function KnowledgeGraphNode({ id, data }: NodeProps<Node<KnowledgeGraphNodeData>>) {
  return (
    <div
      data-testid={`graph-node-${id}`}
      className="border-border bg-card text-card-foreground h-full w-full rounded-md border px-3 py-2 shadow-sm"
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-muted-foreground text-[0.65rem] tracking-[0.16em] uppercase">
        {data.level}
      </p>
      <p className="text-sm leading-tight font-medium">{data.title}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
