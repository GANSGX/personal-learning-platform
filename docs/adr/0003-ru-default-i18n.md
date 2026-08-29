# 0003. Russian-default UI and lesson locales

## Status

Accepted

## Context

The product owner writes in Russian. Chrome, login, map, and fixture lessons were English-only.
Developer workflow stays English (Conventional Commits, PR titles, code identifiers).
The app is a static Cloudflare Pages export, so locale cannot depend on a server session.

## Decision

1. **Two locales:** `ru` (default) and `en`.
2. **No new i18n library.** Dictionaries and a client `I18nProvider` live in `apps/web`.
   Preference is stored in `localStorage` (`plp-locale`).
3. **Lesson MDX:** default file (`*.mdx`) is Russian and feeds the graph. English body is
   `*.en.mdx` with the same node id. `loadCurriculum` ignores locale-suffixed files so nodes
   are not duplicated.
4. **Node titles:** `title` is the default (Russian) label. Optional `titleEn` is the English
   label for the canvas and side panel.
5. **Visualizations** accept a `ru | en` locale from the web shell. They do not import Next.js.

## Consequences

- First paint is Russian. Users who chose English switch after hydration.
- `html[lang]` is `ru` in the static document and updates on the client.
- E2E asserts Russian copy unless the test switches locale.
- Adding a language later means a new dictionary, optional `*.xx.mdx` files, and a title field.

## Alternatives considered

| Option                         | Rejected because                               |
| ------------------------------ | ---------------------------------------------- |
| English-only + later translate | Owner-facing product is Russian first          |
| `next-intl` + `/ru` routes     | Extra dependency; clashes with static export   |
| Separate graph artifacts       | Same DAG; only labels and lesson bodies differ |
