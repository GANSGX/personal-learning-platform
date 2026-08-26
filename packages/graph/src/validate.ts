import type { KnowledgeNodeMetadata, Track } from "@plp/domain";

export type ValidationIssue = {
  code:
    | "duplicate-id"
    | "missing-prerequisite"
    | "broken-unlock"
    | "broken-related"
    | "invalid-visualization"
    | "invalid-lab"
    | "invalid-track-node"
    | "cycle"
    | "orphan-lesson";
  message: string;
};

export type ValidateCurriculumInput = {
  nodes: readonly KnowledgeNodeMetadata[];
  tracks?: readonly Track[];
  visualizationIds?: ReadonlySet<string>;
  labIds?: ReadonlySet<string>;
};

export function validateCurriculum(input: ValidateCurriculumInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seen = new Map<string, number>();

  for (const node of input.nodes) {
    const count = seen.get(node.id) ?? 0;
    seen.set(node.id, count + 1);
  }

  for (const [id, count] of seen) {
    if (count > 1) {
      issues.push({
        code: "duplicate-id",
        message: `Duplicate node id: ${id}`,
      });
    }
  }

  const ids = new Set(seen.keys());

  for (const node of input.nodes) {
    for (const required of node.requires) {
      if (!ids.has(required)) {
        issues.push({
          code: "missing-prerequisite",
          message: `${node.id} requires missing node ${required}`,
        });
      }
    }

    for (const unlocked of node.unlocks) {
      if (!ids.has(unlocked)) {
        issues.push({
          code: "broken-unlock",
          message: `${node.id} unlocks missing node ${unlocked}`,
        });
      }
    }

    for (const related of node.relatedTo) {
      if (!ids.has(related)) {
        issues.push({
          code: "broken-related",
          message: `${node.id} related-to missing node ${related}`,
        });
      }
    }

    if (input.visualizationIds) {
      for (const visualization of node.visualizations) {
        if (!input.visualizationIds.has(visualization)) {
          issues.push({
            code: "invalid-visualization",
            message: `${node.id} references unknown visualization ${visualization}`,
          });
        }
      }
    }

    if (input.labIds) {
      for (const lab of node.labs) {
        if (!input.labIds.has(lab)) {
          issues.push({
            code: "invalid-lab",
            message: `${node.id} references unknown lab ${lab}`,
          });
        }
      }
    }
  }

  issues.push(...detectRequiresCycles(input.nodes));

  if (input.tracks) {
    const referenced = new Set<string>();
    for (const track of input.tracks) {
      for (const nodeId of track.nodeIds) {
        referenced.add(nodeId);
        if (!ids.has(nodeId)) {
          issues.push({
            code: "invalid-track-node",
            message: `Track ${track.id} references missing node ${nodeId}`,
          });
        }
      }
    }

    for (const id of ids) {
      if (!referenced.has(id)) {
        issues.push({
          code: "orphan-lesson",
          message: `Node ${id} is not part of any track`,
        });
      }
    }
  }

  return issues;
}

function detectRequiresCycles(nodes: readonly KnowledgeNodeMetadata[]): ValidationIssue[] {
  const adjacency = new Map<string, readonly string[]>();
  for (const node of nodes) {
    adjacency.set(node.id, node.requires);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const issues: ValidationIssue[] = [];

  const visit = (id: string, stack: string[]): void => {
    if (visited.has(id)) {
      return;
    }
    if (visiting.has(id)) {
      const cycleStart = stack.indexOf(id);
      const cycle = cycleStart === -1 ? [...stack, id] : [...stack.slice(cycleStart), id];
      issues.push({
        code: "cycle",
        message: `Curriculum dependency cycle detected:\n${cycle.join("\n→ ")}`,
      });
      return;
    }

    visiting.add(id);
    for (const next of adjacency.get(id) ?? []) {
      visit(next, [...stack, id]);
    }
    visiting.delete(id);
    visited.add(id);
  };

  for (const node of nodes) {
    visit(node.id, []);
  }

  return issues;
}
