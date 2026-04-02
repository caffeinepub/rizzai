import { getTrustBadge } from "@/utils/trustUtils";

interface TrustBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function TrustBadge({ score, size = "md" }: TrustBadgeProps) {
  const badge = getTrustBadge(score);
  const sizeClass =
    size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${sizeClass} ${badge.bgColor} ${badge.borderColor} ${badge.color}`}
    >
      {badge.label}
    </span>
  );
}
