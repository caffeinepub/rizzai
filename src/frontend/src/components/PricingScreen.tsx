import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

const PLANS = [
  {
    id: "free",
    name: "Free",
    tagline: "Just starting out",
    price: null,
    priceLabel: "₹0",
    period: "forever",
    credits: "10 AI credits / month",
    features: [
      "10 AI credits every month",
      "3 daily matches",
      "Basic matchmaking",
      "Standard chat features",
    ],
    cta: "Current Plan",
    disabled: true,
    badge: null,
    highlight: false,
    icon: null,
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Get better replies, every day",
    price: 599,
    priceLabel: "₹599",
    period: "/ month",
    credits: "200 AI credits / month",
    features: [
      "200 AI credits monthly",
      "Priority matches",
      "AI Reply Coach",
      "See who liked you",
      "Advanced conversation tips",
    ],
    cta: "Start Pro",
    disabled: false,
    badge: "Most popular",
    highlight: true,
    icon: Sparkles,
  },
  {
    id: "elite",
    name: "Elite",
    tagline: "Maximize every conversation",
    price: 1199,
    priceLabel: "₹1199",
    period: "/ month",
    credits: "Unlimited AI credits",
    features: [
      "Unlimited AI credits",
      "Top placement in Discover",
      "Advanced AI Coach",
      "Read receipts",
      "Weekly profile boost",
      "Priority support",
    ],
    cta: "Go Elite",
    disabled: false,
    badge: "Best value",
    highlight: false,
    icon: Crown,
  },
];

const CREDIT_PACKS = [
  { price: 99, credits: 50, label: "Try it out", badge: null },
  { price: 199, credits: 150, label: "Most bought", badge: "Most bought" },
  { price: 499, credits: 500, label: "Best deal", badge: "Best deal" },
];

export function PricingScreen({ onClose }: { onClose: () => void }) {
  const handlePlan = (plan: (typeof PLANS)[0]) => {
    if (plan.disabled) return;
    toast.info("Coming soon — payment integration in progress");
  };

  const handlePack = () => {
    toast.info("Coming soon — payment integration in progress");
  };

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
        {/* Plans */}
        <div className="space-y-3 mb-8">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.id}
                data-ocid={`pricing.item.${i + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl p-5 border transition-all ${
                  plan.id === "elite"
                    ? "border-amber-500/40"
                    : plan.highlight
                      ? "border-primary/50"
                      : "border-border"
                }`}
                style={{
                  background:
                    plan.id === "elite"
                      ? "linear-gradient(145deg, oklch(0.17 0.03 75 / 0.35), oklch(0.14 0.016 255))"
                      : plan.highlight
                        ? "linear-gradient(145deg, oklch(0.17 0.025 265 / 0.4), oklch(0.14 0.016 255))"
                        : "oklch(0.15 0.015 255)",
                  boxShadow: plan.highlight
                    ? "0 0 0 1px oklch(0.58 0.22 265 / 0.25), 0 8px 32px oklch(0.58 0.22 265 / 0.08)"
                    : plan.id === "elite"
                      ? "0 0 0 1px oklch(0.75 0.18 75 / 0.2), 0 8px 32px oklch(0.6 0.16 75 / 0.08)"
                      : undefined,
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      plan.id === "elite"
                        ? "bg-amber-500/90 text-black"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}

                {/* Plan header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 ${
                            plan.id === "elite"
                              ? "text-amber-400"
                              : "text-primary"
                          }`}
                        />
                      )}
                      <h2 className="text-lg font-bold text-foreground">
                        {plan.name}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-2xl font-black ${
                        plan.id === "elite"
                          ? "text-amber-300"
                          : plan.highlight
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    >
                      {plan.priceLabel}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {plan.period}
                    </p>
                  </div>
                </div>

                {/* Credits highlight */}
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-4 ${
                    plan.id === "elite"
                      ? "bg-amber-500/15 border border-amber-500/25"
                      : plan.highlight
                        ? "bg-primary/15 border border-primary/25"
                        : "bg-secondary border border-border"
                  }`}
                >
                  <Zap
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      plan.id === "elite"
                        ? "text-amber-400"
                        : plan.highlight
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-xs font-semibold ${
                      plan.id === "elite"
                        ? "text-amber-300"
                        : plan.highlight
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {plan.credits}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          plan.id === "elite"
                            ? "text-amber-400"
                            : plan.highlight
                              ? "text-primary"
                              : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-foreground/90">{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  type="button"
                  data-ocid={`pricing.${plan.id}.primary_button`}
                  disabled={plan.disabled}
                  onClick={() => handlePlan(plan)}
                  className={`w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] ${
                    plan.disabled
                      ? "bg-secondary text-muted-foreground cursor-default"
                      : plan.id === "elite"
                        ? "text-black"
                        : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                  style={
                    plan.id === "elite" && !plan.disabled
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.68 0.22 55))",
                        }
                      : undefined
                  }
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
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
            Every credit helps you write messages that actually get replies.
            <span className="text-foreground font-medium"> No pressure</span> —
            upgrade when it makes sense for you.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
