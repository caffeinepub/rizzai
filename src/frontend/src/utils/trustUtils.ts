export type TrustLevel = "high" | "medium" | "low";

export interface TrustBadgeInfo {
  label: "High Trust" | "Medium Trust" | "Low Trust";
  level: TrustLevel;
  color: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
}

export function getTrustBadge(score: number): TrustBadgeInfo {
  if (score >= 70) {
    return {
      label: "High Trust",
      level: "high",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/15",
      borderColor: "border-emerald-500/30",
      barColor: "bg-emerald-500",
    };
  }
  if (score >= 40) {
    return {
      label: "Medium Trust",
      level: "medium",
      color: "text-amber-400",
      bgColor: "bg-amber-500/15",
      borderColor: "border-amber-500/30",
      barColor: "bg-amber-500",
    };
  }
  return {
    label: "Low Trust",
    level: "low",
    color: "text-rose-400",
    bgColor: "bg-rose-500/15",
    borderColor: "border-rose-500/30",
    barColor: "bg-rose-500",
  };
}

export function getTrustLevel(score: number): TrustLevel {
  return getTrustBadge(score).level;
}
