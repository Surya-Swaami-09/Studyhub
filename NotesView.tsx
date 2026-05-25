import React, { useState, useEffect } from "react";
import { NoteTopic, Flashcard } from "../types";
import { 
  BookOpen, Sparkles, Brain, Loader2, ArrowRight, HelpCircle, 
  Flame, CheckCircle, RefreshCw, Search, Download, Printer, 
  ChevronRight, BookmarkCheck, Star, Sparkle, Clock, Bot, Heart, History, ListFilter, Tag,
  FileText, Award
} from "lucide-react";

interface NotesViewProps {
  onXpEarned: (amount: number) => void;
  onFlashcardCreated: (amount: number) => void;
}

// Helper to dynamically generate rich sample study textbook chapters for any Class + Subject
const generateDynamicChapter = (classLevel: number, subject: string, chapterIndex: number): NoteTopic => {
  let title = "";
  let tags: string[] = [];
  let content = "";
  let preview = "";

  if (subject === "Mathematics" || subject === "Maths") {
    if (chapterIndex === 0) {
      title = classLevel <= 8 ? "Fractions, Decimals & Simplification Masterclass" : classLevel <= 10 ? "Quadratic Equations & Polynomial Solutions" : "Differential Calculus & Rate Laws";
      tags = ["Calculus", "Algebra", "Formulas"];
      preview = `Master core elements of ${title} for Class ${classLevel}. Includes simplified formulas and solved proofs.`;
      content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: Mathematics | Class: ${classLevel} Standard | Unit: 1.0 (Core Analysis)
---

# CHAPTER 1: FOUNDATIONS OF ${title.toUpperCase()}

Welcome to the StudyHub official curriculum study guide. This course summary is specifically tailored to aligned national guidelines for Class ${classLevel}.

## 1. MAIN PEAK CONCEPT

${classLevel <= 8 ? `
Fractions represent dynamic ratios of equal partitions of a single whole structure:
* **Numerator**: How many parts are actively counted.
* **Denominator**: How many equal parts constitute the absolute whole.
* To simplify, execute Division of both coordinates by their Greatest Common Divisor (GCD).
` : classLevel <= 10 ? `
A polynomial of degree 2 is a Quadratic Equation, represented universally as:
$$ax^2 + bx + c = 0 \\quad (a \\neq 0)$$

The roots of this formula are calculated using the Master Quadratic Formula:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

* The Term $D = b^2 - 4ac$ is the **Discriminant**.
* If $D > 0$: Two distinct real roots exist.
* If $D = 0$: Real & coincident singular roots exist.
* If $D < 0$: Conjugate complex roots form.
` : `
Derivatives formulate the exact instantaneous rate of change of variables relative to each other:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$

### Standard Slopes Guide:
* Power Law: $\\frac{d}{dx}[x^n] = n \\cdot x^{n-1}$
* Exponential Law: $\\frac{d}{dx}[e^x] = e^x$
* Product Rule: $(u \\cdot v)' = u'v + uv'$
`}

## 2. HIGH-YIELD SOLVED PROBLEM CASE

**Question**: Evaluate critical coordinates to simplify system behavior under standard board parameters.
1. Formulate the primary equation with given initial boundary constants.
2. Isolate independent factors securely.
3. Solve for $x$ and verify through back-substitution.

**AI Memory Hint**: Look for coordinate symmetries to solve coordinate transformations up to 30% faster!`;
    } else {
      title = classLevel <= 8 ? "Understanding Shapes & Symmetry Laws" : classLevel <= 10 ? "Trigonometric Heights & Trigonometric Ratios" : "Coordinate Vector Spaces & Inner Products";
      tags = ["Geometry", "Coordinate", "Spatial"];
      preview = `Explore formulas, coordinate proofs, and detailed geometric relationships in ${title}.`;
      content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: Mathematics | Class: ${classLevel} Standard | Unit: 2.0 (Applied Practice)
---

# CHAPTER 2: ESSENTIAL APPLICATIONS OF ${title.toUpperCase()}

This analytical summary targets Class ${classLevel} standards to support deep spatial visualization.

## 1. THEORETICAL BLUEPRINT

${classLevel <= 10 ? `
The trigonometric relationships define angles as ratios of right-angled triangle segments:
* $\\sin \\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$
* $\\cos \\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$
* $\\tan \\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{\\sin \\theta}{\\cos \\theta}$

### Essential Identity:
$$\\sin^2 \\theta + \\cos^2 \\theta = 1$$
` : `
A Vector in 3D coordinate space represents a directed segment with both magnitude and orientation:
$$\\mathbf{A} = a_x\\mathbf{i} + a_y\\mathbf{j} + a_z\\mathbf{k}$$

* **Scalar Dot Product**: 
  $$\\mathbf{A} \\cdot \\mathbf{B} = a_x b_x + a_y b_y + a_z b_z = |A||B| \\cos \\theta$$
* **Vector Cross Product**: Generates an orthogonal torque vector.
`}

## 2. MEMORY AND EXAM DRILLS
* Tip: Keep drawing helper triangles to verify trigonometric identities.
* Remember: The sum of interior angles in any polygon is given by:
  $$\\text{Total Angle} = (n - 2) \\times 180^{\\circ}$$`;
    }
  } else if (subject === "Science" || subject === "Physics" || subject === "Chemistry" || subject === "Biology") {
    if (chapterIndex === 0) {
      title = subject === "Physics" ? "Newtonian Dynamics, Energy & Momentum Laws" :
              subject === "Chemistry" ? "Periodic Classifications & Structural Elements" :
              subject === "Biology" ? "Cell Division & Genetic Reproduction Principles" :
              classLevel <= 8 ? "Plant Respiration & Photosynthesis Processes" : "Chemical Formulas & Balanced Equations";
      tags = ["Science", "Atomic", "Newtonian"];
      preview = `Comprehensive standard guidelines, key balanced equations, and structural guides for ${title}.`;
      content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: ${subject} | Class: ${classLevel} Standard | Unit: 1.0 (Foundations)
---

# CHAPTER 1: INTRODUCTORY ANALYSIS OF ${title.toUpperCase()}

A complete high-relevance study summary. Designed to facilitate structured revision for Class ${classLevel} students.

## 1. CORE DISCOVERIES & CONCEPTS

${subject === "Physics" ? `
### Isaac Newton's Three Postulates of Action:
1. **Law of Inertia**: Objects maintain constant velocity unless subjected to external net forces.
2. **Acceleration Dynamics**: 
   $$\\mathbf{F}_{\\text{net}} = m \\cdot \\mathbf{a}$$
3. **Action-Reaction Principle**: Every interaction manifests equal and opposite forces.

* **Friction System**:
  * Static Friction Limit: $f_s \\le \\mu_s \\cdot F_n$
  * Kinetic Friction: $f_k = \\mu_k \\cdot F_n$ (acts dynamically opposite to relative slide direction).
` : subject === "Chemistry" ? `
### Atomic Structures and Valence Patterns:
Atoms establish chemical bonds to stabilize valence shells:
* **Covalent Bonding**: Shared electron pairs between electronegative nonmetals.
* **Ionic Bonding**: Complete transfer of valence charges between electropositive metals and nonmetals.

* **Periodic Law**: Modern physical elements behave as periodic functions of atomic numbers.
` : subject === "Biology" ? `
### Core Genetic Code Transmission:
* Cellular organisms split through balanced reproduction phases:
  * **Mitosis**: Yields two genetically identical diploid somatic daughters for growth.
  * **Meiosis**: Quadruples original cycles to yield four haploid gametes to promote genetic variation.
` : `
### Plant Cellular Energetics:
Green vegetative tissues capture radiant energy using chlorophyll traps:
$$6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$$

* Essential factors for rate limits: Solar intensity, local $\\text{CO}_2$ partial pressure, and hydration levels.
`}

## 2. HIGH-YIELD QUESTIONS FOR BOARD EXAMS
* Draw full free-body diagrams including normal force and static friction representations.
* Balance molecular weights on both sides of chemical equations to guarantee full points.`;
    } else {
      title = subject === "Physics" ? "Electromagnetism, Field Strengths & Induction" :
              subject === "Chemistry" ? "Organic Synthesis & Substitution Kinetics" :
              subject === "Biology" ? "Human Nervous Pathways & Cardiac Control" :
              classLevel <= 8 ? "Exploring Forces, Friction & Simple Hydraulics" : "Optical Reflection, Refraction & Ray Lenses";
      tags = ["Science", "Field", "Optics"];
      preview = `Dive deep into advanced formulas, critical observations, and structural charts for ${title}.`;
      content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: ${subject} | Class: ${classLevel} Standard | Unit: 2.0 (Applied Dynamics)
---

# CHAPTER 2: DEEP DIVE INTO ${title.toUpperCase()}

Essential references compiled for Class ${classLevel} diagnostic exams.

## 1. ADVANCED CONCEPTS

${subject === "Physics" ? `
### Electromagnetism & Field Flux:
* **Ohm's Constant Resistor Law**: $V = I \\cdot R$
* **Magnetic Force Equation on Moving Charge**:
  $$\\mathbf{F} = q(\\mathbf{v} \\times \\mathbf{B})$$
* **Faraday's Law of Induction**:
  $$\\mathcal{E} = -\\frac{d\\Phi_B}{dt}$$
` : subject === "Chemistry" ? `
### Nucleophilic Substitution Pathways (SN1 vs SN2):
* **SN1 Mechanism**: Two-step pathway, forms a carbocation intermediate. Rate depends strictly on substrate concentration. Creates racemic configurations.
* **SN2 Mechanism**: One-step concerted back-side attack. Promotes complete inversion of stereochemistry.
` : subject === "Biology" ? `
### Hormonal Coordinators & Nerve Pulses:
* Neurotransmitters pass across synapses through action potentials.
* The cardiac cycle operates under strict pacemaker control (Sinoatrial node).
` : `
### Ray Wave Lens Equations:
* Mirror Formula: $\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$
* Thin Lens Formula: $\\frac{1}{f} = \\frac{1}{v} - \\frac{1}{u}$
* Refractive Index: $n = c / v$ (ratio of velocity in vacuum versus medium).
`}

## 2. BOARD RATED STUDY CHEATSHEETS
* **Active recall reminder**: Use the right-hand rule to easily identify spatial magnetic force vector cross-products quickly!`;
    }
  } else if (subject === "English") {
    title = chapterIndex === 0 ? "Narrative Comprehension & Grammar Syntaxes" : "Classical Poetry Analysis & Stylistic Prose";
    tags = ["English", "Grammar", "Syntax"];
    preview = `Refine report writings, grammatical clauses, and critical literary appreciation strategies.`;
    content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: English | Class: ${classLevel} Standard | Unit: ${chapterIndex + 1}.0
---

# CHAPTER ${chapterIndex + 1}: ${title.toUpperCase()}

Master the mechanics of reading comprehension and written communication for Class ${classLevel} boards.

## 1. ESSENTIAL RULES OF COMPOSITION
* **Voice Active & Passive**:
  * *Active*: "The student scored outstanding grades."
  * *Passive*: "Outstanding grades were scored by the student."
* **Indirect Speeches**: Maintain historical tenses back-shift rules whenever reporting dialogue.

## 2. HIGH-YIELD STRATEGY FOR READING COMPREHENSION
1. Spend the first 2 minutes scanning headings and the final questions first.
2. Mark active verbs in the prompt to locate key points quickly.
3. Write precise sentences without fluff.`;
  } else if (subject === "Hindi") {
    title = chapterIndex === 0 ? "Hindi Vyakaran: Samas & Alankar" : "Classic Prose, Vocabulary & Essay Drafting";
    tags = ["Hindi", "Vyakaran", "Literature"];
    preview = `Comprehensive Hindi grammar guidelines, compound words definitions, and exam blueprints.`;
    content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: Hindi | Class: ${classLevel} Standard | Unit: ${chapterIndex + 1}.0
---

# अध्याय ${chapterIndex + 1}: ${title}

Class ${classLevel} बोर्ड परीक्षा के लिए विशेष अध्ययन पत्रिका।

## 1. मुख्य व्याकरण नियम (Samas & Alankar)
* **समास**: दो या दो से अधिक शब्दों के मेल से बने नए शब्द को समास कहते हैं।
  * *द्वंद्व समास*: दोनों पद प्रधान (जैसे - माता-पिता)
  * *बहुव्रीहि समास*: कोई अन्य पद प्रधान (जैसे - लंबोदर)
* **अलंकार**: काव्य की शोभा बढ़ाने वाले तत्वों को अलंकार कहते हैं।
  * *अनुप्रास*: वर्णों की पुनरावृत्ति।
  * *रूपक*: उपमेय में उपमान का अभेद आरोप।

## 2. परीक्षा उपयोगी सुझाव
* गद्यांश को हल करते समय मुख्य भावों को रेखांकित करें।
* सुंदर लेखनी और स्वच्छ वर्तनी के अतिरिक्त अंक प्राप्त होते हैं।`;
  } else if (subject === "Social Science" || subject === "Economics") {
    title = chapterIndex === 0 ? "Resource Management, Geopolitics & Earth Systems" : "Fiscal Income Metrics & Democratic Governance";
    tags = [subject, "Economics", "History"];
    preview = `Analyze historical events, resource distributions, and crucial formulas of aggregate growth parameters.`;
    content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: ${subject} | Class: ${classLevel} Standard | Unit: ${chapterIndex + 1}.0
---

# CHAPTER ${chapterIndex + 1}: ${title.toUpperCase()}

A targeted curriculum outline to support Class ${classLevel} final syllabus prep.

## 1. RESOURCE ALLOCATIONS & GEOGRAPHY
* **Sustainable Development**: Utilizing current territorial inputs without compromising next-generation outputs.
* **National Income Multipliers**:
  $$Y = C + I + G + (X - M)$$
  
  $$\\text{Multiplier } (K) = \\frac{1}{1 - \\text{MPC}}$$

## 2. IMPORTANT BOARD MEMORIES
* Bullet lists are much more effective than dense paragraphs.
* Always outline key dates, map coordinates, and legislative acts prominently in your answers.`;
  } else if (subject === "Accountancy" || subject === "Business Studies") {
    title = chapterIndex === 0 ? "Financial Ledger Entries & Balance Sheets" : "Principles of Management & Strategic Planning";
    tags = [subject, "Finance", "Management"];
    preview = `Double-entry guidelines, partnership balance sheets, Fayol's 14 principles, and strategic workflows.`;
    content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: ${subject} | Class: ${classLevel} Standard | Unit: ${chapterIndex + 1}.0
---

# CHAPTER ${chapterIndex + 1}: ${title.toUpperCase()}

Maximize your technical commerce skills for Class ${classLevel} exams.

## 1. THE FOUNDATIONAL ACCOUNTING EQUATION
Every transaction impacts at least two balance columns:
$$\\text{Assets} = \\text{Liabilities} + \\text{Equity}$$

* **Debit Rules**: Increase in Assets & Expenses.
* **Credit Rules**: Increase in Liabilities, Equity & Revenues.

## 2. THE 14 PRINCIPLES OF MANAGEMENT (FAYOL)
Henry Fayol defined essential structures to synchronize workflow:
* **Division of Work**: Specialization increases output by making employees more efficient.
* **Unity of Command**: Employees should receive directives from only one manager to prevent confusion.
* **Subordination of Individual Interests**: Core business objectives take absolute priority over individual wishes.`;
  } else {
    title = `Introductory Syllabus in ${subject}`;
    tags = ["General", "Basic"];
    preview = `Step-by-step guides, summaries, and structural tips for scoring in ${subject}.`;
    content = `---
## STUDYHUB ACADEMIC WORKBOOK
### Subject: ${subject} | Class: ${classLevel} Standard | Unit: ${chapterIndex + 1}.0
---

# CHAPTER ${chapterIndex + 1}: ${title.toUpperCase()}

Syllabus resource targeting Class ${classLevel} students.

## 1. KEY TAKEAWAYS
* Keep studying daily study sheets for 20 minutes to convert short-term study links into permanent neural memory.
* Challenge yourself with randomized mock tests on a 3-day frequency pattern.

## 2. RECOMMENDED READING CHANNELS
* Read original summary books and synthesize notes regularly.`;
  }

  return {
    id: `note-${subject.toLowerCase().substring(0, 3)}-c${classLevel}-${chapterIndex + 1}`,
    title,
    subject,
    preview,
    content,
    tags,
    classLevel
  };
};

export default function NotesView({ onXpEarned, onFlashcardCreated }: NotesViewProps) {
  // Filters states
  const [selectedClass, setSelectedClass] = useState<number>(10);
  const [selectedStream, setSelectedStream] = useState<"Science" | "Commerce">("Science");
  const [selectedSubject, setSelectedSubject] = useState<string>("Mathematics");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>("All"); // "All", "1", "2", "3"
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"text" | "pdf">("text");

  // Lists & storage states
  const [activeChapters, setActiveChapters] = useState<NoteTopic[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteTopic | null>(null);
  const [bookmarks, setBookmarks] = useState<NoteTopic[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<NoteTopic[]>([]);

  // AI interactive workspace helper states
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [generatingCards, setGeneratingCards] = useState(false);
  const [revealedCardIndexes, setRevealedCardIndexes] = useState<number[]>([]);
  
  const [customQuestion, setCustomQuestion] = useState("");
  const [aiClarification, setAiClarification] = useState("");
  const [loadingClarification, setLoadingClarification] = useState(false);

  // Load bookmarks and recently viewed on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("studyhub_bookmarked_notes");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Failed loading bookmarks", e);
      }
    }

    const savedViewed = localStorage.getItem("studyhub_recently_viewed_notes");
    if (savedViewed) {
      try {
        setRecentlyViewed(JSON.parse(savedViewed));
      } catch (e) {
        console.error("Failed loading recently viewed notes", e);
      }
    }

    // Handle interactive dashboard redirect selection parameters
    const autoNoteId = localStorage.getItem("studyhub_auto_select_note_id");
    const autoClass = localStorage.getItem("studyhub_auto_select_class");
    const autoSub = localStorage.getItem("studyhub_auto_select_subject");
    if (autoClass && autoSub) {
      setSelectedClass(Number(autoClass));
      setSelectedSubject(autoSub);
      localStorage.removeItem("studyhub_auto_select_note_id");
      localStorage.removeItem("studyhub_auto_select_class");
      localStorage.removeItem("studyhub_auto_select_subject");
    }
  }, []);

  // Determine dynamic available subjects based on Class and Stream selection rules
  const getAvailableSubjects = (cls: number, stream: "Science" | "Commerce") => {
    if (cls >= 5 && cls <= 10) {
      return ["Mathematics", "Science", "English", "Hindi", "Social Science"];
    } else {
      // Classes 11 and 12 require streams
      if (stream === "Science") {
        return ["Physics", "Chemistry", "Mathematics", "Biology", "English"];
      } else {
        return ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"];
      }
    }
  };

  // Re-build active chapters list whenever any filter parameters change
  useEffect(() => {
    const subjectsList = getAvailableSubjects(selectedClass, selectedStream);
    
    // Auto-adjust subject selection if current active subject isn't valid under new class/stream
    let activeSub = selectedSubject;
    if (!subjectsList.includes(selectedSubject)) {
      activeSub = subjectsList[0];
      setSelectedSubject(activeSub);
    }

    // Determine initial set of notes to filter
    let baseNotes: NoteTopic[] = [];
    if (showBookmarksOnly) {
      baseNotes = bookmarks;
    } else {
      // Generate 3 sample complete chapters per class and subject to provide massive, highly robust resource data
      baseNotes.push(generateDynamicChapter(selectedClass, activeSub, 0));
      baseNotes.push(generateDynamicChapter(selectedClass, activeSub, 1));
      baseNotes.push(generateDynamicChapter(selectedClass, activeSub, 2));
    }

    // Filter by specific Chapter Number (e.g. Chapter 1, 2, 3)
    let filtered = baseNotes;
    if (selectedChapterFilter !== "All") {
      const chapterNum = parseInt(selectedChapterFilter, 10);
      filtered = baseNotes.filter((note) => {
        return note.id.endsWith(`-${chapterNum}`) || note.title.toLowerCase().includes(`chapter ${chapterNum}`);
      });
    }

    // Support searching inside titles, tags, content
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (chap) =>
          chap.title.toLowerCase().includes(q) ||
          chap.preview.toLowerCase().includes(q) ||
          chap.content.toLowerCase().includes(q) ||
          chap.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    setActiveChapters(filtered);
    
    // Auto select first match if possible or clear
    if (filtered.length > 0) {
      // Keep selected is possible or default first
      const exists = filtered.find(n => n.id === selectedNote?.id);
      setSelectedNote(exists || filtered[0]);
    } else {
      setSelectedNote(null);
    }

    // Clean old workspaces
    setFlashcards([]);
    setRevealedCardIndexes([]);
    setAiClarification("");
    setCustomQuestion("");
  }, [selectedClass, selectedStream, selectedSubject, searchQuery, selectedChapterFilter, showBookmarksOnly, bookmarks]);

  const handleSelectNote = (note: NoteTopic) => {
    setSelectedNote(note);
    setFlashcards([]);
    setRevealedCardIndexes([]);
    setAiClarification("");
    setCustomQuestion("");
    setViewMode("text");

    // Add to recently viewed list
    setRecentlyViewed((prev) => {
      const filtered = prev.filter(item => item.id !== note.id);
      const updated = [note, ...filtered].slice(0, 6);
      localStorage.setItem("studyhub_recently_viewed_notes", JSON.stringify(updated));
      return updated;
    });
  };

  const handleToggleBookmark = (note: NoteTopic) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some(item => item.id === note.id);
      let updated;
      if (isBookmarked) {
        updated = prev.filter(item => item.id !== note.id);
      } else {
        updated = [note, ...prev];
        onXpEarned(10); // Reward bookmark adding!
      }
      localStorage.setItem("studyhub_bookmarked_notes", JSON.stringify(updated));
      return updated;
    });
  };

  // Premium PDF / Print generation handler
  const handlePrintPdf = () => {
    if (!selectedNote) return;

    onXpEarned(10); // Reward active workbook offline syncing!

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>StudyHub AI - ${selectedNote.title} (Class ${selectedClass})</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 50px; 
              color: #1e293b; 
              background: #ffffff; 
              line-height: 1.7;
            }
            .header-block { 
              border-bottom: 3px solid #6366f1; 
              padding-bottom: 25px; 
              margin-bottom: 35px; 
            }
            .brand { 
              font-size: 14px; 
              font-weight: 800; 
              color: #6366f1; 
              letter-spacing: 0.1em; 
              text-transform: uppercase; 
              margin-bottom: 5px;
            }
            .title { 
              font-size: 28px; 
              font-weight: 800; 
              color: #0f172a; 
              margin: 0; 
              line-height: 1.2;
            }
            .metadata { 
              font-size: 12px; 
              color: #64748b; 
              margin-top: 10px; 
              font-weight: 600;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
            .tag {
              display: inline-block;
              background: #f1f5f9;
              color: #475569;
              padding: 3px 10px;
              border-radius: 5px;
              font-size: 11px;
              margin-right: 6px;
              font-weight: bold;
            }
            .content { 
              font-size: 14px; 
              color: #334155; 
              white-space: pre-wrap; 
            }
            h1, h2, h3 { 
              color: #0f172a; 
              margin-top: 30px; 
              margin-bottom: 15px; 
              font-weight: 800;
            }
            h1 { font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
            h2 { font-size: 16px; }
            h3 { font-size: 14px; }
            code { 
              font-family: 'JetBrains Mono', monospace; 
              background: #f8fafc; 
              padding: 2px 6px; 
              border-radius: 4px; 
              font-size: 12px; 
              color: #e11d48;
            }
            .tip-box {
              background: #f8fafc;
              border-left: 4px solid #6366f1;
              padding: 15px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
              font-size: 13px;
              color: #475569;
            }
            .footer { 
              margin-top: 60px; 
              font-size: 11px; 
              color: #94a3b8; 
              border-top: 1px solid #f1f5f9; 
              padding-top: 20px; 
              text-align: center; 
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-block">
            <div class="brand">🚀 StudyHub AI Smart Notes System</div>
            <div class="title">${selectedNote.title}</div>
            <div class="metadata">
              Class Grade Level: ${selectedNote.classLevel} Standard &bull; Subject: ${selectedNote.subject} &bull; Verified Syllabus
            </div>
            <div style="margin-top: 12px;">
              ${selectedNote.tags.map(t => `<span class="tag">#${t}</span>`).join("")}
            </div>
          </div>
          <div class="content">${selectedNote.content}</div>
          <div class="tip-box">
            <strong>Active Recall Strategy</strong>: For maximum recall retention, review this study roadmap 24 hours after your first reading session, and immediately challenge yourself using StudyHub AI Mock Quizzes!
          </div>
          <div class="footer">
            StudyHub AI Portal - Your Ultimate Exam Prep Assistant. Document ID: ${selectedNote.id}. Saved via Print/PDF. All rights reserved.
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  };

  // Alternative HTML Document study card downloader
  const handleDownloadHtmlFile = () => {
    if (!selectedNote) return;

    onXpEarned(15); // Reward downloading!

    const docContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>StudyHub - ${selectedNote.title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; color: #334155; background: #fafafa; }
            .card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 800px; margin: 0 auto; }
            h1 { color: #1e1b4b; }
            .meta { color: #6366f1; font-weight: bold; font-size: 12px; text-transform: uppercase; margin-bottom: 20px; }
            pre { background: #f8fafc; padding: 15px; border-radius: 8px; font-family: monospace; overflow-x: auto; border: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="meta">StudyHub Study Booklet - Class ${selectedClass} | Subject: ${selectedNote.subject}</div>
            <h1>${selectedNote.title}</h1>
            <div style="white-space: pre-wrap;">${selectedNote.content}</div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([docContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.title.replace(/\s+/g, "_")}_Class_${selectedClass}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Server-side AI Flashcard integration
  const handleGenerateFlashcards = async () => {
    if (!selectedNote) return;

    setGeneratingCards(true);
    setFlashcards([]);
    setRevealedCardIndexes([]);

    try {
      const res = await fetch("/api/ai/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedNote.content })
      });

      if (!res.ok) throw new Error();

      const cards = await res.json();
      setFlashcards(cards);
      onXpEarned(25); // Bonus study setup reward!
      onFlashcardCreated(cards.length);
    } catch (err) {
      // Fallback
      setFlashcards([
        { question: `What is the core target in ${selectedNote.title}?`, answer: "Maximize revision of key definitions in this note." },
        { question: "How does StudyHub AI recommend memorizing this?", answer: "Leverage standard active recall cycles and try again." }
      ]);
    } finally {
      setGeneratingCards(false);
    }
  };

  // Note-specific doubt solver 
  const handleClarifyNote = async (presetPrompt?: string) => {
    if (!selectedNote) return;
    
    const prompt = presetPrompt || customQuestion || `Explain this concept in simple terms: ${selectedNote.title}`;
    if (!prompt.trim()) return;

    setLoadingClarification(true);
    setAiClarification("");

    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Based on this textbook chapter note summary of Class ${selectedClass} ${selectedNote.subject}:
"${selectedNote.content}"

Explain and expand on the student's question: "${prompt}"
Keep it highly pedagogical, outstandingly positive, clear, and well-organized with simple bullet points.`,
        })
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setAiClarification(data.text);
      onXpEarned(10);
    } catch (err) {
      setAiClarification("Our active AI model returned a temporary service notice. Recommended Action: Please memorize formulas and run standard active recall grids.");
    } finally {
      setLoadingClarification(false);
    }
  };

  const toggleCardReveal = (idx: number) => {
    if (revealedCardIndexes.includes(idx)) {
      setRevealedCardIndexes(revealedCardIndexes.filter(i => i !== idx));
    } else {
      setRevealedCardIndexes([...revealedCardIndexes, idx]);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Visual Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="text-indigo-400 h-6 w-6" />
              Syllabus Study Chapters
            </h1>
            <p className="text-sm text-slate-400">
              Access curated board summaries, select your class, generate customized recall flashcards, and instantly download print-ready PDFs.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center gap-1.5 shrink-0 select-none">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" />
            Active Reward: Earn +25 XP with AI Flashcards!
          </div>
        </div>
      </div>

       {/* FILTER CONTROL PANEL WIDGET */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6">
        
        {/* Step 1: Select Class Grade & Bookmark Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-widest text-slate-500">
              <span>Step 1: Choose Academic Class</span>
              <span className="text-sky-400 font-mono">Classes 5 to 12</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[5, 6, 7, 8, 9, 10, 11, 12].map((cls) => (
                <button
                  key={cls}
                  id={`class-pill-${cls}`}
                  onClick={() => {
                    setSelectedClass(cls);
                    setShowBookmarksOnly(false); // Reset to regular class notes
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black border transition-all duration-350 cursor-pointer ${
                    selectedClass === cls && !showBookmarksOnly
                      ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:border-slate-750"
                  }`}
                >
                  Class {cls}
                </button>
              ))}
            </div>
          </div>

          {/* New Bookmarks Mode Toggle with Badge Count */}
          <div className="md:self-end shrink-0">
            <button
              onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                showBookmarksOnly
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-lg shadow-amber-500/5 font-extrabold"
                  : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
              }`}
            >
              <Star className={`h-4.5 w-4.5 ${showBookmarksOnly ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
              <span>Show Saved Bookmarks ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Step 1.5: Stream Toggle Selector for Classes 11 & 12 */}
        {selectedClass >= 11 && !showBookmarksOnly && (
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-850/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
            <div className="space-y-0.5 text-left">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Select Advanced Study Stream</h4>
              <p className="text-[11px] text-slate-400">Choose Science or Commerce path to load corresponding curriculum subjects.</p>
            </div>
            
            <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0">
              <button
                id="stream-science-btn"
                onClick={() => setSelectedStream("Science")}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedStream === "Science"
                    ? "bg-sky-600/20 border border-sky-500/30 text-sky-450 shadow-md"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                Science Stream
              </button>
              <button
                id="stream-commerce-btn"
                onClick={() => setSelectedStream("Commerce")}
                className={`px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  selectedStream === "Commerce"
                    ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-455 shadow-md"
                    : "text-slate-400 hover:text-white border border-transparent"
                }`}
              >
                Commerce Stream
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-3 border-t border-slate-850 items-end">
          
          {/* Step 2: Subject selection pills list */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-left text-xs font-extrabold uppercase tracking-wider text-slate-500">
              {showBookmarksOnly ? "Filter Bookmarks by Subject" : "Step 2: Subject Focus"}
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {getAvailableSubjects(selectedClass, selectedStream).map((sub) => (
                <button
                  key={sub}
                  id={`subject-pill-${sub.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-400 shadow-sm"
                      : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-950/60"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* New Step 4: Chapter Index filter selector */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-left text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              Chapter Filter
            </h3>
            <select
              value={selectedChapterFilter}
              onChange={(e) => setSelectedChapterFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              <option value="All">All Chapters</option>
              <option value="1">Chapter 1</option>
              <option value="2">Chapter 2</option>
              <option value="3">Chapter 3</option>
            </select>
          </div>

          {/* Step 3: Search bar input */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-left text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Search inside Content
            </h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500 pointer-events-none" />
              <input
                id="search-notes-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: Calculus, SN1, Newtonian..."
                className="w-full bg-slate-950 border border-slate-850 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-550 text-left"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-500 hover:text-white font-bold"
                >
                  ×
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MASTER SPLIT PANEL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Chapters / Units Lists & Recently Viewed sidebar */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
              <span>{showBookmarksOnly ? "Saved Bookmarks" : "Syllabus Chapters"} ({activeChapters.length})</span>
              <span>Class {selectedClass}</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activeChapters.map((note, index) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    id={`chapter-card-${note.id}`}
                    onClick={() => handleSelectNote(note)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition duration-200 ${
                      isSelected
                        ? "bg-slate-850 border-indigo-500 shadow-md shadow-indigo-400/5 text-white"
                        : "bg-slate-900 border-slate-850 hover:border-slate-750 text-slate-300 hover:bg-slate-900/80"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] font-extrabold uppercase font-mono tracking-wider text-indigo-400">
                      <span>{note.subject}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-450 font-mono">
                        UNIT {index + 1}
                      </span>
                    </div>
                    
                    <h3 id={`chapter-title-${note.id}`} className="font-extrabold text-sm text-white mt-1.5 tracking-tight hover:text-indigo-300">
                      {note.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {note.preview}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-3.5">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] bg-slate-950 font-bold text-slate-400 px-2 py-0.5 rounded border border-slate-850">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}

              {activeChapters.length === 0 && (
                <div className="p-8 text-center bg-slate-900 border border-slate-850 rounded-2xl text-slate-500 text-xs text-left leading-relaxed">
                  No syllabus chapters found matching your filter criteria. Try resetting.
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed Sidebar list widget */}
          {recentlyViewed.length > 0 && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 space-y-3 animate-fadeIn">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <History className="h-4 w-4 text-indigo-400 shrink-0" />
                Recently Viewed Notes
              </h3>

              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {recentlyViewed.map((viewNote) => {
                  const isCurrent = selectedNote?.id === viewNote.id;
                  return (
                    <button
                      key={viewNote.id}
                      onClick={() => handleSelectNote(viewNote)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        isCurrent 
                          ? "bg-indigo-650/10 border-indigo-500/40 text-white font-semibold"
                          : "bg-slate-950/40 border-slate-850/60 hover:border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold truncate text-[11px]">{viewNote.title}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">Class {viewNote.classLevel} &bull; {viewNote.subject}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right Column (Span 2): Active Chapter Reader & Interactive AI Workspace */}
        <div className="lg:col-span-8 space-y-6 text-left">
          {selectedNote ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 animate-fadeIn relative">
              
              {/* Reader Action Ribbon Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-md">
                      Class {selectedClass}Standard &bull; {selectedNote.subject} Booklet
                    </span>
                    
                    {/* Inline Star toggle bookmark button */}
                    <button
                      onClick={() => handleToggleBookmark(selectedNote)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        bookmarks.some(item => item.id === selectedNote.id)
                          ? "bg-amber-500/20 border-amber-500/40 text-amber-400"
                          : "bg-slate-950 border-slate-850 text-slate-550 hover:text-slate-350"
                      }`}
                      title={bookmarks.some(item => item.id === selectedNote.id) ? "Bookmarked note" : "Bookmark this note"}
                    >
                      <Star className={`h-3.5 w-3.5 ${bookmarks.some(item => item.id === selectedNote.id) ? "fill-amber-400" : ""}`} />
                    </button>
                  </div>
                  
                  <h2 id="note-inspect-title" className="text-xl sm:text-2xl font-black text-white pt-1">{selectedNote.title}</h2>
                </div>

                {/* PDF & HTML Downloader Button group */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    id="download-html-doc-btn"
                    onClick={handleDownloadHtmlFile}
                    title="Download Offline HTML Study Sheet"
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    id="download-pdf-btn"
                    onClick={handlePrintPdf}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
                  >
                    <Printer className="h-4 w-4" />
                    Download PDF Booklet
                  </button>
                </div>
              </div>

              {/* Toggle segment for View Mode */}
              <div className="flex items-center gap-3 bg-slate-950 p-1 rounded-xl w-fit border border-slate-850">
                <button
                  type="button"
                  onClick={() => setViewMode("text")}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === "text"
                      ? "bg-indigo-605 bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Regular Reader
                </button>
                <button
                  type="button"
                  id="pdf-preview-tab-btn"
                  onClick={() => setViewMode("pdf")}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    viewMode === "pdf"
                      ? "bg-indigo-605 bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-slate-100" />
                  Live PDF Preview
                </button>
              </div>

              {/* Note Content Panel */}
              {viewMode === "text" ? (
                <div id="note-text-reader" className="text-xs sm:text-sm text-slate-350 leading-relaxed space-y-4 whitespace-pre-wrap font-sans text-left min-h-[140px] select-text selection:bg-indigo-600 selection:text-white">
                  {selectedNote.content}
                </div>
              ) : (
                <div id="pdf-preview-pane" className="animate-fadeIn p-4 sm:p-8 bg-white text-slate-800 rounded-2xl shadow-inner border border-slate-200 relative overflow-hidden select-text font-serif">
                  
                  {/* Subtle diagonal background watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none rotate-[-30deg]">
                    <div className="text-5xl sm:text-7xl font-sans font-black tracking-widest text-[#6366f1] text-center">
                      STUDYHUB AI COPY<br />
                      VERIFIED CURRICULUM
                    </div>
                  </div>

                  {/* PDF Document body layout */}
                  <div className="relative z-10 space-y-6">
                    {/* Official Letterhead Header */}
                    <div className="border-b-2 border-indigo-605 border-indigo-600 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left">
                      <div className="text-left">
                        <div className="text-[10px] font-black tracking-widest text-indigo-600 font-sans uppercase">
                          STUDYHUB ACADEMIC WORKBOOK PLATFORM
                        </div>
                        <h3 className="font-extrabold text-xs text-slate-500 font-sans tracking-wide mt-0.5 uppercase">
                          Official Board Syllabus Directory
                        </h3>
                      </div>
                      
                      <div className="text-right sm:text-right text-[9px] font-mono text-slate-400 bg-slate-105 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        DOC-ID: {selectedNote.id.toUpperCase()}
                      </div>
                    </div>

                    {/* Meta section */}
                    <div className="text-left font-sans text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-wrap gap-x-4 gap-y-2 justify-between">
                      <div>
                        <span className="text-slate-450 font-bold uppercase text-[9px] block">STANDARD CLASS:</span>
                        <span className="font-black text-slate-700">Grade Level {selectedClass}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 font-bold uppercase text-[9px] block">SUBJECT:</span>
                        <span className="font-black text-slate-700">{selectedNote.subject}</span>
                      </div>
                      <div>
                        <span className="text-slate-450 font-bold uppercase text-[9px] block">VERIFICATION:</span>
                        <span className="font-black text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 inline text-emerald-500" />
                          Certified Approved
                        </span>
                      </div>
                    </div>

                    {/* Book Title */}
                    <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <h2 className="text-lg sm:text-xl font-black text-slate-905 text-slate-900 tracking-tight leading-tight px-4 font-sans">
                        {selectedNote.title}
                      </h2>
                      <div className="flex flex-wrap gap-1 mt-2 justify-center">
                        {selectedNote.tags.map((tag, i) => (
                          <span key={i} className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold font-sans px-2 py-0.5 rounded">
                            #{tag.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Core Notebook Content compiled */}
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed text-left whitespace-pre-wrap pl-1 sm:pl-3 pr-1 space-y-4">
                      {selectedNote.content}
                    </div>

                    {/* Pedagogical disclaimer note */}
                    <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-900 rounded-r-lg p-4 text-[11px] leading-relaxed text-left font-sans shadow-sm">
                      <strong className="text-amber-800 font-extrabold flex items-center gap-1 mb-1">
                        ⚠️ Official Practice Guideline
                      </strong>
                      This academic summary is formatted according to standard testing evaluation rules. Users can download, print, or bookmark this notebook using standard offline study tools.
                    </div>

                    {/* Bottom stamps, certificate and signatures area */}
                    <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left font-sans text-[10px] text-slate-400">
                        <p>© 2026 StudyHub AI. Saved on {new Date().toLocaleDateString()}</p>
                        <p className="mt-0.5 font-mono text-[9px]">A4 Format &bull; Certified Study Material</p>
                      </div>

                      <div className="flex items-center gap-2 border border-indigo-100 p-2 rounded-xl bg-indigo-50 font-sans pointer-events-none select-none">
                        <Award className="h-5 w-5 text-indigo-600 animate-pulse shrink-0" />
                        <div className="text-left">
                          <p className="text-[9px] font-black text-indigo-600">STUDYHUB AI</p>
                          <p className="text-[8px] font-extrabold text-slate-500 leading-none">VERIFIED COMPILER</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* STUDYHUB INTERACTIVE AI SPLIT COMPANION */}
              <div className="pt-8 border-t border-slate-850 space-y-8">
                
                {/* AI Auxiliary Feature 1: Flashcards Creator */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/10">
                        <Brain className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                          AI Memory Flashcards Generator
                          <Sparkle className="h-3 w-3 text-yellow-400 fill-current animate-pulse" />
                        </h4>
                        <p className="text-[11px] text-slate-400">Convert standard chapter text into interactive quick-recall cards.</p>
                      </div>
                    </div>

                    <button
                      id="generate-flashcards-btn"
                      onClick={handleGenerateFlashcards}
                      disabled={generatingCards}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl transition cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
                    >
                      {generatingCards ? (
                        <>
                          <Loader2 className="animate-spin h-3.5 w-3.5" />
                          Running AI Extraction...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5" />
                          {flashcards.length > 0 ? "Regenerate Flashcards" : "Assemble Flashcards (+25 XP)"}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Flashcards rendering list wrapper */}
                  {flashcards.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-fadeIn">
                      {flashcards.map((card, idx) => {
                        const isRevealed = revealedCardIndexes.includes(idx);
                        return (
                          <div
                            key={idx}
                            id={`flashcard-${idx}`}
                            onClick={() => toggleCardReveal(idx)}
                            className={`p-4 rounded-xl border text-left cursor-pointer transition-all min-h-[130px] flex flex-col justify-between ${
                              isRevealed 
                                ? "bg-indigo-500/5 border-indigo-500/30 text-white" 
                                : "bg-slate-950/60 border-slate-850/80 hover:border-slate-700 text-slate-350"
                            }`}
                          >
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider flex items-center gap-1">
                                <BookmarkCheck className="h-3 w-3 text-indigo-400" />
                                CARD {idx + 1}
                              </span>
                              <p className="text-xs text-white font-bold tracking-tight">
                                {card.question}
                              </p>
                            </div>

                            <div className="border-t border-slate-850 pt-2 mt-3 flex justify-between items-center text-[10px]">
                              <span className="text-indigo-400 font-extrabold uppercase">
                                {isRevealed ? "ANSWER ACTIVE" : "CLICK TO REVEAL"}
                              </span>
                              <RefreshCw className={`h-3 w-3 text-slate-500 ${isRevealed ? "rotate-90 text-indigo-455" : ""}`} />
                            </div>

                            {isRevealed && (
                              <div className="mt-2 text-xs text-slate-300 bg-slate-950 border border-indigo-500/10 p-2.5 rounded-lg text-left italic font-medium leading-relaxed">
                                {card.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* AI Auxiliary Feature 2: Explainer / Ask AI */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/10">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white">Ask AI Doubt Solver</h4>
                      <p className="text-[11px] text-slate-400">Submit queries or solve standard numerical derivations using textbook reference limits.</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      id="custom-ai-query-input"
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Ex: Explain key derivations, suggest study mnemonic, etc."
                      className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 search-text-align"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleClarifyNote();
                      }}
                    />
                    <button
                      id="ask-ai-submit-btn"
                      onClick={() => handleClarifyNote()}
                      disabled={loadingClarification || !customQuestion.trim()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-950 disabled:text-slate-650 border border-slate-700 text-white text-xs font-black rounded-xl transition cursor-pointer shrink-0"
                    >
                      {loadingClarification ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        "Ask Expert"
                      )}
                    </button>
                  </div>

                  {/* Doubt Solving Suggestion Presets */}
                  <div className="flex flex-wrap gap-2 pt-1.5">
                    <button
                      onClick={() => handleClarifyNote("Write a bullet list of ultimate exam takeaways from this note summary.")}
                      className="text-[10px] text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-705 rounded-lg px-2.5 py-1 transition cursor-pointer font-bold"
                    >
                      "Summarize Ultimate Key Takeaways"
                    </button>
                    <button
                      onClick={() => handleClarifyNote("Help me formulate a creative memory mnemonic to recall key constants and definitions.")}
                      className="text-[10px] text-slate-400 hover:text-white bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-705 rounded-lg px-2.5 py-1 transition cursor-pointer font-bold"
                    >
                      "Give Me an Active Memory Mnemonic"
                    </button>
                  </div>

                  {/* AI response widget screen */}
                  {(aiClarification || loadingClarification) && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 space-y-3 text-left animate-fadeIn">
                      <div className="flex justify-between items-center text-[10px] font-bold text-sky-400 uppercase tracking-widest border-b border-slate-900 pb-2">
                        <span className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current animate-spin-slow" />
                          StudyHub AI Scholar Clarification
                        </span>
                        <span>REFERENCE: {selectedNote.id.toUpperCase()}</span>
                      </div>

                      {loadingClarification ? (
                        <div className="py-6 flex flex-col items-center justify-center space-y-2.5 text-xs text-slate-500 animate-pulse">
                          <Loader2 className="animate-spin h-6 w-6 text-sky-400" />
                          <span>Assembling textbook proofs & references...</span>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line text-left">
                          {aiClarification}
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-center items-center gap-2">
              <BookOpen className="h-10 w-10 text-slate-600 mb-2 animate-bounce" />
              <p className="font-extrabold text-sm text-slate-300">No active book selected</p>
              <p className="text-xs text-slate-500 max-w-sm">Please select a syllabus chapter booklet from the left column layout to begin reading.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
