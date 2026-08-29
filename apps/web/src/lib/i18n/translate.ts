import { messages, type MessageKey } from "./messages.ts";
import type { Locale } from "./locale.ts";

export function translate(locale: Locale, key: MessageKey): string {
  return messages[locale][key];
}
