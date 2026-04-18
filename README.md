# SwipeSignal

> **Research-first outbound, with a human in the loop.** Tinder for prospect intelligence — and it gets smarter every time you swipe.

**Submission** — [Marketing Agents Hackathon](https://lu.ma/) · The AI Collective × Lynk · Entrepreneurs First, San Francisco · April 19, 2026

**[→ Try it live at swipesignal.lovable.app](https://swipesignal.lovable.app)**

---

## What it does

Cold outreach is broken — not because people don't care, but because real personalization is too expensive to do at scale. The average SDR or solo founder spends 27 minutes researching and writing every cold email. So they skip the research, send templated garbage, and wonder why nobody replies.

SwipeSignal is a research-first outbound agent with a human-in-the-loop feedback layer that learns over time.

Drop in a company name. The agent scrapes the target's public signals — job postings, recent news, product reviews, LinkedIn activity — and synthesizes a short intelligence brief: not raw data points, but specific insights about what problem the company is feeling *right now*. The brief is broken into 3–4 swipe cards. You swipe right to approve an insight, left to flag it. Every correction feeds the learning loop. When you're done, SwipeSignal drafts a cold email grounded in the insights you approved — written to a specific human, not a `team@` alias.

**The result:** 27 minutes of manual research and writing compressed to under 3 minutes of human review — with a system that compounds on your judgment over time.

---

## The 90-second demo

Since the hackathon format is live-product-only (no video, no deck), here's what judges see on stage:

1. **Landing** — One field. User types `Clay`. Single CTA: *Research this company →*
2. **Loading** — 12 seconds. Three sequential status lines: *Scanning job postings → Reading product reviews → Synthesizing insights.* Named attribution: *Powered by Apify*.
3. **Swipe card stack** — 4 cards surface one at a time. Each shows signal source, a specific synthesized insight, and a confidence chip (high / moderate). The user approves three, flags one (the moderate-confidence card), and types a short correction note — *"off-thesis — pricing isn't a design conversation."*
4. **Email output** — Addressed to a named human with a role-appropriate title. Opens by referencing a specific approved card, names the underlying problem, ends with a concrete ask. The highlighted phrase in the body shows judges which card it came from.
5. **Learning counter** — *"SwipeSignal has learned from 1 correction."* Increments live. The moat, visible.

Total elapsed time in the demo: under 90 seconds.

---

## The insight behind it

Every outbound tool on the market does one of two things: **data lookup** (Apollo, ZoomInfo, Clay) or **generic AI writing** (Autobound, Lemlist AI). Nobody does **intelligence synthesis** — reading between the lines of a company's signals to understand what pain they're feeling right now and turning that into outreach that reads like a human spent twenty minutes on it.

That's the product wedge. Existing tools tell you *that* a company raised money. SwipeSignal tells you *what problem that money just created for them* — and writes the email that acknowledges it.

The second wedge is the learning loop. Every existing AI outbound tool gets dumber as you use it, because your corrections die in the drafts folder. SwipeSignal captures every flag, every correction note, and every approve as a signal. Over time, the system learns *your* thesis — what you pitch, who you pitch to, which insights resonate with your voice — and surfaces fewer off-thesis cards on your next run.

---

## Who it's for

**Primary persona:** Solo founders and early sales hires (0–2 person sales teams) at Seed / Series A B2B startups doing outbound for the first time.

- 25–38, based in SF / NYC or remote
- No RevOps, no dedicated PMM, no $3,000/month Clay budget
- Writing cold emails from a spreadsheet and instinct
- Burning runway trying to find their first 10 customers

They need something that does the hard research work for them, keeps them in control of what goes out, and gets better the more they use it — without requiring them to hire a data engineer to operate it.

---

## How it's different

| | Clay / Apollo | Autobound / Lemlist AI | **SwipeSignal** |
|---|---|---|---|
| What it does | Data lookup + enrichment | Generic AI email writing | Intelligence synthesis |
| Research | You build the workflow | Skipped — writes from lookups | Agent synthesizes specific insight per prospect |
| Human review | None (automation) | None (automation) | **Swipe review — human confirms every insight** |
| Learning | None — static | None — each email is fresh | **Compounds on every correction** |
| Setup | 2–4 weeks onboarding | Connect + go | Type a company name. That's it. |
| Price | $149–349 / seat / month | $59–99 / seat / month | **Target: $49–79 / seat / month** |

The positioning: SwipeSignal sits between "do it yourself" (Clay) and "let the AI send whatever" (Autobound). It's the first tool that treats the human's judgment as the product's training data.

---

## Market math

Numbers we can defend, not numbers we want to be true:

- **700,000** active SDRs and solo founders doing cold outbound in the US (LinkedIn job-title counts for SDR / BDR / Founder with outbound activity, cross-checked against RepVue and Bridge Group SDR reports)
- **27 minutes** average time spent researching + writing a single cold email (Bridge Group 2025 SDR Metrics Report, corroborated by Gartner's 2024 outbound efficiency study)
- **Target pricing:** $49–79 / seat / month (anchored below Apollo's individual tier at $99/mo, above pure AI-writing tools at $29/mo)

**Serviceable addressable market (SAM):**
> 700,000 users × $49–79/mo × 12 months = **$411M–$663M/year**

We aren't naming a $9B TAM because that would include categories SwipeSignal doesn't compete in (enterprise sales engagement platforms, CRM). The defensible number is the SAM above. That's more than enough for a Seed / Series A company.

**Path to $10M ARR:** ~14,000 paying users at the midpoint price. That's 2% of the SAM. Reachable through the communities the target user already lives in (r/sales, r/coldemail, Lenny's community, YC internal Slack, tactical content on LinkedIn).

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TanStack Start (SSR + server functions), Tailwind v4 with custom CSS tokens |
| Motion | Framer Motion for drag physics, edge glow, card exit |
| Fonts | Instrument Serif (display) + Inter (body/UI), loaded via Google Fonts |
| Synthesis | Lovable AI Gateway — Gemini 3 Flash for insight synthesis + email generation |
| Scraping | [Apify](https://apify.com) — one API, 24,000+ actors for job postings, news, G2 reviews |
| Persistence | Browser `localStorage` for the learning counter (demo-scoped) |
| Hosting | Lovable built-in hosting |
| Build tool | Lovable |

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      SwipeSignal Data Flow                           │
│                                                                      │
│  ┌────────┐     ┌─────────────┐     ┌──────────┐     ┌────────────┐ │
│  │ User   │────▶│  Apify      │────▶│ Lovable  │────▶│ Swipe UI   │ │
│  │ types  │     │  actors     │     │ AI       │     │ 3–4 cards  │ │
│  │ "Clay" │     │ (jobs/news/ │     │ Gateway  │     │            │ │
│  │        │     │  G2)        │     │ (Gemini  │     │            │ │
│  │        │     │             │     │  synth)  │     │            │ │
│  └────────┘     └─────────────┘     └──────────┘     └──────┬─────┘ │
│                                                             │       │
│                                                    approve /│ flag  │
│                                                             ▼       │
│                                                     ┌────────────┐  │
│                                                     │  Learning  │  │
│                                                     │  counter   │◀─┤
│                                                     │ (localSt.) │  │
│                                                     └──────┬─────┘  │
│                                                            │        │
│                                                            ▼        │
│                                                   ┌───────────────┐ │
│                                                   │ Email         │ │
│                                                   │ generation    │ │
│                                                   │ (Gemini,      │ │
│                                                   │  grounded in  │ │
│                                                   │  approved     │ │
│                                                   │  cards only)  │ │
│                                                   └───────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Demo note:** For reliability at 3pm, the judged demo runs against cached Apify JSON fixtures (Clay, Attio, Retool) pre-computed earlier in the day. The live Apify path is wired and has been tested; we intentionally bypass it in the judged run to eliminate network failure modes during a 90-second demo. The synthesis and email generation steps still hit the Lovable AI Gateway live.

---

## Design direction

The aesthetic is deliberately called out because it's part of the product thesis: outbound tools all look enterprise-beige (Pardot, Outreach, SalesLoft). SwipeSignal looks like Linear, Raycast, Arc, or Perplexity instead — because solo founders and early sales hires want consumer-grade tools, not enterprise software ported to their laptop.

**Name for the aesthetic:** *Considered Craft.*

- Warm off-white base (`#FAF8F5`), never pure white
- Near-black ink (`#1A1A1A`), never pure black
- One accent color only — deep teal (`#1F4E5F`)
- Muted green for approve (`#4CAF7D`), warm amber for flag (`#F59E0B`) — never neon, never red
- **Typography:** Instrument Serif for headlines and metadata values, Inter for everything else. No system-font fallbacks.
- **Swipe card:** 20px radius, warm soft shadow (not flat gray drop-shadow), 2–3° drag tilt, edge glow that fades in during drag
- **No spinners.** Loading state is sequential text with a single pulsing dot
- **No pill buttons, no gradients, no Tailwind blue, no component-library defaults**

Full spec in [`swipesignal-ui-design.md`](./swipesignal-ui-design.md).

---

## What's next post-hackathon

- **Real learning loop.** The demo uses a `localStorage` counter. V1 replaces it with a Supabase-backed correction log, scoped per user, that fine-tunes the synthesis prompt over time with the user's approved/flagged pairs.
- **Inbox of prospects.** Batch processing. Drop in a list of 50 companies overnight; wake up to 50 swipe stacks. The daily sweep.
- **CRM write-back.** Approved insights and sent emails flow into HubSpot / Pipedrive / Attio automatically — not because automation is the goal, but because teams need the record.
- **Voice feedback.** For reps doing 40 prospects a day, typing corrections is too slow. "Hey SwipeSignal, flag this — it's a stale signal" is faster and captures more nuance.
- **Team mode.** Learning loops currently train per-user. Team mode lets a sales org share a tuning signal across reps, so the SDR team's collective judgment compounds, not just one rep's.

---

## For judges

If you're evaluating this as a submission:

- **The live product is the submission.** Open [swipesignal.lovable.app](https://swipesignal.lovable.app), type `Clay`, and walk the flow. Total time: ~90 seconds end-to-end.
- **The swipe card motion is the headline technical moment.** Drag a card past the 100px threshold and watch the tilt, edge glow, and exit animation. It's built to feel tactile and consumer-grade, not like a form control.
- **The email output is the payoff.** The body references a specific approved card by name. The recipient is a named human with a role-appropriate title — not `team@`.
- **The learning counter increments in real time.** Flag the moderate-confidence card (#3 in the Clay flow) and watch it tick up.
- **Apify attribution is live on the loading screen.** The Apify integration is the foundation of the scraping layer and has a separate $500 prize track — the attribution is intentional.

### What to pull each lever on

| Judge focus | Where to look |
|---|---|
| Human-in-the-loop architecture | Swipe stack + flag correction row + learning counter |
| Apify integration | Loading screen attribution; scraping pipeline is production-shaped |
| Demo moment in under 90s | End-to-end flow from landing to email, single demo path |
| Problem-solution fit | "How it's different" table + Market math section above |
| Market size & willingness to pay | Market math section (defensible SAM, not inflated TAM) |

---

## Team

**Dan Harrison** — Product, demo flow, pitch, design direction. Founder of [WombatLabs](https://wombatlabs.ai), a fractional design partner for AI startups. Dan is the customer — that's the pitch hook.

**Kevin** — Parallel build track. Owned a second prototype in a different tool (Claude Code + Framer Motion) as demo reliability insurance. Final shipped build chosen at the 2:50pm checkpoint based on which ran cleanest.

---

## Related artifacts in this repo

- [`swipesignal-PRD.md`](./swipesignal-PRD.md) — full product requirements document
- [`swipesignal-ui-design.md`](./swipesignal-ui-design.md) — locked UI specification
- [`swipesignal-pitch-playbook.md`](./swipesignal-pitch-playbook.md) — pitch script + judge-specific emphasis

---

## Contact

Dan Harrison — [dan@wombatlabs.ai](mailto:dan@wombatlabs.ai) — [WombatLabs](https://wombatlabs.ai)

*SwipeSignal — Think Tinder, but for confirming prospect intelligence.*
