import { Link, Outlet, createFileRoute, redirect, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/research")({
  validateSearch: (search: Record<string, unknown>) => ({
    company: typeof search.company === "string" ? search.company : "",
  }),
  beforeLoad: ({ search, location }) => {
    const trimmed = search.company.trim();
    if (location.pathname === "/research" && trimmed) {
      throw redirect({
        to: "/research/$company",
        params: { company: trimmed },
      });
    }
  },
  component: ResearchRouteShell,
});

function ResearchRouteShell() {
  const location = useLocation();

  if (location.pathname !== "/research") {
    return <Outlet />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="ss-label mb-3">Choose a demo company</div>
        <p className="text-[15px] text-ink-muted">
          Live research is rate-limited for the demo. Start from Clay, Attio, or Retool.
        </p>
        <Link
          to="/"
          className="ss-press mt-6 inline-flex rounded-[10px] border border-[var(--ss-border)] bg-surface px-4 py-2 text-[13px] font-semibold text-ink"
        >
          Back to start
        </Link>
      </div>
    </main>
  );
}
