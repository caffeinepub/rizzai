import { ConnectBottomSheet } from "@/components/ConnectBottomSheet";
import { ProfileDetailScreen } from "@/components/ProfileDetailScreen";
import { TrustBadge } from "@/components/TrustBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { MOCK_MATCHES, type Match } from "@/data/mockData";
import { getActivityStatus, rankProfiles } from "@/utils/discoverRanking";
import { SlidersHorizontal, Star, UserPlus, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const VIEWER_GENDER = "man" as const;
const VIEWER_LOOKING_FOR = ["woman", "nonbinary"] as const;
const PAGE_SIZE = 6;
const SEEN_KEY = "rizz_seen";

// Derive unique interests from all mock matches
const ALL_INTERESTS = Array.from(
  new Set(MOCK_MATCHES.flatMap((m) => m.interests)),
).sort();

const MATCH_PCT_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "60%+", value: 60 },
  { label: "75%+", value: 75 },
  { label: "80%+", value: 80 },
  { label: "90%+", value: 90 },
];

const GENDER_OPTIONS = [
  { label: "Women", value: "woman" },
  { label: "Men", value: "man" },
  { label: "Nonbinary", value: "nonbinary" },
];

type FilterState = {
  ageMin: number;
  ageMax: number;
  genders: string[];
  interests: string[];
  minMatch: number;
};

const DEFAULT_FILTERS: FilterState = {
  ageMin: 18,
  ageMax: 35,
  genders: [],
  interests: [],
  minMatch: 0,
};

function isDefaultFilters(f: FilterState): boolean {
  return (
    f.ageMin === DEFAULT_FILTERS.ageMin &&
    f.ageMax === DEFAULT_FILTERS.ageMax &&
    f.genders.length === 0 &&
    f.interests.length === 0 &&
    f.minMatch === 0
  );
}

function hasPrefilledData(f: FilterState): boolean {
  return (
    f.genders.length > 0 ||
    f.ageMin !== DEFAULT_FILTERS.ageMin ||
    f.ageMax !== DEFAULT_FILTERS.ageMax
  );
}

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

interface DiscoverScreenProps {
  initialFilters?: {
    ageMin?: number;
    ageMax?: number;
    genders?: string[];
    interests?: string[];
    minMatch?: number;
  };
}

export function DiscoverScreen({ initialFilters }: DiscoverScreenProps) {
  const ranked = useMemo(
    () => rankProfiles(MOCK_MATCHES, VIEWER_GENDER, [...VIEWER_LOOKING_FOR]),
    [],
  );

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Match | null>(null);
  const [connectSheetProfile, setConnectSheetProfile] = useState<Match | null>(
    null,
  );
  const [showHighMatchOnly, setShowHighMatchOnly] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ageMin: initialFilters?.ageMin ?? DEFAULT_FILTERS.ageMin,
    ageMax: initialFilters?.ageMax ?? DEFAULT_FILTERS.ageMax,
    genders: initialFilters?.genders ?? DEFAULT_FILTERS.genders,
    interests: initialFilters?.interests ?? DEFAULT_FILTERS.interests,
    minMatch: initialFilters?.minMatch ?? DEFAULT_FILTERS.minMatch,
  });
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveFilters = !isDefaultFilters(appliedFilters);
  const isPreFilled = hasPrefilledData(appliedFilters);

  const filteredRanked = useMemo(() => {
    let result = ranked;

    if (showHighMatchOnly) {
      result = result.filter(
        (p) => p.compatibility != null && p.compatibility >= 80,
      );
    }

    if (
      appliedFilters.ageMin !== DEFAULT_FILTERS.ageMin ||
      appliedFilters.ageMax !== DEFAULT_FILTERS.ageMax
    ) {
      result = result.filter(
        (p) => p.age >= appliedFilters.ageMin && p.age <= appliedFilters.ageMax,
      );
    }

    if (appliedFilters.genders.length > 0) {
      result = result.filter((p) => appliedFilters.genders.includes(p.gender));
    }

    if (appliedFilters.interests.length > 0) {
      result = result.filter((p) =>
        appliedFilters.interests.some((interest) =>
          p.interests.includes(interest),
        ),
      );
    }

    if (appliedFilters.minMatch > 0) {
      result = result.filter(
        (p) =>
          p.compatibility != null && p.compatibility >= appliedFilters.minMatch,
      );
    }

    return result;
  }, [ranked, showHighMatchOnly, appliedFilters]);

  // Reset visible count when filtered list changes
  const prevFilteredLengthRef = useRef(filteredRanked.length);
  useEffect(() => {
    if (prevFilteredLengthRef.current !== filteredRanked.length) {
      setVisibleCount(PAGE_SIZE);
      prevFilteredLengthRef.current = filteredRanked.length;
    }
  });

  useEffect(() => {
    markSeen(ranked.slice(0, PAGE_SIZE).map((p) => p.id));
  }, [ranked]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || visibleCount >= filteredRanked.length) return;
    setIsLoadingMore(true);
    loadingTimerRef.current = setTimeout(() => {
      setVisibleCount((prev) => {
        const next = Math.min(prev + PAGE_SIZE, filteredRanked.length);
        markSeen(filteredRanked.slice(prev, next).map((p) => p.id));
        return next;
      });
      setIsLoadingMore(false);
    }, 1800);
  }, [isLoadingMore, visibleCount, filteredRanked]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setTimeout(loadMore, 800);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    };
  }, []);

  const visibleProfiles = filteredRanked.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRanked.length;

  // Build active filter chips
  const activeChips: { label: string; onRemove: () => void }[] = [];

  if (
    appliedFilters.ageMin !== DEFAULT_FILTERS.ageMin ||
    appliedFilters.ageMax !== DEFAULT_FILTERS.ageMax
  ) {
    activeChips.push({
      label: `Age: ${appliedFilters.ageMin}\u2013${appliedFilters.ageMax}`,
      onRemove: () =>
        setAppliedFilters((prev) => ({
          ...prev,
          ageMin: DEFAULT_FILTERS.ageMin,
          ageMax: DEFAULT_FILTERS.ageMax,
        })),
    });
  }

  for (const g of appliedFilters.genders) {
    const option = GENDER_OPTIONS.find((o) => o.value === g);
    activeChips.push({
      label: option?.label ?? g,
      onRemove: () =>
        setAppliedFilters((prev) => ({
          ...prev,
          genders: prev.genders.filter((x) => x !== g),
        })),
    });
  }

  for (const interest of appliedFilters.interests) {
    activeChips.push({
      label: interest,
      onRemove: () =>
        setAppliedFilters((prev) => ({
          ...prev,
          interests: prev.interests.filter((x) => x !== interest),
        })),
    });
  }

  if (appliedFilters.minMatch > 0) {
    activeChips.push({
      label: `${appliedFilters.minMatch}%+`,
      onRemove: () => setAppliedFilters((prev) => ({ ...prev, minMatch: 0 })),
    });
  }

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
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors relative"
          aria-label="Open filters"
          onClick={() => setShowFilterDrawer(true)}
        >
          <SlidersHorizontal
            className={`w-4 h-4 transition-colors ${hasActiveFilters ? "text-primary" : "text-muted-foreground"}`}
          />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border border-background" />
          )}
        </button>
      </header>

      {/* High match toggle */}
      <div className="px-5 pb-3 flex-shrink-0">
        <div
          className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${
            showHighMatchOnly
              ? "border-primary/40 bg-primary/10"
              : "border-border bg-secondary/40"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">⚡</span>
            <span
              className={`text-sm font-medium transition-colors ${showHighMatchOnly ? "text-primary" : "text-muted-foreground"}`}
            >
              High matches only
            </span>
            {showHighMatchOnly && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30"
              >
                80%+
              </motion.span>
            )}
          </div>
          <Switch
            data-ocid="discover.high_match.toggle"
            checked={showHighMatchOnly}
            onCheckedChange={(v) => setShowHighMatchOnly(v)}
            aria-label="Show only high matches"
          />
        </div>
      </div>

      {/* Active filter chips */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-5 pb-3 flex-shrink-0 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-[11px] font-semibold text-primary">
                Filters Applied
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {activeChips.map((chip) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-medium text-primary hover:bg-primary/25 transition-colors"
                >
                  {chip.label}
                  <X className="w-3 h-3" />
                </motion.button>
              ))}
              <button
                type="button"
                data-ocid="discover.filter.clear_button"
                onClick={() => setAppliedFilters({ ...DEFAULT_FILTERS })}
                className="flex-shrink-0 text-[11px] font-semibold text-muted-foreground underline underline-offset-2 px-1"
              >
                Clear all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile list */}
      <div className="px-5 pb-6 space-y-4 flex-1">
        <AnimatePresence initial={false}>
          {visibleProfiles.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              index={i}
              onSelect={() => setSelectedProfile(profile)}
              onConnect={() => setConnectSheetProfile(profile)}
            />
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div data-ocid="discover.loading_state" className="space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {hasMore && !isLoadingMore && <div ref={sentinelRef} className="h-4" />}

        {/* Empty state */}
        {!isLoadingMore &&
          filteredRanked.length === 0 &&
          (hasActiveFilters || showHighMatchOnly) && (
            <motion.div
              data-ocid="discover.empty_state"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-3">
                <SlidersHorizontal className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No profiles match your filters
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Try adjusting or clearing your filters to see more people.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAppliedFilters({ ...DEFAULT_FILTERS });
                  setShowHighMatchOnly(false);
                }}
                className="text-xs text-primary font-semibold underline underline-offset-2"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

        {/* End of list */}
        {!hasMore && !isLoadingMore && visibleProfiles.length > 0 && (
          <motion.div
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

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilterDrawer && (
          <FilterDrawer
            current={appliedFilters}
            isPreFilled={isPreFilled}
            onApply={(filters) => {
              setAppliedFilters(filters);
              setShowFilterDrawer(false);
            }}
            onClose={() => setShowFilterDrawer(false)}
          />
        )}
      </AnimatePresence>

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

      {/* Connect Bottom Sheet */}
      <ConnectBottomSheet
        isOpen={!!connectSheetProfile}
        onClose={() => setConnectSheetProfile(null)}
        profile={connectSheetProfile}
        onAIConnect={() => setConnectSheetProfile(null)}
        onNormalConnect={() => setConnectSheetProfile(null)}
      />
    </div>
  );
}

// ── Filter Drawer ────────────────────────────────────────────────────────────

function FilterDrawer({
  current,
  isPreFilled,
  onApply,
  onClose,
}: {
  current: FilterState;
  isPreFilled: boolean;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<FilterState>({ ...current });

  function toggleGender(g: string) {
    setDraft((prev) => ({
      ...prev,
      genders: prev.genders.includes(g)
        ? prev.genders.filter((x) => x !== g)
        : [...prev.genders, g],
    }));
  }

  function toggleInterest(interest: string) {
    setDraft((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((x) => x !== interest)
        : [...prev.interests, interest],
    }));
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        data-ocid="discover.filter.modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 32, stiffness: 320 }}
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden"
        style={{ background: "oklch(0.14 0.015 255)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[75vh] pb-6">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-lg font-bold text-foreground">Filters</h2>
            <button
              type="button"
              data-ocid="discover.filter.close_button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Pre-filled notice */}
          {isPreFilled && (
            <div className="px-5 pb-2">
              <p className="text-[11px] text-muted-foreground/70">
                ✨ Pre-filled from your preferences
              </p>
            </div>
          )}

          <div className="px-5 space-y-6">
            {/* Age Range */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Age Range
              </h3>
              <div className="flex items-center gap-3">
                <label className="flex-1">
                  <span className="text-[11px] text-muted-foreground mb-1 block">
                    Min age
                  </span>
                  <input
                    data-ocid="discover.filter.age_min.input"
                    type="number"
                    min={18}
                    max={draft.ageMax - 1}
                    value={draft.ageMin}
                    onChange={(e) => {
                      const val = Math.max(
                        18,
                        Math.min(Number(e.target.value), draft.ageMax - 1),
                      );
                      setDraft((prev) => ({ ...prev, ageMin: val }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm text-center font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </label>
                <div className="text-muted-foreground text-sm pt-4">–</div>
                <label className="flex-1">
                  <span className="text-[11px] text-muted-foreground mb-1 block">
                    Max age
                  </span>
                  <input
                    data-ocid="discover.filter.age_max.input"
                    type="number"
                    min={draft.ageMin + 1}
                    max={60}
                    value={draft.ageMax}
                    onChange={(e) => {
                      const val = Math.min(
                        60,
                        Math.max(Number(e.target.value), draft.ageMin + 1),
                      );
                      setDraft((prev) => ({ ...prev, ageMax: val }));
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-foreground text-sm text-center font-semibold focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </label>
              </div>
            </section>

            {/* Gender */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Gender
              </h3>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    data-ocid="discover.filter.gender.toggle"
                    onClick={() => toggleGender(opt.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      draft.genders.includes(opt.value)
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {draft.genders.length === 0 && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  None selected = any gender
                </p>
              )}
            </section>

            {/* Match % */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Match %
              </h3>
              <div className="flex flex-wrap gap-2">
                {MATCH_PCT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    data-ocid="discover.filter.match_pct.toggle"
                    onClick={() =>
                      setDraft((prev) => ({ ...prev, minMatch: opt.value }))
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                      draft.minMatch === opt.value
                        ? "bg-primary/20 text-primary border-primary/40 shadow-sm"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Interests */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    data-ocid="discover.filter.interest.toggle"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      draft.interests.includes(interest)
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-secondary text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
              {draft.interests.length === 0 && (
                <p className="text-[11px] text-muted-foreground mt-2">
                  None selected = any interest
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Footer buttons */}
        <div
          className="px-5 py-4 border-t border-border flex gap-3"
          style={{ background: "oklch(0.14 0.015 255)" }}
        >
          <button
            type="button"
            data-ocid="discover.filter.clear_button"
            onClick={() => setDraft({ ...DEFAULT_FILTERS })}
            className="flex-1 py-3 rounded-2xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary/60 transition-colors"
          >
            Clear Filters
          </button>
          <button
            type="button"
            data-ocid="discover.filter.submit_button"
            onClick={() => onApply(draft)}
            className="flex-[2] py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Apply Filters
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Profile Card ─────────────────────────────────────────────────────────────

function ProfileCard({
  profile,
  index,
  onSelect,
  onConnect,
}: {
  profile: Match;
  index: number;
  onSelect: () => void;
  onConnect: () => void;
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
        <div className="flex items-start gap-3 mb-3">
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

        <button
          type="button"
          data-ocid={`discover.connect.button.${index + 1}`}
          className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onConnect();
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
