import { Waypoints } from "lucide-react";

import { GraphCanvas } from "@/components/graph-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { loadGraphLayout } from "@/lib/load-graph-layout";

export default async function HomePage() {
  const layout = await loadGraphLayout();

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
      <main className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section
          aria-label="Knowledge graph canvas"
          className="border-border bg-card/40 m-4 min-h-[28rem] overflow-hidden rounded-lg border"
        >
          <GraphCanvas layout={layout} />
        </section>
        <aside
          aria-label="Selected node"
          className="border-border bg-sidebar border-t lg:border-t-0 lg:border-l"
        >
          <Card className="h-full rounded-none border-0 bg-transparent ring-0">
            <CardHeader>
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Node</p>
              <CardTitle>No node selected</CardTitle>
              <CardDescription>
                Theory, visualization, practice, and checkpoint will open here.
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Select a node on the map to inspect it.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
