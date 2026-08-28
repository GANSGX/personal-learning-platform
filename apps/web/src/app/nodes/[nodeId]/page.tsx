import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { loadCurriculum, loadLessonByNodeId } from "@plp/content";

import { Badge } from "@/components/ui/badge";
import { LessonProgressActions } from "@/components/lesson-progress-actions";
import { LessonVisualizations } from "@/components/lesson-visualizations";
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

  const { LessonBody } = await import("@/components/lesson-body");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 lg:px-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to knowledge map
      </Link>
      <div className="mt-6 space-y-3">
        <Badge variant="secondary">{lesson.metadata.level}</Badge>
        <h2 className="text-foreground text-2xl font-medium" data-testid="lesson-title">
          {lesson.metadata.title}
        </h2>
        <p className="text-muted-foreground text-sm">{lesson.metadata.id}</p>
      </div>
      <main className="mt-8 flex-1 space-y-8">
        <LessonVisualizations visualizationIds={lesson.metadata.visualizations} />
        <LessonBody source={lesson.body} />
        <LessonProgressActions nodeId={lesson.metadata.id} />
      </main>
    </div>
  );
}
