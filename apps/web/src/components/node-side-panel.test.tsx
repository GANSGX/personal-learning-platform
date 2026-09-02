import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import type { KnowledgeNodeMetadata } from "@plp/domain";

import { I18nProvider } from "@/lib/i18n/i18n-context";

import { NodeSidePanel } from "./node-side-panel.tsx";

// Mock progress context so we can test the panel without IndexedDB
vi.mock("@/lib/progress/progress-context", () => ({
  useProgressContext: () => ({
    progress: { userId: "test-user", nodes: {} },
    ready: true,
    markStarted: vi.fn(),
    markPracticeComplete: vi.fn(),
    markCheckpointComplete: vi.fn(),
  }),
}));

const mockNodes: KnowledgeNodeMetadata[] = [
  {
    id: "node.first",
    title: "Основы сетей",
    level: "foundation",
    requires: [],
    unlocks: ["node.second"],
    relatedTo: [],
    visualizations: ["packet-journey"],
    labs: [],
  },
  {
    id: "node.second",
    title: "Модель OSI",
    level: "foundation",
    requires: ["node.first"],
    unlocks: [],
    relatedTo: [],
    visualizations: [],
    labs: [],
  },
];

const nodesById = new Map(mockNodes.map((n) => [n.id, n]));

describe("NodeSidePanel", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders empty state placeholder when no node is selected", () => {
    render(
      <I18nProvider>
        <NodeSidePanel
          node={undefined}
          nodes={mockNodes}
          nodesById={nodesById}
          onShowPath={vi.fn()}
          onClearPath={vi.fn()}
        />
      </I18nProvider>,
    );

    expect(screen.getByText("Узел не выбран")).toBeTruthy();
    expect(screen.getByText("Выберите узел на карте, чтобы посмотреть его.")).toBeTruthy();
  });

  it("renders node details, prerequisites, and action buttons when node is selected", () => {
    const onShowPath = vi.fn();
    const onClearPath = vi.fn();

    render(
      <I18nProvider>
        <NodeSidePanel
          node={mockNodes[1]}
          nodes={mockNodes}
          nodesById={nodesById}
          onShowPath={onShowPath}
          onClearPath={onClearPath}
        />
      </I18nProvider>,
    );

    expect(screen.getByTestId("node-side-panel-title").textContent).toBe("Модель OSI");
    expect(screen.getAllByText("Основы сетей").length).toBeGreaterThanOrEqual(1);

    // Check action buttons by testid / text
    expect(screen.getByTestId("node-action-theory")).toBeTruthy();
    expect(screen.getByText("Визуализация")).toBeTruthy();
    expect(screen.getByTestId("node-action-mark-practice")).toBeTruthy();
    expect(screen.getByTestId("node-action-mark-checkpoint")).toBeTruthy();

    // Check learning path button
    const pathButton = screen.getByTestId("node-action-show-path");
    expect(pathButton).toBeTruthy();
    expect(pathButton.textContent).toBe("Показать путь сюда");
    fireEvent.click(pathButton);
    expect(onShowPath).toHaveBeenCalledWith(["node.first", "node.second"]);
  });
});
