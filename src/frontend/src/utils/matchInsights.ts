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
