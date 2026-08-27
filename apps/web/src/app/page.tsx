import { Waypoints } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
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
          className="border-border bg-card/40 m-4 rounded-lg border border-dashed"
        >
          <div className="flex h-full min-h-[28rem] items-center justify-center p-8 text-center">
            <div className="max-w-md space-y-2">
              <p className="text-foreground text-sm font-medium">Graph canvas</p>
              <p className="text-muted-foreground text-sm">
                React Flow lands in a follow-up PR. This shell is the dark workspace for nodes,
                paths, and checkpoints.
              </p>
            </div>
          </div>
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
