import { getMatchReasons } from "@/utils/matchInsights";
import { motion } from "motion/react";

interface Props {
  profile: {
    interests: string[];
    compatibility: number;
    lookingFor: ("man" | "woman" | "nonbinary")[];
    gender: "man" | "woman" | "nonbinary";
  };
  animationDelay?: number;
}

export function AIMatchExplanation({ profile, animationDelay = 0.08 }: Props) {
  const reasons = getMatchReasons(profile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
      data-ocid="profile.card"
      className="rounded-2xl p-4"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.16 0.04 270 / 0.85), oklch(0.13 0.025 265 / 0.90))",
        border: "1px solid oklch(0.55 0.18 265 / 0.18)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-3">
        <span className="text-sm">✨</span>
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "oklch(0.72 0.15 275)" }}
        >
          You matched because
        </span>
      </div>
      <ul className="space-y-2.5">
        {reasons.map((reason) => (
          <li key={reason.label} className="flex items-start gap-2.5">
            <span className="text-sm leading-none mt-0.5 flex-shrink-0">
              {reason.icon}
            </span>
            <div className="min-w-0">
              <span
                className="text-sm font-semibold leading-tight block"
                style={{ color: "oklch(0.88 0.04 265)" }}
              >
                {reason.label}
              </span>
              <span
                className="text-[11px] leading-tight block mt-0.5 truncate"
                style={{ color: "oklch(0.56 0.08 268)" }}
              >
                {reason.sublabel}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
