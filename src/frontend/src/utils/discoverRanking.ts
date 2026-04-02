import type { Match } from "@/data/mockData";

export type ActivityStatus = "active-now" | "recently-active" | null;

export function getActivityStatus(lastActive: Date): ActivityStatus {
  const diffMs = Date.now() - lastActive.getTime();
  const diffMin = diffMs / 60000;
  if (diffMin < 5) return "active-now";
  if (diffMin < 60) return "recently-active";
  return null;
}

function recencyScore(lastActive: Date): number {
  const diffMs = Date.now() - lastActive.getTime();
  const diffMin = diffMs / 60000;
  if (diffMin < 5) return 1.0;
  if (diffMin < 60) return 0.7;
  if (diffMin < 60 * 24) return 0.3;
  return 0;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function scoreProfile(profile: Match): number {
  const trust = (profile.trustScore / 100) * 0.3;
  const recency = recencyScore(profile.lastActive) * 0.25;
  const complete = (profile.isComplete ? 1 : 0) * 0.15;
  const responseSpeed =
    (1 - clamp(profile.responseTimeMinutes / 60, 0, 1)) * 0.15;
  const chatScore = clamp(profile.completedChats / 20, 0, 1) * 0.15;
  return trust + recency + complete + responseSpeed + chatScore;
}

// Mulberry32 seeded PRNG — avoid param reassignment
function mulberry32(initialSeed: number) {
  let state = initialSeed;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function rankProfiles(
  profiles: Match[],
  viewerGender: "woman" | "man" | "nonbinary",
  viewerLookingFor: string[],
): Match[] {
  // Filter by mutual preference
  const compatible = profiles.filter(
    (p) =>
      p.lookingFor.includes(viewerGender) &&
      viewerLookingFor.includes(p.gender),
  );

  // Score each profile
  const scored = compatible.map((p) => ({
    profile: p,
    score: scoreProfile(p),
  }));
  scored.sort((a, b) => b.score - a.score);

  // Bucket into high-quality, nearby, and new
  const highQuality = scored
    .filter((s) => !s.profile.isNearby && !s.profile.isNew)
    .map((s) => s.profile);
  const nearby = scored.filter((s) => s.profile.isNearby).map((s) => s.profile);
  const newUsers = scored
    .filter((s) => s.profile.isNew && !s.profile.isNearby)
    .map((s) => s.profile);

  // Interleave: 1 high-quality, 1 nearby-or-new, repeat
  const nearbyOrNew = [...nearby, ...newUsers];
  const interleaved: Match[] = [];
  const maxLen = Math.max(highQuality.length, nearbyOrNew.length);
  for (let i = 0; i < maxLen; i++) {
    if (i < highQuality.length) interleaved.push(highQuality[i]);
    if (i < nearbyOrNew.length) interleaved.push(nearbyOrNew[i]);
  }

  // Dedup preserving order
  const seenIds = new Set<string>();
  const deduped: Match[] = [];
  for (const p of interleaved) {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
      deduped.push(p);
    }
  }

  // Add any remaining that didn't fit into buckets
  for (const { profile } of scored) {
    if (!seenIds.has(profile.id)) {
      deduped.push(profile);
    }
  }

  // Daily seed — shifts every 4 hours
  const seed = Math.floor(Date.now() / (4 * 3600 * 1000));
  return seededShuffle(deduped, seed);
}
