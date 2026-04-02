# RizzAI

## Current State
- `IdentityPreferenceFlow` collects 7 steps: identity, connectWith, intent, ageRange, distance, interestMatch, vibePreference. Calls `onComplete(prefs: MatchingPreferences)` but App.tsx discards the prefs (just sets `isPreferenceSetup = true`).
- `DiscoverScreen` has its own internal `FilterState` (ageMin, ageMax, genders, interests, minMatch) initialized to defaults. No external props for pre-filling.
- Filters work correctly once applied manually.

## Requested Changes (Diff)

### Add
- `matchingPreferences` state in App.tsx to store what user set during Identity/Preference flow.
- `initialFilters` prop on `DiscoverScreen` to accept pre-filled filter values.
- Mapping logic: `prefs.ageRange` → ageMin/ageMax; `prefs.connectWith` → genders; `prefs.vibePreference` (interests from that step) → interests (skipped if too abstract); keep other onboarding fields available for future use.
- A subtle "Based on your preferences" note in the filter drawer when filters are pre-filled.

### Modify
- `App.tsx`: change `onComplete={() => setIsPreferenceSetup(true)}` to `onComplete={(prefs) => { setMatchingPreferences(prefs); setIsPreferenceSetup(true); }}`. Pass derived initial filters to `DiscoverScreen`.
- `DiscoverScreen`: accept optional `initialFilters?: Partial<FilterState>` prop. Use it to set initial `appliedFilters` state.
- `IdentityPreferenceFlow`: no changes needed; already calls `onComplete(prefs)`.

### Remove
- Nothing.

## Implementation Plan
1. Update `App.tsx`: add `matchingPreferences` state, store prefs on flow complete, derive initialFilters object, pass to DiscoverScreen.
2. Update `DiscoverScreen`: add `initialFilters` prop, initialize `appliedFilters` state from it, show subtle "Personalized from your preferences" hint in the filter header when pre-filled.
