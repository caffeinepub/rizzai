# RizzAI

## Current State
The app has swipe-based Home screen with match cards, AI First Message overlay after swiping right, chat with AI assistant panel, trust system, monetization, Smart Boost, Who Viewed You, and conversation health meter.

## Requested Changes (Diff)

### Add
- AI Match Insights component: a card/section that surfaces shared interests and similarities between the current user and a match
- Displayed in two places:
  1. On the swipe card (Home screen) — compact inline insight like "You both like travel + fitness"
  2. On the Profile Detail screen — a more prominent insight card with shared tags highlighted
- Mock insight data derived from the profile's interest tags compared to the user's own interests
- Insight labels styled as small pills/chips with an emoji or icon prefix (e.g. ✈️ Travel, 💪 Fitness)
- A short headline copy: "You both like [X + Y]" or "X things in common"

### Modify
- Home swipe cards: add a small match insight line below the bio/tags
- Profile Detail screen: add an "AI Insights" card section above the sticky CTA button

### Remove
- Nothing removed

## Implementation Plan
1. Define a shared `getMatchInsights(userInterests, matchInterests)` utility that returns overlapping tags
2. Add compact insight line to Home swipe cards (1 line, truncated)
3. Add AI Match Insights card to Profile Detail screen with icon pills and headline
4. Use mock user interests (travel, fitness, music, etc.) as the "current user" baseline
5. Style consistently with dark theme — subtle accent color for insight pills
