"use client";

import { type Node, type NodeProps, Handle, Position } from "@xyflow/react";

import type { KnowledgeLevel, NodeStatus } from "@plp/domain";

import { useI18n } from "@/lib/i18n/i18n-context";
import type { MessageKey } from "@/lib/i18n/messages";
import { getNodeStatusClassName } from "@/lib/node-status-styles";

const statusKeys = {
  LOCKED: "status.LOCKED",
  AVAILABLE: "status.AVAILABLE",
  IN_PROGRESS: "status.IN_PROGRESS",
  THEORY_COMPLETE: "status.THEORY_COMPLETE",
  PRACTICE_COMPLETE: "status.PRACTICE_COMPLETE",
  MASTERED: "status.MASTERED",
} as const satisfies Record<NodeStatus, MessageKey>;

const levelKeys = {
  foundation: "level.foundation",
  infrastructure: "level.infrastructure",
  security: "level.security",
  osint: "level.osint",
} as const satisfies Record<KnowledgeLevel, MessageKey>;

type KnowledgeGraphNodeData = {
  title: string;
  level: KnowledgeLevel;
  status: NodeStatus;
  highlighted: boolean;
  onSelect?: () => void;
};

export function KnowledgeGraphNode({
  id,
  data,
  selected,
}: NodeProps<Node<KnowledgeGraphNodeData>>) {
  const { t } = useI18n();
  const isLocked = data.status === "LOCKED";
  const levelLabel = t(levelKeys[data.level]);
  const statusLabel = t(statusKeys[data.status]);

  return (
    <button
      type="button"
      data-testid={`graph-node-${id}`}
      data-node-status={data.status}
      aria-pressed={selected}
      aria-label={`${data.title}, ${levelLabel}, ${statusLabel}`}
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
      <p className="text-[0.65rem] tracking-[0.16em] uppercase opacity-80">{levelLabel}</p>
      <p className="text-sm leading-tight font-medium">{data.title}</p>
      <p className="text-muted-foreground mt-1 text-[0.65rem] tracking-[0.12em] uppercase">
        {statusLabel}
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
