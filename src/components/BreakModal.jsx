import React, { useState, useEffect } from 'react';
import { Coffee, Play, Pause, RotateCcw, X, Sparkles, Wind } from 'lucide-react';

export default function BreakModal({ isOpen, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 minutes
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(300);
      setIsActive(true);
      return;
    }

    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isOpen]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-paper-50 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-paper-300 text-center relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle glow background */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-100 rounded-full blur-2xl opacity-60" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-accent-100 rounded-full blur-2xl opacity-60" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-800 rounded-full hover:bg-paper-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-200">
          <Wind className="w-8 h-8 animate-pulse" />
        </div>

        <h3 className="text-xl font-bold text-charcoal-900 mb-1">
          Cognitive Decompression
        </h3>
        <p className="text-xs text-charcoal-600 mb-6 max-w-xs mx-auto">
          Step back from the screen. Take three slow deep breaths to reset your dopamine baseline and executive function.
        </p>

        {/* Timer Display */}
        <div className="text-5xl font-mono font-bold text-charcoal-900 tracking-tight mb-6">
          {formattedTime}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-semibold hover:bg-charcoal-800 transition active:scale-95"
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSecondsLeft(300);
              setIsActive(true);
            }}
            className="p-2 rounded-xl bg-paper-200 hover:bg-paper-300 text-charcoal-700 transition"
            title="Reset to 5:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Return Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-sm shadow-sm transition active:scale-95"
        >
          Ready to Re-Focus
        </button>
      </div>
    </div>
  );
}

