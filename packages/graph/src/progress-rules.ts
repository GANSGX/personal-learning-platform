import type { KnowledgeNodeMetadata, NodeStatus, Progress } from "@plp/domain";
import { createEmptyNodeProgress, deriveNodeStatusFromFlags } from "@plp/domain";

export type LockReason = {
  nodeId: string;
  title: string;
  mastered: boolean;
};

export class GraphPathError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GraphPathError";
  }
}

function buildNodesById(
  nodes: readonly KnowledgeNodeMetadata[],
): Map<string, KnowledgeNodeMetadata> {
  return new Map(nodes.map((node) => [node.id, node]));
}

function getNodeProgress(progress: Progress, nodeId: string) {
  return progress.nodes[nodeId] ?? createEmptyNodeProgress();
}

export function resolveNodeStatus(
  nodeId: string,
  nodes: readonly KnowledgeNodeMetadata[],
  progress: Progress,
): NodeStatus {
  const nodesById = buildNodesById(nodes);
  const node = nodesById.get(nodeId);

  if (node === undefined) {
    throw new GraphPathError(`Unknown node: ${nodeId}`);
  }

  for (const requiredId of node.requires) {
    const requiredStatus = resolveNodeStatus(requiredId, nodes, progress);
    if (requiredStatus !== "MASTERED") {
      return "LOCKED";
    }
  }

  return deriveNodeStatusFromFlags(getNodeProgress(progress, nodeId));
}

export function collectAncestorIds(
  targetId: string,
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>,
): Set<string> {
  const ancestors = new Set<string>();

  function visit(nodeId: string) {
    const node = nodesById.get(nodeId);
    if (node === undefined) {
      throw new GraphPathError(`Unknown node: ${nodeId}`);
    }

    for (const requiredId of node.requires) {
      if (!ancestors.has(requiredId)) {
        ancestors.add(requiredId);
        visit(requiredId);
      }
    }
  }

  visit(targetId);
  return ancestors;
}

export function topologicalSort(
  nodeIds: Iterable<string>,
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>,
): string[] {
  const ids = [...nodeIds];
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  function visit(nodeId: string) {
    if (visited.has(nodeId)) {
      return;
    }

    if (visiting.has(nodeId)) {
      throw new GraphPathError(`Cycle detected at ${nodeId}`);
    }

    visiting.add(nodeId);
    const node = nodesById.get(nodeId);

    if (node !== undefined) {
      for (const requiredId of node.requires) {
        if (ids.includes(requiredId)) {
          visit(requiredId);
        }
      }
    }

    visiting.delete(nodeId);
    visited.add(nodeId);
    sorted.push(nodeId);
  }

  for (const nodeId of ids) {
    visit(nodeId);
  }

  return sorted;
}

export function getPrerequisiteChain(
  targetId: string,
  nodes: readonly KnowledgeNodeMetadata[],
): string[] {
  const nodesById = buildNodesById(nodes);

  if (!nodesById.has(targetId)) {
    throw new GraphPathError(`Unknown node: ${targetId}`);
  }

  const ancestors = collectAncestorIds(targetId, nodesById);
  const orderedAncestors = topologicalSort(ancestors, nodesById);
  return [...orderedAncestors, targetId];
}

export function getLockReasons(
  nodeId: string,
  nodes: readonly KnowledgeNodeMetadata[],
  progress: Progress,
): LockReason[] {
  const nodesById = buildNodesById(nodes);
  const node = nodesById.get(nodeId);

  if (node === undefined) {
    throw new GraphPathError(`Unknown node: ${nodeId}`);
  }

  return node.requires.map((requiredId) => ({
    nodeId: requiredId,
    title: nodesById.get(requiredId)?.title ?? requiredId,
    mastered: resolveNodeStatus(requiredId, nodes, progress) === "MASTERED",
  }));
}

export function findLearningPath(
  targetId: string,
  nodes: readonly KnowledgeNodeMetadata[],
  progress: Progress,
): string[] {
  const chain = getPrerequisiteChain(targetId, nodes);

  return chain.filter((id) => resolveNodeStatus(id, nodes, progress) !== "MASTERED");
}

export function resolveAllNodeStatuses(
  nodes: readonly KnowledgeNodeMetadata[],
  progress: Progress,
): Map<string, NodeStatus> {
  const statuses = new Map<string, NodeStatus>();

  for (const node of nodes) {
    statuses.set(node.id, resolveNodeStatus(node.id, nodes, progress));
  }

  return statuses;
}
