"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/i18n-context";

export default function LessonNotFound() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-foreground text-2xl font-medium">{t("lesson.notFoundTitle")}</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-sm">{t("lesson.notFoundBody")}</p>
      <Link href="/" className="text-primary mt-6 text-sm underline-offset-4 hover:underline">
        {t("lesson.backToMap")}
      </Link>
    </div>
  );
}
