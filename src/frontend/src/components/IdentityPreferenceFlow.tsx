import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface MatchingPreferences {
  identity: string;
  connectWith: string[];
  intent: string[];
  ageRange: [number, number];
  distance: string;
  interestMatch: string;
  vibePreference: string[];
}

interface Props {
  onComplete: (prefs: MatchingPreferences) => void;
}

const TOTAL_STEPS = 7;

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.58 0.22 305), oklch(0.62 0.24 265))",
        }}
        initial={{ width: 0 }}
        animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}

function SelectionCard({
  emoji,
  label,
  sublabel,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-200 min-h-[80px] w-full ${
        selected
          ? "border-violet-500 bg-violet-950/30 shadow-[0_0_12px_rgba(139,92,246,0.4)] ring-1 ring-violet-500"
          : "border-zinc-800 bg-zinc-900 active:scale-95"
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-white font-semibold text-sm text-center leading-tight">
        {label}
      </span>
      {sublabel && (
        <span className="text-zinc-500 text-xs text-center leading-tight">
          {sublabel}
        </span>
      )}
    </button>
  );
}

export function IdentityPreferenceFlow({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [prefs, setPrefs] = useState<MatchingPreferences>({
    identity: "",
    connectWith: [],
    intent: [],
    ageRange: [20, 35],
    distance: "",
    interestMatch: "",
    vibePreference: [],
  });

  const goNext = () => {
    setDirection(1);
    if (step === TOTAL_STEPS) {
      onComplete(prefs);
    } else {
      setStep((s) => s + 1);
    }
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const skip = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const skippableSteps = [5, 6];
  const canSkip = skippableSteps.includes(step);

  const canContinue = () => {
    if (step === 1) return prefs.identity !== "";
    if (step === 2) return prefs.connectWith.length > 0;
    if (step === 3) return prefs.intent.length > 0;
    if (step === 7) return prefs.vibePreference.length > 0;
    return true;
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="h-svh w-screen bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-12 pb-4">
        <div className="flex items-center mb-4">
          {step > 1 ? (
            <button
              type="button"
              data-ocid="preference.back.button"
              onClick={goBack}
              className="p-2 -ml-2 text-zinc-400 active:text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex-1 mx-3">
            <ProgressBar step={step} />
          </div>
          {canSkip ? (
            <button
              type="button"
              data-ocid="preference.skip.button"
              onClick={skip}
              className="text-zinc-500 text-sm font-medium px-2 py-1 active:text-zinc-300 transition-colors"
            >
              Skip
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
        <p className="text-zinc-600 text-xs text-center">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto px-5 py-2"
          >
            {step === 1 && (
              <Step1
                value={prefs.identity}
                onChange={(v) => setPrefs((p) => ({ ...p, identity: v }))}
              />
            )}
            {step === 2 && (
              <Step2
                value={prefs.connectWith}
                onChange={(v) => setPrefs((p) => ({ ...p, connectWith: v }))}
              />
            )}
            {step === 3 && (
              <Step3
                value={prefs.intent}
                onChange={(v) => setPrefs((p) => ({ ...p, intent: v }))}
              />
            )}
            {step === 4 && (
              <Step4
                value={prefs.ageRange}
                onChange={(v) => setPrefs((p) => ({ ...p, ageRange: v }))}
              />
            )}
            {step === 5 && (
              <Step5
                value={prefs.distance}
                onChange={(v) => setPrefs((p) => ({ ...p, distance: v }))}
              />
            )}
            {step === 6 && (
              <Step6
                value={prefs.interestMatch}
                onChange={(v) => setPrefs((p) => ({ ...p, interestMatch: v }))}
              />
            )}
            {step === 7 && (
              <Step7
                value={prefs.vibePreference}
                onChange={(v) => setPrefs((p) => ({ ...p, vibePreference: v }))}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="flex-shrink-0 px-5 pb-10 pt-4">
        <button
          type="button"
          data-ocid="preference.continue.button"
          onClick={goNext}
          disabled={!canContinue()}
          className="w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{
            background: canContinue()
              ? "linear-gradient(135deg, oklch(0.58 0.22 305), oklch(0.62 0.24 265))"
              : "oklch(0.2 0.015 255)",
          }}
        >
          {step === TOTAL_STEPS ? "Let's Go 🚀" : "Continue"}
        </button>
      </div>
    </div>
  );
}

function StepHeading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
      {children}
    </h1>
  );
}

// Step 1 — Identity
function Step1({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  const options = [
    { id: "male", emoji: "🧔", label: "Male" },
    { id: "female", emoji: "👩", label: "Female" },
    { id: "non-binary", emoji: "🌈", label: "Non-binary" },
    { id: "prefer-not-to-say", emoji: "🤐", label: "Prefer not to say" },
  ];
  return (
    <div>
      <StepHeading>Who are you? ✨</StepHeading>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            selected={value === o.id}
            onClick={() => onChange(o.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Step 2 — Connect With
function Step2({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const options = [
    { id: "men", emoji: "🧔", label: "Men" },
    { id: "women", emoji: "👩", label: "Women" },
    { id: "everyone", emoji: "🌍", label: "Everyone" },
  ];

  const toggle = (id: string) => {
    if (id === "everyone") {
      onChange(value.includes("everyone") ? [] : ["everyone"]);
    } else {
      const without = value.filter((v) => v !== "everyone");
      onChange(
        without.includes(id)
          ? without.filter((v) => v !== id)
          : [...without, id],
      );
    }
  };

  return (
    <div>
      <StepHeading>Who do you want to connect with? 💫</StepHeading>
      <div className="grid grid-cols-1 gap-3">
        {options.map((o) => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            selected={value.includes(o.id)}
            onClick={() => toggle(o.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Step 3 — Intent
function Step3({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const options = [
    {
      id: "casual",
      emoji: "🔥",
      label: "Casual dating",
      sub: "Low-pressure, good vibes",
    },
    {
      id: "serious",
      emoji: "💍",
      label: "Serious relationship",
      sub: "Looking for something real",
    },
    {
      id: "friends",
      emoji: "👯",
      label: "Friends",
      sub: "Build genuine connections",
    },
    {
      id: "chatting",
      emoji: "💬",
      label: "Just chatting",
      sub: "See where it goes",
    },
    { id: "unsure", emoji: "🤷", label: "Not sure", sub: "Open to anything" },
  ];

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );
  };

  return (
    <div>
      <StepHeading>What are you looking for? 🎯</StepHeading>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sub}
            selected={value.includes(o.id)}
            onClick={() => toggle(o.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Step 4 — Age Range
function Step4({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [min, max] = value;

  return (
    <div>
      <StepHeading>Preferred age range? 🎂</StepHeading>
      <div className="flex items-center justify-center mb-10">
        <span
          className="text-5xl font-bold"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.18 305), oklch(0.72 0.2 265))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {min} – {max}
        </span>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label
              htmlFor="pref-age-min"
              className="text-zinc-400 text-sm font-medium"
            >
              Min age
            </label>
            <span className="text-white font-semibold text-lg">{min}</span>
          </div>
          <input
            id="pref-age-min"
            data-ocid="preference.age_min.input"
            type="range"
            min={18}
            max={58}
            value={min}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange([v, Math.max(v + 1, max)]);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, oklch(0.58 0.22 305) 0%, oklch(0.58 0.22 305) ${
                ((min - 18) / 42) * 100
              }%, oklch(0.25 0.02 255) ${
                ((min - 18) / 42) * 100
              }%, oklch(0.25 0.02 255) 100%)`,
            }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label
              htmlFor="pref-age-max"
              className="text-zinc-400 text-sm font-medium"
            >
              Max age
            </label>
            <span className="text-white font-semibold text-lg">{max}</span>
          </div>
          <input
            id="pref-age-max"
            data-ocid="preference.age_max.input"
            type="range"
            min={19}
            max={60}
            value={max}
            onChange={(e) => {
              const v = Number(e.target.value);
              onChange([Math.min(min, v - 1), v]);
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(90deg, oklch(0.62 0.24 265) 0%, oklch(0.62 0.24 265) ${
                ((max - 19) / 41) * 100
              }%, oklch(0.25 0.02 255) ${
                ((max - 19) / 41) * 100
              }%, oklch(0.25 0.02 255) 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Step 5 — Distance
function Step5({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  const options = [
    { id: "nearby", emoji: "📍", label: "Nearby", sub: "5–20 km" },
    { id: "city-wide", emoji: "🏙️", label: "City-wide", sub: "Same city" },
    { id: "anywhere", emoji: "🌍", label: "Anywhere", sub: "Global matches" },
  ];
  return (
    <div>
      <StepHeading>How far should matches be? 📡</StepHeading>
      <div className="grid grid-cols-1 gap-3">
        {options.map((o) => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            sublabel={o.sub}
            selected={value === o.id}
            onClick={() => onChange(o.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Step 6 — Interest Matching
function Step6({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  const options = [
    {
      id: "same",
      emoji: "🎯",
      label: "Same interests as me",
      sub: "Birds of a feather",
    },
    {
      id: "open",
      emoji: "🌀",
      label: "Open to different interests",
      sub: "Opposites attract",
    },
  ];
  return (
    <div>
      <StepHeading>What kind of people do you prefer? 🧩</StepHeading>
      <div className="grid grid-cols-1 gap-4">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left ${
              value === o.id
                ? "border-violet-500 bg-violet-950/30 shadow-[0_0_12px_rgba(139,92,246,0.4)] ring-1 ring-violet-500"
                : "border-zinc-800 bg-zinc-900 active:scale-95"
            }`}
          >
            <span className="text-4xl">{o.emoji}</span>
            <div>
              <p className="text-white font-semibold text-base">{o.label}</p>
              <p className="text-zinc-500 text-sm mt-0.5">{o.sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 7 — Vibe Preference
function Step7({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const options = [
    { id: "funny", emoji: "😂", label: "Funny" },
    { id: "chill", emoji: "😌", label: "Chill" },
    { id: "deep", emoji: "🧠", label: "Deep thinker" },
    { id: "ambitious", emoji: "🚀", label: "Ambitious" },
    { id: "romantic", emoji: "💕", label: "Romantic" },
  ];

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );
  };

  return (
    <div>
      <StepHeading>What vibe do you prefer? ✨</StepHeading>
      <p className="text-zinc-500 text-sm mb-5">Pick one or more</p>
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => (
          <SelectionCard
            key={o.id}
            emoji={o.emoji}
            label={o.label}
            selected={value.includes(o.id)}
            onClick={() => toggle(o.id)}
          />
        ))}
      </div>
    </div>
  );
}
