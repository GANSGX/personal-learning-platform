"use client";

import { type Node, type NodeProps, Handle, Position } from "@xyflow/react";

import type { KnowledgeLevel, NodeStatus, NodeTrack } from "@plp/domain";
import { resolveNodeTrack } from "@plp/domain";

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

const trackKeys: Record<NodeTrack, MessageKey> = {
  networking: "track.networking",
  os: "track.os",
  linux: "track.linux",
  windows: "track.windows",
  infrastructure: "track.infrastructure",
  security: "track.security",
  osint: "track.osint",
};

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
  const track = resolveNodeTrack(id);
  const trackLabel = t(trackKeys[track]);
  const statusLabel = t(statusKeys[data.status]);

  return (
    <button
      type="button"
      data-testid={`graph-node-${id}`}
      data-node-status={data.status}
      aria-pressed={selected}
      aria-label={`${data.title}, ${trackLabel}, ${statusLabel}`}
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-lg border p-2.5 text-left shadow-sm transition-colors ${getNodeStatusClassName(data.status)} ${
        selected ? "ring-ring ring-2" : ""
      } ${data.highlighted ? "ring-primary ring-2" : ""} ${isLocked ? "opacity-80" : ""}`}
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
      <div className="flex items-center justify-between gap-1">
        <span className="text-muted-foreground text-[0.65rem] font-semibold tracking-wider uppercase">
          {trackLabel}
        </span>
      </div>
      <div className="my-auto py-0.5">
        <p
          className="text-foreground line-clamp-2 text-xs leading-snug font-semibold"
          title={data.title}
        >
          {data.title}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[0.65rem] font-medium tracking-wide uppercase">
          {statusLabel}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-muted-foreground pointer-events-none"
        aria-hidden="true"
      />
    </button>
  );
}
