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
    <div className="h-svh w-screen bg-background flex flex-col overflow-hidden">
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
        className="flex-shrink-0 tab-bar border-t border-border px-2 pb-safe pt-2"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
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
                    style={
                      isActive
                        ? {
                            filter:
                              "drop-shadow(0 0 8px oklch(0.7 0.25 280)) drop-shadow(0 0 4px oklch(0.75 0.22 280))",
                          }
                        : undefined
                    }
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

      <Toaster />
    </div>
  );
}
