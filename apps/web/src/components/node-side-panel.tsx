"use client";

import type { KnowledgeNodeMetadata, Lab, NodeStatus } from "@plp/domain";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  findLearningPath,
  getLockReasons,
  getPrerequisiteChain,
  resolveAllNodeStatuses,
} from "@plp/graph";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n/i18n-context";
import { localizedNodeTitle } from "@/lib/i18n/localized-title";
import type { MessageKey } from "@/lib/i18n/messages";
import { useProgressContext } from "@/lib/progress/progress-context";

import { cn } from "@/lib/utils";

type NodeSidePanelProps = {
  node: KnowledgeNodeMetadata | undefined;
  nodes: readonly KnowledgeNodeMetadata[];
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>;
  labs?: Record<string, Lab>;
  onShowPath: (nodeIds: readonly string[]) => void;
  onClearPath: () => void;
};

const nodeActions = [
  { id: "theory", labelKey: "panel.theory" },
  { id: "visualization", labelKey: "panel.visualization" },
  { id: "practice", labelKey: "panel.practice" },
  { id: "checkpoint", labelKey: "panel.checkpoint" },
] as const satisfies ReadonlyArray<{ id: string; labelKey: MessageKey }>;

const statusKeys = {
  LOCKED: "status.LOCKED",
  AVAILABLE: "status.AVAILABLE",
  IN_PROGRESS: "status.IN_PROGRESS",
  THEORY_COMPLETE: "status.THEORY_COMPLETE",
  PRACTICE_COMPLETE: "status.PRACTICE_COMPLETE",
  MASTERED: "status.MASTERED",
} as const satisfies Record<NodeStatus, MessageKey>;

const levelKeys = {
  foundation: "level.foundation",
  infrastructure: "level.infrastructure",
  security: "level.security",
  osint: "level.osint",
} as const satisfies Record<KnowledgeNodeMetadata["level"], MessageKey>;

function NodeRelationList({
  label,
  locale,
  nodeIds,
  nodesById,
  testId,
}: {
  label: string;
  locale: "ru" | "en";
  nodeIds: readonly string[];
  nodesById: ReadonlyMap<string, KnowledgeNodeMetadata>;
  testId: string;
}) {
  if (nodeIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" data-testid={testId}>
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{label}</p>
      <ul className="space-y-1">
        {nodeIds.map((nodeId) => (
          <li key={nodeId} className="text-sm">
            {localizedNodeTitle(nodesById.get(nodeId), locale, nodeId)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightList({
  title,
  items,
  testId,
}: {
  title: string;
  items: readonly string[];
  testId: string;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" data-testid={testId}>
      <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{title}</p>
      <ol className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm">
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function NodeSidePanel({
  node,
  nodes,
  nodesById,
  labs = {},
  onShowPath,
  onClearPath,
}: NodeSidePanelProps) {
  const { locale, t } = useI18n();
  const { ready, progress, markPracticeComplete, markCheckpointComplete } = useProgressContext();
  const [showPrerequisites, setShowPrerequisites] = useState(false);
  const [showLockReasons, setShowLockReasons] = useState(false);

  const statuses = useMemo(
    () => (ready ? resolveAllNodeStatuses(nodes, progress) : new Map<string, NodeStatus>()),
    [nodes, progress, ready],
  );

  if (!node) {
    return (
      <Card
        className="h-full rounded-none border-0 bg-transparent ring-0"
        data-testid="node-side-panel"
      >
        <CardHeader>
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {t("panel.emptyKicker")}
          </p>
          <CardTitle>{t("panel.emptyTitle")}</CardTitle>
          <CardDescription>{t("panel.emptyDescription")}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <p className="text-muted-foreground text-sm">{t("panel.emptyHint")}</p>
        </CardContent>
      </Card>
    );
  }

  const status = statuses.get(node.id) ?? "LOCKED";
  const prerequisiteChain = getPrerequisiteChain(node.id, nodes)
    .slice(0, -1)
    .map((nodeId) => localizedNodeTitle(nodesById.get(nodeId), locale, nodeId));
  const lockReasons = getLockReasons(node.id, nodes, progress).map((reason) => ({
    label: localizedNodeTitle(nodesById.get(reason.nodeId), locale, reason.title),
    done: reason.mastered,
  }));
  const learningPath = findLearningPath(node.id, nodes, progress).map((nodeId) =>
    localizedNodeTitle(nodesById.get(nodeId), locale, nodeId),
  );
  const nodeProgress = progress.nodes[node.id];
  const canMarkPractice = status === "THEORY_COMPLETE";
  const canMarkCheckpoint = status === "PRACTICE_COMPLETE";

  return (
    <Card
      className="h-full rounded-none border-0 bg-transparent ring-0"
      data-testid="node-side-panel"
    >
      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {t("panel.emptyKicker")}
          </p>
          <CardTitle data-testid="node-side-panel-title">
            {localizedNodeTitle(node, locale, node.id)}
          </CardTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" data-testid="node-side-panel-status">
            {t(statusKeys[status])}
          </Badge>
          <Badge variant="outline">{t(levelKeys[node.level])}</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6 pt-6">
        <NodeRelationList
          label={t("panel.requires")}
          locale={locale}
          nodeIds={node.requires}
          nodesById={nodesById}
          testId="node-requires"
        />
        <NodeRelationList
          label={t("panel.unlocks")}
          locale={locale}
          nodeIds={node.unlocks}
          nodesById={nodesById}
          testId="node-unlocks"
        />

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {t("panel.insights")}
          </p>
          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-show-prerequisites"
              onClick={() => {
                setShowPrerequisites((current) => !current);
              }}
            >
              {t("panel.showPrerequisites")}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-why-locked"
              onClick={() => {
                setShowLockReasons((current) => !current);
              }}
            >
              {t("panel.whyLocked")}
            </Button>
            <Button
              type="button"
              variant="outline"
              data-testid="node-action-show-path"
              onClick={() => {
                onShowPath(findLearningPath(node.id, nodes, progress));
              }}
            >
              {t("panel.showPath")}
            </Button>
            <Button type="button" variant="ghost" onClick={onClearPath}>
              {t("panel.clearPath")}
            </Button>
          </div>
        </div>

        {showPrerequisites ? (
          <InsightList
            title={t("panel.prerequisiteChain")}
            items={prerequisiteChain}
            testId="node-prerequisite-chain"
          />
        ) : null}

        {showLockReasons ? (
          <div className="space-y-2" data-testid="node-lock-reasons">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {t("panel.missing")}
            </p>
            {lockReasons.length === 0 ? (
              <p className="text-sm">{t("panel.noBlockers")}</p>
            ) : (
              <ul className="space-y-1">
                {lockReasons.map((reason) => (
                  <li key={reason.label} className="text-sm">
                    {reason.done ? "✓" : "✗"} {reason.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {learningPath.length > 0 ? (
          <InsightList
            title={t("panel.learningPath")}
            items={learningPath}
            testId="node-learning-path"
          />
        ) : null}

        {node.labs.length > 0 ? (
          <div className="space-y-2" data-testid="node-labs">
            <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
              {t("panel.labs")}
            </p>
            <div className="grid gap-2">
              {node.labs.map((labId) => {
                const lab = labs[labId];
                const labTitle = lab
                  ? locale === "en" && lab.titleEn
                    ? lab.titleEn
                    : lab.title
                  : labId;

                return (
                  <Sheet key={labId}>
                    <SheetTrigger
                      render={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto w-full justify-between px-3 py-2 text-left"
                          data-testid={`node-lab-card-${labId}`}
                        />
                      }
                    >
                      <div className="flex flex-col items-start gap-0.5 overflow-hidden pr-2">
                        <span className="max-w-[200px] truncate text-xs font-medium">
                          {labTitle}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {lab?.environment ?? "Packet Tracer"}
                        </span>
                      </div>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {t("panel.openLab")}
                      </Badge>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-full space-y-4 overflow-y-auto sm:max-w-lg"
                      data-testid={`node-lab-sheet-${labId}`}
                    >
                      <SheetHeader>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{lab?.environment ?? "Packet Tracer"}</Badge>
                          <span className="text-muted-foreground font-mono text-xs">{labId}</span>
                        </div>
                        <SheetTitle className="text-lg">{labTitle}</SheetTitle>
                        <SheetDescription>{lab?.goal}</SheetDescription>
                      </SheetHeader>

                      {lab?.topology ? (
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            {t("panel.labTopology")}
                          </p>
                          <pre className="bg-muted overflow-x-auto rounded border p-3 font-mono text-xs whitespace-pre">
                            {lab.topology}
                          </pre>
                        </div>
                      ) : null}

                      {lab?.checklist && lab.checklist.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                            {t("panel.labChecklist")}
                          </p>
                          <ul className="space-y-1.5 text-sm">
                            {lab.checklist.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-muted-foreground mt-0.5">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}

                      {lab?.body ? (
                        <div className="text-muted-foreground border-t pt-3 text-sm whitespace-pre-line">
                          {lab.body}
                        </div>
                      ) : null}

                      <div className="border-t pt-4">
                        <Button
                          type="button"
                          variant="default"
                          className="w-full"
                          disabled={!canMarkPractice}
                          data-testid={`node-lab-complete-${labId}`}
                          onClick={() => {
                            void markPracticeComplete(node.id);
                          }}
                        >
                          {t("panel.markPractice")}
                          {nodeProgress?.practiceComplete ? " ✓" : ""}
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
            {t("panel.actions")}
          </p>
          <div className="grid gap-2">
            {nodeActions.map((action) => {
              if (action.id === "theory") {
                return (
                  <Link
                    key={action.id}
                    href={`/nodes/${node.id}`}
                    className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                    data-testid="node-action-theory"
                  >
                    {t(action.labelKey)}
                    {nodeProgress?.theoryComplete ? " ✓" : ""}
                  </Link>
                );
              }

              if (action.id === "practice") {
                return (
                  <Button
                    key={action.id}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canMarkPractice}
                    data-testid="node-action-mark-practice"
                    onClick={() => {
                      void markPracticeComplete(node.id);
                    }}
                  >
                    {t("panel.markPractice")}
                    {nodeProgress?.practiceComplete ? " ✓" : ""}
                  </Button>
                );
              }

              if (action.id === "checkpoint") {
                return (
                  <Button
                    key={action.id}
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={!canMarkCheckpoint}
                    data-testid="node-action-mark-checkpoint"
                    onClick={() => {
                      void markCheckpointComplete(node.id);
                    }}
                  >
                    {t("panel.markCheckpoint")}
                    {nodeProgress?.checkpointComplete ? " ✓" : ""}
                  </Button>
                );
              }

              return (
                <Button key={action.id} type="button" variant="outline" disabled>
                  {t(action.labelKey)}
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
