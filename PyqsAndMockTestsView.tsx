import React, { useState, useEffect, useRef } from "react";
import { STATIC_PYQS } from "../data";
import { Question, MockTest, SavedHistory } from "../types";
import { 
  FileText, ClipboardList, HelpCircle, Loader2, Check, X, ArrowRight, ArrowLeft,
  Sparkles, Calendar, BookOpen, Clock, Play, Bookmark, Send, 
  RefreshCw, CheckCircle, Award, Timer, Search, Trophy, Flame, Zap, Shield, Sparkle
} from "lucide-react";

interface PyqsAndMockTestsViewProps {
  onXpEarned: (amount: number) => void;
  onQuizTaken: () => void;
  initialTab?: string;
}

interface LeaderboardStudent {
  rank: number;
  name: string;
  school: string;
  streak: number;
  xpValue: number;
  avatar: string;
}

// 4 Specific requested categories of tests
const EXTRA_MOCK_TESTS: (MockTest & { category: "daily" | "chapter-wise" | "weekly" | "full-syllabus"; description: string; topic: string })[] = [
  {
    id: "test-daily-01",
    title: "Daily Science & Chemistry Speed Drill",
    subject: "Chemistry",
    durationMinutes: 5,
    category: "daily",
    topic: "Chemical Bonding & pH Scales",
    description: "A fast-paced daily check on chemical bonding electric polarities, pH balances, and element classifications.",
    questions: [
      {
        id: "td1-q1",
        text: "What is the pH level of a 1.0 x 10^-3 M hydrochloric acid (HCl) solution in pure water at room temperature?",
        options: ["1.0", "3.0", "7.0", "11.0"],
        correctAnswer: 1,
        subject: "Chemistry",
        exam: "Daily Drill"
      },
      {
        id: "td1-q2",
        text: "Which of the following organic structures represents the simplest aromatic hydrocarbon ring compound?",
        options: ["Cyclohexane", "Hexene", "Benzene", "Toluene"],
        correctAnswer: 2,
        subject: "Chemistry",
        exam: "Daily Drill"
      },
      {
        id: "td1-q3",
        text: "Which chemical bond possesses the highest level of electric polarity based on standard electronegativity?",
        options: ["C-H", "O-H", "H-F", "N-H"],
        correctAnswer: 2,
        subject: "Chemistry",
        exam: "Daily Drill"
      }
    ]
  },
  {
    id: "test-chapter-01",
    title: "Calculus Limits & Function Chapters",
    subject: "Mathematics",
    durationMinutes: 10,
    category: "chapter-wise",
    topic: "Unit 1: Limits & Continuity",
    description: "Highly focused, chapter-specific drill targeting limits approaching infinity, derivatives, and Squeeze theorems.",
    questions: [
      {
        id: "tc1-q1",
        text: "Evaluate the limit value as x approaches infinity: lim (x -> ∞) of [ (3x^2 + 7x) / (8x^2 - 4) ]?",
        options: ["0", "3/8", "7/4", "Infinity asymp"],
        correctAnswer: 1,
        subject: "Mathematics",
        exam: "Chapter Test"
      },
      {
        id: "tc1-q2",
        text: "Evaluate the derivative value at x = 0 for the function f(x) = e^(4x) + cos(x).",
        options: ["1", "3", "4", "5"],
        correctAnswer: 2,
        subject: "Mathematics",
        exam: "Chapter Test"
      },
      {
        id: "tc1-q3",
        text: "Find the slope value of the tangent to the quadratic curve y = x^2 - 3x at the boundary point x = 4.",
        options: ["1", "3", "5", "7"],
        correctAnswer: 2,
        subject: "Mathematics",
        exam: "Chapter Test"
      }
    ]
  },
  {
    id: "test-weekly-01",
    title: "Weekly National Entrance Speed Trial",
    subject: "Physics",
    durationMinutes: 12,
    category: "weekly",
    topic: "Kinematics & Pulley Systems",
    description: "Our weekly curated mock practice of high-stakes national exam patterns including tension, kinetic friction, and gravity.",
    questions: [
      {
        id: "tw1-q1",
        text: "A pulling force of 15 N slides a 5 kg block along a rough plane at a constant velocity. Taking g = 10 m/s^2, solve for the coefficient of kinetic friction (μ_k).",
        options: ["0.15", "0.30", "0.45", "0.50"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Weekly Mock"
      },
      {
        id: "tw1-q2",
        text: "If the physical distance between two coordinate gravity mass centers is halved, the net force of attraction will:",
        options: ["Be Halved", "Double", "Become 1/4th", "Quadruple"],
        correctAnswer: 3,
        subject: "Physics",
        exam: "Weekly Mock"
      },
      {
        id: "tw1-q3",
        text: "When an absolute rolling cylinder moves without sliding on a pavement, what is the speed of its low contact point relative to the road?",
        options: ["Translational speed v", "Instantaneous Zero", "Angular speed ω", "Double translational speed 2v"],
        correctAnswer: 1,
        subject: "Physics",
        exam: "Weekly Mock"
      }
    ]
  },
  {
    id: "test-full-01",
    title: "Full Syllabus Comprehensive Board prep (Mixed Set)",
    subject: "Computer Science",
    durationMinutes: 15,
    category: "full-syllabus",
    topic: "All-In-One Board Syllabus Mock",
    description: "An intensive comprehensive mockup running across physical thermodynamics, quantum numbers, sorting stables, and compound matrices.",
    questions: [
      {
        id: "tf1-q1",
        text: "Which of the following sorting algorithms possesses a stable average time complexity of O(n log n) along with O(n) space?",
        options: ["Quick Sort", "Heap Sort", "Merge Sort", "Insertion Sort"],
        correctAnswer: 2,
        subject: "Computer Science",
        exam: "Full Syllabus Mock"
      },
      {
        id: "tf1-q2",
        text: "In database normalization design, what normal form is established by removing all partial key dependencies on composite primaries?",
        options: ["1st Normal Form (1NF)", "2nd Normal Form (2NF)", "3rd Normal Form (3NF)", "Boyce-Codd Normal Form"],
        correctAnswer: 1,
        subject: "Computer Science",
        exam: "Full Syllabus Mock"
      },
      {
        id: "tf1-q3",
        text: "According to thermodynamics, what represents the maximum theoretical conversion efficiency bound of virtual heat systems?",
        options: ["Carnot heat engine cycle bounds", "Symmetric entropy reduction coefficients", "Absolute thermodynamic zeroes", "Enthalpy ratio calculations"],
        correctAnswer: 0,
        subject: "Physics",
        exam: "Full Syllabus Mock"
      }
    ]
  }
];

// Seeded Leaderboard contestants
const DAILY_LEADERBOARD_SEED: LeaderboardStudent[] = [
  { rank: 1, name: "Arjun Verma", school: "Bal Bharti School, Delhi", streak: 12, xpValue: 950, avatar: "👨‍🎓" },
  { rank: 2, name: "Priti Shinde", school: "KV IIT Powai, Mumbai", streak: 8, xpValue: 840, avatar: "👩‍🎓" },
  { rank: 3, name: "Rishabh Roy", school: "Sanskriti School, Pune", streak: 15, xpValue: 710, avatar: "👨‍💻" },
  { rank: 4, name: "Tanvi Nair", school: "CHIREC Intl, Hyderabad", streak: 5, xpValue: 620, avatar: "👩‍💻" },
  { rank: 5, name: "Aditya Goel", school: "DPS RK Puram, Gurgaon", streak: 6, xpValue: 490, avatar: "🕵️‍♂️" }
];

const WEEKLY_LEADERBOARD_SEED: LeaderboardStudent[] = [
  { rank: 1, name: "Priti Shinde", school: "KV IIT Powai, Mumbai", streak: 14, xpValue: 2840, avatar: "👩‍🎓" },
  { rank: 2, name: "Arjun Verma", school: "Bal Bharti School, Delhi", streak: 12, xpValue: 2470, avatar: "👨‍🎓" },
  { rank: 3, name: "Ananya Deshmukh", school: "Bishop School, Bangalore", streak: 21, xpValue: 2150, avatar: "👩‍🚀" },
  { rank: 4, name: "Rishabh Roy", school: "Sanskriti School, Pune", streak: 18, xpValue: 1980, avatar: "👨‍💻" },
  { rank: 5, name: "Kunal Sen", school: "Modern High, Kolkata", streak: 9, xpValue: 1650, avatar: "👨‍🚀" }
];

export default function PyqsAndMockTestsView({ onXpEarned, onQuizTaken, initialTab }: PyqsAndMockTestsViewProps) {
  // Page Navigation State ("pyqs" | "mock-tests" | "leaderboard")
  const [activeSection, setActiveSection] = useState<"pyqs" | "mock-tests" | "leaderboard">(
    initialTab === "mock-tests" ? "mock-tests" : "pyqs"
  );

  // Active testing arena sub-categories filter
  const [testCategory, setTestCategory] = useState<"daily" | "chapter-wise" | "weekly" | "full-syllabus">("daily");

  useEffect(() => {
    if (initialTab) {
      setActiveSection(initialTab === "mock-tests" ? "mock-tests" : "pyqs");
    }
  }, [initialTab]);

  // Filters State
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // PYQs states
  const [checkedAnswers, setCheckedAnswers] = useState<{ [qId: string]: number }>({});
  const [aiExplanations, setAiExplanations] = useState<{ [qId: string]: string }>({});
  const [loadingExplanations, setLoadingExplanations] = useState<{ [qId: string]: boolean }>({});

  // Active Mock Test states
  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);
  const [quizHistory, setQuizHistory] = useState<SavedHistory[]>([]);
  const [aiDiagnosis, setAiDiagnosis] = useState("");
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);

  // Leaderboard filters "daily" | "weekly"
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<"daily" | "weekly">("daily");

  // User details retrieved from App context or localStorage for personalized leaderboarding
  const [userName, setUserName] = useState("Aspirant");
  const [userXp, setUserXp] = useState(120);
  const [userStreak, setUserStreak] = useState(3);

  // Re-read local status on render
  useEffect(() => {
    const savedName = localStorage.getItem("studyhub_student_name") || "Aspirant";
    const savedXp = localStorage.getItem("studyhub_xp_points");
    const savedStreak = localStorage.getItem("studyhub_streak_count");
    setUserName(savedName);
    if (savedXp) setUserXp(parseInt(savedXp, 10));
    if (savedStreak) setUserStreak(parseInt(savedStreak, 10));

    // Load quiz history list
    const storedHistory = localStorage.getItem("studyhub_mock_history");
    if (storedHistory) {
      try {
        setQuizHistory(JSON.parse(storedHistory));
      } catch (e) {}
    }
  }, [testSubmitted, activeSection]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const subjectsList = ["All", "Mathematics", "Physics", "Chemistry", "Computer Science"];
  const yearsList = ["All", "2023", "2022", "2021"];

  // Filter PYQs dynamically
  const filteredPyqs = STATIC_PYQS.filter((q) => {
    const subjectMatch = selectedSubject === "All" || q.subject === selectedSubject;
    const yearMatch = selectedYear === "All" || q.year?.toString() === selectedYear;
    const searchMatch = searchQuery.trim() === "" || 
      q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.exam.toLowerCase().includes(searchQuery.toLowerCase());
    return subjectMatch && yearMatch && searchMatch;
  });

  // Filter Upgraded Mock Tests dynamically
  const filteredMockTests = EXTRA_MOCK_TESTS.filter((t) => {
    const categoryMatch = t.category === testCategory;
    const subjectMatch = selectedSubject === "All" || t.subject === selectedSubject;
    const searchMatch = searchQuery.trim() === "" || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && subjectMatch && searchMatch;
  });

  // Countdown clock effect
  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (testStarted && timeLeft === 0 && !testSubmitted) {
      handleSubmitMockTest();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [testStarted, timeLeft, testSubmitted]);

  // Option selection in Previous Year Papers
  const handleSelectPyqOption = (qId: string, optionIdx: number, correctAnswerIdx: number) => {
    if (checkedAnswers[qId] !== undefined) return;
    setCheckedAnswers({ ...checkedAnswers, [qId]: optionIdx });
    if (optionIdx === correctAnswerIdx) {
      onXpEarned(15);
      setUserXp((prev) => prev + 15);
    }
  };

  // Explain with Gemini trigger
  const handleFetchAiExplanation = async (q: Question) => {
    if (loadingExplanations[q.id]) return;
    setLoadingExplanations(prev => ({ ...prev, [q.id]: true }));
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Question content: "${q.text}". Correct answer index in options is ${q.correctAnswer} (${q.options[q.correctAnswer]}). Subject is ${q.subject}. Give a crisp, 100-word logical proof key for this problem.`
        })
      });
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      setAiExplanations(prev => ({ ...prev, [q.id]: data.text || "No response." }));
    } catch (e) {
      setAiExplanations(prev => ({ ...prev, [q.id]: q.explanation || "By laws of physical theorems, this option holds mathematically correct." }));
    } finally {
      setLoadingExplanations(prev => ({ ...prev, [q.id]: false }));
    }
  };

  // Interactive Test Triggers
  const handleStartMockTest = (test: MockTest) => {
    setActiveTest(test);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setTimeLeft(test.durationMinutes * 60);
    setTestStarted(true);
    setTestSubmitted(false);
    setAiDiagnosis("");
  };

  const handleSelectMockOption = (qId: string, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const toggleFlagQuestion = (qId: string) => {
    setFlaggedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  // Evaluate test and save score
  const handleSubmitMockTest = () => {
    if (!activeTest) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    let score = 0;
    activeTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score += 1;
      }
    });

    setTestScore(score);
    setTestSubmitted(true);
    onQuizTaken();

    const xpEarned = score * 30 + 10; // 30 XP per correct + 10 attendance criteria
    onXpEarned(xpEarned);
    setUserXp((prev) => prev + xpEarned);

    const record: SavedHistory = {
      date: new Date().toLocaleDateString(),
      testTitle: activeTest.title,
      score: score,
      totalQuestions: activeTest.questions.length,
    };

    const nextHistory = [record, ...quizHistory];
    setQuizHistory(nextHistory);
    localStorage.setItem("studyhub_mock_history", JSON.stringify(nextHistory));
  };

  // Send score to AI diagnostics
  const handleGenerateDiagnostics = async () => {
    if (!activeTest) return;
    setLoadingDiagnosis(true);
    setAiDiagnosis("");

    const quizDetails = activeTest.questions.map((q) => ({
      text: q.text,
      userAns: userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : "Skipped",
      correct: q.options[q.correctAnswer],
      isCorrect: userAnswers[q.id] === q.correctAnswer
    }));

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Analyze student score on mock test "${activeTest.title}". Result: ${testScore}/${activeTest.questions.length}. Answer profile: ${JSON.stringify(quizDetails)}. Deliver 3 encouraging pedagogical hints pointing out conceptual fixes. Keep it under 150 words.`
        })
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAiDiagnosis(data.text);
    } catch {
      setAiDiagnosis("Offline Mentor Insight: Well attempted! Focused formulas of this subject and revising limits/bonds inside the Revision Notes directories is highly advised.");
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  const handleResetMockLobby = () => {
    setActiveTest(null);
    setTestStarted(false);
    setTestSubmitted(false);
    setAiDiagnosis("");
  };

  const formatTimerString = (secondsCount: number) => {
    const mins = Math.floor(secondsCount / 60);
    const secs = secondsCount % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Dynamic user rank sorting for leaderboard
  const getLeaderboardList = (): LeaderboardStudent[] => {
    const baseList = leaderboardTimeframe === "daily" ? [...DAILY_LEADERBOARD_SEED] : [...WEEKLY_LEADERBOARD_SEED];
    // Push the active student
    const activeStudent: LeaderboardStudent = {
      rank: 99,
      name: `${userName} (You)`,
      school: "Self Study Space",
      streak: userStreak,
      xpValue: leaderboardTimeframe === "daily" ? (userXp % 1000) : userXp, // simulate a daily slice of total XP
      avatar: "🚀"
    };
    
    const combined = [...baseList, activeStudent];
    // Sort descending by XP
    combined.sort((a, b) => b.xpValue - a.xpValue);
    // Assign sorted ranks
    return combined.map((student, idx) => ({
      ...student,
      rank: idx + 1
    }));
  };

  const displayedLeaderboard = getLeaderboardList();
  const topStudents = displayedLeaderboard.slice(0, 3);
  const remainingStudents = displayedLeaderboard.slice(3);

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. HEADER HERO PANEL */}
      {!testStarted && (
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden text-left shadow-2xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-tr from-sky-500/10 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-md">
                Certified Testing & Diagnostic Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <Trophy className="text-yellow-400 h-6.5 w-6.5" />
                Examinations, Drills & Leaderboard
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                Practice verified Past Board Question files, solve chapter tests, take 5-minute fast tests, or review absolute student hierarchies on our live competitive dashboard.
              </p>
            </div>
            
            <div className="flex bg-slate-950 px-4 py-2 border border-slate-850 rounded-2xl items-center gap-2.5 text-xs text-indigo-400 font-bold shrink-0">
              <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Rank Up with +200 XP daily!</span>
            </div>
          </div>
        </section>
      )}

      {/* CORE ACTIVE TEST WORKSPACE SCREEN */}
      {testStarted && activeTest && (
        <section className="animate-fadeIn">
          {!testSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 text-left">
              
              {/* Left Column: Progress Directory Navigator */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6">
                
                {/* Simulated Timer Clock */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-center space-y-1.5 shadow-inner">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest font-mono">Assigned Testing Timer</span>
                  <div className={`text-2xl sm:text-3.5xl font-mono font-black flex items-center justify-center gap-2 ${timeLeft <= 60 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
                    <Clock className="h-5 w-5" />
                    <span>{formatTimerString(timeLeft)}</span>
                  </div>
                </div>

                {/* Directory map button grid */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-450">Section Question Directory</span>
                    <span className="text-indigo-400 font-bold font-mono">
                      {Object.keys(userAnswers).length}/{activeTest.questions.length} Checked
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {activeTest.questions.map((q, idx) => {
                      const isActive = currentQuestionIdx === idx;
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isFlagged = flaggedQuestions.includes(q.id);

                      let styleClass = "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-700";
                      
                      if (isAnswered) {
                        styleClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20";
                      }
                      if (isFlagged) {
                        styleClass = "bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20";
                      }
                      if (isActive) {
                        styleClass = "ring-2 ring-indigo-500 bg-indigo-500/10 border-indigo-550 text-white font-black";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIdx(idx)}
                          className={`text-xs py-2 rounded-xl border transition cursor-pointer font-bold ${styleClass}`}
                        >
                          Q{idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Indicator button */}
                <div className="pt-4 border-t border-slate-800/60">
                  <button
                    onClick={handleSubmitMockTest}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-650 to-rose-600 hover:from-red-750 hover:to-rose-700 text-white text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Finish & Evaluate Test
                  </button>
                </div>

              </div>

              {/* Right Column: Active Question Interactive Box */}
              <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between min-h-[460px]">
                
                {/* Header Information */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-wide">
                      Active Problem {currentQuestionIdx + 1} of {activeTest.questions.length}
                    </span>
                    <h3 className="text-slate-400 text-xs font-medium">Focus Subject: {activeTest.questions[currentQuestionIdx].subject}</h3>
                  </div>

                  <button
                    onClick={() => toggleFlagQuestion(activeTest.questions[currentQuestionIdx].id)}
                    className={`flex items-center text-xs px-2.5 py-1.5 rounded-xl border transition ${
                      flaggedQuestions.includes(activeTest.questions[currentQuestionIdx].id)
                        ? "bg-amber-500/15 border-amber-550 text-amber-400 font-bold"
                        : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bookmark className="h-3.5 w-3.5 mr-1" />
                    {flaggedQuestions.includes(activeTest.questions[currentQuestionIdx].id) ? "Flagged for second review" : "Flag / Bookmark"}
                  </button>
                </div>

                {/* Problem Statement text */}
                <div className="space-y-6 flex-1 py-4">
                  <p className="text-white text-base sm:text-lg font-bold leading-relaxed">
                    {activeTest.questions[currentQuestionIdx].text}
                  </p>

                  {/* Multiple choice selections */}
                  <div className="grid grid-cols-1 gap-3">
                    {activeTest.questions[currentQuestionIdx].options.map((opt, optIdx) => {
                      const isSelected = userAnswers[activeTest.questions[currentQuestionIdx].id] === optIdx;
                      
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectMockOption(activeTest.questions[currentQuestionIdx].id, optIdx)}
                          className={`flex items-center p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition cursor-pointer ${
                            isSelected
                              ? "bg-indigo-650/15 border-indigo-500 text-white font-bold shadow-sm"
                              : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-350 hover:bg-slate-950/60"
                          }`}
                        >
                          <div className={`h-4.5 w-4.5 rounded-full border-2 mr-3 flex items-center justify-center transition-all ${
                            isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-700"
                          }`}>
                            {isSelected && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question Lower pagination tools */}
                <div className="flex justify-between items-center border-t border-slate-800 pt-5 mt-4">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((p) => p - 1)}
                    className="flex items-center px-4 py-2 rounded-xl bg-slate-850 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                    Prev Question
                  </button>

                  {currentQuestionIdx < activeTest.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                      className="flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Next Question
                      <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitMockTest}
                      className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-90 text-white text-xs font-black transition cursor-pointer"
                    >
                      Process Final Evaluation
                      <Send className="h-3.5 w-3.5 ml-1.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          ) : (
            
            /* SHOW LIVE EVALUATED SCORES AND PERFORMANCE ANALYSIS DIAGNOSTICS */
            <div className="space-y-8 text-left animate-fadeIn">
              
              {/* Header result row */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1 text-left">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest block font-mono">
                    Assessment Submitted & Correct answers generated
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{activeTest.title} - Scorecard</h2>
                  <p className="text-xs text-slate-400">Review correct options, instant performance indicators, and trigger modern AI-diagnostic summaries.</p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={handleResetMockLobby}
                    className="flex items-center px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-white text-xs font-bold transition cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                    Test Arena Directory
                  </button>

                  <button
                    onClick={handleGenerateDiagnostics}
                    disabled={loadingDiagnosis}
                    className="flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-90 disabled:opacity-40 text-black font-black text-xs transition cursor-pointer"
                  >
                    {loadingDiagnosis ? (
                      <>
                        <Loader2 className="animate-spin h-3.5 w-3.5 mr-1.5" />
                        Generating Diagnostics Plan...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Free AI Performance Diagnosis
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grid: Circle Score widget + AI Feedback display box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Circular chart dial card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">Score Accuracy Rates</span>
                  
                  <div className="h-28 w-28 rounded-full border-4 border-indigo-500/90 flex flex-col items-center justify-center bg-slate-950 shadow-inner">
                    <span className="text-2.5xl font-black text-white">{testScore} / {activeTest.questions.length}</span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Points</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-slate-350 leading-relaxed font-semibold">
                      You reached a secure <b>{Math.round((testScore / activeTest.questions.length) * 100)}%</b> accuracy rate.
                    </p>
                    <span className="inline-block text-[10px] text-indigo-400 font-extrabold bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                      Earned +{testScore * 30 + 10} XP Study Points!
                    </span>
                  </div>
                </div>

                {/* AI Performance Analysis Report Box */}
                <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 font-mono">
                    <Sparkles className="text-yellow-400 h-4 w-4 animate-spin" style={{ animationDuration: '6s' }} />
                    ACADEMIC ADVICE & REMEDIAL ROADMAP
                  </h3>

                  <div className="p-4 p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                    {aiDiagnosis ? (
                      <p className="whitespace-pre-wrap">{aiDiagnosis}</p>
                    ) : (
                      <div className="space-y-3">
                        <p>Need deep coaching insights on your errors?</p>
                        <p className="text-slate-400 text-xs">Click the <b>"Free AI Performance Diagnosis"</b> button in the top right. This parses your incorrect choices, extracts core gaps, and outlines a targeted active revision schedule to guarantee higher board scores!</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Correct Answers Checklist Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
                <h3 className="font-extrabold text-base text-white border-b border-slate-850 pb-3">
                  Correct Answer & Reference Proof Key
                </h3>

                <div className="grid grid-cols-1 gap-4.5">
                  {activeTest.questions.map((q, idx) => {
                    const chosenIdx = userAnswers[q.id];
                    const chosenText = chosenIdx !== undefined ? q.options[chosenIdx] : "Skipped";
                    const isCorrect = chosenIdx === q.correctAnswer;
                    const correctText = q.options[q.correctAnswer];

                    return (
                      <div key={q.id} className="p-4.5 rounded-2xl bg-slate-950 border border-slate-850 space-y-3 text-left">
                        <div className="flex justify-between items-start gap-4">
                          <p className="text-xs sm:text-sm font-bold text-slate-200">
                            Q{idx + 1}. {q.text}
                          </p>

                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-black shrink-0 ${
                            isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                          }`}>
                            {isCorrect ? "Correct answer" : "Incorrect option"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">Your Chosen Option:</span>
                            <span className={isCorrect ? "text-emerald-400 font-semibold" : "text-red-450 font-semibold"}>
                              {chosenText}
                            </span>
                          </div>

                          <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                            <span className="text-slate-500 block text-[9px] font-bold uppercase">Correct Option:</span>
                            <span className="text-indigo-400 font-black">{correctText}</span>
                          </div>
                        </div>

                        {q.explanation && (
                          <p className="text-xs text-slate-450 bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 leading-relaxed">
                            💡 <b>Proof Logic:</b> {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </section>
      )}

      {/* THREE MAIN TAB SWITCH ACTIONS */}
      {!testStarted && (
        <div className="flex bg-slate-900 border border-slate-850 p-1 rounded-2xl w-full sm:w-fit text-left">
          <button
            onClick={() => {
              setActiveSection("pyqs");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer select-none ${
              activeSection === "pyqs"
                ? "bg-slate-950 text-indigo-400 shadow-md border border-slate-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="h-4 w-4" />
            Previous Year Papers ({STATIC_PYQS.length})
          </button>

          <button
            onClick={() => {
              setActiveSection("mock-tests");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer select-none ${
              activeSection === "mock-tests"
                ? "bg-slate-950 text-indigo-400 shadow-md border border-slate-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            Testing Arena ({EXTRA_MOCK_TESTS.length})
          </button>

          <button
            onClick={() => {
              setActiveSection("leaderboard");
              setSearchQuery("");
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer select-none ${
              activeSection === "leaderboard"
                ? "bg-slate-950 text-indigo-400 shadow-md border border-slate-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Trophy className="h-4 w-4 text-amber-500 animate-pulse" />
            Leaderboard
          </button>
        </div>
      )}

      {/* PREVIOUS YEAR QUESTIONS AREA */}
      {!testStarted && activeSection === "pyqs" && (
        <section className="space-y-6">
          
          {/* Filters shelf */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-5 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block font-mono">
                Select Study Subject
              </span>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 flex-wrap gap-1">
                {subjectsList.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 text-xs font-bold transition rounded-lg cursor-pointer ${
                      selectedSubject === sub
                        ? "bg-indigo-600 border border-indigo-500 text-white"
                        : "text-slate-450 hover:text-slate-250"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3 border-t border-slate-850 items-end">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block font-mono">Select Exam Year</span>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1 w-fit">
                  {yearsList.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`px-3 py-1 text-xs font-bold transition rounded-lg cursor-pointer ${
                        selectedYear === yr
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {yr === "All" ? "All Years" : yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block font-mono">Find by Keyword</span>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search past papers, formula solutions, sn1 pathways..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* List of PYQ cards */}
          <div className="grid grid-cols-1 gap-6 text-left">
            {filteredPyqs.map((q, idx) => {
              const chosen = checkedAnswers[q.id];
              const answered = chosen !== undefined;
              const isCorrect = chosen === q.correctAnswer;
              const hasAiExp = aiExplanations[q.id];
              const aiLoading = loadingExplanations[q.id];

              return (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-850 flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                        {q.exam}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-450 uppercase">
                        {q.subject}
                      </span>
                    </div>

                    {q.year && (
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-950 px-2 py-0.5 rounded">
                        BOARD SPEC: {q.year}
                      </span>
                    )}
                  </div>

                  <p className="text-white text-sm sm:text-base font-bold leading-relaxed">
                    Q{idx + 1}. {q.text}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, opIdx) => {
                      let btnStyle = "border-slate-850 text-slate-350 hover:border-slate-750 hover:bg-slate-950/40";
                      let leftIcon = null;

                      if (answered) {
                        if (opIdx === q.correctAnswer) {
                          btnStyle = "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold";
                          leftIcon = <Check className="h-4 w-4 mr-2 text-emerald-400 shrink-0" />;
                        } else if (chosen === opIdx) {
                          btnStyle = "border-red-500/40 bg-red-500/10 text-red-400";
                          leftIcon = <X className="h-4 w-4 mr-2 text-red-500 shrink-0" />;
                        } else {
                          btnStyle = "border-slate-900 text-slate-600 opacity-40";
                        }
                      }

                      return (
                        <button
                          key={opIdx}
                          disabled={answered}
                          onClick={() => handleSelectPyqOption(q.id, opIdx, q.correctAnswer)}
                          className={`flex items-center p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition ${btnStyle}`}
                        >
                          {leftIcon}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3.5">
                      <div className="flex gap-2 items-center text-xs font-black uppercase tracking-wider">
                        <span className={isCorrect ? "text-emerald-400" : "text-rose-400"}>
                          {isCorrect ? "Correct Option selected! +15 XP" : "Wrong Option chosen"}
                        </span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-slate-400">Review solutions below</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed max-w-2xl bg-slate-900 border border-slate-850/60 p-2.5 rounded-xl">
                        {q.explanation || "No manual proof provided."}
                      </p>

                      <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-xs text-slate-450 font-medium">Confused with thermodynamic formula rules or limits math proofs?</span>
                        <button
                          onClick={() => handleFetchAiExplanation(q)}
                          disabled={aiLoading}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/10 border border-indigo-500/25 hover:bg-indigo-600 text-xs font-bold text-indigo-400 hover:text-white transition cursor-pointer"
                        >
                          {aiLoading ? (
                            <>
                              <Loader2 className="animate-spin h-3 w-3 mr-1" />
                              Generating solution...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 text-yellow-300 mr-1 animate-pulse" />
                              {hasAiExp ? "Ask Tutoring Bot Again" : "Explain with AI Tutor"}
                            </>
                          )}
                        </button>
                      </div>

                      {hasAiExp && (
                        <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-xs text-slate-300 font-sans leading-relaxed text-left animate-fadeIn">
                          <span className="text-[10px] text-indigo-400 font-bold block mb-1">💡 STUDYHUB AI DETAILED BREAKDOWN</span>
                          <p>{hasAiExp}</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}

            {filteredPyqs.length === 0 && (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs leading-relaxed">
                No past board questions match your filtering criteria. Try listing another subject preset.
              </div>
            )}
          </div>
        </section>
      )}

      {/* TESTING ARENA WITH THE 4 SPECIFIC CATEGORIES */}
      {!testStarted && activeSection === "mock-tests" && (
        <section className="space-y-6">
          
          {/* Responsive Card-Based Category Selector Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {[
              { 
                id: "daily", 
                title: "📅 Daily Quiz Section", 
                sub: "Self Speed Drills", 
                border: "border-sky-500/30", 
                activeBorder: "ring-2 ring-sky-500 bg-sky-500/10",
                desc: "Quick 5-minute single drills to maintain active cognitive streaks.",
                color: "text-sky-400"
              },
              { 
                id: "chapter-wise", 
                title: "📚 Chapter MCQ Tests", 
                sub: "Focused Revision", 
                border: "border-emerald-500/30", 
                activeBorder: "ring-2 ring-emerald-505 bg-emerald-500/10",
                desc: "Focused on specific units like limits calculus & organic compounds.",
                color: "text-emerald-400"
              },
              { 
                id: "weekly", 
                title: "🏆 Weekly Mock Tests", 
                sub: "National Exam Prep", 
                border: "border-amber-500/30", 
                activeBorder: "ring-2 ring-amber-500 bg-amber-500/10",
                desc: "Full mix kinematics speed tests with active state trackers.",
                color: "text-amber-400"
              },
              { 
                id: "full-syllabus", 
                title: "🎓 Full Syllabus Tests", 
                sub: "Board Mockups", 
                border: "border-purple-500/30", 
                activeBorder: "ring-2 ring-purple-500 bg-purple-500/10",
                desc: "Comprehensive papers simulating high-stake Class 10 & 12 board runs.",
                color: "text-purple-400"
              }
            ].map((cat) => {
              const isActive = testCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setTestCategory(cat.id as any)}
                  className={`cursor-pointer rounded-2xl p-4 border ${cat.border} transition hover:scale-[1.01] duration-150 flex flex-col justify-between space-y-2 ${
                    isActive ? `${cat.activeBorder} shadow-lg shadow-slate-900/40` : "bg-slate-900"
                  }`}
                >
                  <div className="space-y-1">
                    <span className={`text-xs font-black block tracking-widest uppercase ${cat.color}`}>{cat.sub}</span>
                    <h3 className="text-sm font-bold text-white tracking-tight">{cat.title}</h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-medium">{cat.desc}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/40 text-[10.5px]">
                    <span className="text-slate-450">Verified Set</span>
                    <span className={`font-mono font-bold ${cat.color}`}>SELECT &rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-850/60 max-w-sm flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Subject filter:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-bold"
            >
              {subjectsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* List of dynamic test cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {filteredMockTests.map((test) => {
              // check if completed in saved state history
              const hasCompletedRecord = quizHistory.some(h => h.testTitle === test.title);
              
              return (
                <div
                  key={test.id}
                  className="bg-slate-905 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-lg">
                        {test.subject} &bull; {test.topic}
                      </span>

                      <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded">
                        <Timer className="h-3.5 w-3.5 text-slate-500" />
                        <span>{test.durationMinutes} Mins</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-white tracking-snug">
                      {test.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {test.description} Complete with {test.questions.length} certified multi-option items.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStartMockTest(test)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Play className="h-4 w-4 fill-current text-white" />
                      Start Assessment
                    </button>

                    {hasCompletedRecord && (
                      <span className="px-3 py-2.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-bold flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredMockTests.length === 0 && (
              <div className="col-span-1 md:col-span-2 p-14 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 text-xs">
                No active assessment found in the "{testCategory}" sub-bracket. Try checking a different subject filter.
              </div>
            )}
          </div>

          {/* Historical Activity Ledger Log List */}
          {quizHistory.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-left space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-450 uppercase tracking-widest font-mono border-b border-slate-850 pb-2">
                <History className="h-4 w-4 text-indigo-400" />
                <span>Your Practice History & Score Index</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500 uppercase font-mono tracking-wider font-extrabold">
                      <th className="py-2.5">Date Attempted</th>
                      <th className="py-2.5">Mock Title</th>
                      <th className="py-2.5 text-center">Score Result</th>
                      <th className="py-2.5 text-right">Accuracy Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/50">
                    {quizHistory.map((rec, k) => {
                      const rate = Math.round((rec.score / rec.totalQuestions) * 100);
                      return (
                        <tr key={k} className="hover:bg-slate-950/20 text-slate-300 font-semibold">
                          <td className="py-2.5 text-slate-505 text-slate-500 font-medium">{rec.date}</td>
                          <td className="py-2.5 text-white">{rec.testTitle}</td>
                          <td className="py-2.5 text-center">{rec.score} / {rec.totalQuestions}</td>
                          <td className="py-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              rate >= 75 ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"
                            }`}>
                              {rate}% Accuracy
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </section>
      )}

      {/* LEADERBOARD & STUDENT RANKINGS SECTION */}
      {!testStarted && activeSection === "leaderboard" && (
        <section className="space-y-8 animate-fadeIn text-left">
          
          {/* Subheader switch */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl">
            <div className="space-y-0.5">
              <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                <Trophy className="h-4.5 w-4.5 text-amber-400" />
                Live Student Leaderboard
              </h2>
              <p className="text-xs text-slate-450 font-medium">Climb ranks inside high-school cohorts by earning XP points during mocks.</p>
            </div>

            {/* Timeframe selector */}
            <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
              <button
                onClick={() => setLeaderboardTimeframe("daily")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  leaderboardTimeframe === "daily" 
                    ? "bg-indigo-600 text-white font-black" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Daily Rankings
              </button>
              <button
                onClick={() => setLeaderboardTimeframe("weekly")}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                  leaderboardTimeframe === "weekly" 
                    ? "bg-indigo-600 text-white font-black" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Weekly Rankings
              </button>
            </div>
          </div>

          {/* Leaderboard Top 3 Students Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topStudents.map((stud, idx) => {
              // Design specific visual badges for top three
              const colors = [
                {
                  bg: "from-amber-400/20 via-slate-900 to-slate-900",
                  border: "border-amber-400/50 shadow-amber-400/5",
                  badge: "🥇 Gold Medalist",
                  badgeText: "text-amber-400 bg-amber-500/10 border border-amber-500/25"
                },
                {
                  bg: "from-slate-450/20 via-slate-900 to-slate-900",
                  border: "border-slate-400/40 shadow-slate-400/5",
                  badge: "🥈 Silver Medalist",
                  badgeText: "text-slate-400 bg-slate-300/10 border border-slate-300/20"
                },
                {
                  bg: "from-amber-700/20 via-slate-900 to-slate-900",
                  border: "border-amber-700/40 shadow-amber-704/5",
                  badge: "🥉 Bronze Medalist",
                  badgeText: "text-amber-600 bg-amber-700/10 border border-amber-700/20"
                }
              ];

              const currentRank = colors[idx] || colors[2];

              return (
                <div
                  key={stud.name}
                  className={`bg-gradient-to-b ${currentRank.bg} border ${currentRank.border} rounded-3xl p-6.5 text-center flex flex-col justify-between items-center space-y-4 hover:scale-[1.01] transition duration-200 relative overflow-hidden`}
                >
                  {/* Decorative background circle */}
                  <div className="absolute top-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />

                  {/* Top Badge */}
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${currentRank.badgeText}`}>
                    {currentRank.badge}
                  </span>

                  {/* Avatar Sphere */}
                  <div className="relative">
                    <div className="h-16 w-16 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center text-3xl shadow">
                      {stud.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 bg-indigo-600 border border-slate-900 rounded-full flex items-center justify-center text-[10px] text-white font-mono font-black shadow">
                      #{stud.rank}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm sm:text-base text-white truncate max-w-[200px]">
                      {stud.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium truncate max-w-[190px]">
                      {stud.school}
                    </p>
                  </div>

                  {/* Bottom details block */}
                  <div className="grid grid-cols-2 gap-2.5 w-full bg-slate-950/60 p-2.5 rounded-xl border border-slate-850/50 text-xs">
                    <div className="text-left font-mono">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Streak</span>
                      <span className="text-orange-400 font-bold flex items-center gap-0.5 mt-0.5">
                        <Flame className="h-3.5 w-3.5 fill-current text-orange-500" />
                        {stud.streak} Days
                      </span>
                    </div>

                    <div className="text-right font-mono">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Core Score</span>
                      <span className="text-white font-extrabold block mt-0.5 text-indigo-400">
                        {stud.xpValue} XP
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Remaining ranks lists */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-850 pb-2 font-mono">
              Academic Cohort Standings
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-850 text-slate-500 uppercase font-mono tracking-wider font-extrabold">
                    <th className="py-3 px-2 text-center w-12">Rank</th>
                    <th className="py-3">Aspirant Student</th>
                    <th className="py-3">Academy Affiliation</th>
                    <th className="py-3 text-center">Active Streak</th>
                    <th className="py-3 text-right">Evaluation Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40">
                  {remainingStudents.map((stud) => {
                    const isItMe = stud.name.includes("(You)");
                    return (
                      <tr 
                        key={stud.name} 
                        className={`transition ${
                          isItMe 
                            ? "bg-indigo-600/10 text-white border-l-4 border-l-indigo-500" 
                            : "hover:bg-slate-950/25"
                        }`}
                      >
                        <td className="py-3.5 px-2 text-center w-12 font-mono font-black">
                          #{stud.rank === 99 ? remainingStudents.length + 3 : stud.rank}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2 font-black">
                            <span className="text-lg">{stud.avatar}</span>
                            <span className={isItMe ? "text-indigo-400 font-black" : "text-slate-200"}>
                              {stud.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-slate-400 font-semibold">{stud.school}</td>
                        <td className="py-3.5 text-center font-mono">
                          <span className="inline-flex items-center gap-1 text-orange-400 font-bold bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">
                            <Flame className="h-3 w-3 fill-current text-orange-500" />
                            {stud.streak} Days
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-mono font-extrabold text-slate-200">
                          {stud.xpValue} XP
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950/50 border border-slate-850/60 rounded-xl flex items-center gap-2 text-[11px] text-slate-450 leading-relaxed font-semibold">
              <span className="text-amber-500">🏆 Protip:</span>
              <span>Submit assessments sequentially inside the <b>Testing Arena</b> tab or study board books in Study Notes directory to boost your XP points and rise further!</span>
            </div>

          </div>

        </section>
      )}

    </div>
  );
}
