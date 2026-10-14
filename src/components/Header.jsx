import React from 'react';
import { Sparkles, RotateCcw, Brain, CheckCircle2, LogOut, User, Zap } from 'lucide-react';

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
    <header className="border-b border-paper-300 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-600 to-accent-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-charcoal-900">CogniSync</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isDemoMode
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                <Sparkles className="w-2.5 h-2.5" />
                {isDemoMode ? 'Demo Mode' : 'Cloud Sync'}
              </span>
            </div>
            <p className="text-[11px] text-charcoal-400 font-medium hidden sm:block leading-none mt-0.5">
              Adaptive Cognitive Focus Engine
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Progress pill */}
          {totalCount > 0 && (
            <div className="hidden sm:flex flex-col items-end gap-0.5">
              <div className="flex items-center gap-1.5 text-xs text-charcoal-600 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{completedCount}/{totalCount}</span>
                <span className="text-charcoal-400 font-medium">({percent}%)</span>
              </div>
              <div className="w-24 h-1.5 bg-paper-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-emerald-500' : 'progress-shimmer'}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )}

          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal-500 hidden md:inline truncate max-w-[110px]">{user.email}</span>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-paper-100 border border-paper-300 text-xs font-semibold text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 transition active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onShowAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition active:scale-95 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          {isDemoMode && (
            <button
              onClick={onResetDemo}
              title="Reload demo tasks"
              className="p-1.5 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-paper-200 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
