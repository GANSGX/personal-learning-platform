import type { Locale } from "./locale.ts";

type TitledNode = {
  title: string;
  titleEn?: string | undefined;
};

export function localizedNodeTitle(
  node: TitledNode | undefined,
  locale: Locale,
  fallback: string,
): string {
  if (node === undefined) {
    return fallback;
  }

  if (locale === "en" && node.titleEn !== undefined) {
    return node.titleEn;
  }

  return node.title;
}
