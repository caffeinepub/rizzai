import { Badge } from "@/components/ui/badge";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import { Bell, Clock, Compass, Heart, Sparkles, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface HomeScreenProps {
  onConnect: (matchId: string) => void;
  connectedIds: Set<string>;
  onGoToDiscover?: () => void;
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
}: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const timeLeft = useCountdown();

  const advance = (dir: "left" | "right" = "left") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setAnimating(false);
    }, 280);
  };

  const handleConnect = () => {
    const match = DAILY_MATCHES[currentIndex];
    if (match) onConnect(match.id);
    advance("left");
  };

  const handleSkip = () => {
    advance("left");
  };

  const isDone = currentIndex >= DAILY_MATCHES.length;
  const currentMatch = DAILY_MATCHES[currentIndex];

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-background">
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
        {/* Countdown + progress */}
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
        {/* Progress dots */}
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
      <div className="flex-1 px-5 pb-6 flex flex-col min-h-0">
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
            </motion.div>
          ) : (
            currentMatch && (
              <motion.div
                key={currentMatch.id}
                initial={{
                  opacity: 0,
                  x: direction === "right" ? 80 : -80,
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{
                  opacity: 0,
                  x: direction === "right" ? -80 : 80,
                }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="flex flex-col flex-1"
              >
                <MatchCard
                  match={currentMatch}
                  index={currentIndex}
                  onConnect={handleConnect}
                  onSkip={handleSkip}
                />
              </motion.div>
            )
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
    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
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

function MatchCard({
  match,
  index,
  onConnect,
  onSkip,
}: {
  match: Match;
  index: number;
  onConnect: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Card */}
      <div
        data-ocid={`home.item.${index + 1}`}
        className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
        style={{
          boxShadow:
            "0 4px 24px -4px oklch(0 0 0 / 0.4), 0 1px 6px -2px oklch(0 0 0 / 0.3)",
        }}
      >
        {/* Photo */}
        <div className="relative h-64 overflow-hidden bg-secondary">
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
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />

          {/* Match % badge top-right */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground border-0 font-bold text-xs px-2.5 py-1">
              {match.compatibility}% match
            </Badge>
          </div>

          {/* Status tags top-left */}
          <StatusTags match={match} />
        </div>

        {/* Info */}
        <div className="p-4 pb-5">
          <h3 className="text-xl font-bold text-foreground">
            {match.name},{" "}
            <span className="font-normal text-muted-foreground">
              {match.age}
            </span>
          </h3>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {match.bio}
          </p>
          {/* Interest chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {match.interests.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          data-ocid={`home.connect.button.${index + 1}`}
          onClick={onConnect}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <Heart className="w-4 h-4" />
          Connect
        </button>
        <p className="text-center text-xs text-muted-foreground">
          💡 AI can help you start better
        </p>
        <button
          type="button"
          data-ocid={`home.skip.button.${index + 1}`}
          onClick={onSkip}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
