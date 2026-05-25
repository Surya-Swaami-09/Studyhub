import React, { useState } from "react";
import { 
  School, Sparkles, Loader2, ArrowRight, Brain, 
  BookOpen, Star, Trophy, Users, CheckCircle, 
  ChevronRight, Calendar, ShieldCheck, Zap 
} from "lucide-react";

interface ClassesViewProps {
  onXpEarned: (amount: number) => void;
  setActiveTab: (tab: string) => void;
}

interface ClassDetails {
  id: string;
  grade: string;
  category: "Primary" | "Middle School" | "Secondary" | "Higher Secondary";
  subjects: string[];
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  totalEnrolled: string;
  color: string;
  glowColor: string;
  bgGradient: string;
}

const CLASSES_DATA: ClassDetails[] = [
  {
    id: "class-5",
    grade: "Class 5",
    category: "Primary",
    subjects: ["Mathematics", "General Science", "English Grammar", "Environmental Studies"],
    description: "Building intermediate cognitive steps, basic fractions, elementary state dynamics, and environment ecology.",
    difficulty: "Beginner",
    totalEnrolled: "12,450 students",
    color: "text-emerald-400",
    glowColor: "shadow-emerald-500/10",
    bgGradient: "from-emerald-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-6",
    grade: "Class 6",
    category: "Middle School",
    subjects: ["Mathematics", "Physics & Chemistry Basics", "General Biology", "Geography & History"],
    description: "Introductory algebraic concepts, kinetic models of materials, plant/animal physiology principles.",
    difficulty: "Beginner",
    totalEnrolled: "14,800 students",
    color: "text-sky-400",
    glowColor: "shadow-sky-500/10",
    bgGradient: "from-sky-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-7",
    grade: "Class 7",
    category: "Middle School",
    subjects: ["Pre-Algebra", "Physical & Chemical Changes", "Life Science", "History & Civics"],
    description: "Integers & equations, cellular respiration, weather cycles, and structural political constitutions.",
    difficulty: "Intermediate",
    totalEnrolled: "16,100 students",
    color: "text-blue-400",
    glowColor: "shadow-blue-500/10",
    bgGradient: "from-blue-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-8",
    grade: "Class 8",
    category: "Middle School",
    subjects: ["Algebra & Geometry", "Force & Pressure", "Synthetic Fibers & Metals", "Computer Literacy"],
    description: "Rational numbers, introduction to force dynamics, carbon materials, and elementary algorithm layouts.",
    difficulty: "Intermediate",
    totalEnrolled: "19,250 students",
    color: "text-indigo-400",
    glowColor: "shadow-indigo-500/10",
    bgGradient: "from-indigo-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-9",
    grade: "Class 9",
    category: "Secondary",
    subjects: ["Real Numbers & Polynomials", "Newtonian Physics Overview", "Atoms & Molecules", "Python Programming"],
    description: "Rigorous proofs, atomic theories, laws of linear motion, and introductory script programming rules.",
    difficulty: "Advanced",
    totalEnrolled: "22,400 students",
    color: "text-purple-400",
    glowColor: "shadow-purple-500/10",
    bgGradient: "from-purple-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-10",
    grade: "Class 10",
    category: "Secondary",
    subjects: ["Trigonometry & Quadratic Eq", "Electricity & Magnetism", "Carbon Compounds", "Board Exam Prep"],
    description: "Board level standards, periodic trends, static charge flows, and detailed chemical bonding matrices.",
    difficulty: "Advanced",
    totalEnrolled: "28,900 students",
    color: "text-pink-400",
    glowColor: "shadow-pink-500/10",
    bgGradient: "from-pink-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-11",
    grade: "Class 11",
    category: "Higher Secondary",
    subjects: ["Calculus & Coordinates", "Thermodynamics & Rotation", "Organic Nomenclature", "Data Structures"],
    description: "Vector kinematics, mechanical waves, orbital hybridization, and arrays or stack buffers search.",
    difficulty: "Expert",
    totalEnrolled: "31,200 students",
    color: "text-rose-400",
    glowColor: "shadow-rose-500/10",
    bgGradient: "from-rose-950/40 via-slate-900 to-slate-900",
  },
  {
    id: "class-12",
    grade: "Class 12",
    category: "Higher Secondary",
    subjects: ["Complex Numbers & Limits", "Quantum Physics & Electrodynamics", "Nomenclature & SN1/SN2", "Database Systems"],
    description: "Syllabus targeting final engineering and pre-university diagnostic exams. Advanced SN1 mechanics.",
    difficulty: "Expert",
    totalEnrolled: "35,600 students",
    color: "text-amber-400",
    glowColor: "shadow-amber-500/10",
    bgGradient: "from-amber-950/40 via-slate-900 to-slate-900",
  }
];

export default function ClassesView({ onXpEarned, setActiveTab }: ClassesViewProps) {
  const [selectedClass, setSelectedClass] = useState<ClassDetails | null>(null);
  
  // AI Customized schedule generator
  const [aiSchedule, setAiSchedule] = useState("");
  const [generatingSchedule, setGeneratingSchedule] = useState(false);
  const [selectedSubjectFocus, setSelectedSubjectFocus] = useState<string>("");

  const handleSelectClass = (cls: ClassDetails) => {
    setSelectedClass(cls);
    setAiSchedule("");
    setSelectedSubjectFocus(cls.subjects[0] || "");
    onXpEarned(10); // Reward active clicking
  };

  const handleGenerateStudyGuide = async () => {
    if (!selectedClass) return;

    setGeneratingSchedule(true);
    setAiSchedule("");

    try {
      const prompt = `Generate a modern 4-week student self-learning roadmap for an outstanding student in ${selectedClass.grade} concentrating on ${selectedSubjectFocus || 'Overall General Study'}.
The student wants to build massive mastery.

Provide a beautifully organized response containing:
1. "Focus of the Week" (Brief bullet lists for Weeks 1 to 4)
2. "Active Recall Tip" for the Subject.
3. "StudyHub AI Recommended Formula/Skill focus".

Keep it pedagogical, straightforward, empowering, and under 180 words total. Do not output markdown code wrappers.`;

      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are an expert curriculum designer and childhood education advisor at StudyHub AI. Output clear, concise, motivating academic schedules using highly structured lines and simple headings."
        })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAiSchedule(data.text || "Your StudyHub schedule is ready! Revise using flashcards daily.");
      onXpEarned(25); // Bonus study setup reward!
    } catch (e) {
      setAiSchedule(`Simulated Syllabus Roadmap for ${selectedClass.grade}:\n\n` +
        `• Week 1: Master fundamental core definitions and formulas.\n` +
        `• Week 2: Build detailed active recall grids on each chapter.\n` +
        `• Week 3: Run comprehensive previous year board questions (PYQs).\n` +
        `• Week 4: Challenge your stamina with our modern Mock Quiz simulator.\n\n` +
        `*Quick Tip*: Take short study breaks every 25 minutes using the Pomodoro technique for high brain energy!`);
    } finally {
      setGeneratingSchedule(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Dynamic Intro Widget banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <School className="text-sky-400 h-6 w-6" />
              Academic Classes Directory
            </h1>
            <p className="text-sm text-slate-400">
              Select your academic standard from Middle School to Higher Secondary. Get automated AI exam schedules and subject insights instantly.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold flex items-center gap-1.5 shrink-0">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-yellow-400" />
            Active Reward: +10 XP on selection!
          </div>
        </div>
      </div>

      {!selectedClass ? (
        /* Screen 1: Beautiful Responsive Grid of Classes cards */
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-mono tracking-widest">
            <span>Core Standards Available</span>
            <span>Choose Your Grade card</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CLASSES_DATA.map((cls) => (
              <div
                key={cls.id}
                id={`class-card-${cls.id}`}
                onClick={() => handleSelectClass(cls)}
                className={`group cursor-pointer rounded-2xl border border-slate-800/80 bg-gradient-to-br ${cls.bgGradient} p-6 space-y-5 flex flex-col justify-between hover:border-slate-700 hover:scale-[1.02] shadow-md transition-all duration-300 ${cls.glowColor}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono font-bold text-slate-500 tracking-wider">
                      {cls.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cls.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-400" :
                      cls.difficulty === "Intermediate" ? "bg-sky-500/10 text-sky-400" :
                      cls.difficulty === "Advanced" ? "bg-purple-500/10 text-purple-400" :
                      "bg-amber-500/10 text-amber-400"
                    }`}>
                      {cls.difficulty}
                    </span>
                  </div>

                  <h3 id={`class-title-${cls.id}`} className={`text-xl font-extrabold tracking-tight ${cls.color} group-hover:text-white transition`}>
                    {cls.grade}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {cls.description}
                  </p>
                </div>

                <div className="border-t border-slate-850 pt-4 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center">
                    <Users className="h-3.5 w-3.5 mr-1 text-slate-400" />
                    {cls.totalEnrolled}
                  </span>
                  <span className="flex items-center text-sky-400 font-bold group-hover:translate-x-1 transition-transform">
                    Explore
                    <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Screen 2: Detailed view for the selected Class with subject modules and AI personalized study guides */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
          
          {/* Left Column: Quick Class Overview & subjects list */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setSelectedClass(null)}
              className="flex items-center text-xs text-slate-400 hover:text-white transition font-medium"
            >
              <ArrowRight className="h-3.5 w-3.5 mr-1.5 rotate-180" />
              Back to Classes board
            </button>

            <div className="space-y-2 border-b border-slate-800 pb-5">
              <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest block">
                {selectedClass.category} Package
              </span>
              <h2 className="text-2xl font-black text-white">{selectedClass.grade} Study Core</h2>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedClass.description}</p>
            </div>

            {/* Core Curriculum subjects */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Curriculums Included</h3>
              <div className="space-y-2">
                {selectedClass.subjects.map((sub, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-850 text-xs text-slate-300"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                      {sub}
                    </span>
                    <ChevronRight className="h-3 w-3 text-slate-650" />
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action shortcuts to main sections */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
                Syllabus Quick Jumps
              </h4>
              <p className="text-[11px] text-slate-400">Quickly transition to study templates and tests based on high-yield models.</p>
              
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <button
                  onClick={() => setActiveTab("notes")}
                  className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-center transition cursor-pointer"
                >
                  Browse Notes
                </button>
                <button
                  onClick={() => setActiveTab("mock-tests")}
                  className="py-1.5 px-2 bg-slate-850 hover:bg-slate-850/80 border border-slate-700 text-slate-200 font-semibold rounded-lg text-center transition cursor-pointer"
                >
                  Solve Quizzes
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (Span 2): AI Learning Guide & dynamic planner generators */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-400 animate-pulse" />
                  AI Study Schedule Maker
                </h3>
                <p className="text-xs text-slate-400">Select focus chapter subject and compile a modern syllabus roadmap instantly.</p>
              </div>

              {/* Subject selector focus */}
              <select
                value={selectedSubjectFocus}
                onChange={(e) => setSelectedSubjectFocus(e.target.value)}
                className="bg-slate-950 border border-slate-850 text-xs text-slate-350 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {selectedClass.subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Action button container */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  Customized for {selectedClass.grade}
                </h4>
                <p className="text-[11px] text-slate-400">Extracts custom active learning milestones tailored for {selectedSubjectFocus}.</p>
              </div>

              <button
                id="generate-class-guide-btn"
                onClick={handleGenerateStudyGuide}
                disabled={generatingSchedule}
                className="w-full sm:w-auto flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-xs text-white transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
              >
                {generatingSchedule ? (
                  <>
                    <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" />
                    Assembling study map...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 mr-2 text-yellow-300 animate-pulse" />
                    Get weeks schedule (+25 XP)
                  </>
                )}
              </button>
            </div>

            {/* Simulated schedule rendering panel */}
            {(aiSchedule || generatingSchedule) && (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-indigo-400">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                    StudyHub AI Tutor Output
                  </span>
                  <span>Target: {selectedSubjectFocus}</span>
                </div>

                {generatingSchedule ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="animate-spin h-8 w-8 text-indigo-400" />
                    <p className="text-xs text-slate-500 animate-pulse">Running advanced matrix educational analysis...</p>
                  </div>
                ) : (
                  <div className="text-xs sm:text-sm text-slate-350 leading-relaxed font-sans whitespace-pre-line text-left">
                    {aiSchedule}
                  </div>
                )}
              </div>
            )}

            {/* Standard Tips Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-850/80 bg-slate-950/40 text-xs space-y-1.5">
                <h5 className="font-bold text-white flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-yellow-400" />
                  Active Quiz Stamina
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  Solving past board papers (PYQs) before standard textbook readings builds cognitive triggers, boosting overall lecture memory capture by up to 2.4x.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-850/80 bg-slate-950/40 text-xs space-y-1.5">
                <h5 className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  StudyHub Certification
                </h5>
                <p className="text-slate-400 leading-relaxed">
                  Earn at least 500 XP points by scoring full correct answers in mock tests to unlock your StudyHub self-study certificate.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
