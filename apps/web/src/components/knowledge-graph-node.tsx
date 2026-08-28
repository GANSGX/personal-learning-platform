"use client";

import { type Node, type NodeProps, Handle, Position } from "@xyflow/react";

import type { NodeStatus } from "@plp/domain";

import { getNodeStatusClassName } from "@/lib/node-status-styles";

type KnowledgeGraphNodeData = {
  title: string;
  level: string;
  status: NodeStatus;
  highlighted: boolean;
  onSelect?: () => void;
};

export function KnowledgeGraphNode({
  id,
  data,
  selected,
}: NodeProps<Node<KnowledgeGraphNodeData>>) {
  const isLocked = data.status === "LOCKED";

  return (
    <button
      type="button"
      data-testid={`graph-node-${id}`}
      data-node-status={data.status}
      aria-pressed={selected}
      aria-label={`${data.title}, ${data.level} level, ${data.status.toLowerCase().replaceAll("_", " ")}`}
      disabled={isLocked}
      className={`h-full w-full rounded-md border px-3 py-2 text-left shadow-sm transition-colors ${getNodeStatusClassName(data.status)} ${
        selected ? "ring-ring ring-2" : ""
      } ${data.highlighted ? "ring-primary ring-2" : ""} ${isLocked ? "cursor-not-allowed opacity-70" : ""}`}
      onClick={(event) => {
        event.stopPropagation();
        if (!isLocked) {
          data.onSelect?.();
        }
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
      <p className="text-[0.65rem] tracking-[0.16em] uppercase opacity-80">{data.level}</p>
      <p className="text-sm leading-tight font-medium">{data.title}</p>
      <p className="text-muted-foreground mt-1 text-[0.65rem] tracking-[0.12em] uppercase">
        {data.status.replaceAll("_", " ")}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
    </button>
  );
}
