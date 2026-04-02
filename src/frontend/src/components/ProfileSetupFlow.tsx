import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

export interface ProfileData {
  photos: File[];
  name: string;
  age: string;
  city: string;
  bio: string;
  interests: string[];
  vibe: string;
  conversationStyle: string;
  intent: string;
  lifestyle: {
    sleepStyle: "night-owl" | "early-bird" | "";
    socialStyle: "introvert" | "extrovert" | "";
    privacyStyle: "social" | "private" | "";
  };
  conversationStarters: { prompt: string; answer: string }[];
}

interface ProfileSetupFlowProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 8;

const PRESET_INTERESTS = [
  "Travel ✈️",
  "Fitness 💪",
  "Music 🎵",
  "Movies 🎬",
  "Business 💼",
  "Books 📚",
  "Food 🍕",
  "Gaming 🎮",
  "Art 🎨",
  "Fashion 👗",
  "Crypto 💰",
  "Photography 📷",
  "Sports ⚽",
  "Cooking 🍳",
  "Yoga 🧘",
];

const VIBE_OPTIONS = [
  { label: "😌 Chill", value: "chill" },
  { label: "😂 Funny", value: "funny" },
  { label: "🧠 Deep", value: "deep" },
  { label: "🚀 Ambitious", value: "ambitious" },
  { label: "💕 Romantic", value: "romantic" },
];

const STYLE_OPTIONS = [
  { label: "😏 Flirty", value: "flirty" },
  { label: "💬 Straightforward", value: "straightforward" },
  { label: "🙃 Sarcastic", value: "sarcastic" },
  { label: "😊 Friendly", value: "friendly" },
];

const INTENT_OPTIONS = [
  {
    emoji: "🔥",
    label: "Casual",
    desc: "Just vibing, no pressure",
    value: "casual",
  },
  {
    emoji: "💍",
    label: "Serious",
    desc: "Ready for something real",
    value: "serious",
  },
  {
    emoji: "👯",
    label: "Friends",
    desc: "New people, good energy",
    value: "friends",
  },
  {
    emoji: "🤷",
    label: "Not sure",
    desc: "Still figuring it out",
    value: "not-sure",
  },
];

const STARTER_PROMPTS = [
  "🌹 Perfect date?",
  "🔥 Biggest turn-on?",
  "📅 Weekend plan?",
  "💭 Random thought you can't stop thinking about?",
  "🎵 Song that describes you right now?",
  "🌍 Dream travel destination?",
];

const GlowButton = ({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-14 rounded-2xl font-semibold text-white text-base transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    style={{
      background:
        "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))",
      boxShadow: disabled
        ? "none"
        : "0 0 24px oklch(0.58 0.22 265 / 0.45), 0 0 48px oklch(0.58 0.22 265 / 0.15)",
    }}
  >
    {children}
  </button>
);

function CheckIcon() {
  return (
    <svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 4L4 7L9 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhotoSlot({
  onSelect,
  onRemove,
  index,
}: {
  onSelect: (f: File) => void;
  onRemove: () => void;
  index: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onSelect(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  if (preview) {
    return (
      <div
        className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden"
        data-ocid={`profile_setup.photo.${(index + 1) as 1 | 2 | 3}`}
      >
        <img
          src={preview}
          alt={`Slot ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          type="button"
          aria-label="Remove photo"
          onClick={() => {
            onRemove();
            setPreview(null);
          }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`Add photo ${index + 1}`}
      data-ocid="profile_setup.upload_button"
      onClick={() => inputRef.current?.click()}
      className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer flex flex-col items-center justify-center gap-2"
      style={{
        border: "2px dashed oklch(0.35 0.05 265)",
        background: "oklch(0.15 0.015 255 / 0.8)",
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ background: "oklch(0.22 0.03 265)" }}
      >
        <Plus className="w-5 h-5 text-muted-foreground" />
      </div>
      <span className="text-xs text-muted-foreground">Add photo</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </button>
  );
}

export function ProfileSetupFlow({ onComplete }: ProfileSetupFlowProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [done, setDone] = useState(false);

  const [data, setData] = useState<ProfileData>({
    photos: [],
    name: "",
    age: "",
    city: "",
    bio: "",
    interests: [],
    vibe: "",
    conversationStyle: "",
    intent: "",
    lifestyle: { sleepStyle: "", socialStyle: "", privacyStyle: "" },
    conversationStarters: [],
  });

  const [customInterest, setCustomInterest] = useState("");
  const [expandedStarters, setExpandedStarters] = useState<Set<string>>(
    new Set(),
  );
  const [starterAnswers, setStarterAnswers] = useState<Record<string, string>>(
    {},
  );

  const goNext = () => {
    if (step === TOTAL_STEPS) {
      const cs = Array.from(expandedStarters).map((p) => ({
        prompt: p,
        answer: starterAnswers[p] || "",
      }));
      setData((prev) => ({ ...prev, conversationStarters: cs }));
      setDone(true);
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  const progress = (step / TOTAL_STEPS) * 100;

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "backOut" }}
        className="h-svh w-screen bg-background flex flex-col items-center justify-center px-6"
        data-ocid="profile_setup.success_state"
      >
        <div
          className="pointer-events-none fixed inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, oklch(0.58 0.22 265) 0%, transparent 70%)",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: "backOut" }}
            className="text-7xl"
          >
            🎉
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              You&apos;re all set{data.name ? `, ${data.name}` : ""}!
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-xs">
              Your profile is ready. Time to find your perfect match ✨
            </p>
          </div>
          <GlowButton onClick={onComplete}>Find Your Matches →</GlowButton>
        </div>
      </motion.div>
    );
  }

  const isOptional = [1, 3, 4, 5, 7, 8].includes(step);
  const canContinue =
    step === 1
      ? true
      : step === 2
        ? data.name.trim() !== "" && data.age.trim() !== ""
        : step === 6
          ? data.intent !== ""
          : true;

  return (
    <div className="h-svh w-screen bg-background flex flex-col overflow-hidden">
      {/* Header: back + progress */}
      <div className="flex-shrink-0 px-4 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          {step > 1 ? (
            <button
              type="button"
              data-ocid="profile_setup.secondary_button"
              onClick={goBack}
              aria-label="Go back"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "oklch(0.18 0.018 255)" }}
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Step {step} of {TOTAL_STEPS}
              </span>
              {isOptional && (
                <button
                  type="button"
                  data-ocid="profile_setup.cancel_button"
                  onClick={goNext}
                  className="text-xs text-muted-foreground underline"
                >
                  Skip
                </button>
              )}
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: "oklch(0.2 0.02 255)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.58 0.22 265), oklch(0.65 0.2 280))",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 overflow-y-auto px-4 pb-4"
          >
            {step === 1 && (
              <StepPhotos
                photos={data.photos}
                onChange={(photos) => setData((p) => ({ ...p, photos }))}
              />
            )}
            {step === 2 && (
              <StepBasicInfo
                name={data.name}
                age={data.age}
                city={data.city}
                onChange={(fields) => setData((p) => ({ ...p, ...fields }))}
              />
            )}
            {step === 3 && (
              <StepBio
                bio={data.bio}
                onChange={(bio) => setData((p) => ({ ...p, bio }))}
              />
            )}
            {step === 4 && (
              <StepInterests
                interests={data.interests}
                customInterest={customInterest}
                onCustomChange={setCustomInterest}
                onChange={(interests) => setData((p) => ({ ...p, interests }))}
              />
            )}
            {step === 5 && (
              <StepPersonality
                vibe={data.vibe}
                style={data.conversationStyle}
                onVibeChange={(vibe) => setData((p) => ({ ...p, vibe }))}
                onStyleChange={(conversationStyle) =>
                  setData((p) => ({ ...p, conversationStyle }))
                }
              />
            )}
            {step === 6 && (
              <StepIntent
                intent={data.intent}
                onChange={(intent) => setData((p) => ({ ...p, intent }))}
              />
            )}
            {step === 7 && (
              <StepLifestyle
                lifestyle={data.lifestyle}
                onChange={(lifestyle) => setData((p) => ({ ...p, lifestyle }))}
              />
            )}
            {step === 8 && (
              <StepConversationStarters
                expanded={expandedStarters}
                answers={starterAnswers}
                onToggle={(prompt) =>
                  setExpandedStarters((prev) => {
                    const next = new Set(prev);
                    if (next.has(prompt)) next.delete(prompt);
                    else next.add(prompt);
                    return next;
                  })
                }
                onAnswerChange={(prompt, answer) =>
                  setStarterAnswers((prev) => ({ ...prev, [prompt]: answer }))
                }
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div
        className="flex-shrink-0 px-4 pb-8 pt-3"
        data-ocid="profile_setup.primary_button"
      >
        <GlowButton onClick={goNext} disabled={!canContinue}>
          {step === TOTAL_STEPS ? "Finish 🎉" : "Continue"}
        </GlowButton>
      </div>
    </div>
  );
}

/* ─── Step components ─────────────────────────────────────── */

function StepPhotos({
  photos,
  onChange,
}: {
  photos: File[];
  onChange: (f: File[]) => void;
}) {
  const slots = [0, 1, 2];
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Show your best self 📸
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload 2–3 clear face photos
        </p>
      </div>
      <div className="flex gap-3 h-52">
        {slots.map((i) => (
          <PhotoSlot
            key={i}
            index={i}
            onSelect={(f) => {
              const next = [...photos];
              next[i] = f;
              onChange(next);
            }}
            onRemove={() => {
              const next = [...photos];
              next.splice(i, 1);
              onChange(next);
            }}
          />
        ))}
      </div>
      <div
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-muted-foreground"
        style={{ background: "oklch(0.17 0.022 265 / 0.5)" }}
      >
        <span>✨</span>
        <span>
          Clear face photos get{" "}
          <strong className="text-foreground">3x more matches</strong>
        </span>
      </div>
    </div>
  );
}

function StepBasicInfo({
  name,
  age,
  city,
  onChange,
}: {
  name: string;
  age: string;
  city: string;
  onChange: (f: { name?: string; age?: string; city?: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Let&apos;s get to know you 👋
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Just the basics</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name-input"
            className="text-sm font-medium text-foreground"
          >
            First name *
          </label>
          <Input
            id="name-input"
            data-ocid="profile_setup.input"
            placeholder="Your first name"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            className="h-14 rounded-2xl text-base bg-zinc-900 border-border px-5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="age-input"
            className="text-sm font-medium text-foreground"
          >
            Age *
          </label>
          <Input
            id="age-input"
            data-ocid="profile_setup.input"
            type="number"
            placeholder="Age"
            value={age}
            min={18}
            max={99}
            onChange={(e) => onChange({ age: e.target.value })}
            className="h-14 rounded-2xl text-base bg-zinc-900 border-border px-5"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="city-input"
            className="text-sm font-medium text-foreground"
          >
            City <span className="text-muted-foreground">(optional)</span>
          </label>
          <Input
            id="city-input"
            data-ocid="profile_setup.input"
            placeholder="City (optional)"
            value={city}
            onChange={(e) => onChange({ city: e.target.value })}
            className="h-14 rounded-2xl text-base bg-zinc-900 border-border px-5"
          />
        </div>
      </div>
    </div>
  );
}

function StepBio({
  bio,
  onChange,
}: { bio: string; onChange: (b: string) => void }) {
  const MAX = 150;
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Your vibe in a few words ✍️
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep it short and real
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Textarea
          data-ocid="profile_setup.textarea"
          rows={4}
          maxLength={MAX}
          placeholder={
            "Love late-night talks & coffee\nGym + travel + good vibes"
          }
          value={bio}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-2xl text-base bg-zinc-900 border-border px-5 py-4 resize-none"
        />
        <div className="text-xs text-right text-muted-foreground">
          {bio.length}/{MAX}
        </div>
      </div>
    </div>
  );
}

function StepInterests({
  interests,
  onChange,
  customInterest,
  onCustomChange,
}: {
  interests: string[];
  onChange: (i: string[]) => void;
  customInterest: string;
  onCustomChange: (v: string) => void;
}) {
  const toggle = (tag: string) => {
    if (interests.includes(tag)) onChange(interests.filter((i) => i !== tag));
    else onChange([...interests, tag]);
  };
  const addCustom = () => {
    const t = customInterest.trim();
    if (!t || interests.includes(t)) return;
    onChange([...interests, t]);
    onCustomChange("");
  };
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What are you into? 🔥
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick everything that fits you
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESET_INTERESTS.map((tag) => {
          const selected = interests.includes(tag);
          return (
            <button
              type="button"
              key={tag}
              data-ocid="profile_setup.toggle"
              onClick={() => toggle(tag)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
              style={{
                background: selected
                  ? "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))"
                  : "oklch(0.18 0.018 255)",
                color: selected ? "white" : "oklch(0.7 0.02 255)",
                border: selected ? "none" : "1px solid oklch(0.28 0.03 265)",
                boxShadow: selected
                  ? "0 0 12px oklch(0.58 0.22 265 / 0.3)"
                  : "none",
              }}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <Input
          data-ocid="profile_setup.search_input"
          placeholder="+ Add your own interest"
          value={customInterest}
          onChange={(e) => onCustomChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          className="flex-1 h-12 rounded-2xl bg-zinc-900 border-border px-4"
        />
        <Button
          type="button"
          data-ocid="profile_setup.secondary_button"
          onClick={addCustom}
          disabled={!customInterest.trim()}
          className="h-12 px-5 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))",
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

function StepPersonality({
  vibe,
  style,
  onVibeChange,
  onStyleChange,
}: {
  vibe: string;
  style: string;
  onVibeChange: (v: string) => void;
  onStyleChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-8 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What&apos;s your energy? ⚡
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This helps AI match your vibe
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">Your vibe?</h3>
        <div className="grid grid-cols-2 gap-3">
          {VIBE_OPTIONS.map((opt) => {
            const selected = vibe === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                data-ocid="profile_setup.toggle"
                onClick={() => onVibeChange(opt.value)}
                className="h-14 rounded-2xl text-sm font-medium transition-all duration-150"
                style={{
                  background: selected
                    ? "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))"
                    : "oklch(0.18 0.018 255)",
                  color: selected ? "white" : "oklch(0.7 0.02 255)",
                  border: selected ? "none" : "1px solid oklch(0.28 0.03 265)",
                  boxShadow: selected
                    ? "0 0 14px oklch(0.58 0.22 265 / 0.35)"
                    : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-foreground">
          Conversation style?
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((opt) => {
            const selected = style === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                data-ocid="profile_setup.toggle"
                onClick={() => onStyleChange(opt.value)}
                className="h-14 rounded-2xl text-sm font-medium transition-all duration-150"
                style={{
                  background: selected
                    ? "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))"
                    : "oklch(0.18 0.018 255)",
                  color: selected ? "white" : "oklch(0.7 0.02 255)",
                  border: selected ? "none" : "1px solid oklch(0.28 0.03 265)",
                  boxShadow: selected
                    ? "0 0 14px oklch(0.58 0.22 265 / 0.35)"
                    : "none",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepIntent({
  intent,
  onChange,
}: {
  intent: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          What are you looking for? 💭
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Be real — it helps us match you better
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {INTENT_OPTIONS.map((opt) => {
          const selected = intent === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              data-ocid="profile_setup.toggle"
              onClick={() => onChange(opt.value)}
              className="flex items-center gap-4 px-5 h-20 rounded-2xl text-left transition-all duration-150"
              style={{
                background: selected
                  ? "linear-gradient(135deg, oklch(0.22 0.05 265), oklch(0.18 0.04 280))"
                  : "oklch(0.16 0.018 255)",
                border: selected
                  ? "1.5px solid oklch(0.58 0.22 265 / 0.7)"
                  : "1px solid oklch(0.24 0.025 255)",
                boxShadow: selected
                  ? "0 0 18px oklch(0.58 0.22 265 / 0.2)"
                  : "none",
              }}
            >
              <span className="text-3xl">{opt.emoji}</span>
              <div>
                <div className="text-base font-semibold text-foreground">
                  {opt.label}
                </div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
              {selected && (
                <div
                  className="ml-auto w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 265)" }}
                >
                  <CheckIcon />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepLifestyle({
  lifestyle,
  onChange,
}: {
  lifestyle: ProfileData["lifestyle"];
  onChange: (l: ProfileData["lifestyle"]) => void;
}) {
  const rows: {
    key: keyof ProfileData["lifestyle"];
    a: { label: string; value: string };
    b: { label: string; value: string };
  }[] = [
    {
      key: "sleepStyle",
      a: { label: "🌙 Night Owl", value: "night-owl" },
      b: { label: "🌅 Early Bird", value: "early-bird" },
    },
    {
      key: "socialStyle",
      a: { label: "🧘 Introvert", value: "introvert" },
      b: { label: "🎉 Extrovert", value: "extrovert" },
    },
    {
      key: "privacyStyle",
      a: { label: "🤫 Private", value: "private" },
      b: { label: "🌐 Social", value: "social" },
    },
  ];
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          How do you roll? 🌙
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Helps us find your kind of people
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {rows.map((row) => {
          const val = lifestyle[row.key];
          return (
            <div key={row.key} className="flex gap-3">
              {[row.a, row.b].map((opt) => {
                const selected = val === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    data-ocid="profile_setup.toggle"
                    onClick={() =>
                      onChange({
                        ...lifestyle,
                        [row.key]: selected ? "" : opt.value,
                      })
                    }
                    className="flex-1 h-16 rounded-2xl text-sm font-medium transition-all duration-150"
                    style={{
                      background: selected
                        ? "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))"
                        : "oklch(0.18 0.018 255)",
                      color: selected ? "white" : "oklch(0.7 0.02 255)",
                      border: selected
                        ? "none"
                        : "1px solid oklch(0.28 0.03 265)",
                      boxShadow: selected
                        ? "0 0 14px oklch(0.58 0.22 265 / 0.3)"
                        : "none",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepConversationStarters({
  expanded,
  answers,
  onToggle,
  onAnswerChange,
}: {
  expanded: Set<string>;
  answers: Record<string, string>;
  onToggle: (p: string) => void;
  onAnswerChange: (p: string, a: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Set the conversation mood 💬
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick 2–3 and answer briefly — AI uses these
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {STARTER_PROMPTS.map((prompt) => {
          const isExpanded = expanded.has(prompt);
          return (
            <motion.div
              key={prompt}
              layout
              className="rounded-2xl overflow-hidden"
              style={{
                border: isExpanded
                  ? "1.5px solid oklch(0.58 0.22 265 / 0.6)"
                  : "1px solid oklch(0.24 0.025 255)",
                background: isExpanded
                  ? "oklch(0.18 0.025 265 / 0.6)"
                  : "oklch(0.16 0.018 255)",
              }}
            >
              <button
                type="button"
                data-ocid="profile_setup.toggle"
                onClick={() => onToggle(prompt)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium text-foreground">
                  {prompt}
                </span>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isExpanded
                      ? "oklch(0.58 0.22 265)"
                      : "oklch(0.25 0.03 265)",
                  }}
                >
                  {isExpanded ? (
                    <CheckIcon />
                  ) : (
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-4"
                  >
                    <Input
                      data-ocid="profile_setup.input"
                      placeholder="Your answer..."
                      value={answers[prompt] || ""}
                      onChange={(e) => onAnswerChange(prompt, e.target.value)}
                      className="h-12 rounded-xl bg-zinc-900 border-border px-4"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
