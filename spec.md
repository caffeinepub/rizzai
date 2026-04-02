# RizzAI Profile Detail Screen

## Current State
App has Home, Chat, Profile, and Discover screens. Discover shows ranked scrollable profile cards with avatar, name, age, activity, bio, interests, trust score, Start Chat CTA. Mock data: 12 profiles in mockData.ts.

## Requested Changes (Diff)

### Add
- ProfileDetailScreen.tsx: full-screen overlay opened from Discover card tap.
  - Top: tall full-width hero image (or gradient placeholder with initials), name+age overlay bottom-left, activity badge.
  - Trust Card: horizontal bar 0-100, color-coded label (High/Good/Building Trust), numeric score.
  - Bio Card: bio text.
  - Interests: tag chips.
  - Action Buttons sticky bottom: primary Start Chat + secondary Save and Skip.
  - AI Hook line above actions: lightbulb emoji + "Use AI to start a better conversation".
  - Smooth scroll content, sticky CTA bar.

### Modify
- DiscoverScreen.tsx: tapping card opens ProfileDetailScreen overlay with slide-up animation (selectedProfile state + AnimatePresence).

### Remove
- Nothing.

## Implementation Plan
1. Create ProfileDetailScreen.tsx with all sections.
2. Update DiscoverScreen.tsx to add selectedProfile state and overlay rendering.
3. ProfileDetailScreen props: profile, onClose, onStartChat, onSave, onSkip.
