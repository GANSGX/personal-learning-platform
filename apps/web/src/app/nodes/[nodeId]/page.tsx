import { notFound } from "next/navigation";

import { loadCurriculum, loadLessonByNodeId } from "@plp/content";

import { LessonLocaleView } from "@/components/lesson-locale-view";
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
  const lesson = await loadLessonByNodeId(getContentRoot(), nodeId, "ru");

  if (lesson === null) {
    return { title: "Урок не найден" };
  }

  return { title: `${lesson.metadata.title} · Платформа персонального обучения` };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { nodeId } = await params;
  const ruLesson = await loadLessonByNodeId(getContentRoot(), nodeId, "ru");

  if (ruLesson === null) {
    notFound();
  }

  const enLesson = await loadLessonByNodeId(getContentRoot(), nodeId, "en");
  const { LessonBody } = await import("@/components/lesson-body");

  return (
    <LessonLocaleView
      actions={<LessonProgressActions nodeId={ruLesson.metadata.id} />}
      enBody={<LessonBody source={enLesson?.body ?? ruLesson.body} />}
      level={ruLesson.metadata.level}
      nodeId={ruLesson.metadata.id}
      ruBody={<LessonBody source={ruLesson.body} />}
      titleEn={ruLesson.metadata.titleEn ?? enLesson?.metadata.title ?? ruLesson.metadata.title}
      titleRu={ruLesson.metadata.title}
      visualizations={<LessonVisualizations visualizationIds={ruLesson.metadata.visualizations} />}
    />
  );
}
