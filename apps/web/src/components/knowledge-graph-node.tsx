"use client";

import { type Node, type NodeProps, Handle, Position } from "@xyflow/react";

type KnowledgeGraphNodeData = {
  title: string;
  level: string;
  onSelect?: () => void;
};

export function KnowledgeGraphNode({
  id,
  data,
  selected,
}: NodeProps<Node<KnowledgeGraphNodeData>>) {
  return (
    <button
      type="button"
      data-testid={`graph-node-${id}`}
      aria-pressed={selected}
      aria-label={`${data.title}, ${data.level} level`}
      className={`border-border bg-card text-card-foreground h-full w-full rounded-md border px-3 py-2 text-left shadow-sm ${
        selected ? "ring-ring ring-2" : ""
      }`}
      onClick={(event) => {
        event.stopPropagation();
        data.onSelect?.();
      }}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
      <p className="text-muted-foreground text-[0.65rem] tracking-[0.16em] uppercase">
        {data.level}
      </p>
      <p className="text-sm leading-tight font-medium">{data.title}</p>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
    </button>
  );
}
