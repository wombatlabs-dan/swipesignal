import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  company: z.string().min(1).max(120),
  approvedInsights: z
    .array(
      z.object({
        source: z.string(),
        insight: z.string(),
      }),
    )
    .min(1)
    .max(10),
  angle: z.string().optional(),
  variant: z.string().optional(),
});

export type GeneratedEmail = {
  subject: string;
  body: string;
};

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<GeneratedEmail> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return buildTemplateEmail(data.company, data.approvedInsights);
    }

    const insightsBlock = data.approvedInsights
      .map((i, idx) => `${idx + 1}. (${i.source}) ${i.insight}`)
      .join("\n");

    const variantHint =
      data.variant === "regenerate"
        ? "Take a noticeably different angle than a typical opener — be more direct or more curious."
        : "";

    const prompt = `You are a senior B2B outbound writer. Draft a cold email to a leader at ${data.company}.

Approved research insights (you MUST reference at least one of these specifically — by name or detail):
${insightsBlock}

${data.angle ? `Suggested angle: ${data.angle}` : ""}
${variantHint}

Rules:
- 2 short paragraphs, 90 words max total.
- No "I hope this finds you well." No "I came across your company." No emoji.
- Reference one specific detail from the insights above. Generic openers are unacceptable.
- End with one soft, specific question — not a meeting ask.
- Sign off "— Dan" only.

Return ONLY valid JSON in this shape (no markdown, no fence):
{"subject":"...","body":"..."}`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "You write specific, restrained, sharp B2B cold emails. You always return strict JSON.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!res.ok) {
        console.warn(`AI gateway returned ${res.status}`);
        return buildTemplateEmail(data.company, data.approvedInsights);
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = json.choices?.[0]?.message?.content?.trim() || "";
      const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

      try {
        const parsed = JSON.parse(cleaned) as { subject?: string; body?: string };
        if (parsed.subject && parsed.body) {
          return { subject: parsed.subject, body: parsed.body };
        }
      } catch {
        // fall through to template
      }
      return buildTemplateEmail(data.company, data.approvedInsights);
    } catch (err) {
      console.error("Email generation failed:", err);
      return buildTemplateEmail(data.company, data.approvedInsights);
    }
  });

function buildTemplateEmail(
  company: string,
  insights: Array<{ source: string; insight: string }>,
): GeneratedEmail {
  const lead = insights[0];
  const support = insights[1];
  return {
    subject: `On ${company} — a thought`,
    body: `Saw the signal: ${lead.insight}\n\nThat caught my eye because most teams treat it as a footnote. ${
      support ? `Combined with ${support.insight.toLowerCase()}, it points to a real shift.` : ""
    } Curious whether you're seeing the same pattern internally — open to comparing notes?\n\n— Dan`,
  };
}
