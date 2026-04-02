import { ChatScreen } from "@/components/ChatScreen";
import { DiscoverScreen } from "@/components/DiscoverScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { Toaster } from "@/components/ui/sonner";
import { Compass, Home, MessageCircle, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type Tab = "home" | "discover" | "chat" | "profile";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "discover", label: "Discover", icon: Compass },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "profile", label: "Profile", icon: User },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const handleConnect = (matchId: string) => {
    setConnectedIds((prev) => new Set([...prev, matchId]));
  };

  return (
    <div className="min-h-screen bg-[oklch(0.08_0.01_255)] flex items-center justify-center p-4">
      {/* Phone frame */}
      <div
        className="relative w-full max-w-[390px] h-[844px] rounded-[44px] overflow-hidden phone-frame bg-background flex flex-col"
        style={{ minHeight: "min(844px, 100svh)" }}
      >
        {/* Status bar */}
        <div className="flex-shrink-0 h-11 flex items-center justify-between px-8 bg-background">
          <span className="text-xs font-semibold text-foreground">9:41</span>
          <div className="w-32 h-6 rounded-full bg-card border border-border" />
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-2.5 rounded-sm border border-muted-foreground/60 relative">
              <div className="absolute inset-y-0.5 left-0.5 right-1 bg-muted-foreground/60 rounded-[1px]" />
              <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1 bg-muted-foreground/60 rounded-full" />
            </div>
          </div>
        </div>

        {/* Screen content */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 overflow-hidden"
            >
              {activeTab === "home" && (
                <HomeScreen
                  onConnect={handleConnect}
                  connectedIds={connectedIds}
                />
              )}
              {activeTab === "discover" && <DiscoverScreen />}
              {activeTab === "chat" && <ChatScreen />}
              {activeTab === "profile" && <ProfileScreen />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Tab Bar */}
        <nav
          data-ocid="nav.tab"
          className="flex-shrink-0 tab-bar border-t border-border px-2 pb-4 pt-2"
        >
          <div className="flex items-center justify-around">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button"
                  key={tab.id}
                  data-ocid={`nav.${tab.id}.tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-1 py-1 px-3 relative"
                  aria-label={tab.label}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    {isActive && (
                      <motion.div
                        layoutId="tab-indicator"
                        className="absolute -inset-2 rounded-xl bg-primary/15"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/40">
          © {new Date().getFullYear()} Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground/70 transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>

      <Toaster />
    </div>
  );
}
