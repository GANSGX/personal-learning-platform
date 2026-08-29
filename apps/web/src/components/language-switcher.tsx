"use client";

import { locales } from "@/lib/i18n/locale";
import { useI18n } from "@/lib/i18n/i18n-context";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={className ?? "flex items-center gap-1"}
      data-testid="locale-switcher"
      role="group"
      aria-label={t("locale.switcher")}
    >
      {locales.map((item) => {
        const selected = item === locale;

        return (
          <button
            key={item}
            aria-pressed={selected}
            className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              selected
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-testid={`locale-${item}`}
            onClick={() => {
              setLocale(item);
            }}
            type="button"
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
