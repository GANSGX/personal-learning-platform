import { KnowledgeMapShell } from "@/components/knowledge-map-shell";
import { loadKnowledgeMap } from "@/lib/load-knowledge-map";

export default async function HomePage() {
  const { layout, layouts, nodes, labs } = await loadKnowledgeMap();

  return (
    <KnowledgeMapShell foundationLayout={layout} layouts={layouts} nodes={nodes} labs={labs} />
  );
}
