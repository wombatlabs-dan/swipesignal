# SwipeSignal Demo Script

**Duration:** 90 seconds
**Viewport:** 1280px width

## Flow

1. **Landing (10s)**
   - Show hero headline with italic "Swipe"
   - "Clay" prefilled in input
   - Click "Research this company →"

2. **Loading (12-14s)**
   - Watch three steps animate sequentially
   - Point out: "Powered by Apify" in sidebar footer
   - Auto-transition to Swipe

3. **Swipe Stack (40s)**
   - Demonstrate drag right on Card 1 → approve
   - Use keyboard: press ← on Card 2 → flag
   - Type correction: "Already addressed in Q4 update"
   - Press Enter to save
   - Watch counter increment with scale animation
   - Drag left on Card 3 → flag, Skip correction
   - Press → keyboard on Card 4 → approve

4. **Email Output (20s)**
   - Show highlighted phrase referencing Card 2
   - Show Basis chips in sidebar (2 ✓, 2 ✗)
   - Show "Learned from 2 corrections" counter
   - Click "Copy email" → shows "Copied ✓"
   - Click "Regenerate" → watch email cross-fade to v2

## Backup (if drag glitches)
- Use keyboard exclusively: → and ←
- Mention: "Keyboard shortcuts are first-class, not fallback"

## Talking points
- Editorial layout signals "designed, not templated"
- No spinners, no progress bars — sequential text states
- Learning counter persists across sessions (localStorage)
- Hardcoded Clay content — demo-ready, no API calls
