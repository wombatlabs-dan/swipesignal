import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCachedResearch, type ResearchPayload } from "@/data/cached-research";

const InputSchema = z.object({
  company: z.string().min(1).max(120),
});

const SIMULATED_DELAY_MS = 12_000;

/**
 * researchCompany — demo mode.
 *
 * For Clay / Attio / Retool we serve curated cached fixtures after a 12s
 * simulated delay so the loading animation completes naturally. For any
 * other company we throw a clean error — the UI shows a polite "try one
 * of the demo companies" message rather than hanging.
 *
 * No live Apify call, no Promise.race, no timeout dance.
 */
export const researchCompany = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<ResearchPayload> => {
    const cached = getCachedResearch(data.company);

    if (!cached) {
      throw new Error(
        "Live Apify access is rate-limited during the demo. Try Clay, Attio, or Retool.",
      );
    }

    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    return cached;
  });
