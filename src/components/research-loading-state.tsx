import { useEffect, useRef, useState } from "react";

const STEPS = [
  "Scanning job postings...",
  "Reading product reviews...",
  "Synthesizing insights...",
];

const STEP_DURATION = 4000; // ms per step — total ~12s

export function ResearchLoadingState({ onComplete }: { onComplete: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);

  // Keep the latest onComplete in a ref so identity changes don't restart timers.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (done) return;
    if (activeStep >= STEPS.length) {
      console.log("[loading] sequence complete, signaling onComplete");
      setDone(true);
      const t = setTimeout(() => onCompleteRef.current(), 400);
      return () => clearTimeout(t);
    }
    console.log(`[loading] step ${activeStep} → ${activeStep + 1} in ${STEP_DURATION}ms`);
    const t = setTimeout(() => setActiveStep((s) => s + 1), STEP_DURATION);
    return () => clearTimeout(t);
  }, [activeStep, done]);

  return (
    <div className="flex w-full items-center justify-center px-6">
      <div className="ss-shadow-card w-full max-w-[420px] rounded-[20px] border border-[var(--ss-border)] bg-surface p-8">
        <div className="ss-label mb-6">Reading between the lines</div>

        <ul className="space-y-5">
          {STEPS.map((label, i) => {
            const isActive = i === activeStep && !done;
            const isComplete = i < activeStep || done;
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={`relative flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                    isComplete
                      ? "bg-[var(--ss-approve)]"
                      : isActive
                        ? "bg-[var(--ss-accent)]"
                        : "bg-[var(--ss-border)]"
                  }`}
                >
                  {isActive && (
                    <span className="ss-pulse-dot absolute inset-0 rounded-full bg-[var(--ss-accent)]" />
                  )}
                </span>
                <span
                  className={`text-[15px] font-medium transition-colors duration-500 ${
                    isActive
                      ? "text-ink"
                      : isComplete
                        ? "text-ink-muted"
                        : "text-ink-muted/60"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 border-t border-[var(--ss-border)] pt-4">
          <p className="text-[11px] text-ink-muted">Powered by Apify</p>
        </div>
      </div>
    </div>
  );
}
