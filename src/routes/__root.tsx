import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl text-ink">404</h1>
        <h2 className="mt-4 text-xl font-medium text-ink">Page not found</h2>
        <p className="mt-2 text-sm text-ink-muted">
          That page doesn't exist. Let's get you back to work.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="ss-press inline-flex items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-[var(--ss-accent-hover)]"
          >
            Back to SwipeSignal
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SwipeSignal — Research smarter. Send with confidence." },
      {
        name: "description",
        content:
          "Research-first outbound. SwipeSignal scrapes a company's signals, drafts a personalized cold email, and lets you swipe to confirm.",
      },
      { name: "author", content: "SwipeSignal" },
      { property: "og:title", content: "SwipeSignal — Research smarter. Send with confidence." },
      {
        property: "og:description",
        content: "Research smarter. Swipe to confirm. Send with confidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "SwipeSignal — Research smarter. Send with confidence." },
      { name: "description", content: "AI-powered outbound agent that synthesizes company intelligence and drafts personalized cold emails." },
      { property: "og:description", content: "AI-powered outbound agent that synthesizes company intelligence and drafts personalized cold emails." },
      { name: "twitter:description", content: "AI-powered outbound agent that synthesizes company intelligence and drafts personalized cold emails." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0e6ea451-c84f-49e1-a88f-fec684ae676b/id-preview-f4d70ec4--584d0ea8-f63a-42f5-945e-fa6722a8a00a.lovable.app-1776543678317.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0e6ea451-c84f-49e1-a88f-fec684ae676b/id-preview-f4d70ec4--584d0ea8-f63a-42f5-945e-fa6722a8a00a.lovable.app-1776543678317.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
