import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { GeneratedEmail } from "@/server/email.functions";
import { getLearningCount } from "@/lib/learning-counter";

export function EmailScreen({
  email,
  company,
  onRegenerate,
  onRestart,
  isRegenerating,
}: {
  email: GeneratedEmail;
  company: string;
  onRegenerate: () => void;
  onRestart: () => void;
  isRegenerating: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const c = getLearningCount();
    if (c !== count) {
      setCount(c);
      setBump(true);
      const t = setTimeout(() => setBump(false), 220);
      return () => clearTimeout(t);
    }
  }, [count]);

  function copy() {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="mx-auto w-full max-w-[640px] px-6"
    >
      <div className="ss-label mb-3">Draft for {company}</div>
      <h2 className="font-display text-[40px] leading-tight text-ink">
        Here's the email.
      </h2>

      <div className="ss-shadow-card mt-8 overflow-hidden rounded-[16px] border border-[var(--ss-border)] bg-surface">
        {/* Email frame header */}
        <div className="border-b border-[var(--ss-border)] bg-[var(--ss-base)]/60 px-6 py-4">
          <div className="grid grid-cols-[60px_1fr] gap-y-1.5 text-[13px]">
            <span className="text-ink-muted">From</span>
            <span className="text-ink">dan@swipesignal.app</span>
            <span className="text-ink-muted">To</span>
            <span className="text-ink">{`team@${company.toLowerCase().replace(/\s+/g, "")}.com`}</span>
            <span className="text-ink-muted">Subject</span>
            <span className="font-medium text-ink">{email.subject}</span>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="whitespace-pre-wrap text-[15px] leading-[1.65] text-ink">
            {email.body}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="ss-press rounded-[10px] bg-[var(--ss-accent)] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[var(--ss-accent-hover)]"
        >
          {copied ? "Copied" : "Copy email"}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="ss-press rounded-[10px] border border-[var(--ss-border)] bg-surface px-5 py-2.5 text-[14px] font-medium text-ink transition-colors hover:border-ink-muted disabled:opacity-50"
        >
          {isRegenerating ? "Rewriting..." : "Regenerate with different angle"}
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="ss-press ml-auto rounded-md px-3 py-1.5 text-[13px] text-ink-muted hover:text-ink"
        >
          Research another →
        </button>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-[var(--ss-border)] pt-5">
        <p className="text-[12px] text-ink-muted">
          SwipeSignal has learned from{" "}
          <motion.span
            animate={bump ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="inline-block font-semibold text-ink"
          >
            {count}
          </motion.span>{" "}
          {count === 1 ? "correction" : "corrections"}.
        </p>
        <p className="text-[11px] text-ink-muted">Powered by Apify · Lovable AI Gateway</p>
      </div>
    </motion.div>
  );
}
