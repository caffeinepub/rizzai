// Current user's interests baseline for AI match insights
export const CURRENT_USER_INTERESTS = [
  "Travel",
  "Music",
  "Coffee",
  "Design",
  "Yoga",
  "Cooking",
  "Running",
  "Photography",
];

// Current user baseline profile for vibe + intent matching
export const CURRENT_USER = {
  interests: CURRENT_USER_INTERESTS,
  vibe: "Chill",
  intent: "Meaningful connection",
  gender: "woman" as const,
  lookingFor: ["man", "woman", "nonbinary"] as (
    | "man"
    | "woman"
    | "nonbinary"
  )[],
};

const INTEREST_EMOJI: Record<string, string> = {
  Travel: "✈️",
  Music: "🎵",
  Coffee: "☕",
  Design: "🎨",
  Yoga: "🧘",
  Cooking: "🍳",
  Running: "🏃",
  Photography: "📷",
  Hiking: "🥾",
  Art: "🖌️",
  Books: "📚",
  Film: "🎬",
  Tech: "💻",
  Fitness: "💪",
  Startups: "🚀",
  Wine: "🍷",
  Jazz: "🎷",
  UX: "✏️",
  Writing: "📝",
  Cats: "🐱",
  Anime: "🌸",
  Gaming: "🎮",
};

export function getMatchInsights(
  userInterests: string[],
  matchInterests: string[],
): string[] {
  const userSet = new Set(userInterests.map((i) => i.toLowerCase()));
  return matchInterests.filter((i) => userSet.has(i.toLowerCase()));
}

export function getInterestEmoji(interest: string): string {
  return INTEREST_EMOJI[interest] ?? "✨";
}

export function formatInsightLine(shared: string[]): string {
  if (shared.length === 0) return "";
  if (shared.length === 1) return `You both like ${shared[0]}`;
  if (shared.length === 2) return `You both like ${shared[0]} + ${shared[1]}`;
  return `You both like ${shared[0]} + ${shared[1]} + ${shared.length - 2} more`;
}

export interface MatchReason {
  icon: string;
  label: string;
  sublabel: string;
}

export function getMatchReasons(
  profile: {
    interests: string[];
    compatibility: number;
    lookingFor: ("man" | "woman" | "nonbinary")[];
    gender: "man" | "woman" | "nonbinary";
  },
  currentUser = CURRENT_USER,
): MatchReason[] {
  const shared = getMatchInsights(currentUser.interests, profile.interests);
  const interestSublabel =
    shared.length > 0 ? shared.slice(0, 3).join(", ") : "Overlapping passions";

  let vibeSublabel: string;
  if (profile.compatibility >= 90) {
    vibeSublabel = "Highly compatible energy";
  } else if (profile.compatibility >= 75) {
    vibeSublabel = "Relaxed + open-minded";
  } else {
    vibeSublabel = "Complementary styles";
  }

  const intentMatches = profile.lookingFor.includes(currentUser.gender);
  const intentSublabel = intentMatches
    ? "Looking for meaningful connection"
    : "Open to getting to know you";

  return [
    { icon: "🎯", label: "Same interests", sublabel: interestSublabel },
    { icon: "💫", label: "Similar vibe", sublabel: vibeSublabel },
    { icon: "🤝", label: "Matching intent", sublabel: intentSublabel },
  ];
}
