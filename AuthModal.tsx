import React, { useState } from "react";
import { X, Mail, Lock, Loader2, Sparkles, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
  onAuthSuccess: (user: { email: string; progress: any }) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = "login", onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in all details.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const url = mode === "login" ? "/api/auth/login" : "/api/auth/signup";

    try {
      // Gather local progress if signing up, so we can save their current work to the brand new account!
      const currentProgress = {
        quizzesTaken: localStorage.getItem("studyhub_quizzes_taken") || "0",
        xpPoints: localStorage.getItem("studyhub_xp_points") || "120",
        streakCount: localStorage.getItem("studyhub_streak_count") || "3",
        flashcardsCreated: localStorage.getItem("studyhub_flashcards_created") || "0",
        studentName: localStorage.getItem("studyhub_student_name") || "Aspirant",
        studyGoals: localStorage.getItem("studyhub_study_goals") || "[]",
        recentlyViewedNotes: localStorage.getItem("studyhub_recently_viewed_notes") || "[]",
        bookmarkedNotes: localStorage.getItem("studyhub_bookmarked_notes") || "[]",
        mockHistory: localStorage.getItem("studyhub_mock_history") || "[]",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
          progress: mode === "signup" ? currentProgress : undefined
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please try again.");
      }

      setSuccessMsg(mode === "login" ? "Welcome back! Syncing progress..." : "Account created successfully! Saving progress...");
      
      setTimeout(() => {
        onAuthSuccess({ email: data.email, progress: data.progress });
        onClose();
        // Clear forms
        setEmail("");
        setPassword("");
        setSuccessMsg("");
      }, 1200);

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden animate-fadeIn text-left">
        {/* Glow effect */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center pb-4 border-b border-slate-850">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold font-sans text-white">
            {mode === "login" ? "Welcome Back to StudyHub" : "Create Your Secure Account"}
          </h2>
          {/* REQUIRED MESSAGE */}
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
            Sign up to save your study progress across devices. All study resources remain free for everyone.
          </p>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-sans">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/30 rounded-xl">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-505" />
              <p className="font-medium">{successMsg}</p>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-350 tracking-wide block">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-350 tracking-wide block">SECURE PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-850 disabled:text-slate-500 text-white text-xs font-extrabold tracking-wider uppercase transition cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                VERIFYING SECURE CREDENTIALS...
              </>
            ) : mode === "login" ? (
              "Secure Login"
            ) : (
              "Create My Free Account"
            )}
          </button>

          {/* REQUIRED: CONTINUE AS GUEST BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 hover:border-slate-755 text-slate-400 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Continue as Guest <ArrowRight className="h-3 w-3" />
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 pt-4 border-t border-slate-850 text-center text-xs text-slate-400">
          {mode === "login" ? (
            <p>
              New to StudyHub?{" "}
              <button 
                onClick={() => setMode("signup")}
                className="text-indigo-400 hover:underline font-bold cursor-pointer"
              >
                Sign Up Now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => setMode("login")}
                className="text-indigo-400 hover:underline font-bold cursor-pointer"
              >
                Log In Instead
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
