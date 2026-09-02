"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type VisualizationErrorBoundaryProps = {
  children: ReactNode;
  visualizationId?: string;
};

type VisualizationErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class VisualizationErrorBoundary extends Component<
  VisualizationErrorBoundaryProps,
  VisualizationErrorBoundaryState
> {
  constructor(props: VisualizationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): VisualizationErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[VisualizationErrorBoundary] Error in visualization ${this.props.visualizationId ?? "unknown"}:`,
      error,
      errorInfo,
    );
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          data-testid="visualization-error-boundary"
          className="border-destructive/40 bg-destructive/10 text-destructive flex flex-col items-center justify-center gap-3 rounded-lg border p-6 text-center"
        >
          <AlertCircle className="size-6 shrink-0" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Не удалось загрузить визуализацию</p>
            {this.props.visualizationId !== undefined && (
              <p className="text-muted-foreground font-mono text-xs">
                id: {this.props.visualizationId}
              </p>
            )}
          </div>
          <Button size="sm" variant="outline" onClick={this.handleRetry} className="mt-2">
            <RotateCcw className="mr-1.5 size-3.5" aria-hidden="true" />
            Попробовать снова
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
