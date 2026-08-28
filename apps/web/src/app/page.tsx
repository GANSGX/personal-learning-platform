import { Waypoints } from "lucide-react";

import { KnowledgeMapShell } from "@/components/knowledge-map-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { loadKnowledgeMap } from "@/lib/load-knowledge-map";

export default async function HomePage() {
  const { layout, nodes } = await loadKnowledgeMap();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border bg-sidebar border-b px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="secondary">Foundation</Badge>
            <h1 className="text-foreground flex items-center gap-2 text-lg font-medium">
              <Waypoints aria-hidden="true" className="size-4" />
              Knowledge map
            </h1>
          </div>
          <Button variant="outline" type="button">
            My current path
          </Button>
        </div>
      </header>
      <KnowledgeMapShell layout={layout} nodes={nodes} />
    </div>
  );
}
