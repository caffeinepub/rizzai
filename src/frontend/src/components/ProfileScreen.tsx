import { TrustBadge } from "@/components/TrustBadge";
import { Switch } from "@/components/ui/switch";
import { getTrustLevel } from "@/utils/trustUtils";
import {
  Bell,
  ChevronRight,
  Crown,
  Heart,
  HelpCircle,
  Lock,
  MessageCircle,
  Settings,
  Shield,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const INTERESTS = [
  "Music",
  "Travel",
  "Coffee",
  "Books",
  "Hiking",
  "Art",
  "Film",
  "Yoga",
];

const MY_TRUST_SCORE = 78;

const TRUST_BREAKDOWN = [
  {
    label: "Response Rate",
    value: "85%",
    icon: Zap,
    color: "text-teal-400",
    bg: "bg-teal-500/15",
    border: "border-teal-500/25",
  },
  {
    label: "Profile Complete",
    value: "70%",
    icon: User,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/25",
  },
  {
    label: "Reports",
    value: "0",
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/25",
  },
];

const NUDGES = [
  { emoji: "⚡", text: "Reply faster to increase trust", id: "nudge-reply" },
  {
    emoji: "✏️",
    text: "Complete your profile to improve score",
    id: "nudge-profile",
  },
];

const MOCK_VIEWERS = [
  {
    id: 1,
    name: "Priya S.",
    age: 23,
    photo: "https://i.pravatar.cc/150?img=5",
    matchPercent: 94,
    timeAgo: "2m ago",
  },
  {
    id: 2,
    name: "Ava M.",
    age: 25,
    photo: "https://i.pravatar.cc/150?img=9",
    matchPercent: 88,
    timeAgo: "15m ago",
  },
  {
    id: 3,
    name: "Mia R.",
    age: 22,
    photo: "https://i.pravatar.cc/150?img=20",
    matchPercent: 76,
    timeAgo: "1h ago",
  },
  {
    id: 4,
    name: "Zoe K.",
    age: 27,
    photo: "https://i.pravatar.cc/150?img=32",
    matchPercent: 91,
    timeAgo: "2h ago",
  },
  {
    id: 5,
    name: "Lily T.",
    age: 24,
    photo: "https://i.pravatar.cc/150?img=44",
    matchPercent: 83,
    timeAgo: "3h ago",
  },
  {
    id: 6,
    name: "Nina B.",
    age: 26,
    photo: "https://i.pravatar.cc/150?img=48",
    matchPercent: 79,
    timeAgo: "5h ago",
  },
  {
    id: 7,
    name: "Sara J.",
    age: 21,
    photo: "https://i.pravatar.cc/150?img=56",
    matchPercent: 85,
    timeAgo: "6h ago",
  },
  {
    id: 8,
    name: "Emma L.",
    age: 28,
    photo: "https://i.pravatar.cc/150?img=60",
    matchPercent: 72,
    timeAgo: "8h ago",
  },
];

interface ProfileScreenProps {
  onOpenPricing: () => void;
  boostEndsAt: number | null;
  onActivateBoost: (endsAt: number | null) => void;
}

function useBoostTimer(
  boostEndsAt: number | null,
  onExpire: () => void,
): string {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!boostEndsAt) {
      setDisplay("");
      return;
    }

    const tick = () => {
      const secondsLeft = Math.max(
        0,
        Math.floor((boostEndsAt - Date.now()) / 1000),
      );
      const mins = Math.floor(secondsLeft / 60)
        .toString()
        .padStart(2, "0");
      const secs = (secondsLeft % 60).toString().padStart(2, "0");
      setDisplay(`${mins}:${secs}`);
      if (secondsLeft === 0) {
        onExpire();
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [boostEndsAt, onExpire]);

  return display;
}

export function ProfileScreen({
  onOpenPricing,
  boostEndsAt,
  onActivateBoost,
}: ProfileScreenProps) {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [justActivated, setJustActivated] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const trustLevel = getTrustLevel(MY_TRUST_SCORE);

  const isBoostActive = boostEndsAt !== null && boostEndsAt > Date.now();

  const boostTimer = useBoostTimer(boostEndsAt, () => onActivateBoost(null));

  const handleActivate = () => {
    const durationMs = selectedDuration * 60 * 1000;
    onActivateBoost(Date.now() + durationMs);
    setJustActivated(true);
    setTimeout(() => setJustActivated(false), 700);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <button
          type="button"
          data-ocid="profile.settings.button"
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Avatar + Identity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-5 pb-6"
      >
        <div className="relative">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-primary-foreground"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.45 0.22 280))",
            }}
          >
            A
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Alex Rivera</h2>
        <p className="text-sm text-muted-foreground">25 · New York, NY</p>
        <p className="text-sm text-center text-muted-foreground mt-2 max-w-[240px] leading-relaxed">
          Building things by day, exploring the city by night. Always up for a
          good conversation.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mx-5 mb-5 grid grid-cols-3 gap-2">
        {[
          { label: "Matches", value: "12", icon: Heart },
          { label: "Chats", value: "3", icon: MessageCircle },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            data-ocid={`profile.item.${i + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="rounded-2xl p-3 text-center border border-border"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.13 0.013 250))",
            }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}

        {/* Trust Score stat card */}
        <motion.div
          data-ocid="profile.item.3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="rounded-2xl p-3 text-center border border-emerald-500/25 col-span-1"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.17 0.018 145 / 0.4), oklch(0.13 0.013 250))",
          }}
        >
          <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
          <p className="text-xl font-bold text-foreground">{MY_TRUST_SCORE}</p>
          <p className="text-xs text-muted-foreground">Trust</p>
        </motion.div>
      </div>

      {/* Viewed You Section */}
      <ViewedYouSection
        viewers={MOCK_VIEWERS}
        isPremium={isPremium}
        onTogglePremium={() => setIsPremium((p) => !p)}
        onOpenPricing={onOpenPricing}
      />

      {/* Trust Score Card */}
      <div className="mx-5 mb-5">
        <motion.div
          data-ocid="profile.trust.card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="rounded-2xl p-4 border border-emerald-500/20"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.17 0.02 145 / 0.3), oklch(0.14 0.014 250))",
          }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Trust Score
          </p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl font-black text-foreground">
              {MY_TRUST_SCORE}
            </span>
            <TrustBadge score={MY_TRUST_SCORE} size="md" />
          </div>
          {/* Progress bar */}
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${MY_TRUST_SCORE}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Your score is updated based on your activity.
          </p>
        </motion.div>
      </div>

      {/* Low trust warning */}
      {trustLevel === "low" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-4 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2"
          data-ocid="profile.error_state"
        >
          <span className="text-base leading-none">⚠️</span>
          <p className="text-xs text-rose-400 leading-relaxed">
            <span className="font-bold">Limited reach.</span> Your trust score
            is low — fewer people will see your profile. Improve it by replying
            faster and completing your profile.
          </p>
        </motion.div>
      )}

      {/* Behavioral nudges */}
      <div className="mx-5 mb-5 space-y-2">
        {NUDGES.map((nudge, i) => (
          <motion.div
            key={nudge.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.1 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/25 bg-amber-500/10"
            data-ocid={`profile.${nudge.id}.card`}
          >
            <span className="text-base leading-none flex-shrink-0">
              {nudge.emoji}
            </span>
            <p className="text-xs text-amber-300 font-medium leading-relaxed">
              {nudge.text}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Trust Breakdown */}
      <div className="px-5 mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Trust Breakdown
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {TRUST_BREAKDOWN.map(
            ({ label, value, icon: Icon, color, bg, border }, i) => (
              <motion.div
                key={label}
                data-ocid={`profile.trust.item.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className={`rounded-2xl p-3 text-center border ${border} ${bg}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl ${bg} border ${border} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                  {label}
                </p>
              </motion.div>
            ),
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="px-5 mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Premium Banner */}
      <div className="mx-5 mb-5">
        <motion.div
          data-ocid="profile.premium.card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.16 75), oklch(0.45 0.2 50), oklch(0.5 0.18 40))",
          }}
        >
          <div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, white, transparent)",
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-100" />
                <span className="text-sm font-bold text-yellow-100">
                  RizzAI Premium
                </span>
              </div>
              <p className="text-xs text-yellow-200/80">
                Unlimited matches · AI coach · Priority
              </p>
            </div>
            <button
              type="button"
              data-ocid="profile.premium.button"
              onClick={onOpenPricing}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-semibold"
            >
              Upgrade
            </button>
          </div>
        </motion.div>
      </div>

      {/* Smart Boost Card */}
      <div className="mx-5 mb-5" ref={cardRef}>
        <SmartBoostCard
          isBoostActive={isBoostActive}
          boostTimer={boostTimer}
          selectedDuration={selectedDuration}
          onSelectDuration={setSelectedDuration}
          onActivate={handleActivate}
          onCancel={() => onActivateBoost(null)}
          justActivated={justActivated}
        />
      </div>

      {/* Settings List */}
      <div className="px-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Settings
        </h3>
        <div className="space-y-1 rounded-2xl overflow-hidden border border-border">
          <SettingsRow
            icon={Bell}
            label="Notifications"
            ocid="profile.notifications.toggle"
            rightElement={
              <Switch
                checked={notificationsOn}
                onCheckedChange={setNotificationsOn}
                data-ocid="profile.notifications.switch"
              />
            }
          />
          <SettingsRow
            icon={Shield}
            label="Privacy"
            ocid="profile.privacy.button"
            chevron
          />
          <SettingsRow
            icon={Crown}
            label="Premium"
            ocid="profile.premium_settings.button"
            chevron
            accent
            onClick={onOpenPricing}
          />
          <SettingsRow
            icon={HelpCircle}
            label="Help & Support"
            ocid="profile.help.button"
            chevron
          />
        </div>
      </div>
    </div>
  );
}

interface Viewer {
  id: number;
  name: string;
  age: number;
  photo: string;
  matchPercent: number;
  timeAgo: string;
}

function ViewedYouSection({
  viewers,
  isPremium,
  onTogglePremium,
  onOpenPricing,
}: {
  viewers: Viewer[];
  isPremium: boolean;
  onTogglePremium: () => void;
  onOpenPricing: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mx-5 mb-5"
      data-ocid="profile.viewed_you.section"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-foreground">Viewed you 👀</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {viewers.length} people checked you out today
          </p>
        </div>
        {/* Demo toggle */}
        <button
          type="button"
          data-ocid="profile.viewed_you.toggle"
          onClick={onTogglePremium}
          className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors"
          style={{
            borderColor: isPremium
              ? "oklch(0.75 0.18 75 / 0.5)"
              : "oklch(0.4 0.03 250 / 0.5)",
            color: isPremium ? "oklch(0.85 0.15 75)" : "oklch(0.55 0.04 250)",
            background: isPremium
              ? "oklch(0.75 0.18 75 / 0.12)"
              : "oklch(0.25 0.02 250 / 0.4)",
          }}
        >
          {isPremium ? "✦ Premium" : "Free"}
        </button>
      </div>

      {/* Horizontal scroll row */}
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
        data-ocid="profile.viewed_you.list"
      >
        {viewers.map((viewer, i) => (
          <ViewerCard
            key={viewer.id}
            viewer={viewer}
            isPremium={isPremium}
            index={i}
          />
        ))}
      </div>

      {/* Free CTA */}
      <AnimatePresence>
        {!isPremium && (
          <motion.div
            key="free-cta"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="flex justify-center mt-3"
          >
            <button
              type="button"
              data-ocid="profile.viewed_you.primary_button"
              onClick={onOpenPricing}
              className="text-xs font-semibold px-5 py-2 rounded-full border transition-all hover:opacity-90 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 265 / 0.2), oklch(0.45 0.22 280 / 0.2))",
                borderColor: "oklch(0.58 0.22 265 / 0.4)",
                color: "oklch(0.78 0.14 265)",
              }}
            >
              See who viewed you →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ViewerCard({
  viewer,
  isPremium,
  index,
}: {
  viewer: Viewer;
  isPremium: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, duration: 0.25 }}
      data-ocid={`profile.viewed_you.item.${index + 1}`}
      className="flex-shrink-0 w-[100px] rounded-xl overflow-hidden border border-white/10 relative"
      style={{
        background: "oklch(0.15 0.018 255)",
      }}
    >
      {/* Photo area */}
      <div className="relative w-full h-[110px] overflow-hidden">
        <img
          src={viewer.photo}
          alt={isPremium ? viewer.name : "Hidden profile"}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isPremium ? "" : "blur-md scale-110"
          }`}
        />
        {/* Match % badge */}
        <div
          className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
          style={{
            background: "oklch(0.52 0.2 265 / 0.85)",
            backdropFilter: "blur(4px)",
          }}
        >
          {viewer.matchPercent}%
        </div>
        {/* Lock overlay for free users */}
        {!isPremium && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.15 0.02 255 / 0.75)",
                backdropFilter: "blur(2px)",
              }}
            >
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-2 py-2">
        <p className="text-xs font-semibold text-foreground truncate">
          {isPremium ? viewer.name : "???"}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {viewer.timeAgo}
        </p>
      </div>
    </motion.div>
  );
}

function SmartBoostCard({
  isBoostActive,
  boostTimer,
  selectedDuration,
  onSelectDuration,
  onActivate,
  onCancel,
  justActivated,
}: {
  isBoostActive: boolean;
  boostTimer: string;
  selectedDuration: 30 | 60;
  onSelectDuration: (d: 30 | 60) => void;
  onActivate: () => void;
  onCancel: () => void;
  justActivated: boolean;
}) {
  return (
    <motion.div
      data-ocid="profile.boost.card"
      animate={justActivated ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl p-4 border"
      style={{
        background: isBoostActive
          ? "linear-gradient(145deg, oklch(0.16 0.03 290), oklch(0.13 0.02 290))"
          : "linear-gradient(145deg, oklch(0.16 0.025 290), oklch(0.13 0.018 280))",
        borderColor: isBoostActive
          ? "oklch(0.62 0.22 290 / 0.35)"
          : "oklch(0.62 0.22 290 / 0.2)",
      }}
    >
      {/* Pulsing border ring when active */}
      {isBoostActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: "1px solid oklch(0.62 0.22 290 / 0.5)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Activation burst */}
      <AnimatePresence>
        {justActivated && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ scale: 0.6, opacity: 0.7 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(circle, oklch(0.62 0.22 290 / 0.3) 0%, transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-xl leading-none"
            animate={justActivated ? { y: [0, -8, 0] } : { y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 400 }}
          >
            🚀
          </motion.span>
          <div>
            <p className="text-sm font-bold text-foreground">Smart Boost</p>
            {!isBoostActive && (
              <p className="text-xs text-muted-foreground">
                Get more visibility for a limited time
              </p>
            )}
          </div>
        </div>
        {isBoostActive && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
            style={{ background: "oklch(0.62 0.22 290)" }}
          >
            🚀 Boost Active
          </motion.span>
        )}
      </div>

      {/* Content: inactive vs active */}
      <AnimatePresence mode="wait">
        {isBoostActive ? (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Timer */}
            <div className="flex items-center justify-center py-3">
              <span
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.82 0.15 290)",
                }}
              >
                {boostTimer}
              </span>
              <span className="ml-2 text-sm text-muted-foreground">
                remaining
              </span>
            </div>
            <p className="text-xs text-center text-muted-foreground mb-3">
              Your profile is being shown to more users
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                data-ocid="profile.boost.cancel_button"
                onClick={onCancel}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Cancel Boost
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="inactive"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {/* Duration selector */}
            <div className="flex gap-2 mb-3">
              {([30, 60] as const).map((dur) => (
                <button
                  key={dur}
                  type="button"
                  data-ocid={`profile.boost.${dur}min.toggle`}
                  onClick={() => onSelectDuration(dur)}
                  className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all border"
                  style={{
                    background:
                      selectedDuration === dur
                        ? "oklch(0.62 0.22 290 / 0.2)"
                        : "transparent",
                    borderColor:
                      selectedDuration === dur
                        ? "oklch(0.62 0.22 290 / 0.6)"
                        : "oklch(0.62 0.22 290 / 0.15)",
                    color:
                      selectedDuration === dur
                        ? "oklch(0.82 0.15 290)"
                        : "oklch(0.65 0.05 290)",
                  }}
                >
                  {dur} min
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              type="button"
              data-ocid="profile.boost.primary_button"
              onClick={onActivate}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98] hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.22 290), oklch(0.52 0.22 290))",
              }}
            >
              Boost Profile 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  ocid,
  rightElement,
  chevron,
  accent,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  ocid: string;
  rightElement?: React.ReactNode;
  chevron?: boolean;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-card hover:bg-secondary/40 transition-colors text-left border-b border-border last:border-0"
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-yellow-500/20" : "bg-secondary"}`}
      >
        <Icon
          className={`w-4 h-4 ${accent ? "text-yellow-400" : "text-muted-foreground"}`}
        />
      </div>
      <span
        className={`flex-1 text-sm font-medium ${accent ? "text-yellow-300" : "text-foreground"}`}
      >
        {label}
      </span>
      {rightElement ??
        (chevron && <ChevronRight className="w-4 h-4 text-muted-foreground" />)}
    </button>
  );
}
