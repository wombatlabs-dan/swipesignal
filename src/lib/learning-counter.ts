const KEY = "swipesignal:learning-count";
const FLAGGED_KEY = "swipesignal:flagged-log";

export function getLearningCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(KEY);
  return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
}

export function incrementLearningCount(): number {
  const next = getLearningCount() + 1;
  window.localStorage.setItem(KEY, String(next));
  return next;
}

export type FlaggedEntry = {
  insightId: string;
  company: string;
  insight: string;
  correction: string;
  at: number;
};

export function logFlagged(entry: FlaggedEntry) {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(FLAGGED_KEY);
  const list: FlaggedEntry[] = raw ? JSON.parse(raw) : [];
  list.push(entry);
  window.localStorage.setItem(FLAGGED_KEY, JSON.stringify(list.slice(-200)));
}
