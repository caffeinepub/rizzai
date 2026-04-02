import { ProfileDetailScreen } from "@/components/ProfileDetailScreen";
import { TrustBadge } from "@/components/TrustBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import { getActivityStatus, rankProfiles } from "@/utils/discoverRanking";
import { SlidersHorizontal, Star, UserPlus, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VIEWER_GENDER = "man" as const;
const VIEWER_LOOKING_FOR = ["woman", "nonbinary"] as const;
const PAGE_SIZE = 6;
const SEEN_KEY = "rizz_seen";

function getSeenIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(ids: string[]) {
  try {
    const current = getSeenIds();
    for (const id of ids) current.add(id);
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...current]));
  } catch {
    // ignore
  }
}

export function DiscoverScreen() {
  const ranked = useMemo(
    () => rankProfiles(MOCK_MATCHES, VIEWER_GENDER, [...VIEWER_LOOKING_FOR]),
    [],
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Match | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mark first batch as seen on mount
  useEffect(() => {
    markSeen(ranked.slice(0, PAGE_SIZE).map((p) => p.id));
  }, [ranked]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= ranked.length) return;
    setIsLoadingMore(true);
    loadingTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + PAGE_SIZE, ranked.length);
        markSeen(ranked.slice(prev, next).map((p) => p.id));
        return next;
      });
      setIsLoadingMore(false);
    }, 1800);
  }, [isLoadingMore, visibleCount, ranked]);

  // IntersectionObserver on sentinel
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setTimeout(loadMore, 800);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const visibleProfiles = ranked.slice(0, visibleCount);
  const hasMore = visibleCount < ranked.length;

  return (
    <div className="flex flex-col h-full overflow-y-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Discover
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            People worth talking to
          </p>
        </div>
        <button
          type="button"
          data-ocid="discover.filter.button"
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Profile list */}
      <div className="px-5 pb-6 space-y-4 flex-1">
        <AnimatePresence initial={false}>
          {visibleProfiles.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              index={i}
              onSelect={() => setSelectedProfile(profile)}
            />
          ))}
        </AnimatePresence>

        {/* Skeleton loading */}
        {isLoadingMore && (
          <div data-ocid="discover.loading_state" className="space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Sentinel */}
        {hasMore && !isLoadingMore && <div ref={sentinelRef} className="h-4" />}

        {/* End of list */}
        {!hasMore && !isLoadingMore && visibleProfiles.length > 0 && (
          <motion.div
            data-ocid="discover.empty_state"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <Star className="w-7 h-7 text-primary" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              You've seen everyone for now.
            </p>
            <p className="text-xs text-muted-foreground">
              Check back in a few hours.
            </p>
          </motion.div>
        )}

        <div className="h-4" />
      </div>

      {/* Profile Detail Overlay */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-0 z-50 overflow-hidden"
          >
            <ProfileDetailScreen
              profile={selectedProfile}
              onClose={() => setSelectedProfile(null)}
              onStartChat={() => setSelectedProfile(null)}
              onSave={() => setSelectedProfile(null)}
              onSkip={() => setSelectedProfile(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileCard({
  profile,
  index,
  onSelect,
}: {
  profile: Match;
  index: number;
  onSelect: () => void;
}) {
  const activity = getActivityStatus(profile.lastActive);
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isLowTrust = profile.trustScore < 40;
  const isHighTrust = profile.trustScore >= 70;

  return (
    <motion.div
      data-ocid={`discover.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.38 }}
      className="rounded-2xl border border-border overflow-hidden cursor-pointer"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.13 0.013 250))",
      }}
      onClick={onSelect}
    >
      <div className="p-4">
        {/* Top row: avatar + info */}
        <div className="flex items-start gap-3 mb-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-border"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-secondary border-2 border-border flex items-center justify-center">
                <span className="text-base font-bold text-muted-foreground">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Name + bio */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-foreground leading-tight">
                {profile.name},{" "}
                <span className="font-normal text-muted-foreground">
                  {profile.age}
                </span>
              </h3>
              {profile.isNew && (
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] px-1.5 py-0 font-semibold">
                  New
                </Badge>
              )}
            </div>

            {/* Activity badge */}
            {activity && (
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    activity === "active-now"
                      ? "bg-green-500 animate-pulse"
                      : "bg-amber-400"
                  }`}
                />
                <span
                  className={`text-[11px] font-medium ${
                    activity === "active-now"
                      ? "text-green-400"
                      : "text-amber-400"
                  }`}
                >
                  {activity === "active-now" ? "Active now" : "Recently active"}
                </span>
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {profile.interests.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta row: trust badge/status + response time + compatibility */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {isHighTrust ? (
            <TrustBadge score={profile.trustScore} size="sm" />
          ) : isLowTrust ? (
            <span className="text-[11px] text-rose-400/70 font-medium">
              Limited reach
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {profile.trustScore} trust
            </span>
          )}
          {profile.responseTimeMinutes < 30 && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" />~
              {profile.responseTimeMinutes} min reply
            </span>
          )}
          {profile.isNearby && (
            <span className="text-[11px] text-muted-foreground">📍 Nearby</span>
          )}
          {profile.compatibility != null && (
            <span className="text-[11px] font-semibold text-primary">
              {profile.compatibility}% match
            </span>
          )}
        </div>

        {/* Connect button */}
        <button
          type="button"
          data-ocid={`discover.connect.button.${index + 1}`}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <UserPlus className="w-4 h-4" />
          Connect
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl border border-border p-4"
      style={{
        background:
          "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.13 0.013 250))",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-18 rounded-full" />
      </div>
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>
  );
}
