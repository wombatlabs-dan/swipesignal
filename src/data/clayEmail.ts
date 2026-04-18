export interface EmailData {
  subject: string
  body: string
  highlightedPhrase: string
}

export const clayEmailV1: EmailData = {
  subject: 'Your SDR hiring spree meets our three-minute onboarding',
  body: `Saw you just opened a round of SDR roles across multiple cities - congrats on the momentum.

One thing caught my eye in your G2 reviews: a consistent note that your setup takes two to four weeks even for experienced ops teams. The research workflow you\'re scaling into is the exact bottleneck.

SwipeSignal gets that workflow to three minutes - and it compounds on each rep\'s judgment every time they swipe. Worth a 15-minute call?`,
  highlightedPhrase: 'your setup takes two to four weeks even for experienced ops teams',
}

export const clayEmailV2: EmailData = {
  subject: 'Complexity is a board-level problem now',
  body: `Saw your latest funding announcement specifically call out product-led growth as the expansion strategy - that\'s a clear signal.

Your G2 reviews tell a different story: non-technical users consistently mention needing a dedicated RevOps engineer just to operate Clay. That gap between PLG ambition and setup complexity is exactly what we solve.

SwipeSignal turns research into judgment calls - three minutes to onboard, zero technical overhead. Want to see it?`,
  highlightedPhrase: 'non-technical users consistently mention needing a dedicated RevOps engineer just to operate Clay',
}
