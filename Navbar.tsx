import React, { useState } from "react";
import { BookOpen, GraduationCap, FileText, ClipboardList, Menu, X, Sparkles, Flame, Award, School, Compass, Bot } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  xpPoints: number;
  currentUser: { email: string } | null;
  onOpenAuth: (mode: "login" | "signup") => void;
  onLogout: () => void;
}

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  streakCount, 
  xpPoints,
  currentUser,
  onOpenAuth,
  onLogout
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: GraduationCap },
    { id: "classes", label: "Classes", icon: School },
    { id: "subjects", label: "Subjects", icon: Compass },
    { id: "notes", label: "Study Notes", icon: BookOpen },
    { id: "pyqs", label: "PYQs & Mock Tests", icon: FileText },
    { id: "ai-assistant", label: "AI Study Assistant", icon: Bot },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick("home")}>
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <span className="ml-3 font-sans font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              StudyHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">AI</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800 text-sky-400 shadow-sm"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Gamified Stat Badges & Profile */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Streak Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold animate-bounce" style={{ animationDuration: '3s' }}>
              <Flame className="h-4 w-4 mr-1 text-orange-500" />
              <span>{streakCount} Day Streak</span>
            </div>

            {/* XP Badge */}
            <div className="flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Award className="h-4 w-4 mr-1 text-emerald-450" />
              <span>{xpPoints} XP Points</span>
            </div>

            {/* Optional Signup & Login system */}
            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <span className="text-xs text-slate-400 font-mono max-w-[120px] truncate" title={currentUser.email}>
                  {currentUser.email.split("@")[0]}
                </span>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <button
                  id="navbar-login-btn"
                  onClick={() => onOpenAuth("login")}
                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-slate-950 border border-slate-800 hover:border-slate-705 hover:bg-slate-850 text-slate-200 transition cursor-pointer"
                >
                  Login
                </button>
                <button
                  id="navbar-signup-btn"
                  onClick={() => onOpenAuth("signup")}
                  className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white shadow shadow-indigo-505/20 transition cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? "bg-slate-800 text-sky-400"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}

            {/* Mobile Stat Badges */}
            <div className="pt-4 pb-2 border-t border-slate-800 flex items-center justify-around">
              <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                <Flame className="h-4 w-4 mr-1 text-orange-500" />
                <span>{streakCount} Day Streak</span>
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Award className="h-4 w-4 mr-1 text-emerald-400" />
                <span>{xpPoints} XP Points</span>
              </div>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-2 border-t border-slate-800 px-4">
              {currentUser ? (
                <div className="space-y-2 text-center text-xs">
                  <p className="text-slate-400 font-mono truncate">Logged in as {currentUser.email}</p>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onOpenAuth("login");
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-350 text-xs font-bold transition cursor-pointer text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth("signup");
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-extrabold transition cursor-pointer text-center"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
