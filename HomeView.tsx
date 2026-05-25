import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Lightbulb, 
  CheckCircle2, 
  BookOpen, 
  Clock, 
  Zap, 
  BookMarked, 
  HelpCircle, 
  Loader2, 
  Award, 
  History, 
  Edit, 
  Check, 
  Calendar, 
  Plus, 
  Trash2, 
  Compass, 
  Target 
} from "lucide-react";

interface HomeViewProps {
  key?: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  xpPoints: number;
  totalQuizzesTaken: number;
  completedFlashcards: number;
  currentUser?: { email: string } | null;
  onOpenAuth?: (mode: "login" | "signup") => void;
}

interface StudyGoal {
  id: string;
  text: string;
  done: boolean;
  xpValue: number;
}

export default function HomeView({ 
  setActiveTab, 
  streakCount, 
  xpPoints, 
  totalQuizzesTaken, 
  completedFlashcards,
  currentUser,
  onOpenAuth
}: HomeViewProps) {
  // AI assistant states
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Student Dashboard state persistence from localStorage
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem("studyhub_student_name") || "Aspirant";
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const [selectedExamPreset, setSelectedExamPreset] = useState<string>(() => {
    return localStorage.getItem("studyhub_countdown_preset") || "jee_main";
  });
  const [customExamDate, setCustomExamDate] = useState<string>(() => {
    return localStorage.getItem("studyhub_custom_exam_date") || "2027-04-05";
  });

  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Persistent Active Study Goals Checklist
  const [goals, setGoals] = useState<StudyGoal[]>(() => {
    const saved = localStorage.getItem("studyhub_study_goals");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: "1", text: "Complete 1 full Biology & Science mock paper", done: false, xpValue: 40 },
      { id: "2", text: "Bookmark calculus limits & derivatives summaries", done: false, xpValue: 15 },
      { id: "3", text: "Practice 15 active recall flashcards on Physics", done: false, xpValue: 25 },
      { id: "4", text: "Ask AI Tutor 3 critical organic chemistry prompts", done: false, xpValue: 20 }
    ];
  });
  const [newGoalText, setNewGoalText] = useState("");

  // Countdown timer clock ticks state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Load recently viewed notes from NotesView key
  useEffect(() => {
    const saved = localStorage.getItem("studyhub_recently_viewed_notes");
    if (saved) {
      try {
        setRecentlyViewed(JSON.parse(saved).slice(0, 3));
      } catch (e) {
        console.error("Failed parsing recently viewed", e);
      }
    }
  }, []);

  // Save student name
  const handleSaveName = () => {
    const clean = tempName.trim();
    if (clean) {
      setUserName(clean);
      localStorage.setItem("studyhub_student_name", clean);
    }
    setIsEditingName(false);
  };

  // Keep Goals persisted
  useEffect(() => {
    localStorage.setItem("studyhub_study_goals", JSON.stringify(goals));
  }, [goals]);

  // Handle addition of custom Goal
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const item: StudyGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      done: false,
      xpValue: 15
    };
    setGoals([...goals, item]);
    setNewGoalText("");
  };

  // Toggle Goal state
  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, done: !g.done };
      }
      return g;
    }));
  };

  // Delete Goal state
  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  // Live clock ticker
  useEffect(() => {
    // Save presets
    localStorage.setItem("studyhub_countdown_preset", selectedExamPreset);
    localStorage.setItem("studyhub_custom_exam_date", customExamDate);

    const computeTimeRemaining = () => {
      let targetDateStr = "";
      switch (selectedExamPreset) {
        case "cbse_10":
          targetDateStr = "2027-03-01T09:00:00";
          break;
        case "cbse_12":
          targetDateStr = "2027-03-01T09:00:00";
          break;
        case "jee_main":
          targetDateStr = "2027-04-05T09:00:00";
          break;
        case "neet_ug":
          targetDateStr = "2027-05-03T09:00:00";
          break;
        case "custom":
        default:
          targetDateStr = `${customExamDate}T09:00:00`;
          break;
      }

      const difference = +new Date(targetDateStr) - +new Date();
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    // Fast initial tick
    setTimeLeft(computeTimeRemaining());

    const timer = setInterval(() => {
      setTimeLeft(computeTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedExamPreset, customExamDate]);

  // Timezone / dynamic salute selection
  const getSaluteMessage = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) {
      return {
        title: "Good Morning",
        salute: "Grab your tea ☕, morning study is proven of maximum brain retention!"
      };
    } else if (hr >= 12 && hr < 17) {
      return {
        title: "Good Afternoon",
        salute: "Stay sharp! A quick conceptual review now keeps you miles ahead."
      };
    } else {
      return {
        title: "Good Evening",
        salute: "Late night revisions? Diligent study builds permanent synapses! Remember breaks."
      };
    }
  };

  const currentSalute = getSaluteMessage();

  // Redirect click handler to auto-navigate to revision summaries tab and pull specific note ID state
  const handleRedirectToNote = (note: any) => {
    localStorage.setItem("studyhub_auto_select_note_id", note.id);
    localStorage.setItem("studyhub_auto_select_class", String(note.classLevel || 10));
    localStorage.setItem("studyhub_auto_select_subject", note.subject || "Mathematics");
    setActiveTab("notes");
  };

  const handleQuickAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setLoading(true);
    setErrorMsg("");
    setAiResponse("");

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiQuery,
          systemInstruction: "You are an incredibly inspiring, friendly, and expert high-school/college tutor at StudyHub AI. Synthesize complex concepts cleanly with simple, clear, bulleted explanations under 150 words. Do not use complex jargon. Encourage the student."
        }),
      });

      if (!res.ok) {
        throw new Error("Could not connect to the StudyHub AI engine.");
      }

      const data = await res.json();
      setAiResponse(data.text || "No response received. Please check backend config.");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred with Gemini API. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const loadPresetQuery = (preset: string) => {
    setAiQuery(preset);
  };

  const quickSubjects = [
    { title: "Mathematics", desc: "Calculus, Linear Vector spaces", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/30", text: "text-blue-400" },
    { title: "Physics", desc: "Forces, Mechanics, Entropy", color: "from-amber-500/20 to-orange-500/10", border: "border-amber-500/30", text: "text-amber-400" },
    { title: "Chemistry", desc: "Orbitals, Substitutions (SN1/SN2)", color: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
    { title: "Computer Science", desc: "Complexity, Algorithms, Databases", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/30", text: "text-purple-400" },
  ];

  // Calculators for leveling
  const currentLevel = Math.floor(xpPoints / 100) + 1;
  const xpInCurrentLevel = xpPoints % 100;

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. STUDENT WELCOME BANNER BOARD */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 text-left">
            <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 rounded-md">
              Level {currentLevel} Academics Cadet
            </span>

            <div className="flex items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempName}
                    maxLength={18}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-white font-extrabold text-2xl px-3 py-1 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h1 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight">
                    {currentSalute.title}, {userName}! 🌟
                  </h1>
                  <button 
                    onClick={() => {
                      setTempName(userName);
                      setIsEditingName(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-850 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Change study nickname"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm text-slate-450 max-w-xl font-medium leading-relaxed">
              {currentSalute.salute}
            </p>
          </div>

          {/* XP Progress Indicator Widget */}
          <div className="bg-slate-950/60 p-4 border border-slate-850 rounded-2xl md:min-w-[280px] shrink-0 text-left">
            <div className="flex justify-between items-center text-xs font-bold font-mono tracking-wide text-slate-400 mb-2">
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-yellow-400" />
                LEVEL PROGRESS
              </span>
              <span>{xpInCurrentLevel}%</span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-slate-900 rounded-full h-3 border border-slate-800 p-0.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-400 via-indigo-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(8, xpInCurrentLevel)}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-2.5 text-[10.5px] text-slate-450 font-bold">
              <span>{xpPoints} Total XP Earned</span>
              <span className="text-indigo-400 font-bold">Next Level: {currentLevel + 1}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CLOUD PROGRESS TRACKER HUB */}
      {currentUser ? (
        <section id="saved-progress-dashboard" className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/40 border-2 border-indigo-500/30 rounded-3xl p-6 text-left relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                  Cloud State Synced (Secure)
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">Your Saved Progress</h2>
              <p className="text-xs text-slate-400">Your mock histories, study trackers, and streak checkpoints are saved to the cloud.</p>
            </div>
            
            <div className="text-xs font-mono text-slate-400 bg-slate-950/60 border border-slate-850 px-3 py-1.5 rounded-xl">
              Account: <span className="text-indigo-400 font-bold">{currentUser.email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">STATIONED STREAK</span>
              <span className="text-lg font-extrabold text-orange-400 mt-1 block">🔥 {streakCount} Days Streaks</span>
              <span className="text-[10px] text-slate-500">Safely backed up. Keep it rolling!</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">SUBMITTED EXAMS</span>
              <span className="text-lg font-extrabold text-sky-400 mt-1 block">📝 {totalQuizzesTaken} Quizzes Taken</span>
              <span className="text-[10px] text-slate-500">Your answer metrics are fully recorded.</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">TARGET GOALS CHECKLIST</span>
              <span className="text-lg font-extrabold text-emerald-400 mt-1 block">🎯 {goals.length} Goals Registered</span>
              <span className="text-[10px] text-slate-500">Active milestone checkpoints synced.</span>
            </div>
          </div>

          {/* Test scores archive */}
          <div className="mt-5 bg-slate-950/40 p-4 rounded-2xl border border-dashed border-slate-800">
            <h4 className="text-xs font-extrabold text-indigo-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              📈 Cloud Archived Test Scores (Mock Papers History)
            </h4>
            
            {(() => {
              const savedScoresStr = localStorage.getItem("studyhub_mock_history");
              let savedScores: any[] = [];
              if (savedScoresStr) {
                try {
                  savedScores = JSON.parse(savedScoresStr);
                } catch (e){}
              }

              if (savedScores.length === 0) {
                return (
                  <p className="text-xs text-slate-500 italic">
                    No mock testing evaluations logged yet. Complete standard mock papers to lock in your scores across devices!
                  </p>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedScores.slice(0, 4).map((record: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs bg-slate-950/90 p-2.5 rounded-xl border border-slate-850">
                      <div>
                        <p className="font-bold text-slate-300 truncate max-w-[170px]">{record.testTitle}</p>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{record.date}</p>
                      </div>
                      <span className="font-extrabold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                        Score: {record.score} / {record.totalQuestions}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      ) : (
        /* Guest Progress Promotion Card showing the exact small message */
        <section className="bg-slate-900 border border-slate-850/80 rounded-3xl p-6 text-left relative overflow-hidden animate-fadeIn flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-1 bg-slate-900 text-left">
            <span className="inline-block px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-indigo-650/20 text-indigo-400 rounded-md border border-indigo-550 border-indigo-500/20">
              Optional Cloud Saving
            </span>
            <h3 className="text-base font-bold text-white pt-1">Cloud Sync Your Study Habits</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
              Sign up to save your study progress across devices. All study resources remain free for everyone.
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onOpenAuth && onOpenAuth("login")}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={() => onOpenAuth && onOpenAuth("signup")}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-extrabold shadow shadow-indigo-500/20 transition cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </section>
      )}

      {/* QUICK STATS PANEL */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 text-left hover:border-slate-750 transition duration-200">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Streak</span>
            <Zap className="h-4 w-4 text-orange-500 fill-current animate-pulse" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{streakCount} Days</h3>
          <p className="text-[10px] text-orange-400 font-bold mt-1">Keep learning daily!</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 text-left hover:border-slate-750 transition duration-200">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Total XP</span>
            <Award className="h-4 w-4 text-yellow-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{xpPoints} XP</h3>
          <p className="text-[10px] text-slate-450 font-bold mt-1">Earned via active study.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 text-left hover:border-slate-750 transition duration-200">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Mock Exams</span>
            <CheckCircle2 className="h-4 w-4 text-sky-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{totalQuizzesTaken} Completed</h3>
          <p className="text-[10px] text-slate-450 font-bold mt-1">Simulated quiz sets run.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4.5 text-left hover:border-slate-750 transition duration-200">
          <div className="flex justify-between items-center text-slate-500 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono">Flashcards</span>
            <Brain className="h-4 w-4 text-emerald-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{completedFlashcards} Generated</h3>
          <p className="text-[10px] text-slate-450 font-bold mt-1">Active memory tools created.</p>
        </div>
      </section>

      {/* 2. DYNAMIC EXAM COUNTDOWN TICKER & COGNITIVE SHIELD BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* CountDown Module (Span 2) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl md:col-span-2 space-y-5 text-left relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-850 pb-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-rose-400" />
                Strategic Milestone Live Countdown
              </h3>
              <p className="text-xs text-slate-450">Precision timer tracking critical board exams & national entries.</p>
            </div>

            {/* Preset selector */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedExamPreset}
                onChange={(e) => setSelectedExamPreset(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold cursor-pointer"
              >
                <option value="jee_main">IIT-JEE Main (April 2027)</option>
                <option value="neet_ug">NEET UG Medical (May 2027)</option>
                <option value="cbse_10">CBSE Class 10 Board Test</option>
                <option value="cbse_12">CBSE Class 12 Board Test</option>
                <option value="custom">-- Custom Exam Date --</option>
              </select>

              {selectedExamPreset === "custom" && (
                <input
                  type="date"
                  value={customExamDate}
                  min="2026-05-25"
                  onChange={(e) => setCustomExamDate(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>

          {/* Digital Clock Display */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Days", val: timeLeft.days, color: "text-indigo-400" },
              { label: "Hours", val: timeLeft.hours, color: "text-sky-450" },
              { label: "Minutes", val: timeLeft.minutes, color: "text-emerald-450" },
              { label: "Seconds", val: timeLeft.seconds, color: "text-rose-450 font-mono text-shadow-red" }
            ].map((card, i) => (
              <div key={i} className="bg-slate-950/80 border border-slate-850 rounded-2xl p-3 text-center transition hover:bg-slate-950">
                <div className={`text-2xl sm:text-4xl font-black ${card.color}`}>
                  {String(card.val).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-slate-500 font-extrabold uppercase mt-1 tracking-wider">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[10.5px] text-slate-450 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-850/50">
            <span className="shrink-0 text-amber-500 font-bold">⚠️ Warning Note:</span>
            <span>Target is computed standard Class-10/12 Board Timetables & NTA Entrance cycles. Prepare systematically!</span>
          </div>

        </div>

        {/* Quick Access Action Hub Column */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-left">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Compass className="h-4.5 w-4.5 text-cyan-400" />
            Quick Learning Actions
          </h3>
          <p className="text-xs text-slate-450">Launch dynamic revision routines instantly to earn standard +10 XP.</p>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => setActiveTab("notes")}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white transition cursor-pointer text-xs font-bold text-left"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-400" />
                Read Subject Summaries
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab("ai-assistant")}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white transition cursor-pointer text-xs font-bold text-left"
            >
              <span className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-sky-400" />
                AI Smart Homework Explainer
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </button>

            <button
              onClick={() => setActiveTab("mock-tests")}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 hover:text-white transition cursor-pointer text-xs font-bold text-left"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Past Year Board Mock Exams
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </div>

      </section>

      {/* 3. SUBSET GRID: RECENT NOTES VIEWED & STUDY GOALS CHECKLIST */}
      {currentUser ? (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Recent notes viewed bookshelf (Span 5) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 text-left">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-indigo-400" />
                Recently Viewedsummaries
              </h3>
              <span className="text-[10px] text-slate-500 font-bold font-mono">MAX 3 TILES</span>
            </div>

            <div className="space-y-3">
              {recentlyViewed.map((viewNote, index) => (
                <div
                  key={viewNote.id}
                  onClick={() => handleRedirectToNote(viewNote)}
                  className="group p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-750 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 truncate">
                      <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition truncate">
                        {viewNote.title}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                        Class {viewNote.classLevel} &bull; {viewNote.subject} Booklet
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-white transition shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}

              {recentlyViewed.length === 0 && (
                <div className="p-8 text-center rounded-2xl bg-slate-950 border border-slate-850/60 text-slate-500 text-xs leading-relaxed space-y-1">
                  <p>No recently read booklet summaries recorded yet.</p>
                  <button 
                    onClick={() => setActiveTab("notes")}
                    className="text-indigo-400 hover:underline font-bold"
                  >
                    Browse syllabus booklets now &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Study Goals CheckList (Span 7) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-3xl space-y-4 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                  <Target className="h-4.5 w-4.5 text-emerald-400" />
                  Weekly Study Milestone Goals
                </h3>
                <p className="text-[11px] text-slate-450">Tick off targets below as you practice mock test sheets.</p>
              </div>
              
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                {goals.filter(g => g.done).length} / {goals.length} Goal Completed
              </span>
            </div>

            {/* Goal Targets lists */}
            <div className="space-y-3">
              {goals.map((g) => (
                <div 
                  key={g.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                    g.done 
                      ? "bg-slate-950/40 border-slate-850 text-slate-500" 
                      : "bg-slate-950 border-slate-850 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 pr-2 truncate">
                    <button
                      onClick={() => handleToggleGoal(g.id)}
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition cursor-pointer shrink-0 ${
                        g.done 
                          ? "bg-emerald-600 border-emerald-500 text-white" 
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {g.done && <Check className="h-3.5 w-3.5" />}
                    </button>
                    <span className={`text-xs truncate ${g.done ? "line-through opacity-60" : ""}`}>{g.text}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-500">+{g.xpValue} XP</span>
                    <button 
                      onClick={() => handleDeleteGoal(g.id)}
                      className="p-1 rounded text-slate-600 hover:text-red-400 transition cursor-pointer"
                      title="Remove task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Input Box to add custom target task */}
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Ex: Solve chemistry chapter 2 questions..."
                  className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal
                </button>
              </form>
            </div>
          </div>

        </section>
      ) : (
        /* Guest Locked State promotion and sync placeholder */
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative font-sans">
          <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1.5px] z-10 flex flex-col items-center justify-center p-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-405 text-indigo-400 mb-3 animate-pulse">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-extrabold text-white">Study Milestone Checkpoints Saver</h4>
              
              {/* EXACT REQUIRED SMALL MESSAGE AND BUTTONS FOR CONTINUANCE */}
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                Sign up to save your study progress across devices. All study resources remain free for everyone.
              </p>
              
              <div className="mt-4 flex gap-2 justify-center">
                <button
                  onClick={() => onOpenAuth && onOpenAuth("login")}
                  className="px-4.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-850 hover:border-slate-750 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth && onOpenAuth("signup")}
                  className="px-4.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>

            {/* Aesthetically blurred underlying checklist blocks to represent full-feature depth */}
            <div className="space-y-3 pointer-events-none filter blur-[1.5px] opacity-15">
              <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="h-4 bg-slate-800 rounded-md w-48" />
                <div className="h-4 bg-slate-800 rounded-md w-12" />
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="h-4 bg-slate-800 rounded-md w-64" />
                <div className="h-4 bg-slate-850 rounded-md w-12" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. BOT INTEGRATION FOR DIAGNOSTICS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Core AI Concept Assistant Explainer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-400" />
                Ask StudyHub AI
              </h2>
              <p className="text-sm text-slate-400">
                Type in any concept, theorem, question, or problem to get an instant tailored explanation.
              </p>
            </div>
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse hidden sm:block" />
          </div>

          <form onSubmit={handleQuickAsk} className="space-y-4 font-sans">
            <div className="relative">
              <textarea
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ex: Explain L'Hopital's Rule with a simple example... OR Why are SN2 reactions stereochemically inverted?"
                rows={3}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-left"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-left">
              {/* Presets */}
              <div className="flex flex-wrap gap-2 text-left">
                <button
                  type="button"
                  onClick={() => loadPresetQuery("What is Carnot thermodynamic efficiency?")}
                  className="px-2.5 py-1 text-xs rounded-full bg-slate-850 border border-slate-750 hover:border-slate-650 text-slate-300 transition cursor-pointer font-sans"
                >
                  "Carnot Efficiency"
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetQuery("Explain Hund's Rule of electron filling")}
                  className="px-2.5 py-1 text-xs rounded-full bg-slate-850 border border-slate-750 hover:border-slate-650 text-slate-300 transition cursor-pointer font-sans"
                >
                  "Hund's Rule"
                </button>
                <button
                  type="button"
                  onClick={() => loadPresetQuery("What is difference between SN1 and SN2?")}
                  className="px-2.5 py-1 text-xs rounded-full bg-slate-850 border border-slate-750 hover:border-slate-650 text-slate-300 transition cursor-pointer font-sans"
                >
                  "SN1 vs SN2"
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !aiQuery.trim()}
                className="flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-850 disabled:text-slate-500 text-white text-sm font-semibold transition cursor-pointer shrink-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Analyzing Concept...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Ask AI Tutor
                  </>
                )}
              </button>
            </div>
          </form>

          {/* AI Response Container */}
          {(aiResponse || loading || errorMsg) && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-3 animate-fadeIn text-left">
              <div className="flex items-center justify-between text-[11px] text-indigo-400 font-extrabold tracking-widest uppercase">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> STUDYHUB AI INSIGHT
                </span>
                {loading && <span className="animate-pulse">Consulting textbook servers...</span>}
              </div>

              {loading ? (
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
                  <p className="text-xs text-slate-500 animate-pulse">Running advanced matrix explanations...</p>
                </div>
              ) : errorMsg ? (
                <div className="text-red-400 text-sm p-3 rounded-xl bg-red-950/20 border border-red-900/30">
                  {errorMsg}
                </div>
              ) : (
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans text-left">
                  {aiResponse}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right column: Subjects navigation list */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-cyan-400" />
              Quick Subjects
            </h2>
            <p className="text-xs text-slate-400 mt-1">Jump directly to subject reference booklets and flashcards.</p>
          </div>

          <div className="space-y-4">
            {quickSubjects.map((sub, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab("notes")}
                className={`group cursor-pointer rounded-2xl p-4 border bg-gradient-to-r ${sub.color} ${sub.border} hover:scale-[1.01] transition-all text-left`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-bold text-sm ${sub.text}`}>{sub.title}</h3>
                    <p className="text-xs text-slate-300 mt-1">{sub.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-white transition" />
                </div>
              </div>
            ))}
          </div>

          {/* Tips Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              STUDY TIP OF THE HOUR
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active recall is 10x more effective than passive reading. Generating flashcards based on notes forcing yourself to solve them builds actual permanent neuron synapses!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
