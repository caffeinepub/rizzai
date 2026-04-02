# RizzAI Monetization v2

## Current State
Monetization overlay exists with Free / Pro ₹599 / Elite ₹1199 flat pricing cards, credit packs, soft upsell nudge in chat, and AI panel credit counter.

## Requested Changes (Diff)

### Add
- Duration toggle (Daily / Weekly / Monthly) on the pricing overlay
- Pro plan: Daily ₹49, Weekly ₹199, Monthly ₹599
- Elite plan: Weekly ₹299, Monthly ₹1199 (no daily option — hide daily toggle state for Elite)
- "Most Popular" badge on Pro Monthly
- "Best Value" badge on Elite Monthly
- Value-based messaging per plan: "Get better replies", "Increase your chances"
- Contextual upsell trigger: when user runs out of credits, wants more matches, or is active in chat

### Modify
- Pricing cards to show dynamic price based on selected duration toggle
- Pro and Elite card CTAs to reflect selected duration
- Credit packs section: keep ₹99/50, ₹199/150, ₹499/500 — no changes
- Soft upsell nudge in chat — keep existing, no changes

### Remove
- Static flat-price display (replace with toggle-driven display)

## Implementation Plan
1. Add a `duration` state ('daily' | 'weekly' | 'monthly') to the pricing overlay component
2. Render toggle pill (Daily / Weekly / Monthly) at top of overlay
3. Map each plan+duration to its price; hide Daily option display for Elite (show "—" or disable)
4. Show "Most Popular" on Pro Monthly, "Best Value" on Elite Monthly based on selected toggle
5. Update CTA button text dynamically: "Start Pro Daily", "Go Elite Weekly", etc.
6. Wire contextual upsell: trigger overlay open when credits hit 0 or match limit reached
7. Keep credit packs and soft chat nudge unchanged
