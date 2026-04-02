import { Badge } from "@/components/ui/badge";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import { Bell, ChevronRight, Clock, Heart, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface HomeScreenProps {
  onConnect: (matchId: string) => void;
  connectedIds: Set<string>;
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

export function HomeScreen({ onConnect, connectedIds }: HomeScreenProps) {
  const timeLeft = useCountdown();
  const remaining = MOCK_MATCHES.length - connectedIds.size;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
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
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
        </button>
      </header>

      {/* Matches header */}
      <div className="px-5 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Today's Matches</h1>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">
              <span className="text-foreground font-semibold">{remaining}</span>{" "}
              of {MOCK_MATCHES.length} remaining
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Refreshes in{" "}
              <span className="font-mono text-foreground font-medium">
                {timeLeft}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Match cards */}
      <div className="px-5 pb-24 space-y-4">
        <AnimatePresence>
          {remaining === 0 ? (
            <motion.div
              key="empty"
              data-ocid="home.empty_state"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-1">
                All Connected!
              </h2>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                You've used all your daily matches. Come back tomorrow for new
                connections.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-primary">
                <Clock className="w-4 h-4" />
                <span className="font-mono font-semibold">{timeLeft}</span>
              </div>
            </motion.div>
          ) : (
            MOCK_MATCHES.map((match, i) => (
              <MatchCard
                key={match.id}
                match={match}
                index={i}
                connected={connectedIds.has(match.id)}
                onConnect={onConnect}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MatchCard({
  match,
  index,
  connected,
  onConnect,
}: {
  match: Match;
  index: number;
  connected: boolean;
  onConnect: (id: string) => void;
}) {
  return (
    <motion.div
      data-ocid={`home.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`relative rounded-2xl overflow-hidden border transition-all ${
        connected
          ? "border-primary/40 opacity-60"
          : "border-border hover:border-primary/30"
      }`}
      style={{
        background:
          "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.13 0.013 250))",
      }}
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={match.photo}
          alt={match.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        {/* Compatibility badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/90 text-primary-foreground border-0 font-semibold text-xs px-2 py-0.5">
            {match.compatibility}% match
          </Badge>
        </div>
        {connected && (
          <div className="absolute inset-0 bg-card/60 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-semibold text-primary">
                Connected
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {match.name}, <span className="font-normal">{match.age}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
              {match.bio}
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {match.interests.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Connect button */}
        {!connected && (
          <button
            type="button"
            data-ocid={`home.connect.button.${index + 1}`}
            onClick={() => onConnect(match.id)}
            className="w-full mt-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all glow-blue-sm"
          >
            <Heart className="w-4 h-4" />
            Connect
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
