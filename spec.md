# RizzAI

## Current State
- Bottom nav exists in App.tsx with 4 tabs (Home, Discover, Chat, Profile) using a spring-animated indicator with `bg-primary/15` background highlight
- Discover cards show: avatar, name/age, activity badge, bio, interests, trust score, response time, and a "Start Chat" button
- No match % displayed on cards
- Active tab uses a subtle bg fill, no neon glow

## Requested Changes (Diff)

### Add
- Soft neon glow effect on active tab icon (box-shadow / drop-shadow with primary color)
- Match % displayed prominently on each Discover profile card
- "Connect" button replacing "Start Chat" on profile cards (tapping card still opens full profile)

### Modify
- Bottom nav: active tab should show a soft neon glow on the icon (not just a bg fill)
- Discover card: show match % as a visible badge/stat next to name or in a meta row
- Discover card action button label: "Connect" instead of "Start Chat"

### Remove
- Nothing removed; existing layout preserved

## Implementation Plan
1. In App.tsx: update active tab indicator to use a neon glow (filter: drop-shadow or box-shadow with primary OKLCH color) on the icon instead of / in addition to the bg fill
2. In DiscoverScreen.tsx ProfileCard: add `profile.compatibility` displayed as "{match}% match" in the meta row
3. In DiscoverScreen.tsx ProfileCard: rename button from "Start Chat" to "Connect" (keep same onClick behavior — open profile detail)
