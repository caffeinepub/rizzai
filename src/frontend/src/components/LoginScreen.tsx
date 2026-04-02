import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "motion/react";
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

function GoogleIcon() {
  return (
    <svg
      role="img"
      aria-label="Google"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Google</title>
      <path
        d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9086c1.7018-1.5668 2.6836-3.874 2.6836-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9086-2.2581c-.8059.54-1.8368.8591-3.0478.8591-2.3441 0-4.3282-1.5832-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573A8.9961 8.9961 0 0 0 0 9c0 1.4523.3477 2.8268.9573 4.0418L3.964 10.71z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6559 3.5795 9 3.5795z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = () => {
    if (!phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleVerify = () => {
    if (otp.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-svh w-screen bg-background flex flex-col items-center justify-center px-6"
      data-ocid="login.page"
    >
      {/* Background gradient blob */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.58 0.22 265) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="text-4xl font-black tracking-tight text-gradient">
            ⚡ RizzAI
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Get better replies
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Start smarter conversations
          </p>
        </motion.div>

        {/* Auth card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full glass rounded-2xl p-6 flex flex-col gap-5"
        >
          {step === "phone" ? (
            <div className="flex flex-col gap-3">
              <label
                htmlFor="phone-input"
                className="text-sm font-medium text-foreground"
              >
                Phone number
              </label>
              <Input
                id="phone-input"
                data-ocid="login.input"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                className="rounded-full h-12 px-5 bg-zinc-900 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50"
              />
              <button
                type="button"
                data-ocid="login.primary_button"
                onClick={handleSendCode}
                disabled={loading || !phone.trim()}
                className="w-full h-12 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))",
                  boxShadow:
                    loading || !phone.trim()
                      ? "none"
                      : "0 0 24px oklch(0.58 0.22 265 / 0.55), 0 0 48px oklch(0.58 0.22 265 / 0.2)",
                }}
              >
                {loading ? "Sending…" : "Send Code"}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3 items-center"
            >
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Code sent to{" "}
                  <span className="text-foreground font-medium">{phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-xs text-primary underline mt-1"
                >
                  Change number
                </button>
              </div>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-11 h-12 rounded-xl border-border bg-zinc-900 text-foreground text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <button
                type="button"
                data-ocid="login.submit_button"
                onClick={handleVerify}
                disabled={loading || otp.length < 6}
                className="w-full h-12 rounded-full font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.22 265), oklch(0.52 0.24 280))",
                  boxShadow:
                    loading || otp.length < 6
                      ? "none"
                      : "0 0 24px oklch(0.58 0.22 265 / 0.55), 0 0 48px oklch(0.58 0.22 265 / 0.2)",
                }}
              >
                {loading ? "Verifying…" : "Verify"}
              </button>
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google login */}
          <Button
            type="button"
            data-ocid="login.secondary_button"
            variant="outline"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full h-12 rounded-full border-border bg-transparent text-foreground gap-2 transition-all duration-200 hover:bg-zinc-800"
            style={{
              boxShadow:
                "0 0 12px oklch(0.58 0.22 265 / 0.2), inset 0 0 0 1px oklch(0.58 0.22 265 / 0.25)",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="text-xs text-muted-foreground text-center px-4"
        >
          By continuing, you agree to our{" "}
          <span className="underline cursor-pointer">Terms</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </motion.p>
      </div>
    </motion.div>
  );
}
