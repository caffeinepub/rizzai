import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AI_RIZZ_TIPS,
  MOCK_CONVERSATIONS,
  type Message,
} from "@/data/mockData";
import { ArrowLeft, ChevronRight, Send, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function ChatScreen() {
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

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
}: {
  conversation: (typeof MOCK_CONVERSATIONS)[0];
  onBack: () => void;
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");
  const [showAI, setShowAI] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tips = AI_RIZZ_TIPS[conversation.id] ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages]);

  const handleSubmit = () => {
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
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
        <div>
          <p className="font-semibold text-sm text-foreground">
            {conversation.match.name}
          </p>
          <p className="text-xs text-green-400">Online</p>
        </div>
        <button
          type="button"
          data-ocid="chat.ai_panel.button"
          onClick={() => setShowAI((v) => !v)}
          className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            showAI
              ? "bg-primary text-primary-foreground glow-blue-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Rizz AI
        </button>
      </header>

      {/* AI Panel */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            key="ai-panel"
            data-ocid="chat.ai_panel.panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden flex-shrink-0"
          >
            <div className="glass m-3 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    AI Rizz Tips
                  </span>
                </div>
                <button
                  type="button"
                  data-ocid="chat.ai_panel.close_button"
                  onClick={() => setShowAI(false)}
                  className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center"
                  aria-label="Close AI panel"
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-2">
                {tips.map((tip, i) => (
                  <button
                    type="button"
                    key={tip}
                    data-ocid={`chat.ai_panel.item.${i + 1}`}
                    onClick={() => {
                      setInput(tip);
                      setShowAI(false);
                    }}
                    className="w-full flex items-start gap-2.5 p-2.5 rounded-xl bg-background/60 hover:bg-background border border-border text-left transition-colors group"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed flex-1">
                      {tip}
                    </p>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2"
      >
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-border">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-secondary rounded-2xl px-4 py-3 flex items-center">
            <input
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
          <button
            type="button"
            data-ocid="chat.submit_button"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all glow-blue-sm disabled:glow-none flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-primary-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isMe = message.senderId === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
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
    </motion.div>
  );
}
