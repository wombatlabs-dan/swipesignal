export interface CardData {
  id: number
  source: string
  insight: string
  confidence: 'High confidence' | 'Moderate — verify this'
}

export const clayCards: CardData[] = [
  {
    id: 1,
    source: 'FROM JOB POSTINGS',
    insight: 'Clay just opened a wave of SDR roles while their own G2 reviews say onboarding takes two to four weeks — they're scaling outbound faster than their product lets customers operate it.',
    confidence: 'High confidence',
  },
  {
    id: 2,
    source: 'FROM G2 REVIEWS',
    insight: 'Clay's top complaint isn't pricing or feature gaps — it's that non-technical users can't run the tool without a dedicated RevOps engineer on staff.',
    confidence: 'Moderate — verify this',
  },
  {
    id: 3,
    source: 'FROM RECENT NEWS',
    insight: 'Clay's latest funding round explicitly flags product-led growth as the expansion thesis. Setup complexity is now a board-level problem, not a UX nice-to-have.',
    confidence: 'High confidence',
  },
  {
    id: 4,
    source: 'FROM JOB POSTINGS',
    insight: 'They just posted a Head of Developer Experience role that didn't exist six months ago. Complexity went from a customer-support issue to a C-level priority.',
    confidence: 'High confidence',
  },
]
