import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { loadCurriculum, loadLessonByNodeId } from "@plp/content";

import { LessonBody } from "@/components/lesson-body";
import { Badge } from "@/components/ui/badge";
import { getContentRoot } from "@/lib/content-root";

type LessonPageProps = {
  params: Promise<{ nodeId: string }>;
};

export async function generateStaticParams() {
  const nodes = await loadCurriculum(getContentRoot());
  return nodes.map((node) => ({ nodeId: node.id }));
}

export async function generateMetadata({ params }: LessonPageProps) {
  const { nodeId } = await params;
  const lesson = await loadLessonByNodeId(getContentRoot(), nodeId);

  if (lesson === null) {
    return { title: "Lesson not found" };
  }

  return { title: `${lesson.metadata.title} · Personal Learning Platform` };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { nodeId } = await params;
  const lesson = await loadLessonByNodeId(getContentRoot(), nodeId);

  if (lesson === null) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border bg-sidebar border-b px-6 py-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to knowledge map
          </Link>
          <div className="space-y-3">
            <Badge variant="secondary">{lesson.metadata.level}</Badge>
            <h1 className="text-foreground text-2xl font-medium" data-testid="lesson-title">
              {lesson.metadata.title}
            </h1>
            <p className="text-muted-foreground text-sm">{lesson.metadata.id}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <LessonBody source={lesson.body} />
      </main>
    </div>
  );
}
