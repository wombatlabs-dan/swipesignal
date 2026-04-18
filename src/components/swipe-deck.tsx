import { useState } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import type { ResearchInsight } from "@/data/cached-research";

type SwipeDirection = "approve" | "flag";

const SWIPE_THRESHOLD = 100;

export function SwipeCard({
  insight,
  onSwipe,
  isTop,
  index,
}: {
  insight: ResearchInsight;
  onSwipe: (dir: SwipeDirection) => void;
  isTop: boolean;
  index: number;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-3, 0, 3]);
  const approveGlow = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const flagGlow = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const approveLabelOpacity = useTransform(x, [40, 100], [0, 1]);
  const flagLabelOpacity = useTransform(x, [-100, -40], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      animate(x, 600, { duration: 0.3, ease: "easeOut" });
      setTimeout(() => onSwipe("approve"), 280);
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      animate(x, -600, { duration: 0.3, ease: "easeOut" });
      setTimeout(() => onSwipe("flag"), 280);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  }

  // Stack-depth styling for non-top cards
  if (!isTop) {
    const depthOffset = index * 8;
    const depthScale = 1 - index * 0.04;
    return (
      <div
        className="ss-shadow-card absolute inset-0 rounded-[20px] border border-[var(--ss-border)] bg-surface"
        style={{
          transform: `translateY(${depthOffset}px) scale(${depthScale})`,
          opacity: 0.6,
          zIndex: -index,
        }}
        aria-hidden
      />
    );
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      className="ss-shadow-card-lg absolute inset-0 cursor-grab touch-none rounded-[20px] border border-[var(--ss-border)] bg-surface p-8 active:cursor-grabbing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Edge glows */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          opacity: approveGlow,
          boxShadow: "inset 0 0 0 3px var(--ss-approve), 0 0 40px var(--ss-approve)",
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[20px]"
        style={{
          opacity: flagGlow,
          boxShadow: "inset 0 0 0 3px var(--ss-flag), 0 0 40px var(--ss-flag)",
        }}
      />

      {/* Swipe labels */}
      <motion.div
        className="pointer-events-none absolute right-6 top-6 rounded-md border-2 border-[var(--ss-approve)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ss-approve)]"
        style={{ opacity: approveLabelOpacity }}
      >
        Good signal
      </motion.div>
      <motion.div
        className="pointer-events-none absolute left-6 top-6 rounded-md border-2 border-[var(--ss-flag)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--ss-flag)]"
        style={{ opacity: flagLabelOpacity }}
      >
        Worth a second look
      </motion.div>

      <div className="flex h-full flex-col">
        <div className="ss-label">{insight.source}</div>

        <p className="mt-6 text-[24px] font-medium leading-[1.35] text-ink">
          {insight.insight}
        </p>

        <div className="mt-auto pt-8">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                insight.confidence.startsWith("High")
                  ? "bg-[var(--ss-approve)]"
                  : "bg-[var(--ss-flag)]"
              }`}
            />
            <span className="text-[12px] font-medium text-ink-muted">{insight.confidence}</span>
          </div>
          <p className="mt-2 text-[11px] text-ink-muted/80">{insight.evidence}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function SwipeDeck({
  insights,
  onComplete,
  onFlag,
}: {
  insights: ResearchInsight[];
  onComplete: (decisions: Decision[]) => void;
  onFlag: (insight: ResearchInsight, correction: string) => void;
}) {
  const [cursor, setCursor] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [pendingFlag, setPendingFlag] = useState<ResearchInsight | null>(null);
  const [correction, setCorrection] = useState("");

  function advance(dir: SwipeDirection, insight: ResearchInsight) {
    const next = [...decisions, { insightId: insight.id, decision: dir }];
    setDecisions(next);
    if (cursor + 1 >= insights.length) {
      // small delay to let exit animation breathe
      setTimeout(() => onComplete(next), 200);
    } else {
      setCursor((c) => c + 1);
    }
  }

  function handleSwipe(dir: SwipeDirection) {
    const insight = insights[cursor];
    if (!insight) return;
    if (dir === "flag") {
      setPendingFlag(insight);
      return;
    }
    advance("approve", insight);
  }

  function submitFlag(skip: boolean) {
    if (!pendingFlag) return;
    if (!skip && correction.trim()) {
      onFlag(pendingFlag, correction.trim());
    } else if (skip) {
      onFlag(pendingFlag, "");
    } else {
      onFlag(pendingFlag, "");
    }
    const insight = pendingFlag;
    setPendingFlag(null);
    setCorrection("");
    advance("flag", insight);
  }

  const remaining = insights.slice(cursor);
  const visibleStack = remaining.slice(0, 3); // top + 2 hint cards

  return (
    <div className="flex w-full flex-col items-center">
      {/* Progress */}
      <div className="ss-label mb-8">
        Card {Math.min(cursor + 1, insights.length)} of {insights.length}
      </div>

      {/* Card stack */}
      <div className="relative h-[440px] w-full max-w-[360px]">
        {visibleStack
          .map((insight, i) => ({ insight, i }))
          .reverse()
          .map(({ insight, i }) => (
            <SwipeCard
              key={insight.id}
              insight={insight}
              isTop={i === 0}
              index={i}
              onSwipe={handleSwipe}
            />
          ))}
      </div>

      {/* Action buttons */}
      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={() => handleSwipe("flag")}
          disabled={!!pendingFlag}
          aria-label="Flag this insight"
          className="ss-press flex h-14 w-14 items-center justify-center rounded-full border border-[var(--ss-border)] bg-surface text-[var(--ss-flag)] transition-colors hover:border-[var(--ss-flag)] disabled:opacity-40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleSwipe("approve")}
          disabled={!!pendingFlag}
          aria-label="Approve this insight"
          className="ss-press flex h-14 w-14 items-center justify-center rounded-full border border-[var(--ss-border)] bg-surface text-[var(--ss-approve)] transition-colors hover:border-[var(--ss-approve)] disabled:opacity-40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      {/* Flag correction sheet */}
      {pendingFlag && (
        <div className="ss-shadow-card mt-8 w-full max-w-[420px] rounded-[16px] border border-[var(--ss-border)] bg-surface p-5">
          <div className="ss-label mb-2">Flagged · what's wrong with this?</div>
          <textarea
            value={correction}
            onChange={(e) => setCorrection(e.target.value)}
            placeholder="Optional — a short note helps SwipeSignal learn."
            rows={2}
            autoFocus
            className="w-full resize-none rounded-[8px] border border-[var(--ss-border)] bg-background px-3 py-2 text-[14px] text-ink placeholder:text-ink-muted focus:border-[var(--ss-accent)] focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => submitFlag(true)}
              className="ss-press rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-muted hover:text-ink"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => submitFlag(false)}
              className="ss-press rounded-md bg-ink px-3 py-1.5 text-[13px] font-semibold text-white hover:bg-black"
            >
              Save & continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export type Decision = { insightId: string; decision: SwipeDirection };
