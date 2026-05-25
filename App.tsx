import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import ClassesView from "./components/ClassesView";
import SubjectsView from "./components/SubjectsView";
import NotesView from "./components/NotesView";
import PyqsAndMockTestsView from "./components/PyqsAndMockTestsView";
import AiAssistantView from "./components/AiAssistantView";
import AuthModal from "./components/AuthModal";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  
  // Gamified progression state
  const [streakCount, setStreakCount] = useState<number>(3);
  const [xpPoints, setXpPoints] = useState<number>(120);
  const [quizzesTaken, setQuizzesTaken] = useState<number>(0);
  const [flashcardsCreated, setFlashcardsCreated] = useState<number>(0);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<{ email: string } | null>(() => {
    const savedUser = localStorage.getItem("studyhub_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed parsing saved user session:", e);
      }
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");

  // Sync state values with localStorage on load
  useEffect(() => {
    const savedStreak = localStorage.getItem("studyhub_streak_count");
    if (savedStreak) setStreakCount(parseInt(savedStreak, 10));

    const savedXp = localStorage.getItem("studyhub_xp_points");
    if (savedXp) setXpPoints(parseInt(savedXp, 10));

    const savedQuizzesObj = localStorage.getItem("studyhub_quizzes_taken");
    if (savedQuizzesObj) setQuizzesTaken(parseInt(savedQuizzesObj, 10));

    const savedCardsObj = localStorage.getItem("studyhub_flashcards_created");
    if (savedCardsObj) setFlashcardsCreated(parseInt(savedCardsObj, 10));
  }, [currentUser]);

  // Read latest local progress metrics to save/sync
  const gatherLocalProgress = () => {
    return {
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
  };

  // Background Progress Syncer across devices for logged-in users
  useEffect(() => {
    if (!currentUser) return;

    let lastSerialized = "";
    const interval = setInterval(async () => {
      const progress = gatherLocalProgress();
      const serialized = JSON.stringify(progress);

      if (serialized !== lastSerialized) {
        try {
          const res = await fetch("/api/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUser.email, progress }),
          });
          if (res.ok) {
            lastSerialized = serialized;
          }
        } catch (err) {
          console.error("Frictionless background synchronization failed:", err);
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentUser, quizzesTaken, xpPoints, streakCount, flashcardsCreated]);

  // Auth Success Handlers
  const handleAuthSuccess = (user: { email: string; progress: any }) => {
    setCurrentUser({ email: user.email });
    localStorage.setItem("studyhub_user", JSON.stringify({ email: user.email }));

    // Apply fetched study progress profile directly
    if (user.progress) {
      const p = user.progress;
      if (p.quizzesTaken !== undefined) {
        setQuizzesTaken(parseInt(p.quizzesTaken, 10));
        localStorage.setItem("studyhub_quizzes_taken", p.quizzesTaken.toString());
      }
      if (p.xpPoints !== undefined) {
        setXpPoints(parseInt(p.xpPoints, 10));
        localStorage.setItem("studyhub_xp_points", p.xpPoints.toString());
      }
      if (p.streakCount !== undefined) {
        setStreakCount(parseInt(p.streakCount, 10));
        localStorage.setItem("studyhub_streak_count", p.streakCount.toString());
      }
      if (p.flashcardsCreated !== undefined) {
        setFlashcardsCreated(parseInt(p.flashcardsCreated, 10));
        localStorage.setItem("studyhub_flashcards_created", p.flashcardsCreated.toString());
      }
      if (p.studentName) {
        localStorage.setItem("studyhub_student_name", p.studentName);
      }
      if (p.studyGoals) {
        localStorage.setItem("studyhub_study_goals", typeof p.studyGoals === "string" ? p.studyGoals : JSON.stringify(p.studyGoals));
      }
      if (p.recentlyViewedNotes) {
        localStorage.setItem("studyhub_recently_viewed_notes", typeof p.recentlyViewedNotes === "string" ? p.recentlyViewedNotes : JSON.stringify(p.recentlyViewedNotes));
      }
      if (p.bookmarkedNotes) {
        localStorage.setItem("studyhub_bookmarked_notes", typeof p.bookmarkedNotes === "string" ? p.bookmarkedNotes : JSON.stringify(p.bookmarkedNotes));
      }
      if (p.mockHistory) {
        localStorage.setItem("studyhub_mock_history", typeof p.mockHistory === "string" ? p.mockHistory : JSON.stringify(p.mockHistory));
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("studyhub_user");
    // Clear study localStorage to keep session environments isolated
    localStorage.removeItem("studyhub_quizzes_taken");
    localStorage.removeItem("studyhub_xp_points");
    localStorage.removeItem("studyhub_streak_count");
    localStorage.removeItem("studyhub_flashcards_created");
    localStorage.removeItem("studyhub_student_name");
    localStorage.removeItem("studyhub_study_goals");
    localStorage.removeItem("studyhub_recently_viewed_notes");
    localStorage.removeItem("studyhub_bookmarked_notes");
    localStorage.removeItem("studyhub_mock_history");

    // Revert state hook variables to baseline guest cadets values
    setStreakCount(3);
    setXpPoints(120);
    setQuizzesTaken(0);
    setFlashcardsCreated(0);
  };

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleXpEarned = (amount: number) => {
    setXpPoints((prev) => {
      const updated = prev + amount;
      localStorage.setItem("studyhub_xp_points", updated.toString());
      return updated;
    });
  };

  const handleQuizTaken = () => {
    setQuizzesTaken((prev) => {
      const updated = prev + 1;
      localStorage.setItem("studyhub_quizzes_taken", updated.toString());
      
      // Dynamic daily streak boost on test submissions
      setStreakCount((current) => {
        const next = current + 1;
        localStorage.setItem("studyhub_streak_count", next.toString());
        return next;
      });

      return updated;
    });
  };

  const handleFlashcardCreated = (amount: number) => {
    setFlashcardsCreated((prev) => {
      const updated = prev + amount;
      localStorage.setItem("studyhub_flashcards_created", updated.toString());
      return updated;
    });
  };

  // Tab switching renderer
  const renderActiveTab = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeView
            key={currentUser ? `auth-${currentUser.email}` : "guest"}
            setActiveTab={setActiveTab}
            streakCount={streakCount}
            xpPoints={xpPoints}
            totalQuizzesTaken={quizzesTaken}
            completedFlashcards={flashcardsCreated}
            currentUser={currentUser}
            onOpenAuth={openAuthModal}
          />
        );
      case "classes":
        return (
          <ClassesView
            onXpEarned={handleXpEarned}
            setActiveTab={setActiveTab}
          />
        );
      case "subjects":
        return (
          <SubjectsView
            onXpEarned={handleXpEarned}
            setActiveTab={setActiveTab}
          />
        );
      case "notes":
        return (
          <NotesView
            onXpEarned={handleXpEarned}
            onFlashcardCreated={handleFlashcardCreated}
          />
        );
      case "pyqs":
      case "mock-tests":
        return (
          <PyqsAndMockTestsView
            onXpEarned={handleXpEarned}
            onQuizTaken={handleQuizTaken}
            initialTab={activeTab}
          />
        );
      case "ai-assistant":
        return (
          <AiAssistantView
            onXpEarned={handleXpEarned}
          />
        );
      default:
        return (
          <HomeView
            key={currentUser ? `auth-${currentUser.email}` : "guest"}
            setActiveTab={setActiveTab}
            streakCount={streakCount}
            xpPoints={xpPoints}
            totalQuizzesTaken={quizzesTaken}
            completedFlashcards={flashcardsCreated}
            currentUser={currentUser}
            onOpenAuth={openAuthModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      {/* Interactive global glowing gradient border */}
      <div className="h-1.5 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 sticky top-0 z-50" />
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakCount={streakCount}
        xpPoints={xpPoints}
        currentUser={currentUser}
        onOpenAuth={openAuthModal}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        {renderActiveTab()}
      </main>

      <Footer />

      {/* Persistent global AuthModal overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
