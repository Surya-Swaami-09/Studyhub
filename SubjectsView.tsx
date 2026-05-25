import React, { useState } from "react";
import { 
  Calculator, Atom, Languages, Compass, LineChart, 
  DollarSign, Sparkles, BookOpen, Star, Award, 
  HelpCircle, ChevronRight, Loader2, ArrowRight, NotebookText
} from "lucide-react";

interface SubjectsViewProps {
  onXpEarned: (amount: number) => void;
  setActiveTab: (tab: string) => void;
}

interface SubjectCard {
  name: string;
  icon: any;
  color: string;
  borderColor: string;
  glowColor: string;
  bgGradient: string;
  description: string;
  keyTopics: string[];
}

const CLASSES_5_10_SUBJECTS: SubjectCard[] = [
  {
    name: "Mathematics",
    icon: Calculator,
    color: "text-blue-400",
    borderColor: "border-blue-500/25",
    glowColor: "shadow-blue-500/5",
    bgGradient: "from-blue-950/20 to-slate-900/60",
    description: "Arithmetic progressions, basic statistics, equations, triangles, and geometry logic.",
    keyTopics: ["Quadratic Solutions", "Real Number Theory", "Trig Basics", "Statistics Graphing"]
  },
  {
    name: "Science",
    icon: Atom,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/25",
    glowColor: "shadow-emerald-500/5",
    bgGradient: "from-emerald-950/20 to-slate-900/60",
    description: "Fundamental carbon structures, electricity circuits, periodic patterns, and cells.",
    keyTopics: ["Chemical Balancing", "Light Refraction", "Life Control & Cord", "Acids & Metals"]
  },
  {
    name: "English",
    icon: Languages,
    color: "text-amber-400",
    borderColor: "border-amber-500/25",
    glowColor: "shadow-amber-500/5",
    bgGradient: "from-amber-950/20 to-slate-900/60",
    description: "Analytical reading, comprehension skills, narrative syntax, tense control, and passive voice.",
    keyTopics: ["Determiners", "Clause Analysis", "Integrated Drills", "Reported Speech"]
  },
  {
    name: "Hindi",
    icon: NotebookText,
    color: "text-rose-400",
    borderColor: "border-rose-500/25",
    glowColor: "shadow-rose-500/5",
    bgGradient: "from-rose-950/20 to-slate-900/60",
    description: "Syllabus covering literature modules, vocabulary expansion, conjugation, essays, and active prose.",
    keyTopics: ["Vyakaran & Muhavare", "Samas & Alankar", "Patra Lekhan", "Gadh Khand"]
  },
  {
    name: "Social Science",
    icon: Compass,
    color: "text-purple-400",
    borderColor: "border-purple-500/25",
    glowColor: "shadow-purple-500/5",
    bgGradient: "from-purple-950/20 to-slate-900/60",
    description: "Historical timelines, planetary resources, modern political institutions, and fiscal developments.",
    keyTopics: ["Democratic States", "Globalization Maps", "Colonial History", "Ecosystem Cartography"]
  }
];

const CLASSES_11_12_SCIENCE: SubjectCard[] = [
  {
    name: "Physics",
    icon: Atom,
    color: "text-sky-400",
    borderColor: "border-sky-500/25",
    glowColor: "shadow-sky-500/5",
    bgGradient: "from-sky-950/20 to-slate-900/60",
    description: "Electromagnetism, classical rotational mechanics, thermodynamics thermodynamics, wave optics.",
    keyTopics: ["Rotational Friction", "Gauss' Law Sphere", "Ray Wave Propagation", "Carnot Efficiencies"]
  },
  {
    name: "Chemistry",
    icon: Star,
    color: "text-teal-400",
    borderColor: "border-teal-500/25",
    glowColor: "shadow-teal-500/5",
    bgGradient: "from-teal-950/20 to-slate-900/60",
    description: "Organic mechanisms (SN1/SN2), equilibrium constants, quantum atomic grids, complex complexes.",
    keyTopics: ["Substitution SN1/SN2", "Gibbs Helmholtz free", "Coordination Compounds", "p-Block Elements"]
  },
  {
    name: "Mathematics",
    icon: Calculator,
    color: "text-indigo-400",
    borderColor: "border-indigo-500/25",
    glowColor: "shadow-indigo-500/5",
    bgGradient: "from-indigo-950/20 to-slate-900/60",
    description: "Indeterminate limits, single/multivariable calculus, matrices determinants, vector spaces.",
    keyTopics: ["Calculus Limits", "Vector Dot Matrix/Cross", "Differential Slopes", "Probability Matrices"]
  },
  {
    name: "Biology",
    icon: Compass,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/25",
    glowColor: "shadow-emerald-500/5",
    bgGradient: "from-emerald-950/20 to-slate-900/60",
    description: "Genetic inheritance DNA structure, botanical energy respiration, human circulation systems.",
    keyTopics: ["DNA Translation", "Photosynthetic Z-Scheme", "Neuron Pathways", "Mendelian Heredity"]
  },
  {
    name: "English",
    icon: Languages,
    color: "text-amber-400",
    borderColor: "border-amber-500/25",
    glowColor: "shadow-amber-500/5",
    bgGradient: "from-amber-950/20 to-slate-900/60",
    description: "Literary criticisms, advanced discourse formats, speech writing synthesis, and comprehensive comprehension.",
    keyTopics: ["Critical Appreciation", "Note Making Patterns", "Report Synthesizing", "Clause Syntaxes"]
  }
];

const CLASSES_11_12_COMMERCE: SubjectCard[] = [
  {
    name: "Accountancy",
    icon: DollarSign,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/25",
    glowColor: "shadow-emerald-500/5",
    bgGradient: "from-emerald-950/20 to-slate-900/60",
    description: "Double-entry protocols, partnership accounting balance sheets, cash flows, and depreciations.",
    keyTopics: ["Partnership Ledgers", "Cash Flow Statements", "Reconstitution Ratios", "Debenture Capital"]
  },
  {
    name: "Business Studies",
    icon: LineChart,
    color: "text-sky-400",
    borderColor: "border-sky-500/25",
    glowColor: "shadow-sky-500/5",
    bgGradient: "from-sky-950/20 to-slate-900/60",
    description: "Strategic planning, human resource coordination, marketing methodologies, consumer act guards.",
    keyTopics: ["Principles of Henry Fayol", "Delegation Autonomy", "Market Mix Strategies", "Capital Structuring"]
  },
  {
    name: "Economics",
    icon: Compass,
    color: "text-rose-400",
    borderColor: "border-rose-500/25",
    glowColor: "shadow-rose-500/5",
    bgGradient: "from-rose-950/20 to-slate-900/60",
    description: "Micro elasticity ratios, aggregate demand macro models, national income tracking, development goals.",
    keyTopics: ["National Income Ledger", "Aggregate Demand Deficit", "Oligopoly Controls", "Indifference Slopes"]
  },
  {
    name: "Mathematics",
    icon: Calculator,
    color: "text-indigo-400",
    borderColor: "border-indigo-500/25",
    glowColor: "shadow-indigo-500/5",
    bgGradient: "from-indigo-950/20 to-slate-900/60",
    description: "Applied statistical linear programming, continuous financial calculus, indices, matrices calculations.",
    keyTopics: ["Linear Programming", "Annuities & Sinking Fund", "Regression Slopes", "Probability Calculus"]
  },
  {
    name: "English",
    icon: Languages,
    color: "text-amber-400",
    borderColor: "border-amber-500/25",
    glowColor: "shadow-amber-500/5",
    bgGradient: "from-amber-950/20 to-slate-900/60",
    description: "Advanced syntax guidelines, resume drafts, business correspondence templates, critical evaluations.",
    keyTopics: ["Business Correspondence", "Report Draftings", "Comprehension Syntaxes", "Precis Synthesis"]
  }
];

export default function SubjectsView({ onXpEarned, setActiveTab }: SubjectsViewProps) {
  const [activeCategory, setActiveCategory] = useState<"5-10" | "11-12-science" | "11-12-commerce">("5-10");
  const [selectedSubject, setSelectedSubject] = useState<SubjectCard | null>(null);

  // AI-powered dynamic tutor outline generator
  const [aiOutline, setAiOutline] = useState("");
  const [loadingOutline, setLoadingOutline] = useState(false);

  const getActiveList = (): SubjectCard[] => {
    switch (activeCategory) {
      case "5-10":
        return CLASSES_5_10_SUBJECTS;
      case "11-12-science":
        return CLASSES_11_12_SCIENCE;
      case "11-12-commerce":
        return CLASSES_11_12_COMMERCE;
    }
  };

  const currentCategoryLabel = () => {
    switch (activeCategory) {
      case "5-10":
        return "Classes 5 to 10 Group";
      case "11-12-science":
        return "Classes 11 & 12 Science Stream";
      case "11-12-commerce":
        return "Classes 11 & 12 Commerce Stream";
    }
  };

  const handleSelectSubject = (sub: SubjectCard) => {
    setSelectedSubject(sub);
    setAiOutline("");
    onXpEarned(10); // Reward exploration
  };

  const handleFetchAiOverview = async () => {
    if (!selectedSubject) return;

    setLoadingOutline(true);
    setAiOutline("");

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are an expert curriculum supervisor at StudyHub AI. Analyze the subject "${selectedSubject.name}" for the student category "${currentCategoryLabel()}".
Generate a high-yield exam overview:
1. "Key Board Chapters" to prioritize.
2. "AI Pro Tip" to score perfectly.
3. Recommended self-study hours per week.

Keep the response straightforward, highly structured with bullet points, pedagogical, and under 150 words.`,
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setAiOutline(data.text || "Revise standard textbooks and practice revision cards daily.");
      onXpEarned(15); // Reward AI counseling
    } catch (e) {
      setAiOutline(`Syllabus Blueprint for ${selectedSubject.name}:\n\n` +
        `• Core Recommended Chapters: ${selectedSubject.keyTopics.join(", ")}\n` +
        `• Self-study Intensity: Recommended 6-8 hours a week.\n` +
        `• StudyHub AI Pro Tip: Run active recall using study notes and take interactive mock tests at least once every 3 days to consolidate your memory!`);
    } finally {
      setLoadingOutline(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner design */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="text-emerald-400 h-6 w-6" />
              Syllabus & Subjects Selection
            </h1>
            <p className="text-sm text-slate-400">
              Customize your learning stream. Browse core topics, explore subjects, and generate custom AI learning blueprints.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shrink-0 select-none">
            <Sparkles className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
            +10 XP on exploring
          </div>
        </div>
      </div>

      {!selectedSubject ? (
        /* Screen 1: Choose Stream & Category, followed by Responsive Cards Grid */
        <div className="space-y-6 animate-fadeIn">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            <button
              id="stream-btn-5-10"
              onClick={() => {
                setActiveCategory("5-10");
                setSelectedSubject(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                activeCategory === "5-10"
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Classes 5 - 10
            </button>
            <button
              id="stream-btn-11-12-sci"
              onClick={() => {
                setActiveCategory("11-12-science");
                setSelectedSubject(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                activeCategory === "11-12-science"
                  ? "bg-sky-600 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Classes 11 - 12 (Science)
            </button>
            <button
              id="stream-btn-11-12-com"
              onClick={() => {
                setActiveCategory("11-12-commerce");
                setSelectedSubject(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition ${
                activeCategory === "11-12-commerce"
                  ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              Classes 11 - 12 (Commerce)
            </button>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-mono tracking-widest">
            <span>Core Subjects for: {currentCategoryLabel()}</span>
            <span>{getActiveList().length} Courses</span>
          </div>

          {/* Responsive Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getActiveList().map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div
                  key={idx}
                  id={`subject-card-${sub.name.toLowerCase()}-${idx}`}
                  onClick={() => handleSelectSubject(sub)}
                  className={`group cursor-pointer rounded-2xl border ${sub.borderColor} bg-gradient-to-br ${sub.bgGradient} p-6 space-y-4 flex flex-col justify-between hover:border-slate-700/85 hover:scale-[1.02] shadow-md transition-all duration-300 ${sub.glowColor}`}
                >
                  <div className="space-y-3 text-left">
                    <div className="flex justify-between items-start">
                      <div className={`p-3 rounded-xl bg-slate-950/40 ${sub.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">
                        Syllabus Unit
                      </span>
                    </div>

                    <h3 id={`subject-title-${idx}`} className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                      {sub.name}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {sub.description}
                    </p>
                  </div>

                  {/* Highlights key chapters */}
                  <div className="border-t border-slate-850 pt-4 text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wide block mb-2">
                      Important Sub-Topics
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sub.keyTopics.slice(0, 2).map((top, i) => (
                        <span key={i} className="text-[10px] bg-slate-950/80 text-slate-350 px-2 py-1 rounded border border-slate-850">
                          {top}
                        </span>
                      ))}
                      {sub.keyTopics.length > 2 && (
                        <span className="text-[10px] text-indigo-400 font-bold self-center">
                          +{sub.keyTopics.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <span className="text-[11px] font-bold text-sky-400 flex items-center group-hover:translate-x-1 transition-transform">
                      View Chapters Blueprint
                      <ChevronRight className="h-4 w-4 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Screen 2: Individual Subject Core Dashboard & AI Blueprints */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
          {/* Left Column Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedSubject(null)}
              className="flex items-center text-xs text-slate-400 hover:text-white transition font-medium"
            >
              <ArrowRight className="h-3.5 w-3.5 mr-1.5 rotate-180" />
              Back to Subject list
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-5">
              <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest block">
                {currentCategoryLabel()} Course
              </span>
              <h2 id="inspect-subject" className="text-2xl font-black text-white">{selectedSubject.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedSubject.description}</p>
            </div>

            {/* List key areas */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">Exam Syllabus Focus</h3>
              <div className="space-y-2">
                {selectedSubject.keyTopics.map((top, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-850 text-xs text-slate-300"
                  >
                    {i + 1}. {top}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive navigation routes */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-850 space-y-3">
              <h4 className="text-xs font-bold text-white flex gap-1.5 items-center">
                <Award className="h-4 w-4 text-indigo-400" />
                Active Fast Studies
              </h4>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Take simulated speed diagnostic quizzes or read brief curated curriculum references on our notes boards.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <button
                  id="jump-notes"
                  onClick={() => setActiveTab("notes")}
                  className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-center transition cursor-pointer"
                >
                  Browse Notes
                </button>
                <button
                  id="jump-quizzes"
                  onClick={() => setActiveTab("mock-tests")}
                  className="py-1.5 bg-slate-850 hover:bg-slate-850/80 border border-slate-700 text-slate-300 font-bold rounded-lg text-center transition cursor-pointer"
                >
                  Solve Quizzes
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: AI Curriculum Blueprint generator */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-5 space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
                AI Exam Preparation Blueprint
              </h3>
              <p className="text-xs text-slate-400">
                Generate high-yield chapter guides, recommended hours and targeted scoring tactics derived from past papers structure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl gap-4">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white uppercase">Blueprint Model Activated</h4>
                <p className="text-[11px] text-slate-400">Build custom exam strategies derived directly from board grading metrics.</p>
              </div>

              <button
                id="generate-subject-guide-btn"
                onClick={handleFetchAiOverview}
                disabled={loadingOutline}
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-xs text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center"
              >
                {loadingOutline ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />
                    Assembling Blueprint...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-300" />
                    Get Prep Outline (+15 XP)
                  </>
                )}
              </button>
            </div>

            {/* Response Section */}
            {(aiOutline || loadingOutline) && (
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center text-xs text-slate-400 border-b border-slate-850 pb-2">
                  <span className="flex items-center gap-1 font-bold text-indigo-400 uppercase">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                    Diagnostic Prep Guidance
                  </span>
                  <span>Subject: {selectedSubject.name}</span>
                </div>

                {loadingOutline ? (
                  <div className="py-8 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-400" />
                    <p className="text-xs text-slate-500 animate-pulse">Running advanced diagnostic synthesis...</p>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans whitespace-pre-line">
                    {aiOutline}
                  </div>
                )}
              </div>
            )}

            {/* Study Guidelines block */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2 text-xs">
              <h5 className="font-bold text-slate-200 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
                How to leverage this dashboard?
              </h5>
              <p className="text-slate-400 leading-relaxed">
                Click on the bottom navigation links or tabs to browse curriculum-aligned Notes, generate revision flashcards, check memory retention with past year paper questions, and participate in our graded assessment system.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
