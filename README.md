# SwipeSignal

Research smarter. Swipe to confirm. Send with confidence.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 18 + TypeScript
- Vite
- React Router v6
- CSS Modules
- Vitest + Testing Library

## Demo Flow

1. Landing → enter company name
2. Loading → 3-step research animation (12-14s)
3. Swipe → drag or keyboard to approve/flag insights
4. Email → generated cold email with highlighted references

## Testing

```bash
npm run test       # Run tests
npm run build      # Production build
```

## Design

See `docs/superpowers/specs/2026-04-18-swipesignal-ui-design.md` for full spec.

Key principles:
- Editorial two-column layout (280px sidebar + main content)
- Instrument Serif + Inter typography
- No Tailwind blues, no pure white/black, no spinners
- 8px spacing grid, 220ms transitions

## Hackathon Submission

**Deadline:** Saturday April 19, 3:00pm
**Demo:** 90 seconds, 1280px viewport
**Content:** Hardcoded Clay company insights (no backend)
