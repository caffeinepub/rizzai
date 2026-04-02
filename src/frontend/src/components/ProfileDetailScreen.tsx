import { TrustBadge } from "@/components/TrustBadge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Match } from "@/data/mockData";
import {
  CURRENT_USER_INTERESTS,
  getInterestEmoji,
  getMatchInsights,
} from "@/utils/matchInsights";
import { getTrustBadge } from "@/utils/trustUtils";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  MessageCircle,
  MoreVertical,
  SkipForward,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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

const REPORT_REASONS = [
  "Inappropriate content",
  "Spam",
  "Fake profile",
  "Harassment",
];

export function ProfileDetailScreen({
  profile,
  onClose,
  onStartChat,
  onSave,
  onSkip,
}: Props) {
  const activity = getActivityStatus(profile.lastActive);
  const trust = getTrustBadge(profile.trustScore);
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const sharedInterests = getMatchInsights(
    CURRENT_USER_INTERESTS,
    profile.interests,
  );

  const handleReport = () => {
    setReportOpen(false);
    setSelectedReason(null);
    toast.success("Report submitted");
    onClose();
  };

  const handleBlock = () => {
    setBlockOpen(false);
    toast.success(`${profile.name} blocked`);
    onClose();
  };

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

          {/* More options button top-right */}
          <button
            type="button"
            data-ocid="profile.open_modal_button"
            onClick={() => setMenuOpen(true)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{
              background: "oklch(0.10 0.01 255 / 0.75)",
              backdropFilter: "blur(12px)",
              border: "1px solid oklch(0.22 0.022 255 / 0.5)",
            }}
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 text-foreground" />
          </button>

          {/* Activity badge */}
          <AnimatePresence>
            {activity && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-16 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
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
              <TrustBadge score={profile.trustScore} size="md" />
            </div>
            {/* Progress bar */}
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profile.trustScore}%` }}
                transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
                className={`h-full rounded-full ${trust.barColor}`}
              />
            </div>
          </motion.div>

          {/* AI Match Insights Card */}
          {sharedInterests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              data-ocid="profile.card"
              className="rounded-2xl p-4 border"
              style={{
                background:
                  "linear-gradient(145deg, oklch(0.17 0.06 275), oklch(0.14 0.04 270))",
                borderColor: "oklch(0.58 0.22 265 / 0.30)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "oklch(0.72 0.18 280)" }}
                >
                  ✨ AI Match Insights
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-3">
                {sharedInterests.length === 1
                  ? `You both love ${sharedInterests[0]}`
                  : `${sharedInterests.length} things in common`}
              </p>
              <div className="flex flex-wrap gap-2">
                {sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: "oklch(0.58 0.22 265 / 0.18)",
                      border: "1px solid oklch(0.58 0.22 265 / 0.40)",
                      color: "oklch(0.82 0.16 275)",
                    }}
                  >
                    {getInterestEmoji(interest)} {interest}
                  </span>
                ))}
              </div>
              <p
                className="text-[11px] mt-3 leading-relaxed"
                style={{ color: "oklch(0.55 0.10 270)" }}
              >
                Use these to spark a conversation 💬
              </p>
            </motion.div>
          )}

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

      {/* More options bottom sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border px-5 pb-8 pt-4"
              style={{ background: "oklch(0.13 0.014 255)" }}
              data-ocid="profile.sheet"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 px-1">
                Options for {profile.name}
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  data-ocid="profile.open_modal_button"
                  onClick={() => {
                    setMenuOpen(false);
                    setReportOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/60 border border-border hover:bg-secondary transition-colors text-left"
                >
                  <span className="text-base">🚩</span>
                  <span className="text-sm font-semibold text-foreground">
                    Report
                  </span>
                </button>
                <button
                  type="button"
                  data-ocid="profile.delete_button"
                  onClick={() => {
                    setMenuOpen(false);
                    setBlockOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/15 transition-colors text-left"
                >
                  <span className="text-base">🚫</span>
                  <span className="text-sm font-semibold text-rose-400">
                    Block
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Dialog */}
      <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
        <AlertDialogContent
          className="border-border"
          style={{ background: "oklch(0.14 0.014 255)" }}
          data-ocid="profile.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Report {profile.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Select a reason for your report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-wrap gap-2 py-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                data-ocid="profile.radio"
                onClick={() => setSelectedReason(reason)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedReason === reason
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="profile.cancel_button"
              className="border-border text-muted-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              data-ocid="profile.confirm_button"
              disabled={!selectedReason}
              onClick={handleReport}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all"
            >
              Submit Report
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Dialog */}
      <AlertDialog open={blockOpen} onOpenChange={setBlockOpen}>
        <AlertDialogContent
          className="border-border"
          style={{ background: "oklch(0.14 0.014 255)" }}
          data-ocid="profile.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Block {profile.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              They won't be able to contact you or see your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="profile.cancel_button"
              className="border-border text-muted-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              data-ocid="profile.delete_button"
              onClick={handleBlock}
              className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-all"
            >
              Block
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
