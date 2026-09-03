"use client";

import type { KnowledgeLevel } from "@plp/domain";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/i18n-context";
import type { MessageKey } from "@/lib/i18n/messages";

const levelKeys = {
  foundation: "level.foundation",
  infrastructure: "level.infrastructure",
  security: "level.security",
  osint: "level.osint",
} as const satisfies Record<KnowledgeLevel, MessageKey>;

type LessonLocaleViewProps = {
  nodeId: string;
  level: KnowledgeLevel;
  titleRu: string;
  titleEn: string;
  ruBody: ReactNode;
  enBody: ReactNode;
  visualizations: ReactNode;
  actions: ReactNode;
};

export function LessonLocaleView({
  nodeId,
  level,
  titleRu,
  titleEn,
  ruBody,
  enBody,
  visualizations,
  actions,
}: LessonLocaleViewProps) {
  const { locale, t } = useI18n();
  const title = locale === "en" ? titleEn : titleRu;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 lg:px-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("lesson.backToMap")}
      </Link>
      <div className="mt-6 space-y-3">
        <Badge variant="secondary">{t(levelKeys[level])}</Badge>
        <h2 className="text-foreground text-2xl font-medium" data-testid="lesson-title">
          {title}
        </h2>
        <p className="text-muted-foreground text-sm">{nodeId}</p>
      </div>
      <section aria-label={title} className="mt-8 flex-1 space-y-8">
        {visualizations}
        {locale === "en" ? enBody : ruBody}
        {actions}
      </section>
    </div>
  );
}
