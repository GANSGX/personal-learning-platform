export type LessonLocale = "ru" | "en";

export const defaultLessonLocale: LessonLocale = "ru";

const localeSuffixPattern = /\.([a-z]{2})\.mdx$/i;

export function isLocaleSpecificLessonFilename(filename: string): boolean {
  return localeSuffixPattern.test(filename);
}

export function lessonFileLocale(filename: string): LessonLocale | null {
  const match = localeSuffixPattern.exec(filename);

  if (match?.[1] === undefined) {
    return null;
  }

  const suffix = match[1].toLowerCase();

  if (suffix === "en") {
    return "en";
  }

  if (suffix === "ru") {
    return "ru";
  }

  return null;
}
