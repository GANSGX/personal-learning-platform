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

export const progressSchema = z.object({
  userId: z.string().min(1),
  nodes: z.record(z.string(), nodeStatusSchema),
});

export type Progress = z.infer<typeof progressSchema>;

export type ProgressRepository = {
  getProgress: (userId: string) => Promise<Progress>;
  saveProgress: (progress: Progress) => Promise<void>;
};
