import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { researchCompany } from "@/server/research.functions";
import { generateEmail, type GeneratedEmail } from "@/server/email.functions";
import { ResearchLoadingState } from "@/components/research-loading-state";
import { SwipeDeck, type Decision } from "@/components/swipe-deck";
import { EmailScreen } from "@/components/email-screen";
import type { ResearchPayload, ResearchInsight } from "@/data/cached-research";
import { incrementLearningCount, logFlagged } from "@/lib/learning-counter";

export const Route = createFileRoute("/research/$company")({
  head: ({ params }) => ({
    meta: [
      { title: `Researching ${params.company} — SwipeSignal` },
      { name: "description", content: `Live research brief for ${params.company}.` },
    ],
  }),
  component: ResearchPage,
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="max-w-md text-center">
          <div className="ss-label mb-3 text-[var(--ss-flag)]">Something snagged</div>
          <p className="text-[15px] text-ink">{error.message}</p>
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="ss-press mt-6 rounded-[10px] bg-ink px-4 py-2 text-[13px] font-semibold text-white"
          >
            Try again
          </button>
        </div>
      </div>
    );
  },
});

type Phase = "loading" | "swiping" | "generating" | "email";

function ResearchPage() {
  const { company } = Route.useParams();
  const navigate = useNavigate();
  const research = useServerFn(researchCompany);
  const generate = useServerFn(generateEmail);

  const [phase, setPhase] = useState<Phase>("loading");
  const [payload, setPayload] = useState<ResearchPayload | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [loadingMinElapsed, setLoadingMinElapsed] = useState(false);
  const [researchReady, setResearchReady] = useState(false);

  // StrictMode-safe single-fire guard for kicking off research + the loading timer.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    console.log("[research] kicking off server fn for", company);
    let resolvedPayload: ResearchPayload | null = null;
    let minElapsed = false;

    const tryAdvance = () => {
      console.log("[advance-check]", { hasPayload: !!resolvedPayload, minElapsed });
      if (resolvedPayload && minElapsed) {
        console.log("[phase] → swiping");
        setPayload(resolvedPayload);
        setPhase("swiping");
      }
    };

    research({ data: { company } })
      .then((r) => {
        console.log("[research] payload received", { insights: r?.insights?.length });
        resolvedPayload = r;
        tryAdvance();
      })
      .catch((err) => {
        console.error("[research] server fn failed", err);
        // Use a minimal fallback so UI can still proceed
        resolvedPayload = {
          company,
          domain: "",
          summary: `Research preview for ${company}.`,
          insights: [],
          emailSeed: { subject: `On ${company}`, angle: "" },
          cached: true,
        };
        tryAdvance();
      });

    // Trigger from the loading component sequence
    (window as unknown as { __ssMinElapsed: () => void }).__ssMinElapsed = () => {
      console.log("[loading-min-elapsed] fired");
      minElapsed = true;
      tryAdvance();
    };
  }, [company, research]);

  const handleLoadingMinElapsed = useCallback(() => {
    const fn = (window as unknown as { __ssMinElapsed?: () => void }).__ssMinElapsed;
    if (fn) fn();
  }, []);

  async function handleSwipeComplete(allDecisions: Decision[]) {
    if (!payload) return;
    setDecisions(allDecisions);
    setPhase("generating");

    const approved = allDecisions
      .filter((d) => d.decision === "approve")
      .map((d) => payload.insights.find((i) => i.id === d.insightId))
      .filter((i): i is ResearchInsight => !!i)
      .map((i) => ({ source: i.source, insight: i.insight }));

    // If user flagged everything, fall back to all insights so we still produce a draft.
    const insightsForEmail =
      approved.length > 0
        ? approved
        : payload.insights.map((i) => ({ source: i.source, insight: i.insight }));

    try {
      const result = await generate({
        data: {
          company: payload.company,
          approvedInsights: insightsForEmail,
          angle: payload.emailSeed.angle,
        },
      });
      setEmail(result);
      setPhase("email");
    } catch (err) {
      console.error(err);
      setEmail({
        subject: `On ${payload.company}`,
        body: "Something went wrong drafting the email. Try regenerating.",
      });
      setPhase("email");
    }
  }

  function handleFlag(insight: ResearchInsight, correction: string) {
    if (!payload) return;
    incrementLearningCount();
    logFlagged({
      insightId: insight.id,
      company: payload.company,
      insight: insight.insight,
      correction,
      at: Date.now(),
    });
  }

  async function handleRegenerate() {
    if (!payload) return;
    setIsRegenerating(true);
    const approved = decisions
      .filter((d) => d.decision === "approve")
      .map((d) => payload.insights.find((i) => i.id === d.insightId))
      .filter((i): i is ResearchInsight => !!i)
      .map((i) => ({ source: i.source, insight: i.insight }));
    const insightsForEmail =
      approved.length > 0
        ? approved
        : payload.insights.map((i) => ({ source: i.source, insight: i.insight }));
    try {
      const result = await generate({
        data: {
          company: payload.company,
          approvedInsights: insightsForEmail,
          angle: payload.emailSeed.angle,
          variant: "regenerate",
        },
      });
      setEmail(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-8 pt-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[var(--ss-accent)]" />
          <span className="text-[13px] font-semibold tracking-tight text-ink">SwipeSignal</span>
        </Link>
        <div className="ss-label">{company}</div>
      </header>

      <section className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 pt-16 pb-20">
        {phase === "loading" && (
          <ResearchLoadingState onComplete={handleLoadingMinElapsed} />
        )}

        {phase === "swiping" && payload && (
          <div className="w-full">
            <div className="mb-10 text-center">
              <h1 className="font-display text-[36px] leading-tight text-ink">
                {payload.company}
              </h1>
              <p className="mt-2 text-[14px] text-ink-muted">{payload.summary}</p>
            </div>
            <SwipeDeck
              insights={payload.insights}
              onComplete={handleSwipeComplete}
              onFlag={handleFlag}
            />
          </div>
        )}

        {phase === "generating" && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center">
            <div className="ss-label mb-3">Drafting</div>
            <p className="font-display text-[32px] text-ink">Writing the email...</p>
            <div className="mt-6 flex items-center gap-2">
              <span className="ss-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--ss-accent)]" />
              <span className="text-[12px] text-ink-muted">via Lovable AI Gateway</span>
            </div>
          </div>
        )}

        {phase === "email" && email && payload && (
          <EmailScreen
            email={email}
            company={payload.company}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
            onRestart={() => navigate({ to: "/" })}
          />
        )}
      </section>
    </main>
  );
}
