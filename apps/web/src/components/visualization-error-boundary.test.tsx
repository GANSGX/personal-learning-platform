import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { VisualizationErrorBoundary } from "./visualization-error-boundary.tsx";

function ProblematicComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test visualization error");
  }
  return <div data-testid="viz-content">Visualization Working!</div>;
}

function TestContainer() {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setShouldThrow(false);
        }}
      >
        Fix Component
      </button>
      <VisualizationErrorBoundary visualizationId="packet-journey">
        <ProblematicComponent shouldThrow={shouldThrow} />
      </VisualizationErrorBoundary>
    </div>
  );
}

describe("VisualizationErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <VisualizationErrorBoundary visualizationId="packet-journey">
        <ProblematicComponent shouldThrow={false} />
      </VisualizationErrorBoundary>,
    );

    expect(screen.getByTestId("viz-content")).toBeTruthy();
    expect(screen.queryByTestId("visualization-error-boundary")).toBeNull();
  });

  it("renders fallback UI when child component throws", () => {
    render(
      <VisualizationErrorBoundary visualizationId="packet-journey">
        <ProblematicComponent shouldThrow={true} />
      </VisualizationErrorBoundary>,
    );

    expect(screen.getByTestId("visualization-error-boundary")).toBeTruthy();
    expect(screen.getByText("Не удалось загрузить визуализацию")).toBeTruthy();
    expect(screen.getByText("id: packet-journey")).toBeTruthy();
    expect(screen.getByText("Попробовать снова")).toBeTruthy();
  });

  it("retries rendering children when retry button is clicked", () => {
    render(<TestContainer />);

    expect(screen.getByTestId("visualization-error-boundary")).toBeTruthy();

    // Fix the underlying component condition
    fireEvent.click(screen.getByText("Fix Component"));

    // Click retry in the error boundary
    fireEvent.click(screen.getByText("Попробовать снова"));

    // Now it should recover and render the visualization
    expect(screen.getByTestId("viz-content")).toBeTruthy();
    expect(screen.queryByTestId("visualization-error-boundary")).toBeNull();
  });
});
