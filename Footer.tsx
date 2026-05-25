import React from "react";
import { GraduationCap, Sparkles, Github, Twitter, Linkedin, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-indigo-600 text-white shadow-md">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="ml-2 font-sans font-bold text-lg text-white">
                StudyHub <span className="text-indigo-400">AI</span>
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              StudyHub AI combines premium core curriculum references with generative artificial intelligence to empower student self-learning. Achieve comprehension faster with customized flashcards, direct answers, and performance diagnoses.
            </p>
          </div>

          {/* Feature Quicklinks */}
          <div>
            <h3 className="font-semibold text-slate-200 text-sm tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><span className="hover:text-white transition cursor-pointer">AI Structured Notes</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Previous Year Solutions</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Interactive Speed Quizzes</span></li>
              <li><span className="hover:text-white transition cursor-pointer">Flashcards Engine</span></li>
            </ul>
          </div>

          {/* Motivation Quote Col */}
          <div>
            <h3 className="font-semibold text-slate-200 text-sm tracking-wider uppercase">Today's Wisdom</h3>
            <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs italic text-slate-300">
              "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice."
              <span className="block mt-2 font-semibold text-sky-400 text-right">— Brian Herbert</span>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            &copy; {new Date().getFullYear()} StudyHub AI. Built with precision for top academic performance.
          </div>
          <div className="flex items-center space-x-1.5 text-slate-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current animate-pulse" />
            <span>for curious minds worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
