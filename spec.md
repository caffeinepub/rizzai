# RizzAI — Monetization System (Version 14)

## Current State
App has Login, onboarding flows, Home, Discover, Chat, Profile screens. Profile has a simple premium banner ('RizzAI Premium / Upgrade' button) that does nothing. Chat has an AI assistant panel (✨ button) with suggestion modes. No pricing, no credit system, no upsell flows exist.

## Requested Changes (Diff)

### Add
- **PricingScreen** component: full-screen modal/sheet showing 3 plan cards (Free, Pro ₹599/mo, Elite ₹1199/mo) with benefit-focused copy, no hard pressure. Accessible from Profile > 'Premium' settings row and from the premium banner.
- **CreditPacksSection** inside PricingScreen: three credit pack options (₹99→50 credits, ₹199→150, ₹499→500). Framed as "top-up when needed."
- **Soft upsell nudge in ChatScreen**: a subtle banner that appears after the user sends 2+ messages in a conversation, with text "✨ Use AI to improve this reply" and a small CTA button. Non-blocking, dismissable.
- **AI credit counter** in the AI assistant panel header: show remaining free credits (e.g. "5 credits left") with a small 'Get more' link that opens PricingScreen.
- **Value messaging** throughout: benefit-first language — "Get better replies", "Increase your chances", "Write messages that get responses".

### Modify
- **ProfileScreen**: wire the premium banner 'Upgrade' button and the 'Premium' settings row to open PricingScreen.
- **ChatScreen AI panel**: add credit counter in panel header; show soft upsell nudge after engagement threshold.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `PricingScreen.tsx` with plan cards (Free/Pro/Elite), benefit lists, and credit packs section. Dark theme, card-based layout, clean spacing.
2. Add `showPricing` state in `App.tsx`; pass `onOpenPricing` callback down to ProfileScreen and ChatScreen.
3. Wire Profile premium banner + settings row to `onOpenPricing`.
4. Add soft upsell nudge in ChatScreen — appears after 2 messages sent, dismissable with X, opens pricing on CTA tap.
5. Add credit counter in AI assistant panel header.
6. All copy is value-focused, never pressuring.
