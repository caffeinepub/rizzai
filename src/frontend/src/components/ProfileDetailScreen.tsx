import type { Match } from "@/data/mockData";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  MessageCircle,
  SkipForward,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  profile: Match;
  onClose: () => void;
  onStartChat: () => void;
  onSave: () => void;
  onSkip: () => void;
}

function getActivityStatus(
  lastActive: Date,
): "active-now" | "recently-active" | null {
  const diffMin = (Date.now() - lastActive.getTime()) / 60000;
  if (diffMin < 5) return "active-now";
  if (diffMin < 60) return "recently-active";
  return null;
}

function getTrustLabel(score: number): {
  label: string;
  color: string;
  barColor: string;
} {
  if (score >= 80)
    return {
      label: "High Trust",
      color: "text-emerald-400",
      barColor: "bg-emerald-500",
    };
  if (score >= 60)
    return {
      label: "Good Trust",
      color: "text-amber-400",
      barColor: "bg-amber-500",
    };
  return {
    label: "Building Trust",
    color: "text-muted-foreground",
    barColor: "bg-secondary",
  };
}

export function ProfileDetailScreen({
  profile,
  onClose,
  onStartChat,
  onSave,
  onSkip,
}: Props) {
  const activity = getActivityStatus(profile.lastActive);
  const trust = getTrustLabel(profile.trustScore);
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        data-ocid="profile.panel"
      >
        {/* Hero image section */}
        <div className="relative w-full" style={{ height: "320px" }}>
          {profile.photo ? (
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.22 0.08 265), oklch(0.16 0.05 280), oklch(0.14 0.04 250))",
              }}
            >
              <span
                className="text-6xl font-black"
                style={{ color: "oklch(0.75 0.18 265)" }}
              >
                {initials}
              </span>
            </div>
          )}

          {/* Bottom gradient overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, oklch(0.12 0.012 255), transparent)",
            }}
          />

          {/* Close button top-left */}
          <button
            type="button"
            data-ocid="profile.close_button"
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: "oklch(0.10 0.01 255 / 0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(0.22 0.022 255 / 0.5)",
            }}
            aria-label="Close"
          >
            <ArrowLeft className="w-4 h-4 text-foreground" />
          </button>

          {/* Activity badge top-right */}
          <AnimatePresence>
            {activity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.10 0.01 255 / 0.80)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid oklch(0.22 0.022 255 / 0.5)",
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity === "active-now"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    activity === "active-now"
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }`}
                >
                  {activity === "active-now" ? "Active now" : "Recently active"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + age overlay (bottom-left) */}
          <div className="absolute bottom-4 left-5">
            <h1 className="text-3xl font-black text-white leading-tight">
              {profile.name},&nbsp;
              <span className="font-light opacity-90">{profile.age}</span>
            </h1>
          </div>
        </div>

        {/* Cards section */}
        <div className="px-5 pt-4 pb-36 space-y-3">
          {/* Trust Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            data-ocid="profile.card"
            className="rounded-2xl p-4 border border-border"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Trust Score
            </p>
            <div className="flex items-center justify-between mb-3">
              <span className="text-4xl font-black text-foreground">
                {profile.trustScore}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  profile.trustScore >= 80
                    ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                    : profile.trustScore >= 60
                      ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                      : "bg-secondary border-border text-muted-foreground"
                }`}
              >
                {trust.label}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile.trustScore}%` }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${trust.barColor}`}
                style={{
                  boxShadow:
                    profile.trustScore >= 80
                      ? "0 0 10px oklch(0.6 0.2 145 / 0.5)"
                      : profile.trustScore >= 60
                        ? "0 0 10px oklch(0.7 0.2 75 / 0.5)"
                        : "none",
                }}
              />
            </div>
          </motion.div>

          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-4 border border-border"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              About
            </p>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {profile.bio}
            </p>
          </motion.div>

          {/* Interests Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl p-4 border border-border"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground/80 font-medium"
                  style={{ border: "1px solid oklch(0.58 0.22 265 / 0.35)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            {profile.responseTimeMinutes < 30 && (
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
                }}
              >
                <Zap className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground">
                  ~{profile.responseTimeMinutes}m reply
                </span>
              </div>
            )}
            {profile.isNearby && (
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
                }}
              >
                <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground">
                  Nearby
                </span>
              </div>
            )}
            {profile.completedChats > 0 && (
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.14 0.014 250))",
                }}
              >
                <MessageCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground">
                  {profile.completedChats} chats
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div
        className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-4"
        style={{
          background:
            "linear-gradient(to top, oklch(0.12 0.012 255) 80%, oklch(0.12 0.012 255 / 0) 100%)",
        }}
      >
        {/* AI Hook */}
        <p
          className="text-center text-xs font-medium mb-3"
          style={{ color: "oklch(0.75 0.18 265)" }}
        >
          💡 Use AI to start a better conversation
        </p>

        {/* Primary CTA */}
        <button
          type="button"
          data-ocid="profile.primary_button"
          onClick={onStartChat}
          className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
            color: "oklch(0.98 0 0)",
            boxShadow:
              "0 0 20px oklch(0.58 0.22 265 / 0.45), 0 4px 16px oklch(0 0 0 / 0.3)",
          }}
        >
          <MessageCircle className="w-4 h-4" />
          Start Chat
        </button>

        {/* Secondary buttons */}
        <div className="flex gap-3 mt-3">
          <button
            type="button"
            data-ocid="profile.save_button"
            onClick={onSave}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-border transition-all active:scale-[0.98] hover:border-primary/40 hover:bg-primary/5"
            style={{ color: "oklch(0.75 0.18 265)" }}
          >
            <Bookmark className="w-4 h-4" />
            Save
          </button>
          <button
            type="button"
            data-ocid="profile.secondary_button"
            onClick={onSkip}
            className="flex-1 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-border text-muted-foreground transition-all active:scale-[0.98] hover:border-border/70 hover:bg-secondary/50"
          >
            <SkipForward className="w-4 h-4" />
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
