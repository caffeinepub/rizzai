import type { Match } from "@/data/mockData";
import {
  CURRENT_USER_INTERESTS,
  getMatchInsights,
} from "@/utils/matchInsights";
import { MessageCircle, Sparkles, UserPlus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

function getSuggestedMessage(profile: Match): string {
  const shared = getMatchInsights(CURRENT_USER_INTERESTS, profile.interests);
  if (shared.length >= 2) {
    const [a, b] = shared;
    return `Hey ${profile.name.split(" ")[0]}! I noticed we both love ${a} and ${b} — what's been your favourite experience so far? 😊`;
  }
  if (shared.length === 1) {
    const [a] = shared;
    return `Hey ${profile.name.split(" ")[0]}! Big fan of ${a} too — what got you into it? 😄`;
  }
  return `Hey ${profile.name.split(" ")[0]}! Your vibe is 🔥 — what's one thing you're really into right now?`;
}

interface ConnectBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Match | null;
  onAIConnect: (profile: Match) => void;
  onNormalConnect: (profile: Match) => void;
}

export function ConnectBottomSheet({
  isOpen,
  onClose,
  profile,
  onAIConnect,
  onNormalConnect,
}: ConnectBottomSheetProps) {
  if (!profile) return null;

  const suggestedMsg = getSuggestedMessage(profile);

  const handleAI = () => {
    onAIConnect(profile);
    onClose();
  };

  const handleNormal = () => {
    onNormalConnect(profile);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 bg-black/60"
            onClick={onClose}
            data-ocid="connect_sheet.modal"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
            className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/5 px-5 pt-3 pb-8"
            style={{ background: "oklch(0.13 0.014 255)" }}
          >
            {/* Drag handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-white/10" />
            </div>

            {/* Profile row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-shrink-0">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-11 h-11 rounded-full object-cover border-2"
                    style={{ borderColor: "oklch(0.62 0.22 265 / 0.5)" }}
                  />
                ) : (
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold"
                    style={{
                      background: "oklch(0.22 0.04 265)",
                      color: "oklch(0.75 0.18 265)",
                    }}
                  >
                    {profile.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight">
                  Connect with {profile.name.split(" ")[0]}
                </p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Start strong with a better first message
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                data-ocid="connect_sheet.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Option — Highlighted card */}
            <div
              className="rounded-2xl p-4 mb-3 border"
              style={{
                background: "oklch(0.16 0.03 270)",
                borderColor: "oklch(0.62 0.22 265 / 0.35)",
              }}
            >
              {/* Badge */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{
                    background: "oklch(0.62 0.22 265 / 0.2)",
                    color: "oklch(0.82 0.18 265)",
                    border: "1px solid oklch(0.62 0.22 265 / 0.3)",
                  }}
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  AI Powered
                </span>
              </div>

              {/* Suggested message preview */}
              <p
                className="text-xs leading-relaxed mb-3 italic"
                style={{ color: "oklch(0.75 0.08 265)" }}
              >
                &ldquo;{suggestedMsg}&rdquo;
              </p>

              {/* AI CTA */}
              <button
                type="button"
                data-ocid="connect_sheet.primary_button"
                onClick={handleAI}
                className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.22 265), oklch(0.52 0.26 280))",
                  color: "oklch(0.98 0 0)",
                  boxShadow:
                    "0 0 18px oklch(0.58 0.22 265 / 0.35), 0 4px 12px oklch(0 0 0 / 0.25)",
                }}
              >
                <MessageCircle className="w-4 h-4" />
                Send with AI 💬
              </button>
            </div>

            {/* Normal connect */}
            <button
              type="button"
              data-ocid="connect_sheet.secondary_button"
              onClick={handleNormal}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98] hover:bg-white/5"
              style={{
                borderColor: "oklch(0.3 0.02 255)",
                color: "oklch(0.65 0.05 255)",
              }}
            >
              <UserPlus className="w-4 h-4" />
              Connect
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
