# 0001. React Flow + ELK for the knowledge graph canvas

## Status

Accepted

## Context

The map is a DAG of `KnowledgeNode` metadata from MDX, not a hardcoded diagram. Spec §15 names React Flow and ELK.js. Layout is a graph algorithm; rendering is UI. `packages/graph` must stay free of React.

## Decision

- `@plp/graph` owns validation and ELK layout (`elkjs`). Input is domain metadata; output is positions and `requires` edges.
- `apps/web` renders that layout with `@xyflow/react`. The client never imports ELK or talks to the filesystem.
- Lesson text stays in `content/**/*.mdx`. Nodes on the canvas show title and level only.

## Consequences

- Adding a lesson file is enough for it to appear on `/` after validate + layout.
- Zero MDX nodes render an empty canvas, not an error.
- React Flow is client-only. It measures the pane and `fitView` after mount, so server HTML cannot match.
- View modes (Infrastructure, Security, …) and the lesson MDX route are separate issues.
