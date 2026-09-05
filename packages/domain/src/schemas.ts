import { z } from "zod";

export const nodeStatusSchema = z.enum([
  "LOCKED",
  "AVAILABLE",
  "IN_PROGRESS",
  "THEORY_COMPLETE",
  "PRACTICE_COMPLETE",
  "MASTERED",
]);

export type NodeStatus = z.infer<typeof nodeStatusSchema>;

export const knowledgeLevelSchema = z.enum(["foundation", "infrastructure", "security", "osint"]);

export type KnowledgeLevel = z.infer<typeof knowledgeLevelSchema>;

export const nodeTrackSchema = z.enum([
  "networking",
  "os",
  "linux",
  "windows",
  "infrastructure",
  "security",
  "osint",
]);

export type NodeTrack = z.infer<typeof nodeTrackSchema>;

export function resolveNodeTrack(nodeId: string): NodeTrack {
  if (
    nodeId.startsWith("networking.") ||
    nodeId.startsWith("netadv.") ||
    nodeId.startsWith("web.")
  ) {
    return "networking";
  }
  if (nodeId.startsWith("os.")) {
    return "os";
  }
  if (nodeId.startsWith("linux.") || nodeId.startsWith("automation.")) {
    return "linux";
  }
  if (nodeId.startsWith("windows.")) {
    return "windows";
  }
  if (
    nodeId.startsWith("devops.") ||
    nodeId.startsWith("containers.") ||
    nodeId.startsWith("infra.")
  ) {
    return "infrastructure";
  }
  if (nodeId.startsWith("security.") || nodeId.startsWith("crypto.")) {
    return "security";
  }
  if (nodeId.startsWith("osint.")) {
    return "osint";
  }
  return "networking";
}

export const graphViewModeSchema = z.enum([
  "networking",
  "os",
  "linux",
  "windows",
  "infrastructure",
  "security",
  "osint",
  "foundation",
  "full",
  "my-path",
]);

export type GraphViewMode = z.infer<typeof graphViewModeSchema>;

export const edgeTypeSchema = z.enum([
  "requires",
  "unlocks",
  "related-to",
  "used-by",
  "practice-for",
  "part-of",
  "alternative-to",
]);

export type EdgeType = z.infer<typeof edgeTypeSchema>;

export const nodeIdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/, "Node id must be dotted or hyphenated lowercase");

export const knowledgeNodeMetadataSchema = z.object({
  id: nodeIdSchema,
  title: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  level: knowledgeLevelSchema,
  requires: z.array(nodeIdSchema).default([]),
  unlocks: z.array(nodeIdSchema).default([]),
  relatedTo: z.array(nodeIdSchema).default([]),
  visualizations: z.array(z.string().min(1)).default([]),
  labs: z.array(z.string().min(1)).default([]),
});

export type KnowledgeNodeMetadata = z.infer<typeof knowledgeNodeMetadataSchema>;

export const edgeSchema = z.object({
  from: nodeIdSchema,
  to: nodeIdSchema,
  type: edgeTypeSchema,
});

export type Edge = z.infer<typeof edgeSchema>;

export const trackSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  nodeIds: z.array(nodeIdSchema).min(1),
});

export type Track = z.infer<typeof trackSchema>;

export const labSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  description: z.string().optional(),
  environment: z.string().default("Cisco Packet Tracer"),
  goal: z.string().min(1),
  topology: z.string().optional(),
  checklist: z.array(z.string()).default([]),
  body: z.string().optional(),
});

export type Lab = z.infer<typeof labSchema>;

export const nodeProgressRecordSchema = z.object({
  started: z.boolean().default(false),
  theoryComplete: z.boolean().default(false),
  practiceComplete: z.boolean().default(false),
  checkpointComplete: z.boolean().default(false),
});

export type NodeProgressRecord = z.infer<typeof nodeProgressRecordSchema>;

export const progressSchema = z.object({
  userId: z.string().min(1),
  nodes: z.record(z.string(), nodeProgressRecordSchema),
});

export type Progress = z.infer<typeof progressSchema>;

export type ProgressRepository = {
  getProgress: (userId: string) => Promise<Progress>;
  saveProgress: (progress: Progress) => Promise<void>;
};
