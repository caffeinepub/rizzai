import { ConnectBottomSheet } from "@/components/ConnectBottomSheet";
import { Badge } from "@/components/ui/badge";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import {
  CURRENT_USER_INTERESTS,
  formatInsightLine,
  getMatchInsights,
} from "@/utils/matchInsights";
import { Bell, Clock, Compass, Heart, Sparkles, X, Zap } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProfileDetailScreen } from "./ProfileDetailScreen";

const DAILY_MATCHES = MOCK_MATCHES.slice(0, 3);
const ALL_ACTIVE_MATCHES = MOCK_MATCHES.filter(
  (m) => Date.now() - m.lastActive.getTime() < 5 * 60 * 1000,
);

interface HomeScreenProps {
  onConnectMatch?: (match: Match) => void;
  onConnect: (matchId: string) => void;
  connectedIds: Set<string>;
  onGoToDiscover?: () => void;
  onOpenPricing?: () => void;
  boostEndsAt?: number | null;
  onBoostActivate?: (endsAt: number) => void;
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

export function HomeScreen({
  onConnect,
  onConnectMatch,
  connectedIds: _connectedIds,
  onGoToDiscover,
  onOpenPricing,
  boostEndsAt,
  onBoostActivate,
}: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailProfile, setDetailProfile] = useState<Match | null>(null);
  const [connectSheetProfile, setConnectSheetProfile] = useState<Match | null>(
    null,
  );
  const timeLeft = useCountdown();

  // Smart Boost Popup
  const [swipeCount, setSwipeCount] = useState(0);
  const [smartBoostPopupVisible, setSmartBoostPopupVisible] = useState(false);
  const hasShownBoostPopup = useRef(false);

  // Instant Match Mode
  const [instantMatchActive, setInstantMatchActive] = useState(false);
  const [instantMatchSecondsLeft, setInstantMatchSecondsLeft] = useState(600);
  const instantMatchTimerRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const isBoostActive = !!boostEndsAt && boostEndsAt > Date.now();

  const displayedMatches = instantMatchActive
    ? ALL_ACTIVE_MATCHES
    : DAILY_MATCHES;
  const isDone = currentIndex >= displayedMatches.length;

  // Smart Boost popup trigger
  useEffect(() => {
    if (swipeCount >= 3 && !isBoostActive && !hasShownBoostPopup.current) {
      hasShownBoostPopup.current = true;
      setSmartBoostPopupVisible(true);
    }
  }, [swipeCount, isBoostActive]);

  // Instant Match countdown
  useEffect(() => {
    if (instantMatchActive) {
      setInstantMatchSecondsLeft(600);
      setCurrentIndex(0);
      instantMatchTimerRef.current = setInterval(() => {
        setInstantMatchSecondsLeft((prev) => {
          if (prev <= 1) {
            setInstantMatchActive(false);
            if (instantMatchTimerRef.current)
              clearInterval(instantMatchTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (instantMatchTimerRef.current)
        clearInterval(instantMatchTimerRef.current);
    }
    return () => {
      if (instantMatchTimerRef.current)
        clearInterval(instantMatchTimerRef.current);
    };
  }, [instantMatchActive]);

  const handleConnectRequest = (match: Match) => {
    setCurrentIndex((prev) => prev + 1);
    setSwipeCount((prev) => prev + 1);
    setConnectSheetProfile(match);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
    setSwipeCount((prev) => prev + 1);
  };

  const handleAIConnect = (match: Match) => {
    if (onConnectMatch) {
      onConnectMatch(match);
    } else {
      onConnect(match.id);
    }
  };

  const handleNormalConnect = (match: Match) => {
    onConnect(match.id);
  };

  const handleBoostNow = () => {
    const endsAt = Date.now() + 30 * 60 * 1000;
    onBoostActivate?.(endsAt);
    setSmartBoostPopupVisible(false);
  };

  const toggleInstantMatch = () => {
    setInstantMatchActive((prev) => !prev);
    if (!instantMatchActive) setCurrentIndex(0);
  };

  const formatInstantTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {detailProfile && (
        <div className="absolute inset-0 z-50">
          <ProfileDetailScreen
            profile={detailProfile}
            onClose={() => setDetailProfile(null)}
            onStartChat={() => setDetailProfile(null)}
            onSave={() => {}}
            onSkip={() => setDetailProfile(null)}
          />
        </div>
      )}

      {/* Connect Bottom Sheet */}
      <div className="absolute inset-0 z-50 pointer-events-none">
        <div className={connectSheetProfile ? "pointer-events-auto" : ""}>
          <ConnectBottomSheet
            isOpen={!!connectSheetProfile}
            onClose={() => setConnectSheetProfile(null)}
            profile={connectSheetProfile}
            onAIConnect={handleAIConnect}
            onNormalConnect={handleNormalConnect}
          />
        </div>
      </div>

      {/* Smart Boost Popup Overlay */}
      <AnimatePresence>
        {smartBoostPopupVisible && (
          <motion.div
            key="boost-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-40 flex items-end"
            style={{ background: "oklch(0 0 0 / 0.65)" }}
            onClick={() => setSmartBoostPopupVisible(false)}
          >
            <motion.div
              key="boost-popup-sheet"
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="w-full rounded-t-3xl p-6 pb-8"
              style={{ background: "oklch(0.13 0.015 265)" }}
              onClick={(e) => e.stopPropagation()}
              data-ocid="home.boost_popup.modal"
            >
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{ background: "oklch(0.55 0.22 265 / 0.2)" }}
              >
                <span className="text-2xl">🚀</span>
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Get more matches in next 30 mins 🚀
              </h2>
              <p
                className="text-sm text-center mb-6"
                style={{ color: "oklch(0.6 0.05 265)" }}
              >
                Boost your profile now to get seen by more people
              </p>
              <button
                type="button"
                data-ocid="home.boost_now.primary_button"
                onClick={handleBoostNow}
                className="w-full py-3.5 rounded-2xl font-bold text-base text-white transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.62 0.22 290), oklch(0.52 0.22 265))",
                }}
              >
                Boost Now
              </button>
              <button
                type="button"
                data-ocid="home.boost_dismiss.button"
                onClick={() => setSmartBoostPopupVisible(false)}
                className="w-full py-3 mt-2 text-sm font-medium text-center transition-colors"
                style={{ color: "oklch(0.55 0.05 265)" }}
              >
                Maybe later
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">
            RizzAI
          </span>
          {/* Boost Active Pill */}
          <AnimatePresence>
            {isBoostActive && (
              <motion.span
                initial={{ opacity: 0, scale: 0.7, x: -4 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                data-ocid="home.boost.badge"
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: "oklch(0.62 0.22 290 / 0.85)" }}
              >
                🚀 Boost Active
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          {/* Instant Match Button */}
          <button
            type="button"
            data-ocid="home.instant_match.toggle"
            onClick={toggleInstantMatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-xs transition-all active:scale-95"
            style={{
              background: instantMatchActive
                ? "oklch(0.72 0.18 55 / 0.2)"
                : "oklch(0.22 0.02 265)",
              color: instantMatchActive
                ? "oklch(0.82 0.18 55)"
                : "oklch(0.55 0.05 265)",
              border: instantMatchActive
                ? "1px solid oklch(0.72 0.18 55 / 0.5)"
                : "1px solid oklch(0.3 0.02 265)",
            }}
          >
            <Zap className="w-3 h-3" />
            {instantMatchActive
              ? `⚡ ${formatInstantTime(instantMatchSecondsLeft)} left`
              : "Instant Match ⚡"}
          </button>
          <button
            type="button"
            data-ocid="home.notifications.button"
            className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Instant Match active banner */}
      <AnimatePresence>
        {instantMatchActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 pb-2 flex-shrink-0 overflow-hidden"
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background: "oklch(0.72 0.18 55 / 0.12)",
                border: "1px solid oklch(0.72 0.18 55 / 0.3)",
                color: "oklch(0.82 0.18 55)",
              }}
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Instant Match active — showing only users online right now
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title section */}
      <div className="px-5 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground">
          {instantMatchActive ? "Active Now" : "Today's Matches"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {instantMatchActive ? (
            <>
              <span
                className="font-semibold"
                style={{ color: "oklch(0.82 0.18 55)" }}
              >
                {ALL_ACTIVE_MATCHES.length} users
              </span>{" "}
              online right now
            </>
          ) : (
            <>
              You have{" "}
              <span className="text-foreground font-semibold">
                {DAILY_MATCHES.length} quality matches
              </span>{" "}
              today
            </>
          )}
        </p>
        {!instantMatchActive && (
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>
                New matches in{" "}
                <span className="font-mono text-foreground font-semibold">
                  {timeLeft}
                </span>
              </span>
            </div>
            {!isDone && (
              <span className="text-xs font-medium text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {currentIndex + 1}
                </span>{" "}
                / {DAILY_MATCHES.length}
              </span>
            )}
          </div>
        )}
        {!isDone && !instantMatchActive && (
          <div className="flex gap-1.5 mt-3">
            {DAILY_MATCHES.map((m, i) => (
              <div
                key={m.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < currentIndex
                    ? "bg-primary/40 flex-1"
                    : i === currentIndex
                      ? "bg-primary flex-[2]"
                      : "bg-secondary flex-1"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card area */}
      <div className="flex-1 px-5 pb-6 flex flex-col min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {instantMatchActive && ALL_ACTIVE_MATCHES.length === 0 ? (
            <motion.div
              key="instant-empty"
              data-ocid="home.instant_match.empty_state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center flex-1 text-center py-10"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: "oklch(0.72 0.18 55 / 0.12)" }}
              >
                <Zap
                  className="w-9 h-9"
                  style={{ color: "oklch(0.72 0.18 55)" }}
                />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                No active users right now
              </h2>
              <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed">
                No active users right now — check back soon ⚡
              </p>
            </motion.div>
          ) : isDone ? (
            <motion.div
              key="empty"
              data-ocid="home.empty_state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center flex-1 text-center py-10"
            >
              <div className="w-20 h-20 rounded-full bg-secondary/60 flex items-center justify-center mb-5">
                <Heart className="w-9 h-9 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                You've seen all matches for today
              </h2>
              <p className="text-sm text-muted-foreground max-w-[240px] leading-relaxed mb-2">
                Come back later or explore more in Discover
              </p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
                <Clock className="w-4 h-4" />
                <span>
                  New in{" "}
                  <span className="font-mono text-foreground font-semibold">
                    {timeLeft}
                  </span>
                </span>
              </div>
              {onGoToDiscover && (
                <button
                  type="button"
                  data-ocid="home.discover.button"
                  onClick={onGoToDiscover}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-foreground font-semibold text-sm hover:bg-secondary/80 transition-colors border border-border"
                >
                  <Compass className="w-4 h-4" />
                  Explore Discover
                </button>
              )}
              {onOpenPricing && (
                <button
                  type="button"
                  data-ocid="home.upgrade.primary_button"
                  onClick={onOpenPricing}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.98] text-white mt-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 265), oklch(0.45 0.22 265))",
                  }}
                >
                  ✨ Get more matches
                </button>
              )}
            </motion.div>
          ) : (
            <SwipeCardStack
              key={`stack-${currentIndex}-${instantMatchActive ? "instant" : "normal"}`}
              matches={displayedMatches}
              currentIndex={currentIndex}
              onConnect={handleConnectRequest}
              onSkip={handleSkip}
              onOpenProfile={(match) => setDetailProfile(match)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function StatusTags({ match }: { match: Match }) {
  const now = Date.now();
  const diffMins = (now - match.lastActive.getTime()) / 60000;
  const isActiveNow = diffMins < 5;
  const isHighTrust = match.trustScore >= 85;

  if (!isActiveNow && !isHighTrust) return null;

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
      {isActiveNow && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Active now
        </span>
      )}
      {isHighTrust && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/90 text-white flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" />
          High trust
        </span>
      )}
    </div>
  );
}

interface SwipeCardStackProps {
  matches: Match[];
  currentIndex: number;
  onConnect: (match: Match) => void;
  onSkip: () => void;
  onOpenProfile: (match: Match) => void;
}

function SwipeCardStack({
  matches,
  currentIndex,
  onConnect,
  onSkip,
  onOpenProfile,
}: SwipeCardStackProps) {
  const dragX = useMotionValue(0);
  const [isFlying, setIsFlying] = useState(false);
  const pointerDownX = useRef(0);
  const pointerDownY = useRef(0);

  const rotate = useTransform(dragX, [-200, 0, 200], [-18, 0, 18]);
  const connectOpacity = useTransform(dragX, [0, 100], [0, 1]);
  const skipOpacity = useTransform(dragX, [-100, 0], [1, 0]);

  const topMatch = matches[currentIndex];
  const nextMatch = matches[currentIndex + 1];
  const thirdMatch = matches[currentIndex + 2];

  const flyOff = (dir: "left" | "right") => {
    if (isFlying) return;
    setIsFlying(true);
    const target = dir === "right" ? 600 : -600;
    dragX.set(target);
    if (dir === "right") {
      onConnect(topMatch);
    } else {
      onSkip();
    }
  };

  const handleDragEnd = () => {
    const x = dragX.get();
    if (x > 120) {
      flyOff("right");
    } else if (x < -120) {
      flyOff("left");
    } else {
      dragX.set(0);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownX.current = e.clientX;
    pointerDownY.current = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const dx = Math.abs(e.clientX - pointerDownX.current);
    const dy = Math.abs(e.clientY - pointerDownY.current);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) {
      onOpenProfile(topMatch);
    }
  };

  if (!topMatch) return null;

  return (
    <div className="flex flex-col flex-1 gap-5">
      {/* Card stack container */}
      <div className="relative flex-1" style={{ minHeight: 0 }}>
        {/* Third card (furthest back) */}
        {thirdMatch && (
          <div
            className="absolute inset-x-0 rounded-2xl overflow-hidden border border-border bg-card"
            style={{
              bottom: 0,
              top: 0,
              transform: "scale(0.88) translateY(16px)",
              zIndex: 1,
              pointerEvents: "none",
              transformOrigin: "bottom center",
            }}
          >
            <CardPhoto match={thirdMatch} />
          </div>
        )}

        {/* Second card (middle) */}
        {nextMatch && (
          <div
            className="absolute inset-x-0 rounded-2xl overflow-hidden border border-border bg-card"
            style={{
              bottom: 0,
              top: 0,
              transform: "scale(0.94) translateY(8px)",
              zIndex: 2,
              pointerEvents: "none",
              transformOrigin: "bottom center",
            }}
          >
            <CardPhoto match={nextMatch} />
          </div>
        )}

        {/* Top card (draggable) */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden border border-border bg-card cursor-grab active:cursor-grabbing"
          style={{
            x: dragX,
            rotate,
            zIndex: 3,
            boxShadow:
              "0 8px 32px -4px oklch(0 0 0 / 0.5), 0 2px 8px -2px oklch(0 0 0 / 0.3)",
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.9}
          onDragEnd={handleDragEnd}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          data-ocid={`home.item.${currentIndex + 1}`}
        >
          {/* CONNECT overlay */}
          <motion.div
            className="absolute top-5 left-4 z-20 border-2 border-emerald-400 rounded-xl px-3 py-1.5 rotate-[-15deg]"
            style={{ opacity: connectOpacity }}
          >
            <span className="text-emerald-400 font-black text-lg tracking-wide">
              CONNECT ❤️
            </span>
          </motion.div>

          {/* SKIP overlay */}
          <motion.div
            className="absolute top-5 right-4 z-20 border-2 border-rose-400 rounded-xl px-3 py-1.5 rotate-[15deg]"
            style={{ opacity: skipOpacity }}
          >
            <span className="text-rose-400 font-black text-lg tracking-wide">
              SKIP 👋
            </span>
          </motion.div>

          <CardFull match={topMatch} index={currentIndex} />
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 pb-2 flex-shrink-0">
        <button
          type="button"
          data-ocid={`home.skip.button.${currentIndex + 1}`}
          onClick={() => flyOff("left")}
          disabled={isFlying}
          className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-secondary/80 hover:border-rose-400/50 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
          aria-label="Skip"
        >
          <X className="w-6 h-6 text-muted-foreground" />
        </button>

        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-[10px] text-muted-foreground">
            💡 AI can help you start better
          </p>
        </div>

        <button
          type="button"
          data-ocid={`home.connect.button.${currentIndex + 1}`}
          onClick={() => flyOff("right")}
          disabled={isFlying}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
          aria-label="Connect"
        >
          <Heart className="w-6 h-6 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
}

function CardPhoto({ match }: { match: Match }) {
  return (
    <div className="relative h-full bg-secondary">
      {match.photo ? (
        <img
          src={match.photo}
          alt={match.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-5xl font-bold text-muted-foreground/40">
            {getInitials(match.name)}
          </span>
        </div>
      )}
    </div>
  );
}

function CardFull({ match, index }: { match: Match; index: number }) {
  const shared = getMatchInsights(CURRENT_USER_INTERESTS, match.interests);
  const insightLine = formatInsightLine(shared);

  return (
    <div className="flex flex-col h-full">
      {/* Photo area — top 65% */}
      <div className="relative flex-[65] overflow-hidden bg-secondary">
        {match.photo ? (
          <img
            src={match.photo}
            alt={match.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-bold text-muted-foreground/40">
              {getInitials(match.name)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />

        {/* Match % badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-primary-foreground border-0 font-bold text-xs px-2.5 py-1">
            {match.compatibility}% match
          </Badge>
        </div>

        {/* Status tags */}
        <StatusTags match={match} />

        {/* Name + age overlay at bottom of photo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
          <h3 className="text-xl font-bold text-white drop-shadow">
            {match.name},{" "}
            <span className="font-normal opacity-80">{match.age}</span>
          </h3>
        </div>
      </div>

      {/* Info area — bottom 35% */}
      <div
        className="flex-[35] px-4 pt-3 pb-4 flex flex-col justify-between"
        data-ocid={`home.card.${index + 1}.panel`}
      >
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {match.bio}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {match.interests.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* AI Match Insight line */}
          {insightLine && (
            <p
              className="text-[11px] font-medium mt-2.5 truncate"
              style={{ color: "oklch(0.72 0.18 280)" }}
            >
              ✨ {insightLine}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
