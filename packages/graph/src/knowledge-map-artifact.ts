import { knowledgeLevelSchema, knowledgeNodeMetadataSchema } from "@plp/domain";
import { z } from "zod";

const curriculumLayoutNodeSchema = z.object({
  id: z.string(),
  title: z.string(),
  level: knowledgeLevelSchema,
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

const curriculumLayoutEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export const knowledgeMapArtifactSchema = z.object({
  contentHash: z.string().min(1),
  generatedAt: z.iso.datetime(),
  nodes: z.array(knowledgeNodeMetadataSchema),
  layout: z.object({
    nodes: z.array(curriculumLayoutNodeSchema),
    edges: z.array(curriculumLayoutEdgeSchema),
  }),
});

export type KnowledgeMapArtifact = z.infer<typeof knowledgeMapArtifactSchema>;

export function parseKnowledgeMapArtifact(value: unknown): KnowledgeMapArtifact {
  return knowledgeMapArtifactSchema.parse(value);
}
