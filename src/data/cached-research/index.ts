import clay from "./clay.json";
import attio from "./attio.json";
import retool from "./retool.json";

export type ResearchInsight = {
  id: string;
  source: string;
  insight: string;
  confidence: string;
  evidence: string;
};

export type ResearchPayload = {
  company: string;
  domain: string;
  summary: string;
  insights: ResearchInsight[];
  emailSeed: { subject: string; angle: string };
  cached: boolean;
};

const CACHE: Record<string, Omit<ResearchPayload, "cached">> = {
  clay: clay as Omit<ResearchPayload, "cached">,
  attio: attio as Omit<ResearchPayload, "cached">,
  retool: retool as Omit<ResearchPayload, "cached">,
};

export function getCachedResearch(name: string): ResearchPayload | null {
  const key = name.trim().toLowerCase();
  const hit = CACHE[key];
  if (!hit) return null;
  return { ...hit, cached: true };
}

export function listCachedCompanies(): string[] {
  return Object.values(CACHE).map((c) => c.company);
}
