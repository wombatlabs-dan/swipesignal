
The user wants the gap between the header and the main content reduced by 45% on the research page. Looking at `src/routes/research.$company.tsx`:

- `<header>` uses `pt-8` (top padding only, no bottom padding/margin)
- `<section>` uses `pt-16 pb-20` (top padding 64px, bottom 80px)

The "big white space" between header and content is the `pt-16` (64px) on the section. Reducing by 45% → ~35px → `pt-9` (36px).

I'll also slightly trim `pb-20` to keep balance, but the user only asked about the gap above content, so I'll leave `pb-20` alone.

## Plan

Edit `src/routes/research.$company.tsx`:
- Change the `<section>` className from `pt-16 pb-20` to `pt-9 pb-20` (64px → 36px top padding, a 45% reduction).

That's the only change. Header padding (`pt-8`) stays — it's the section's top padding creating the gap.

## Files touched
- `src/routes/research.$company.tsx` — one className change.
