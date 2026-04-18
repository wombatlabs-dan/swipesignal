import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { listCachedCompanies } from "@/data/cached-research";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SwipeSignal — Research smarter. Send with confidence." },
      {
        name: "description",
        content:
          "Type a company name. SwipeSignal scrapes their public signals, drafts a cold email, and lets you swipe to confirm.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState("Clay");
  const cachedExamples = listCachedCompanies();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = company.trim();
    if (!trimmed) return;
    console.log("[landing] submitting company", trimmed);
    navigate({ to: "/research/$company", params: { company: trimmed } });
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-8 pt-8">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--ss-accent)]" />
          <span className="text-[13px] font-semibold tracking-tight text-ink">SwipeSignal</span>
        </div>
        <div className="ss-label">Research-first outbound</div>
      </header>

      <section className="mx-auto max-w-2xl px-6 pt-32 pb-16">
        <h1 className="font-display text-[56px] leading-[1.05] text-ink md:text-[64px]">
          Research smarter.
          <br />
          <span className="italic text-[var(--ss-accent)]">Swipe</span> to confirm.
          <br />
          Send with confidence.
        </h1>

        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-muted">
          Drop a company name. We scrape their public signals — job posts, news, reviews — and
          surface what's actually worth referencing. You swipe through. We write the email.
        </p>

        <form onSubmit={handleSubmit} action="/research" method="get" className="mt-12">
          <label htmlFor="company" className="ss-label mb-3 block">
            Target company
          </label>
          <div className="relative">
            <input
              id="company"
              name="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Drop a company name. We'll do the homework."
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-[10px] border border-[var(--ss-border)] bg-surface px-5 py-4 text-[17px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-[var(--ss-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--ss-accent)]/15"
            />
          </div>

          <button
            type="submit"
            disabled={!company.trim()}
            className="ss-press mt-4 w-full rounded-[10px] bg-[var(--ss-accent)] px-5 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--ss-accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Research this company →
          </button>
        </form>

        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="ss-label">Try one</span>
          {cachedExamples.map((c) => (
            <Link
              key={c}
              to="/research/$company"
              params={{ company: c }}
              preload={false}
              className="ss-press rounded-md border border-[var(--ss-border)] bg-surface px-3 py-1.5 text-[12px] font-medium text-ink-muted transition-colors hover:border-[var(--ss-accent)] hover:text-ink"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      <footer className="fixed bottom-6 left-0 right-0 mx-auto max-w-6xl px-8">
        <div className="flex items-center justify-between text-[11px] text-ink-muted">
          <span>Powered by Apify · Lovable AI Gateway</span>
          <span>v0.1 · demo</span>
        </div>
      </footer>
    </main>
  );
}
