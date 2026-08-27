import type { KnowledgeLevel, KnowledgeNodeMetadata } from "@plp/domain";
import ElkBundled from "elkjs/lib/elk.bundled.js";

const NODE_WIDTH = 180;
const NODE_HEIGHT = 56;

type ElkLayoutResult = {
  children?: Array<{ id?: string; x?: number; y?: number }>;
};

type ElkInstance = {
  layout: (graph: {
    id: string;
    layoutOptions: Record<string, string>;
    children: Array<{ id: string; width: number; height: number }>;
    edges: Array<{ id: string; sources: string[]; targets: string[] }>;
  }) => Promise<ElkLayoutResult>;
};

function isElkConstructor(value: unknown): value is new () => ElkInstance {
  return typeof value === "function";
}

function createElk(): ElkInstance {
  if (!isElkConstructor(ElkBundled)) {
    throw new Error("elkjs did not export a constructor");
  }

  return new ElkBundled();
}

export type CurriculumLayoutNode = {
  id: string;
  title: string;
  level: KnowledgeLevel;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CurriculumLayoutEdge = {
  id: string;
  source: string;
  target: string;
};

export type CurriculumLayout = {
  nodes: CurriculumLayoutNode[];
  edges: CurriculumLayoutEdge[];
};

export function requiresEdges(nodes: readonly KnowledgeNodeMetadata[]): CurriculumLayoutEdge[] {
  const edges: CurriculumLayoutEdge[] = [];

  for (const node of nodes) {
    for (const required of node.requires) {
      edges.push({
        id: `${required}->${node.id}`,
        source: required,
        target: node.id,
      });
    }
  }

  return edges;
}

export function readElkPositions(
  children?: ReadonlyArray<{ id?: string; x?: number; y?: number }>,
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  for (const child of children ?? []) {
    if (child.id === undefined) {
      continue;
    }

    positions.set(child.id, { x: child.x ?? 0, y: child.y ?? 0 });
  }

  return positions;
}

export function toLayoutNodes(
  nodes: readonly KnowledgeNodeMetadata[],
  positions: ReadonlyMap<string, { x: number; y: number }>,
): CurriculumLayoutNode[] {
  return nodes.map((node) => {
    const position = positions.get(node.id) ?? { x: 0, y: 0 };
    return {
      id: node.id,
      title: node.title,
      level: node.level,
      x: position.x,
      y: position.y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    };
  });
}

export async function layoutCurriculum(
  nodes: readonly KnowledgeNodeMetadata[],
): Promise<CurriculumLayout> {
  const edges = requiresEdges(nodes);

  if (nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  const elk = createElk();
  const graph = await elk.layout({
    id: "curriculum",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.spacing.nodeNode": "48",
      "elk.layered.spacing.nodeNodeBetweenLayers": "72",
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  });

  return {
    nodes: toLayoutNodes(nodes, readElkPositions(graph.children)),
    edges,
  };
}
