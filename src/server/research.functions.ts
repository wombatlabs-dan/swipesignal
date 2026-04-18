import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCachedResearch, type ResearchPayload } from "@/data/cached-research";

const InputSchema = z.object({
  company: z.string().min(1).max(120),
});

/**
 * researchCompany — attempts a live Apify scrape, falls back to cached fixtures
 * for the demo set (Clay / Attio / Retool). Always returns a usable payload so
 * the UI can advance.
 */
export const researchCompany = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ResearchPayload> => {
    const cached = getCachedResearch(data.company);

    // For our 3 demo companies we serve the curated cache directly — guaranteed
    // quality for the live pitch.
    if (cached) {
      return cached;
    }

    const token = process.env.APIFY_API_TOKEN;
    if (!token) {
      // No live capability — return a graceful generic payload instead of crashing.
      return buildGenericFallback(data.company);
    }

    try {
      // Live Apify call (Google News scraper actor). Wrapped in a 9s timeout so
      // the loading sequence still feels intentional even on slow runs.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);

      const res = await fetch(
        `https://api.apify.com/v2/acts/lhotanova~google-news-scraper/run-sync-get-dataset-items?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            query: data.company,
            language: "US:en",
            maxItems: 5,
          }),
        },
      );
      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`Apify returned ${res.status}, using fallback`);
        return buildGenericFallback(data.company);
      }

      const items = (await res.json()) as Array<{
        title?: string;
        source?: string;
        link?: string;
      }>;

      if (!Array.isArray(items) || items.length === 0) {
        return buildGenericFallback(data.company);
      }

      const insights = items.slice(0, 4).map((item, i) => ({
        id: `${data.company.toLowerCase()}-live-${i}`,
        source: "From recent news",
        insight: item.title || `Recent coverage of ${data.company}`,
        confidence: i < 2 ? "High confidence" : "Moderate — verify this",
        evidence: item.source ? `${item.source}` : "Google News",
      }));

      return {
        company: data.company,
        domain: "",
        summary: `Live signals scraped for ${data.company}.`,
        insights,
        emailSeed: {
          subject: `Following ${data.company} closely`,
          angle: "Reference the most recent news item by name.",
        },
        cached: false,
      };
    } catch (err) {
      console.error("Apify request failed:", err);
      return buildGenericFallback(data.company);
    }
  });

function buildGenericFallback(company: string): ResearchPayload {
  return {
    company,
    domain: "",
    summary: `Research preview for ${company}.`,
    insights: [
      {
        id: `${company}-fb-1`,
        source: "From job postings",
        insight: `${company} appears to be growing — multiple open roles suggest they're investing ahead of revenue.`,
        confidence: "Moderate — verify this",
        evidence: "Generic signal · live data unavailable",
      },
      {
        id: `${company}-fb-2`,
        source: "From recent news",
        insight: `${company} has had recent press mentions — a good hook is referencing their latest announcement by name.`,
        confidence: "Moderate — verify this",
        evidence: "Generic signal · live data unavailable",
      },
      {
        id: `${company}-fb-3`,
        source: "From G2 reviews",
        insight: `Reviewers of ${company} commonly cite onboarding friction — a classic angle for a workflow-tooling pitch.`,
        confidence: "Moderate — verify this",
        evidence: "Generic signal · live data unavailable",
      },
    ],
    emailSeed: {
      subject: `Quick note on ${company}`,
      angle: "Lead with the most specific approved insight.",
    },
    cached: true,
  };
}
