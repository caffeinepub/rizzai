import { Badge } from "@/components/ui/badge";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import { Bell, Clock, Compass, Heart, Sparkles, X, Zap } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProfileDetailScreen } from "./ProfileDetailScreen";

interface HomeScreenProps {
  onConnect: (matchId: string) => void;
  connectedIds: Set<string>;
  onGoToDiscover?: () => void;
  onOpenPricing?: () => void;
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

const DAILY_MATCHES = MOCK_MATCHES.slice(0, 3);

export function HomeScreen({
  onConnect,
  connectedIds: _connectedIds,
  onGoToDiscover,
  onOpenPricing,
}: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailProfile, setDetailProfile] = useState<Match | null>(null);
  const timeLeft = useCountdown();

  const isDone = currentIndex >= DAILY_MATCHES.length;

  const handleConnect = (match: Match) => {
    onConnect(match.id);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleSkip = () => {
    setCurrentIndex((prev) => prev + 1);
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

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gradient">
            RizzAI
          </span>
        </div>
        <button
          type="button"
          data-ocid="home.notifications.button"
          className="relative w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </header>

      {/* Title section */}
      <div className="px-5 pb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground">Today's Matches</h1>
        <p className="text-sm text-muted-foreground mt-1">
          You have{" "}
          <span className="text-foreground font-semibold">
            {DAILY_MATCHES.length} quality matches
          </span>{" "}
          today
        </p>
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
        {!isDone && (
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
          {isDone ? (
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
              key={`stack-${currentIndex}`}
              matches={DAILY_MATCHES}
              currentIndex={currentIndex}
              onConnect={handleConnect}
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
      // snap back
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
        </div>
      </div>
    </div>
  );
}
