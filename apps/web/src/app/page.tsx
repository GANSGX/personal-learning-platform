import { KnowledgeMapShell } from "@/components/knowledge-map-shell";
import { loadKnowledgeMap } from "@/lib/load-knowledge-map";

export default async function HomePage() {
  const { layout, nodes } = await loadKnowledgeMap();

  return <KnowledgeMapShell foundationLayout={layout} nodes={nodes} />;
}
