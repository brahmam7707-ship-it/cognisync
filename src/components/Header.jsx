import React from 'react';
import { Sparkles, RotateCcw, Brain, CheckCircle2, LogOut, User } from 'lucide-react';

export default function Header({ 
  onResetDemo, 
  completedCount, 
  totalCount, 
  user, 
  onSignOut,
  onShowAuthModal,
  isDemoMode 
}) {
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header className="border-b border-paper-300 bg-paper-50/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-charcoal-900">CogniSync</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded-full">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                {isDemoMode ? 'Demo Mode' : 'Cloud Sync'}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-400 font-medium hidden sm:block">
              Adaptive Cognitive Energy & Focus Engine
            </p>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Progress */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-paper-200/60 text-xs text-charcoal-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium whitespace-nowrap">
              {completedCount}/{totalCount} <span className="text-charcoal-400">({percent}%)</span>
            </span>
          </div>

          {/* User Sign In / Out */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal-600 hidden md:inline truncate max-w-[120px]">
                {user.email}
              </span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-paper-300 text-xs font-medium text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95"
                title="Sign out of Supabase"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onResetDemo}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-paper-300 text-xs font-medium text-charcoal-600 hover:text-charcoal-900 hover:bg-paper-100 transition active:scale-95"
                title="Reset sample tasks"
              >
                <RotateCcw className="w-3 h-3 text-charcoal-400" />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={onShowAuthModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
              >
                <User className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
