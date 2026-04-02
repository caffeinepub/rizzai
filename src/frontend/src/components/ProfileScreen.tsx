import { Switch } from "@/components/ui/switch";
import {
  Bell,
  ChevronRight,
  Crown,
  Heart,
  HelpCircle,
  MessageCircle,
  Settings,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const INTERESTS = [
  "Music",
  "Travel",
  "Coffee",
  "Books",
  "Hiking",
  "Art",
  "Film",
  "Yoga",
];

export function ProfileScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <button
          type="button"
          data-ocid="profile.settings.button"
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </button>
      </header>

      {/* Avatar + Identity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center px-5 pb-6"
      >
        <div className="relative">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold text-primary-foreground"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.45 0.22 280))",
            }}
          >
            A
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-primary flex items-center justify-center glow-blue-sm">
            <Star className="w-3.5 h-3.5 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>
        <h2 className="mt-4 text-xl font-bold text-foreground">Alex Rivera</h2>
        <p className="text-sm text-muted-foreground">25 · New York, NY</p>
        <p className="text-sm text-center text-muted-foreground mt-2 max-w-[240px] leading-relaxed">
          Building things by day, exploring the city by night. Always up for a
          good conversation.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="mx-5 mb-5 grid grid-cols-3 gap-2">
        {[
          { label: "Matches", value: "12", icon: Heart },
          { label: "Chats", value: "3", icon: MessageCircle },
          { label: "Rizz Score", value: "87", icon: Star },
        ].map(({ label, value, icon: Icon }, i) => (
          <motion.div
            key={label}
            data-ocid={`profile.item.${i + 1}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="rounded-2xl p-3 text-center border border-border"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.17 0.018 255), oklch(0.13 0.013 250))",
            }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Interests */}
      <div className="px-5 mb-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Interests
        </h3>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary border border-border text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Premium Banner */}
      <div className="mx-5 mb-5">
        <motion.div
          data-ocid="profile.premium.card"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="relative overflow-hidden rounded-2xl p-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.16 75), oklch(0.45 0.2 50), oklch(0.5 0.18 40))",
          }}
        >
          <div
            className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, white, transparent)",
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-100" />
                <span className="text-sm font-bold text-yellow-100">
                  RizzAI Premium
                </span>
              </div>
              <p className="text-xs text-yellow-200/80">
                Unlimited matches · AI coach · Priority
              </p>
            </div>
            <button
              type="button"
              data-ocid="profile.premium.button"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white text-xs font-semibold"
            >
              Upgrade
            </button>
          </div>
        </motion.div>
      </div>

      {/* Settings List */}
      <div className="px-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Settings
        </h3>
        <div className="space-y-1 rounded-2xl overflow-hidden border border-border">
          <SettingsRow
            icon={Bell}
            label="Notifications"
            ocid="profile.notifications.toggle"
            rightElement={
              <Switch
                checked={notificationsOn}
                onCheckedChange={setNotificationsOn}
                data-ocid="profile.notifications.switch"
              />
            }
          />
          <SettingsRow
            icon={Shield}
            label="Privacy"
            ocid="profile.privacy.button"
            chevron
          />
          <SettingsRow
            icon={Crown}
            label="Premium"
            ocid="profile.premium_settings.button"
            chevron
            accent
          />
          <SettingsRow
            icon={HelpCircle}
            label="Help & Support"
            ocid="profile.help.button"
            chevron
          />
        </div>
      </div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  ocid,
  rightElement,
  chevron,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  ocid: string;
  rightElement?: React.ReactNode;
  chevron?: boolean;
  accent?: boolean;
}) {
  return (
    <button
      type="button"
      data-ocid={ocid}
      className="w-full flex items-center gap-3 px-4 py-3.5 bg-card hover:bg-secondary/40 transition-colors text-left border-b border-border last:border-0"
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent ? "bg-yellow-500/20" : "bg-secondary"}`}
      >
        <Icon
          className={`w-4 h-4 ${accent ? "text-yellow-400" : "text-muted-foreground"}`}
        />
      </div>
      <span
        className={`flex-1 text-sm font-medium ${accent ? "text-yellow-300" : "text-foreground"}`}
      >
        {label}
      </span>
      {rightElement ??
        (chevron && <ChevronRight className="w-4 h-4 text-muted-foreground" />)}
    </button>
  );
}
