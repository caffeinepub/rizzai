import { ChatScreen } from "@/components/ChatScreen";
import { DiscoverScreen } from "@/components/DiscoverScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { IdentityPreferenceFlow } from "@/components/IdentityPreferenceFlow";
import { LoginScreen } from "@/components/LoginScreen";
import { PricingScreen } from "@/components/PricingScreen";
import { ProfileScreen } from "@/components/ProfileScreen";
import { ProfileSetupFlow } from "@/components/ProfileSetupFlow";
import { Toaster } from "@/components/ui/sonner";
import type { Match } from "@/data/mockData";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileSetup, setIsProfileSetup] = useState(false);
  const [isPreferenceSetup, setIsPreferenceSetup] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [showPricing, setShowPricing] = useState(false);
  const [boostEndsAt, setBoostEndsAt] = useState<number | null>(null);
  const [aiFirstMessageProfile, setAiFirstMessageProfile] =
    useState<Match | null>(null);

  const handleConnect = (matchId: string) => {
    setConnectedIds((prev) => new Set([...prev, matchId]));
  };

  const handleConnectMatch = (match: Match) => {
    setConnectedIds((prev) => new Set([...prev, match.id]));
    setAiFirstMessageProfile(match);
    setActiveTab("chat");
  };

  const handleActivateBoost = (endsAt: number | null) => {
    setBoostEndsAt(endsAt);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        <Toaster />
      </>
    );
  }

  if (!isProfileSetup) {
    return (
      <>
        <ProfileSetupFlow onComplete={() => setIsProfileSetup(true)} />
        <Toaster />
      </>
    );
  }

  if (!isPreferenceSetup) {
    return (
      <>
        <IdentityPreferenceFlow onComplete={() => setIsPreferenceSetup(true)} />
        <Toaster />
      </>
    );
  }

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
                onConnectMatch={handleConnectMatch}
                connectedIds={connectedIds}
                onGoToDiscover={() => setActiveTab("discover")}
                onOpenPricing={() => setShowPricing(true)}
                boostEndsAt={boostEndsAt}
              />
            )}
            {activeTab === "discover" && <DiscoverScreen />}
            {activeTab === "chat" && (
              <ChatScreen
                onOpenPricing={() => setShowPricing(true)}
                aiFirstMessageProfile={aiFirstMessageProfile}
                onClearAiFirstMessage={() => setAiFirstMessageProfile(null)}
              />
            )}
            {activeTab === "profile" && (
              <ProfileScreen
                onOpenPricing={() => setShowPricing(true)}
                boostEndsAt={boostEndsAt}
                onActivateBoost={handleActivateBoost}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <nav
        data-ocid="nav.tab"
        className="flex-shrink-0 tab-bar border-t border-border px-2 pt-2"
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
                className="flex flex-col items-center gap-1 py-1 px-4"
                aria-label={tab.label}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? "text-white" : "text-zinc-500"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                <span
                  className={`text-[10px] transition-colors duration-200 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-zinc-500 font-medium"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Pricing Overlay */}
      <AnimatePresence>
        {showPricing && <PricingScreen onClose={() => setShowPricing(false)} />}
      </AnimatePresence>

      <Toaster />
    </div>
  );
}
