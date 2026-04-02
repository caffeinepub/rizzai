import { TrustBadge } from "@/components/TrustBadge";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MOCK_CONVERSATIONS,
  MOCK_MATCHES,
  type Match,
  type Message,
} from "@/data/mockData";
import {
  ArrowLeft,
  MessageCircle,
  MoreVertical,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Conversation Health Meter ─────────────────────────────────────────────────

type HealthStatus = "good" | "normal" | "dying";

const HEALTH_CONFIG: Record<
  HealthStatus,
  { emoji: string; label: string; bg: string; text: string; border: string }
> = {
  good: {
    emoji: "🔥",
    label: "Good",
    bg: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  normal: {
    emoji: "😐",
    label: "Normal",
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  dying: {
    emoji: "❄️",
    label: "Dying",
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
};

function computeHealth(messages: Message[]): HealthStatus {
  if (messages.length === 0) return "dying";

  // Check last 6 messages for back-and-forth
  const recent = messages.slice(-6);
  const senders = recent.map((m) => m.senderId);

  // Count consecutive "me" messages at the end (unanswered streak)
  let myStreak = 0;
  for (let i = senders.length - 1; i >= 0; i--) {
    if (senders[i] === "me") myStreak++;
    else break;
  }

  // Count alternations in recent window
  let alternations = 0;
  for (let i = 1; i < senders.length; i++) {
    if (senders[i] !== senders[i - 1]) alternations++;
  }

  // Last message is from them → engaged
  const lastFromThem = messages[messages.length - 1].senderId === "them";

  if (myStreak >= 3) return "dying";
  if (lastFromThem && alternations >= 2) return "good";
  if (lastFromThem || alternations >= 1) return "normal";
  if (myStreak >= 2) return "dying";
  return "normal";
}

function ConversationHealthMeter({ messages }: { messages: Message[] }) {
  const status = computeHealth(messages);
  const cfg = HEALTH_CONFIG[status];

  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${cfg.bg} ${cfg.text} ${cfg.border} flex-shrink-0`}
      title={`Conversation health: ${cfg.label}`}
    >
      <span className="leading-none">{cfg.emoji}</span>
      <span>{cfg.label}</span>
    </motion.div>
  );
}

// ── AI First Message ──────────────────────────────────────────────────────────

const AI_TEMPLATES = [
  (name: string, interest: string) =>
    `Hey ${name}, your thing with ${interest} seriously caught my eye 👀 — what's the most underrated part of it?`,
  (name: string, interest: string) =>
    `Okay ${name}, I have to know — ${interest}? Tell me everything. 😄`,
  (name: string, interest: string) =>
    `${name}! A fellow ${interest} person? We might be the same human. What got you into it?`,
  (_name: string, interest: string) =>
    `Hot take incoming: ${interest} is genuinely one of the best things. Agree or disagree? 👀`,
  (name: string, interest: string) =>
    `I saw ${interest} on your profile and had to say hi, ${name}. What's your current obsession in that space?`,
  (name: string, _interest: string) =>
    `${name}, your bio gave me way too many questions. Where do we even start? 😄`,
  (name: string, interest: string) =>
    `${interest} AND ${name}? This is already my favourite match today.`,
  (name: string, interest: string) =>
    `Serious question for ${name}: ${interest} fan — what would you recommend to a complete beginner?`,
  (name: string, _interest: string) =>
    `${name} — skipping the small talk. What's been the best part of your week so far?`,
  (name: string, interest: string) =>
    `I feel like anyone who's into ${interest} has excellent taste, so — hey ${name} 👋`,
];

function getAiFirstMessage(name: string, interests: string[]): string {
  const interest = interests[0] ?? "your interests";
  const idx = (name.charCodeAt(0) + interests.length) % AI_TEMPLATES.length;
  return AI_TEMPLATES[idx](name, interest);
}

function AiFirstMessageOverlay({
  profile,
  onSend,
  onDismiss,
}: {
  profile: Match;
  onSend: (text: string) => void;
  onDismiss: () => void;
}) {
  const suggestion = getAiFirstMessage(profile.name, profile.interests);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-40 bg-black/50 backdrop-blur-[1px]"
        onClick={onDismiss}
      />
      {/* Slide-up card */}
      <motion.div
        data-ocid="chat.ai_first_message.panel"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border px-5 pb-8 pt-5"
        style={{ background: "oklch(0.11 0.008 270)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-9 h-1 rounded-full bg-white/20 mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-base">✨</span>
          <p className="text-sm font-bold text-white">
            AI suggests a first message
          </p>
          <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            1 credit
          </span>
        </div>

        {/* Suggestion card */}
        <div
          className="rounded-2xl border border-white/10 px-4 py-3.5 mb-5"
          style={{ background: "oklch(0.16 0.01 270)" }}
        >
          <p className="text-sm text-white/90 leading-relaxed italic">
            &ldquo;{suggestion}&rdquo;
          </p>
        </div>

        {/* Primary action */}
        <button
          type="button"
          data-ocid="chat.ai_first_message.primary_button"
          onClick={() => onSend(suggestion)}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white mb-3 active:scale-[0.98] transition-transform"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 290), oklch(0.50 0.25 310))",
          }}
        >
          Send AI message
        </button>

        {/* Secondary */}
        <button
          type="button"
          data-ocid="chat.ai_first_message.cancel_button"
          onClick={onDismiss}
          className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Write my own
        </button>
      </motion.div>
    </>
  );
}

const SIMULATED_REPLIES = [
  "Haha that's so true 😄",
  "Tell me more!",
  "Omg same 🙌",
  "You're funny 😂",
  "No way... really? 👀",
  "That's actually wild 🤯",
  "Okay I wasn't expecting that 😅",
];

const STARTER_CHIPS = [
  "Ask about weekend plans 🌅",
  "Try a fun question 🎲",
  "What's your hot take? 🔥",
  "Favorite travel story? ✈️",
  "Coffee or tea? ☕",
  "Last show you binged? 📺",
];

// ── Conversation Suggestion Cards ─────────────────────────────────────────────

const CONVERSATION_SUGGESTIONS = [
  "Ask about their weekend 🌅",
  "Talk about hobbies 🎨",
  "Favorite travel memory? ✈️",
  "What's your hot take? 🔥",
  "Coffee or tea person? ☕",
  "What are you watching lately? 📺",
  "Any fun plans coming up? 🎉",
  "Best meal you've had recently? 🍜",
  "Dream destination? 🌏",
  "Morning person or night owl? 🌙",
];

function ConversationSuggestionCards({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="pt-2 px-4"
    >
      <div
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-1"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CONVERSATION_SUGGESTIONS.map((suggestion) => (
          <button
            type="button"
            key={suggestion}
            data-ocid="chat.suggestion.button"
            onClick={() => onSelect(suggestion)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

const REPORT_REASONS = [
  "Inappropriate content",
  "Spam",
  "Fake profile",
  "Harassment",
];

type AIMode =
  | "Reply Suggestions"
  | "Icebreakers"
  | "Message Improver"
  | "Chat Boost";

const AI_MODES: AIMode[] = [
  "Reply Suggestions",
  "Icebreakers",
  "Message Improver",
  "Chat Boost",
];

const SUGGESTIONS: Record<
  AIMode,
  { Funny: string; Flirty: string; Smart: string }
> = {
  "Reply Suggestions": {
    Funny: "Okay but why do you always make me laugh at the worst times 😂",
    Flirty:
      "Keep talking like that and I might actually have to stop pretending I'm busy 😏",
    Smart:
      "That's a genuinely interesting take — what made you see it that way?",
  },
  Icebreakers: {
    Funny: "Quick question: pineapple on pizza — hero or villain? 🍕",
    Flirty: "Be honest, do you always text this good or am I just special? 👀",
    Smart: "What's something you believe that most people would disagree with?",
  },
  "Message Improver": {
    Funny:
      "Upgrade: 'lol same' → 'Okay but that's literally my villain origin story 😂'",
    Flirty:
      "Upgrade: 'hey' → 'Okay I've been thinking about you way too much today 🙈'",
    Smart:
      "Upgrade: 'sounds good' → 'That actually lines up perfectly with what I was thinking'",
  },
  "Chat Boost": {
    Funny:
      "Plot twist: what if we just skipped the small talk and got to the weird stuff? 🤪",
    Flirty:
      "Real talk — you've been on my mind. What's your schedule looking like? 😌",
    Smart: "If our conversations were a movie, what genre would it be so far?",
  },
};

type Tone = "Funny" | "Flirty" | "Smart";

const TONE_CONFIG: Record<
  Tone,
  { emoji: string; badgeCls: string; cardBorder: string }
> = {
  Funny: {
    emoji: "😂",
    badgeCls: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    cardBorder: "border-amber-500/20",
  },
  Flirty: {
    emoji: "😏",
    badgeCls: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    cardBorder: "border-pink-500/20",
  },
  Smart: {
    emoji: "🧠",
    badgeCls: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
    cardBorder: "border-indigo-500/20",
  },
};

function AIAssistantPanel({
  onClose,
  onInsert,
  lastMessageFromMe,
  onOpenPricing,
}: {
  onClose: () => void;
  onInsert: (text: string) => void;
  lastMessageFromMe: boolean;
  onOpenPricing: () => void;
}) {
  const [activeMode, setActiveMode] = useState<AIMode>("Reply Suggestions");
  const suggestions = SUGGESTIONS[activeMode];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        data-ocid="chat.ai_panel.backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        data-ocid="chat.ai_panel.panel"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f] rounded-t-3xl border-t border-border"
        style={{ maxHeight: "72vh" }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-bold text-foreground text-base">
              AI Assistant
            </span>
            {/* Credit counter */}
            <span className="text-[10px] text-muted-foreground ml-1">
              5 free credits left ·{" "}
              <button
                type="button"
                data-ocid="chat.ai_panel.open_modal_button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="text-primary hover:underline"
              >
                Get more →
              </button>
            </span>
          </div>
          <button
            type="button"
            data-ocid="chat.ai_panel.close_button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
            aria-label="Close AI panel"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Smart Nudge */}
        <AnimatePresence mode="wait">
          {lastMessageFromMe && (
            <motion.div
              key="nudge-reply"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mx-5 mb-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <span className="text-sm">💡</span>
                <span className="text-xs text-amber-400 font-medium">
                  Try a better reply
                </span>
              </div>
            </motion.div>
          )}
          {activeMode === "Reply Suggestions" && !lastMessageFromMe && (
            <motion.div
              key="nudge-boost"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mx-5 mb-2 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                <span className="text-sm">🎯</span>
                <span className="text-xs text-blue-400 font-medium">
                  This might get a response
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mode Tabs */}
        <div className="px-5 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {AI_MODES.map((mode) => (
              <button
                type="button"
                key={mode}
                data-ocid="chat.ai_panel.tab"
                onClick={() => setActiveMode(mode)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Suggestion Cards */}
        <div
          className="px-5 pb-8 space-y-3 overflow-y-auto"
          style={{ maxHeight: "40vh" }}
        >
          {(["Funny", "Flirty", "Smart"] as Tone[]).map((tone, i) => {
            const cfg = TONE_CONFIG[tone];
            return (
              <motion.button
                type="button"
                key={tone}
                data-ocid={`chat.ai_panel.item.${i + 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onInsert(suggestions[tone]);
                  onClose();
                }}
                className={`w-full text-left bg-secondary/60 border ${cfg.cardBorder} rounded-2xl p-4 transition-colors hover:bg-secondary/80 active:scale-[0.98]`}
              >
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${cfg.badgeCls}`}
                >
                  {cfg.emoji} {tone}
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {suggestions[tone]}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

export function ChatScreen({
  onOpenPricing,
  aiFirstMessageProfile,
  onClearAiFirstMessage,
}: {
  onOpenPricing: () => void;
  aiFirstMessageProfile?: Match | null;
  onClearAiFirstMessage?: () => void;
}) {
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [showAiFirstMessage, setShowAiFirstMessage] = useState(false);

  // When a new match is passed in, open or create their conversation and show AI overlay
  const prevAiProfile = useRef<string | null>(null);
  useEffect(() => {
    if (!aiFirstMessageProfile) return;
    if (prevAiProfile.current === aiFirstMessageProfile.id) return;
    prevAiProfile.current = aiFirstMessageProfile.id;
    // Find existing convo or create a new empty one
    const existingConvo = conversations.find(
      (c) => c.match.id === aiFirstMessageProfile.id,
    );
    if (existingConvo) {
      setActiveConvoId(existingConvo.id);
    } else {
      const newConvo = {
        id: `convo-${aiFirstMessageProfile.id}`,
        match: {
          id: aiFirstMessageProfile.id,
          name: aiFirstMessageProfile.name,
          photo: aiFirstMessageProfile.photo,
        },
        messages: [],
        lastMessage: "",
        lastTime: "now",
        unread: 0,
      };
      setConversations((prev) => [newConvo, ...prev]);
      setActiveConvoId(newConvo.id);
    }
    setShowAiFirstMessage(true);
  }, [aiFirstMessageProfile, conversations]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  const handleSend = (text: string) => {
    if (!activeConvoId || !text.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      text,
      timestamp: new Date(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvoId
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: text,
              lastTime: "now",
              unread: 0,
            }
          : c,
      ),
    );
  };

  const handleSimulatedReply = (convoId: string) => {
    const reply =
      SIMULATED_REPLIES[Math.floor(Math.random() * SIMULATED_REPLIES.length)];
    const replyMsg: Message = {
      id: `msg-reply-${Date.now()}`,
      senderId: "them",
      text: reply,
      timestamp: new Date(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [...c.messages, replyMsg],
              lastMessage: reply,
              lastTime: "now",
            }
          : c,
      ),
    );
  };

  const handleOpen = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
    setActiveConvoId(id);
  };

  if (activeConvo) {
    return (
      <ChatDetail
        conversation={activeConvo}
        onBack={() => setActiveConvoId(null)}
        onSend={handleSend}
        onSimulatedReply={() => handleSimulatedReply(activeConvo.id)}
        onOpenPricing={onOpenPricing}
        showAiFirstMessage={showAiFirstMessage}
        aiFirstMessageProfile={aiFirstMessageProfile}
        onDismissAiFirstMessage={() => {
          setShowAiFirstMessage(false);
          onClearAiFirstMessage?.();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <header className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {conversations.length} active conversations
        </p>
      </header>

      <div data-ocid="chat.list" className="px-3 pb-24 space-y-1">
        {conversations.map((convo, i) => (
          <motion.button
            type="button"
            key={convo.id}
            data-ocid={`chat.item.${i + 1}`}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => handleOpen(convo.id)}
            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60 active:bg-secondary transition-colors text-left"
          >
            <div className="relative flex-shrink-0">
              <Avatar className="w-12 h-12 border border-border">
                <AvatarImage src={convo.match.photo} alt={convo.match.name} />
                <AvatarFallback>{convo.match.name[0]}</AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-sm">
                  {convo.match.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {convo.lastTime}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate mt-0.5">
                {convo.lastMessage}
              </p>
            </div>
            {convo.unread > 0 && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {convo.unread}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ChatDetail({
  conversation,
  onBack,
  onSend,
  onSimulatedReply,
  onOpenPricing,
  showAiFirstMessage,
  aiFirstMessageProfile,
  onDismissAiFirstMessage,
}: {
  conversation: (typeof MOCK_CONVERSATIONS)[0];
  onBack: () => void;
  onSend: (text: string) => void;
  onSimulatedReply: () => void;
  onOpenPricing: () => void;
  showAiFirstMessage?: boolean;
  aiFirstMessageProfile?: Match | null;
  onDismissAiFirstMessage?: () => void;
}) {
  const [input, setInput] = useState("");
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [sentCount, setSentCount] = useState(0);
  const [showUpsellNudge, setShowUpsellNudge] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Look up trust score for the person being chatted with
  const matchData = MOCK_MATCHES.find((m) => m.id === conversation.match.id);
  const trustScore = matchData?.trustScore ?? 92;

  const lastMessageFromMe =
    conversation.messages.length > 0 &&
    conversation.messages[conversation.messages.length - 1].senderId === "me";

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    const newCount = sentCount + 1;
    setSentCount(newCount);
    // Show soft upsell after 2nd message, once per session
    if (newCount === 2 && !showUpsellNudge) {
      setShowUpsellNudge(true);
    }
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      onSimulatedReply();
    }, 2000);
  };

  const handleReport = () => {
    setReportOpen(false);
    setSelectedReason(null);
    toast.success("Report submitted");
  };

  const handleBlock = () => {
    setBlockOpen(false);
    toast.success(`${conversation.match.name} blocked`);
    onBack();
  };

  const lastOutgoingIndex = conversation.messages.reduce(
    (acc, msg, i) => (msg.senderId === "me" ? i : acc),
    -1,
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border flex-shrink-0">
        <button
          type="button"
          data-ocid="chat.back.button"
          onClick={onBack}
          className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <Avatar className="w-9 h-9 border border-border">
          <AvatarImage
            src={conversation.match.photo}
            alt={conversation.match.name}
          />
          <AvatarFallback>{conversation.match.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm text-foreground truncate">
              {conversation.match.name}
            </p>
            <TrustBadge score={trustScore} size="sm" />
          </div>
          <p className="text-xs text-green-400">Online</p>
        </div>
        {/* Conversation Health Meter */}
        <ConversationHealthMeter messages={conversation.messages} />
        {/* More options */}
        <button
          type="button"
          data-ocid="chat.open_modal_button"
          onClick={() => setMenuOpen(true)}
          className="w-8 h-8 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3"
      >
        {conversation.messages.length === 0 ? (
          <ConversationStarters
            onChipClick={(chip) => {
              setInput(chip);
              inputRef.current?.focus();
            }}
          />
        ) : (
          <div className="space-y-1">
            {conversation.messages.map((msg, i) => {
              const isLastOutgoing =
                msg.senderId === "me" && i === lastOutgoingIndex;
              return (
                <div key={msg.id}>
                  <MessageBubble message={msg} />
                  {isLastOutgoing && (
                    <p className="text-[10px] text-muted-foreground text-right mt-0.5 pr-1">
                      Seen ✓
                    </p>
                  )}
                </div>
              );
            })}
            <AnimatePresence>{isTyping && <TypingBubble />}</AnimatePresence>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Soft upsell nudge + Suggestion cards + Input area */}
      <div className="flex-shrink-0 border-t border-border">
        {/* Soft Upsell Nudge */}
        <AnimatePresence>
          {showUpsellNudge && (
            <motion.div
              data-ocid="chat.ai_upsell.card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="mx-4 mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-amber-500/35"
              style={{ background: "oklch(0.16 0.025 75 / 0.25)" }}
            >
              <span className="text-base leading-none flex-shrink-0">✨</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-amber-200 leading-tight">
                  Use AI to improve this reply
                </p>
                <p className="text-[10px] text-amber-400/80 mt-0.5">
                  Increase your chances of getting a response
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  data-ocid="chat.ai_upsell.primary_button"
                  onClick={() => {
                    setShowUpsellNudge(false);
                    setShowAIPanel(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 transition-colors text-[11px] font-bold text-amber-300"
                >
                  Try AI
                </button>
                <button
                  type="button"
                  data-ocid="chat.ai_upsell.close_button"
                  onClick={() => setShowUpsellNudge(false)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation Suggestion Cards */}
        {conversation.messages.length > 0 && !showAIPanel && (
          <ConversationSuggestionCards
            onSelect={(text) => {
              setInput(text);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
          />
        )}

        {/* Input */}
        <div className="px-4 py-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-secondary rounded-2xl px-4 py-3 flex items-center">
              <input
                ref={inputRef}
                data-ocid="chat.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
            </div>
            {/* AI Button */}
            <button
              type="button"
              data-ocid="chat.ai.button"
              onClick={() => setShowAIPanel(true)}
              className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors flex-shrink-0"
              aria-label="Open AI assistant"
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </button>
            {/* Send Button */}
            <button
              type="button"
              data-ocid="chat.submit_button"
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* AI First Message Overlay */}
      <AnimatePresence>
        {showAiFirstMessage &&
          aiFirstMessageProfile &&
          conversation.messages.length === 0 && (
            <AiFirstMessageOverlay
              profile={aiFirstMessageProfile}
              onSend={(text) => {
                onSend(text);
                onDismissAiFirstMessage?.();
              }}
              onDismiss={() => onDismissAiFirstMessage?.()}
            />
          )}
      </AnimatePresence>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAIPanel && (
          <AIAssistantPanel
            onClose={() => setShowAIPanel(false)}
            onInsert={(text) => {
              setInput(text);
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            lastMessageFromMe={lastMessageFromMe}
            onOpenPricing={onOpenPricing}
          />
        )}
      </AnimatePresence>

      {/* More options bottom sheet */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-border px-5 pb-8 pt-4"
              style={{ background: "oklch(0.13 0.014 255)" }}
              data-ocid="chat.sheet"
            >
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 px-1">
                Options for {conversation.match.name}
              </p>
              <div className="space-y-2">
                <button
                  type="button"
                  data-ocid="chat.open_modal_button"
                  onClick={() => {
                    setMenuOpen(false);
                    setReportOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-secondary/60 border border-border hover:bg-secondary transition-colors text-left"
                >
                  <span className="text-base">🚩</span>
                  <span className="text-sm font-semibold text-foreground">
                    Report
                  </span>
                </button>
                <button
                  type="button"
                  data-ocid="chat.delete_button"
                  onClick={() => {
                    setMenuOpen(false);
                    setBlockOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 hover:bg-rose-500/15 transition-colors text-left"
                >
                  <span className="text-base">🚫</span>
                  <span className="text-sm font-semibold text-rose-400">
                    Block
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Report Dialog */}
      <AlertDialog open={reportOpen} onOpenChange={setReportOpen}>
        <AlertDialogContent
          className="border-border"
          style={{ background: "oklch(0.14 0.014 255)" }}
          data-ocid="chat.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Report {conversation.match.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Select a reason for your report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-wrap gap-2 py-2">
            {REPORT_REASONS.map((reason) => (
              <button
                key={reason}
                type="button"
                data-ocid="chat.radio"
                onClick={() => setSelectedReason(reason)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedReason === reason
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "bg-secondary border-border text-muted-foreground hover:border-border/80"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="chat.cancel_button"
              className="border-border text-muted-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              data-ocid="chat.confirm_button"
              disabled={!selectedReason}
              onClick={handleReport}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-all"
            >
              Submit Report
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Dialog */}
      <AlertDialog open={blockOpen} onOpenChange={setBlockOpen}>
        <AlertDialogContent
          className="border-border"
          style={{ background: "oklch(0.14 0.014 255)" }}
          data-ocid="chat.dialog"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Block {conversation.match.name}?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              They won't be able to contact you or see your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              data-ocid="chat.cancel_button"
              className="border-border text-muted-foreground"
            >
              Cancel
            </AlertDialogCancel>
            <button
              type="button"
              data-ocid="chat.delete_button"
              onClick={handleBlock}
              className="px-4 py-2 rounded-md bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-all"
            >
              Block
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ConversationStarters({
  onChipClick,
}: { onChipClick: (chip: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full min-h-[300px] px-4 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-bold text-foreground text-lg mb-1">
        Start the conversation
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Break the ice — it's easier than you think 💬
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {STARTER_CHIPS.map((chip) => (
          <button
            type="button"
            key={chip}
            data-ocid="chat.empty_state"
            onClick={() => onChipClick(chip)}
            className="bg-secondary/70 border border-border rounded-full px-3 py-1.5 text-xs text-foreground hover:bg-secondary active:scale-95 transition-all"
          >
            {chip}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex justify-start mt-1"
    >
      <div className="bg-secondary border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground block"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              duration: 0.8,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === "me";
  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`flex flex-col ${isMe ? "items-end" : "items-start"} mb-1`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-foreground rounded-bl-sm border border-border"
        }`}
      >
        {message.text}
      </div>
      <p
        className={`text-[10px] text-muted-foreground mt-0.5 ${
          isMe ? "text-right" : "text-left"
        }`}
      >
        {timeStr}
      </p>
    </motion.div>
  );
}
