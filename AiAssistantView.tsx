import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, Send, Sparkles, BookOpen, HelpCircle, CheckCircle, Award, Bookmark, 
  Trash2, Copy, Download, RefreshCw, ChevronRight, MessageSquare, ListTodo, 
  ChevronDown, BookMarked, Layers, History, Clock, FileText, Check, AlertCircle, 
  ThumbsUp, ExternalLink, Printer, ClipboardCheck, ArrowUpRight
} from "lucide-react";

interface AiAssistantProps {
  onXpEarned: (amount: number) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  mode: "chat" | "notes" | "mcqs" | "explain";
  topic?: string;
  subject?: string;
  // Specific payload for interactive parsed objects
  mcqs?: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export default function AiAssistantView({ onXpEarned }: AiAssistantProps) {
  const [activeMode, setActiveMode] = useState<"chat" | "notes" | "mcqs" | "explain">("chat");
  const [inputText, setInputText] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [noteDepth, setNoteDepth] = useState("Comprehensive");
  const [theoryLevel, setTheoryLevel] = useState("Easy Analogy");
  const [numMcqs, setNumMcqs] = useState(3);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // MCQ answering state for chat messages
  // Structure: { [messageId_questionIdx]: selectedOptionIdx }
  const [userMcqSelections, setUserMcqSelections] = useState<{ [key: string]: number }>({});
  const [copyStates, setCopyStates] = useState<{ [key: string]: boolean }>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested preset prompts based on subject
  const presetShortcuts = [
    { label: "SN2 Reaction Mechanism", mode: "explain" as const, text: "SN2 Reaction Mechanism in organic chemistry" },
    { label: "Derive Quadratic Formula", mode: "explain" as const, text: "Derive the quadratic formula step by step" },
    { label: "Notes on Photosynthesis", mode: "notes" as const, text: "Light-dependent and light-independent reactions of Photosynthesis" },
    { label: "MCQ Quiz on Electrostatics", mode: "mcqs" as const, text: "Electric charges, Coulomb law, and field lines" },
    { label: "How do semiconductors work?", mode: "chat" as const, text: "Explain semiconductor physics in simple terms" }
  ];

  // Subject directories
  const subjectsList = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "General Studies"];

  // Scroll to bottom whenever messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Load chat logs on component mount
  useEffect(() => {
    const cachedLogs = localStorage.getItem("studyhub_ai_chat_logs");
    if (cachedLogs) {
      try {
        setMessages(JSON.parse(cachedLogs));
      } catch (e) {
        console.error("Failed to load AI chat records", e);
      }
    } else {
      // Welcome seed message
      const defaultWelcome: ChatMessage = {
        id: "wel-1",
        sender: "ai",
        text: "Hello, Scholar! 🎓 Wave hello to **StudyHub AI**, powered by Google Gemini. I am your dedicated 24/7 personal tutor. Select a custom study aid mode on the selector or type a query directly below to begin your journey!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: "chat"
      };
      setMessages([defaultWelcome]);
    }
  }, []);

  // Save chat logs helper
  const saveMessagesToCache = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem("studyhub_ai_chat_logs", JSON.stringify(newMsgs));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to delete all conversation history?")) {
      const defaultWelcome: ChatMessage = {
        id: `wel-${Date.now()}`,
        sender: "ai",
        text: "History reset successfully. Let's make history with outstanding grades! What are we studying next? 🚀",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: "chat"
      };
      saveMessagesToCache([defaultWelcome]);
      setUserMcqSelections({});
    }
  };

  // Extract JSON helper for MCQs
  const extractStructuredJson = (rawText: string) => {
    try {
      let clean = rawText.trim();
      // Look for codeblocks in case the model returns markdown JSON
      if (clean.includes("```json")) {
        const parts = clean.split("```json");
        clean = parts[1].split("```")[0];
      } else if (clean.includes("```")) {
        const parts = clean.split("```");
        clean = parts[parts.length - 2 || 1].replace(/^[a-zA-Z]+\n/, "");
      }
      
      // Attempt clean parsing
      const parsed = JSON.parse(clean.trim());
      if (Array.isArray(parsed)) {
        return parsed;
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
      return null;
    } catch (e) {
      console.warn("Regex-based JSON stripping fallback triggered", e);
      return null;
    }
  };

  // Trigger query submission
  const handleSubmitPrompt = async (forcedText?: string, overrideMode?: "chat" | "notes" | "mcqs" | "explain") => {
    const targetText = forcedText || inputText;
    if (!targetText.trim()) return;

    const currentMode = overrideMode || activeMode;
    const clientTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // 1. Append user message
    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: "user",
      text: targetText,
      timestamp: clientTimestamp,
      mode: currentMode,
      subject: selectedSubject
    };

    const updatedWithUser = [...messages, userMsg];
    saveMessagesToCache(updatedWithUser);
    if (!forcedText) setInputText("");
    setIsLoading(true);
    setErrorMessage("");

    // 2. Formulate proper dynamic system prompt for Gemini
    let systemInstruction = "";
    let finalPromptText = targetText;

    if (currentMode === "chat") {
      systemInstruction = `You are a world-class academic tutor. Help the student resolve their doubts in ${selectedSubject !== "All" ? selectedSubject : "general school/college level science & arts subjects"}. Offer step-by-step reasoning, clear bullet-pointed explanations, and supportive remarks. Keep the response beautifully styled in markdown. Limit responses to 250 words unless detail is vital. Keep formulas formatted clearly.`;
    } 
    else if (currentMode === "notes") {
      systemInstruction = `You are an expert textbook compiler and syllabus specialist list maker. Generate highly detailed academic revision notes for the requested topic. 
Format your output exactly in elegant Markdown with:
# Topic Title (with clean header)
## 📌 Core Summary Checklist
(Summarize in 3 bullet points)
## 💡 Comprehensive Explanations & Context
(Describe concepts in standard instructional textbook blocks, highlighting core keywords in bold)
## 🧪 Key Mathematical Formulas or Organic Mechanisms (if applicable)
(Present equations cleanly)
## 📖 Definitions Index
(A short list of core definitions)
Keep the notes authoritative, rich, and highly valuable. Topic is: ${targetText}. Depth is: ${noteDepth}. Subject Context: ${selectedSubject !== "All" ? selectedSubject : "General Studies"}`;
    } 
    else if (currentMode === "explain") {
      systemInstruction = `You are an exceptionally engaging teacher who excels at describing complex matters using intuitive mental analogies. 
Topic: ${targetText}. Level style: ${theoryLevel}.
Ensure your response follows this structure with markdown headers:
# 🔍 Conceptual Explanations: ${targetText}
## 🧩 The Intuitive Analogy
(Describe a real-world analogical scenario that makes the concept instantly clear)
## 🔬 Technical Deep-Dive
(Provide a step-by-step layout of how it actually works technically, mathematically, or chemically)
## 🚀 Quick Recap Formulas / Key Facts
(Highlight 3 core bullet points to write in exams)`;
    } 
    else if (currentMode === "mcqs") {
      systemInstruction = `You are an automated curriculum developer. Create exactly ${numMcqs} multiple-choice exam-prep questions regarding the requested topic: "${targetText}".
Subject target: ${selectedSubject !== "All" ? selectedSubject : "General Sci/Arts Level"}.
You MUST respond with a valid JSON array only. Do not add conversational text, prefix statements, or outer notes. The array must contain exactly ${numMcqs} objects.
Each object in the array must feature exactly these keys:
- "question": string (the question text)
- "options": array of exactly 4 strings (options)
- "correctIndex": integer (the index in options array, 0 to 3)
- "explanation": string (the standard educational solution proof)

Example Schema:
[
  {
    "question": "Which of these represents Sn1 pathway rate dependency?",
    "options": ["Substrate concentration only", "Nucleophile intensity only", "Both substrate and nucleophile", "Solvent velocity index"],
    "correctIndex": 0,
    "explanation": "Sn1 reaction rates depend strictly on forming carbocations, which relies solely on the substrate concentration."
  }
]`;
    }

    try {
      const response = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: finalPromptText,
          systemInstruction: systemInstruction
        })
      });

      if (!response.ok) throw new Error("Our expert AI tutor servers took too long to respond. Please review your internet link.");
      const data = await response.json();
      const generatedText = data.text || "I was unable to retrieve a response. Let us try reformulating the subject inquiry.";

      const aiMsgId = `ai-${Date.now()}`;
      let parsedMcqs: ChatMessage["mcqs"] = undefined;

      // Parse MCQs if in mcqs mode
      if (currentMode === "mcqs") {
        const parsed = extractStructuredJson(generatedText);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          parsedMcqs = parsed.map((item: any) => ({
            question: item.question || "Topic question",
            options: Array.isArray(item.options) ? item.options.slice(0, 4) : ["A", "B", "C", "D"],
            correctIndex: typeof item.correctIndex === "number" ? item.correctIndex : 0,
            explanation: item.explanation || "No explanation outline."
          }));
        }
      }

      // Complete message
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: "ai",
        text: generatedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: currentMode,
        topic: targetText,
        subject: selectedSubject,
        mcqs: parsedMcqs
      };

      // Rewards
      if (currentMode === "mcqs") {
        onXpEarned(35); // +35 XP for generating custom quizzes!
      } else if (currentMode === "notes") {
        onXpEarned(40); // +40 XP for notes gen!
      } else {
        onXpEarned(15); // +15 XP for normal chats!
      }

      saveMessagesToCache([...updatedWithUser, aiMsg]);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "A response rendering error popped up. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Click shortcut chip
  const handleChipClick = (preset: typeof presetShortcuts[0]) => {
    setSelectedSubject(preset.mode === "notes" ? "Chemistry" : "General Studies");
    setActiveMode(preset.mode);
    handleSubmitPrompt(preset.text, preset.mode);
  };

  // Handle MCQ selection *inside* a chat bubble containing live parsed MCQs
  const handleSelectLiveMcq = (msgId: string, qIdx: number, userIdx: number, correctIdx: number) => {
    const stateKey = `${msgId}_${qIdx}`;
    if (userMcqSelections[stateKey] !== undefined) return; // Already solved

    setUserMcqSelections(prev => ({
      ...prev,
      [stateKey]: userIdx
    }));

    if (userIdx === correctIdx) {
      onXpEarned(15); // Earn 15 XP for correct answers!
    } else {
      onXpEarned(2); // consolatory 2 XP
    }
  };

  // Helper to copy content to clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Printable layout for individual notes or chats
  const handlePrintMsg = (msg: ChatMessage) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>StudyHub AI - Note Revision Booklet</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background: white; line-height: 1.6; }
            .badge { background: #e0e7ff; color: #4338ca; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; margin-bottom: 20px; display: inline-block; text-transform: uppercase; }
            h1 { font-size: 26px; color: #0f172a; margin-top: 5px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
            h2 { font-size: 18px; color: #1e1b4b; margin-top: 30px; }
            p, li { font-size: 14px; color: #334155; }
            .notebox { background: #f8fafc; border-left: 4px solid #4f46e5; padding: 15px; border-radius: 0 10px 10px 0; font-size: 13.5px; margin: 25px 0; color: #475569; }
            footer { text-align: center; margin-top: 55px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 25px; }
            @media print { body { padding: 15px; } }
          </style>
        </head>
        <body>
          <div class="badge">StudyHub AI generated ${msg.mode} material</div>
          <h1>Topic: ${msg.topic || "Academic Reference Sheet"}</h1>
          <div style="font-size:12.5px; color:#64748b; margin-bottom: 30px;">
            Subject: ${msg.subject || "General Studies"} &bull; Generated on ${new Date().toLocaleDateString()}
          </div>
          <div>
            ${msg.text.replace(/\r?\n/g, '<br />')}
          </div>
          <div class="notebox">
            <b>Evaluation Guidance:</b> Maintain active recall by writing summary equations from memory. Retake diagnostic tests inside StudyHub app interface to log progression records.
          </div>
          <footer>
            StudyHub AI Solutions Hub &bull; Certified Classroom Handouts
          </footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left h-full max-w-7xl mx-auto pb-16 animate-fadeIn">
      
      {/* LEFT COLUMN: CONTROL BOARD & SPECIALIZED WORKSHOPS PANEL */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Welcome Status card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/10">
              <Bot className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">AI Study Buddy</h2>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Gemini Active Tutor Setup
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4 leading-relaxed">
            Switch custom tools on the panel below to quickly request target study resources, formulate diagnostic multiple-choice items, or ask basic Q&A help.
          </p>
        </div>

        {/* COMPRESSION METHOD TABS SELECTOR (STUDY AIDS PANEL) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Select Study Tool Mode</span>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {/* Mode 1 */}
            <button
              onClick={() => { setActiveMode("chat"); setErrorMessage(""); }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                activeMode === "chat" 
                  ? "bg-indigo-600/10 border-indigo-550/80 text-white shadow-sm" 
                  : "bg-slate-950/70 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              <MessageSquare className={`h-5 w-5 mt-0.5 shrink-0 ${activeMode === "chat" ? "text-indigo-400" : "text-slate-500"}`} />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Ask a Question</p>
                <p className="text-[10px] opacity-70 leading-normal">Resolve dynamic homework queries step-by-step</p>
              </div>
            </button>

            {/* Mode 2 */}
            <button
              onClick={() => { setActiveMode("notes"); setErrorMessage(""); }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                activeMode === "notes" 
                  ? "bg-indigo-600/10 border-indigo-550/80 text-white shadow-sm"
                  : "bg-slate-950/70 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              <FileText className={`h-5 w-5 mt-0.5 shrink-0 ${activeMode === "notes" ? "text-indigo-400" : "text-slate-500"}`} />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Generate Notes</p>
                <p className="text-[10px] opacity-70 leading-normal">Synthesize rich summaries, indexes, key takeaway metrics</p>
              </div>
            </button>

            {/* Mode 3 */}
            <button
              onClick={() => { setActiveMode("explain"); setErrorMessage(""); }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                activeMode === "explain" 
                  ? "bg-indigo-600/10 border-indigo-550/80 text-white shadow-sm" 
                  : "bg-slate-950/70 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              <BookOpen className={`h-5 w-5 mt-0.5 shrink-0 ${activeMode === "explain" ? "text-indigo-400" : "text-slate-500"}`} />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Explain Topic</p>
                <p className="text-[10px] opacity-70 leading-normal">Construct real-life analogies, simplified models, visual formulas</p>
              </div>
            </button>

            {/* Mode 4 */}
            <button
              onClick={() => { setActiveMode("mcqs"); setErrorMessage(""); }}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition cursor-pointer ${
                activeMode === "mcqs" 
                  ? "bg-indigo-600/10 border-indigo-550/80 text-white shadow-sm" 
                  : "bg-slate-950/70 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-300"
              }`}
            >
              <ListTodo className={`h-5 w-5 mt-0.5 shrink-0 ${activeMode === "mcqs" ? "text-indigo-400" : "text-slate-500"}`} />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold">Generate MCQs</p>
                <p className="text-[10px] opacity-70 leading-normal">Build custom self-testing worksheets with scorecards</p>
              </div>
            </button>
          </div>
        </div>

        {/* CONTEXT FILTERS BLOCK */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Configure Parameters</span>

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 font-bold block">Subject Area Filter</label>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition cursor-pointer"
            >
              <option value="All">All Subjects (General Help)</option>
              {subjectsList.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Mode-Specific Variables */}
          {activeMode === "notes" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[11px] text-slate-400 font-bold block">Summary Depth</label>
              <div className="flex gap-1 bg-slate-950 p-1 border border-slate-850 rounded-xl">
                {["Concise", "Comprehensive"].map((depth) => (
                  <button
                    key={depth}
                    onClick={() => setNoteDepth(depth)}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition cursor-pointer ${
                      noteDepth === depth ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {depth}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMode === "explain" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[11px] text-slate-400 font-bold block">Tutoring Language Style</label>
              <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl gap-1">
                {["Easy Analogy", "Exam Rigorous"].map((styleOpt) => (
                  <button
                    key={styleOpt}
                    onClick={() => setTheoryLevel(styleOpt)}
                    className={`flex-1 text-[10px] font-bold py-1.5 rounded-lg transition cursor-pointer ${
                      theoryLevel === styleOpt ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {styleOpt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeMode === "mcqs" && (
            <div className="space-y-2 animate-fadeIn">
              <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                <span>Quiz Items count</span>
                <span className="text-indigo-400">{numMcqs} Questions</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={numMcqs} 
                onChange={(e) => setNumMcqs(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono font-bold px-1 select-none">
                <span>1 MCQ</span>
                <span>3 MCQs</span>
                <span>5 MCQs</span>
              </div>
            </div>
          )}

          {/* Clear dialogue helper */}
          <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-mono">Sessions saved automatically</span>
            <button
              onClick={handleClearHistory}
              className="p-1 px-2.5 rounded-lg border border-red-500/25 hover:bg-red-500/15 text-red-400 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Reset Conversation
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: REASSURING ACTIVE CHAT DIALOGUE INTERFACE */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between overflow-hidden min-h-[580px] sm:min-h-[640px]">
        
        {/* Active conversation title header */}
        <div className="bg-slate-950 px-6 py-4.5 border-b border-slate-850 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
              <Bot className="h-4.5 w-4.5 animate-bounce" style={{ animationDuration: '4s' }} />
            </span>
            <div className="space-y-0.5 text-left">
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                Active Study Workspace
                <span className="text-[9px] font-mono px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 rounded-full capitalize">
                  {activeMode} Mode
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-400">
                Contextual filters active: {selectedSubject === "All" ? "General Studies" : selectedSubject}
              </p>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-indigo-300 text-[10px] font-bold">
            <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
            <span>Generate resources as saved logs!</span>
          </div>
        </div>

        {/* Live chat dialog messages list area */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 max-h-[460px] min-h-[300px]">
          {messages.map((msg, index) => {
            const isAi = msg.sender === "ai";
            const messageKey = msg.id;

            return (
              <div 
                key={messageKey} 
                className={`flex gap-3 sm:gap-4 text-left max-w-full lg:max-w-7xl animate-fadeIn ${
                  isAi ? "justify-start" : "justify-end"
                }`}
              >
                {/* AI Icon Avatar */}
                {isAi && (
                  <div className="h-8.5 w-8.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0 select-none shadow-md">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-400 fill-current animate-pulse" />
                  </div>
                )}

                {/* Message Core Shape structure */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] rounded-3xl p-4.5 shadow-sm relative ${
                  isAi 
                    ? "bg-slate-950/80 border border-slate-850 text-slate-100 rounded-tl-sm"
                    : "bg-indigo-650/15 border border-indigo-500/30 text-slate-200 rounded-tr-sm"
                }`}>
                  {/* Top identifier tag */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 border-b border-slate-850/60 pb-1.5 mb-2 gap-2">
                    <span className="font-mono uppercase tracking-wide">
                      {isAi ? "AI Expert Core" : "You (Student)"}
                    </span>
                    <span className="opacity-80 font-mono text-slate-550 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Standard text text-render output styled recursively */}
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap select-text markdown-body">
                    {msg.text}
                  </div>

                  {/* SPECIALIZED INTERACTIVE ELEMENT: INTERACTIVE LIVE MULTIPLE-CHOICE QUIZ BLOCK */}
                  {isAi && msg.mode === "mcqs" && msg.mcqs && msg.mcqs.length > 0 && (
                    <div className="mt-5 space-y-5 border-t border-slate-850 pt-4 leading-normal select-none animate-fadeIn">
                      
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold mb-3">
                        <ClipboardCheck className="h-4 w-4" />
                        <span>Interactive Self-Evaluation Quizsheet:</span>
                      </div>

                      {msg.mcqs.map((q, qIndex) => {
                        const answerKey = `${msg.id}_${qIndex}`;
                        const selectedOption = userMcqSelections[answerKey];
                        const answered = selectedOption !== undefined;
                        const isUserCorrect = answered && selectedOption === q.correctIndex;

                        return (
                          <div 
                            key={qIndex} 
                            className="bg-slate-900 border border-slate-850/80 rounded-2xl p-4 space-y-3.5"
                          >
                            <span className="text-[10px] font-mono font-black uppercase text-indigo-400 tracking-wider">
                              Question {qIndex + 1} of {msg.mcqs?.length}
                            </span>
                            
                            <p className="text-xs font-black text-white">{q.question}</p>

                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((opt, optIndex) => {
                                const isThisSelected = selectedOption === optIndex;
                                const isThisCorrect = optIndex === q.correctIndex;

                                let variantClass = "bg-slate-950 text-slate-350 border-slate-850 hover:bg-slate-950/80 hover:border-slate-700 cursor-pointer";
                                let iconPart = null;

                                if (answered) {
                                  if (isThisCorrect) {
                                    variantClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold cursor-default";
                                    iconPart = <Check className="h-3.5 w-3.5 shrink-0" />;
                                  } else if (isThisSelected) {
                                    variantClass = "bg-red-500/10 border-red-500/40 text-red-400 cursor-default";
                                    iconPart = <AlertCircle className="h-3.5 w-3.5 shrink-0" />;
                                  } else {
                                    variantClass = "bg-slate-950/20 text-slate-600 border-slate-900/60 opacity-60 cursor-default";
                                  }
                                }

                                return (
                                  <button
                                    key={optIndex}
                                    disabled={answered}
                                    onClick={() => handleSelectLiveMcq(msg.id, qIndex, optIndex, q.correctIndex)}
                                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs text-left transition ${variantClass}`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold opacity-60">[{String.fromCharCode(65 + optIndex)}]</span>
                                      <span>{opt}</span>
                                    </div>
                                    {iconPart}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Solution details box shown on click answer */}
                            {answered && (
                              <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-1 text-[11px] leading-relaxed animate-fadeIn">
                                <span className={`font-mono font-bold block ${isUserCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {isUserCorrect ? "✓ STUNNING ANSWER! (+15 XP Awarded)" : "✗ Incorrect choice (+2 consolatory XP)"}
                                </span>
                                <p className="text-slate-400 italic font-sans">
                                  <b>Proof Key:</b> {q.explanation}
                                </p>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* COMMAND BUTTONS FOOTER BAR */}
                  {isAi && (msg.mode === "notes" || msg.mode === "explain" || msg.mode === "chat") && (
                    <div className="mt-4 border-t border-slate-850/60 pt-3 flex items-center justify-between gap-2 flex-wrap text-slate-500">
                      
                      <div className="flex items-center gap-1.5 select-none opacity-80 text-[10.5px]">
                        <BookMarked className="h-3.5 w-3.5 text-indigo-400 fill-current animate-pulse" />
                        <span>Source: Verified Google Gemini tutoring materials</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className="p-1.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-white transition flex items-center gap-1 text-[10px] font-bold cursor-pointer font-mono"
                          title="Copy text content"
                        >
                          {copyStates[msg.id] ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-slate-400" />
                              Copy Text
                            </>
                          )}
                        </button>

                        {/* Print notes layout */}
                        <button
                          onClick={() => handlePrintMsg(msg)}
                          className="p-1.5 rounded-xl bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-white transition flex items-center gap-1 text-[10px] font-bold cursor-pointer font-mono"
                          title="Print beautifully formatted notes booklet"
                        >
                          <Printer className="h-3 w-3 text-slate-400" />
                          <span>Print File</span>
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            );
          })}

          {/* Prompt Loading Indicator */}
          {isLoading && (
            <div className="flex gap-4 text-left justify-start">
              <div className="h-8.5 w-8.5 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center text-indigo-400 shrink-0 select-none shadow-md">
                <Bot className="h-4.5 w-4.5 text-indigo-400 animate-spin" />
              </div>

              <div className="bg-slate-950/80 border border-slate-850 rounded-3xl rounded-tl-sm p-4.5 shadow-sm max-w-[75%] space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-black animate-pulse">
                  Tapping syllabus databases...
                </span>
                <div className="flex space-x-1.5 py-1 select-none">
                  <div className="h-2 w-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 bg-sky-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* Diagnostic error messages banner */}
          {errorMessage && (
            <div className="flex items-center gap-3 p-4 bg-red-900/10 border border-red-500/25 rounded-2xl text-xs text-red-400 animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div className="flex-1 text-left">
                <span className="font-bold uppercase tracking-wider block text-[10px]">Tutor engine interruption</span>
                <span>{errorMessage}</span>
              </div>
              <button 
                onClick={() => handlePromptAgain()}
                className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-650 text-white text-[10px] font-bold transition flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <RefreshCw className="h-3 w-3 animate-spin" />
                Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM CONTROLLERS BOX */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-850 space-y-4">
          
          {/* Preset Shortcuts Chips list shown if empty chat */}
          {messages.length <= 1 && (
            <div className="space-y-2 text-left animate-fadeIn">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                ⭐ QUICK RECALL AIDS (PRESET CHIPS)
              </span>
              <div className="flex flex-wrap gap-2 justify-start max-h-[85px] overflow-y-auto">
                {presetShortcuts.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleChipClick(preset)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer max-w-full truncate"
                  >
                    <ArrowUpRight className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Main User Writing input interface form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmitPrompt(); }}
            className="flex items-center gap-2 relative"
          >
            <input
              id="ai-assistant-text-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
              placeholder={
                activeMode === "chat" ? "Ask any academic doubt or ask for study hacks..." :
                activeMode === "notes" ? "Type note syllabus topic (e.g. SN2 Mechanism)..." :
                activeMode === "explain" ? "Type topic for simplified intuitive analogies..." : 
                "Type topic to construct customized Multiple Choice quizzes..."
              }
              className="flex-1 bg-slate-900 border border-slate-850 focus:border-indigo-500/80 rounded-2xl py-3.5 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition text-left"
            />

            {/* Submit Send Button pin */}
            <button
              id="ai-assistant-send-btn"
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0"
              title="Submit prompt layout"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          {/* Sub description tag */}
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono select-none px-1">
            <span>Powered by Gemini-3.5-flash AI</span>
            <span>Earn up to +40 XP points per prompt cycle!</span>
          </div>

        </div>

      </div>

    </div>
  );

  // Fallback diagnostic retry trigger
  function handlePromptAgain() {
    setErrorMessage("");
    const lastUserMessage = [...messages].reverse().find(m => m.sender === "user");
    if (lastUserMessage) {
      handleSubmitPrompt(lastUserMessage.text, lastUserMessage.mode);
    }
  }
}
