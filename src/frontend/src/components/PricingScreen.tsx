import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Duration = "daily" | "weekly" | "monthly";

const DURATION_LABELS: { id: Duration; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
];

interface PlanConfig {
  price: number | null;
  period: string;
  available: boolean;
}

const PRO_PRICING: Record<Duration, PlanConfig> = {
  daily: { price: 49, period: "/ day", available: true },
  weekly: { price: 199, period: "/ week", available: true },
  monthly: { price: 599, period: "/ month", available: true },
};

const ELITE_PRICING: Record<Duration, PlanConfig> = {
  daily: { price: null, period: "", available: false },
  weekly: { price: 299, period: "/ week", available: true },
  monthly: { price: 1199, period: "/ month", available: true },
};

const CREDIT_PACKS = [
  { price: 99, credits: 50, label: "Try it out", badge: null },
  { price: 199, credits: 150, label: "Most bought", badge: "Most bought" },
  { price: 499, credits: 500, label: "Best deal", badge: "Best deal" },
];

export function PricingScreen({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState<Duration>("monthly");

  const proPricing = PRO_PRICING[duration];
  const elitePricing = ELITE_PRICING[duration];

  const handlePlan = (_planId: string) => {
    toast.info("Coming soon — payment integration in progress");
  };

  const handlePack = () => {
    toast.info("Coming soon — payment integration in progress");
  };

  const proCtaText = `Start Pro ${duration.charAt(0).toUpperCase() + duration.slice(1)}`;
  const eliteCtaText = elitePricing.available
    ? `Go Elite ${duration.charAt(0).toUpperCase() + duration.slice(1)}`
    : "Not Available";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "oklch(0.10 0.012 255)" }}
      data-ocid="pricing.modal"
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
        style={{
          background: "oklch(0.10 0.012 255 / 0.95)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Choose your plan
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upgrade when it makes sense for you
          </p>
        </div>
        <button
          type="button"
          data-ocid="pricing.close_button"
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
          aria-label="Close pricing"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 pb-12">
        {/* Duration Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-center mb-6"
        >
          <div
            className="flex items-center gap-1 p-1 rounded-full border border-border"
            style={{ background: "oklch(0.13 0.014 255)" }}
            data-ocid="pricing.toggle"
          >
            {DURATION_LABELS.map((d) => (
              <button
                key={d.id}
                type="button"
                data-ocid={`pricing.duration.${d.id}.tab`}
                onClick={() => setDuration(d.id)}
                className="relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  color:
                    duration === d.id
                      ? "oklch(0.98 0.004 255)"
                      : "oklch(0.55 0.02 255)",
                  background:
                    duration === d.id ? "oklch(0.22 0.025 265)" : "transparent",
                  boxShadow:
                    duration === d.id
                      ? "0 0 0 1px oklch(0.58 0.22 265 / 0.35)"
                      : undefined,
                }}
              >
                {d.label}
                {d.id === "monthly" && (
                  <span
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap"
                    style={{
                      background: "oklch(0.65 0.22 265)",
                      color: "oklch(0.98 0.004 255)",
                    }}
                  >
                    SAVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="space-y-3 mb-8">
          {/* Free Plan */}
          <motion.div
            data-ocid="pricing.item.1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative rounded-3xl p-5 border border-border"
            style={{ background: "oklch(0.15 0.015 255)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Free</h2>
                <p className="text-sm text-muted-foreground">
                  Just starting out
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-muted-foreground">₹0</p>
                <p className="text-[11px] text-muted-foreground">forever</p>
              </div>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                "10 AI credits / month",
                "3 daily matches",
                "Basic matchmaking",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                  <span className="text-sm text-foreground/70">{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              data-ocid="pricing.free.primary_button"
              disabled
              className="w-full py-3 rounded-2xl font-bold text-sm bg-secondary text-muted-foreground cursor-default"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            data-ocid="pricing.item.2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative rounded-3xl p-5 border transition-all"
            style={{
              borderColor: "oklch(0.58 0.22 265 / 0.5)",
              background:
                "linear-gradient(145deg, oklch(0.17 0.025 265 / 0.4), oklch(0.14 0.016 255))",
              boxShadow:
                "0 0 0 1px oklch(0.58 0.22 265 / 0.25), 0 8px 32px oklch(0.58 0.22 265 / 0.08)",
            }}
          >
            {/* Badge */}
            <AnimatePresence mode="wait">
              {duration === "monthly" && (
                <motion.span
                  key="popular"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute -top-3 left-5 px-3 py-1 rounded-full text-[11px] font-bold bg-primary text-primary-foreground"
                >
                  🔥 Most Popular
                </motion.span>
              )}
            </AnimatePresence>

            <div className="flex items-start justify-between mb-1.5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Pro</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-snug max-w-[180px]">
                  Get better replies · More matches · Better visibility
                </p>
              </div>
              <div className="text-right">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={duration}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="text-2xl font-black text-primary"
                  >
                    ₹{proPricing.price}
                  </motion.p>
                </AnimatePresence>
                <p className="text-[11px] text-muted-foreground">
                  {proPricing.period}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 bg-primary/15 border border-primary/25">
              <Zap className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
              <span className="text-xs font-semibold text-primary">
                200 AI credits / month
              </span>
            </div>

            <ul className="space-y-2 mb-4">
              {[
                "Priority matches",
                "AI Reply Coach",
                "See who liked you",
                "Advanced conversation tips",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                  <span className="text-sm text-foreground/90">{f}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-ocid="pricing.pro.primary_button"
              onClick={() => handlePlan("pro")}
              className="w-full py-3 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all active:scale-[0.98]"
            >
              {proCtaText}
            </button>
          </motion.div>

          {/* Elite Plan */}
          <motion.div
            data-ocid="pricing.item.3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative rounded-3xl p-5 border transition-all"
            style={{
              borderColor: "oklch(0.75 0.18 75 / 0.4)",
              background:
                "linear-gradient(145deg, oklch(0.17 0.03 75 / 0.35), oklch(0.14 0.016 255))",
              boxShadow:
                "0 0 0 1px oklch(0.75 0.18 75 / 0.2), 0 8px 32px oklch(0.6 0.16 75 / 0.08)",
            }}
          >
            {/* Badge */}
            <AnimatePresence mode="wait">
              {duration === "monthly" && (
                <motion.span
                  key="bestvalue"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute -top-3 left-5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-black"
                >
                  ⭐ Best Value
                </motion.span>
              )}
            </AnimatePresence>

            <div className="flex items-start justify-between mb-1.5">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h2 className="text-lg font-bold text-foreground">Elite</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-snug max-w-[180px]">
                  Increase your chances · Priority visibility · Premium matches
                </p>
              </div>
              <div className="text-right">
                <AnimatePresence mode="wait">
                  {elitePricing.available ? (
                    <motion.p
                      key={duration}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="text-2xl font-black text-amber-300"
                    >
                      ₹{elitePricing.price}
                    </motion.p>
                  ) : (
                    <motion.p
                      key="unavailable"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-2xl font-black text-muted-foreground/40"
                    >
                      —
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="text-[11px] text-muted-foreground">
                  {elitePricing.available
                    ? elitePricing.period
                    : "not available"}
                </p>
              </div>
            </div>

            {!elitePricing.available && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 border"
                style={{
                  background: "oklch(0.15 0.01 255)",
                  borderColor: "oklch(0.3 0.01 255)",
                }}
              >
                <span className="text-xs text-muted-foreground/60">
                  Elite is available on Weekly &amp; Monthly plans only
                </span>
              </motion.div>
            )}

            {elitePricing.available && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 bg-amber-500/15 border border-amber-500/25">
                <Zap className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
                <span className="text-xs font-semibold text-amber-300">
                  Unlimited AI credits
                </span>
              </div>
            )}

            <ul className="space-y-2 mb-4">
              {[
                "Top placement in Discover",
                "Advanced AI Coach",
                "Read receipts",
                "Weekly profile boost",
                "Priority support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      elitePricing.available
                        ? "text-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      elitePricing.available
                        ? "text-foreground/90"
                        : "text-muted-foreground/40"
                    }`}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              data-ocid="pricing.elite.primary_button"
              disabled={!elitePricing.available}
              onClick={() => elitePricing.available && handlePlan("elite")}
              className={`w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
                !elitePricing.available
                  ? "bg-secondary/50 text-muted-foreground/40 cursor-default"
                  : "text-black hover:opacity-90"
              }`}
              style={
                elitePricing.available
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.68 0.22 55))",
                    }
                  : undefined
              }
            >
              {eliteCtaText}
            </button>
          </motion.div>
        </div>

        {/* Credit Packs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          data-ocid="pricing.credits.section"
        >
          <h3 className="text-base font-bold text-foreground mb-1">
            Need more credits? Top up anytime.
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            1 AI action = 1 credit. No subscription required.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-8">
            {CREDIT_PACKS.map((pack, i) => (
              <motion.button
                key={pack.price}
                type="button"
                data-ocid={`pricing.credits.item.${i + 1}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePack}
                className="relative flex flex-col items-center justify-center p-3.5 rounded-2xl border border-border bg-card hover:bg-secondary/60 active:scale-95 transition-all text-center"
              >
                {pack.badge && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary text-primary-foreground whitespace-nowrap">
                    {pack.badge}
                  </span>
                )}
                <p className="text-base font-black text-foreground mt-1">
                  ₹{pack.price}
                </p>
                <p className="text-[11px] font-semibold text-primary mt-0.5">
                  {pack.credits} credits
                </p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {pack.label}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Value footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center px-4 py-5 rounded-2xl border border-border/60 bg-secondary/30"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every credit helps you write messages that actually get replies.{" "}
            <span className="text-foreground font-medium">No pressure</span> —
            upgrade when it makes sense for you.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
