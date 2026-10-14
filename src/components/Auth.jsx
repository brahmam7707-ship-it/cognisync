import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Brain, Lock, Mail, ArrowRight, AlertCircle, CheckCircle, Info, Sparkles } from 'lucide-react';

export default function Auth({ onContinueDemo }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      setErrorMsg('Supabase is not configured yet. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env or continue in demo mode.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;

        if (data.session) {
          // Auto-confirmed or confirmations off
          setSuccessMsg('Account created successfully! Redirecting...');
        } else {
          // Confirmation email sent
          setSuccessMsg('Sign up successful! Please check your email for the confirmation link before signing in.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) throw error;
        // User session automatically picked up by onAuthStateChange in App.jsx
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-paper-300 shadow-sm">
        {/* Brand */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-600 text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900 tracking-tight">
            CogniSync
          </h1>
          <p className="text-xs text-charcoal-400 mt-1 font-medium">
            Adaptive Cognitive Energy & Focus Engine
          </p>
        </div>

        {/* Supabase Missing Notice */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Supabase Not Yet Configured</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-950 font-normal">
              To connect real authentication and cloud database, set <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> in your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code> file.
            </p>
            <button
              type="button"
              onClick={onContinueDemo}
              className="w-full mt-2 py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue in Local Demo Mode</span>
            </button>
          </div>
        )}

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-paper-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              !isSignUp ? 'bg-white text-charcoal-900 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`py-2 text-xs font-semibold rounded-lg transition ${
              isSignUp ? 'bg-white text-charcoal-900 shadow-xs' : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2 font-medium">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-paper-300 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-paper-300 text-xs text-charcoal-900 bg-white focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-600"
              />
            </div>
            {isSignUp && (
              <p className="text-[11px] text-charcoal-400 mt-1">
                Must be at least 6 characters. Email confirmation may be required.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full py-2.5 px-4 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-50 text-white font-semibold text-xs tracking-wide shadow-xs transition active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Demo fallback link if Supabase is configured but user just wants quick demo */}
        {isSupabaseConfigured && (
          <div className="mt-6 pt-4 border-t border-paper-200 text-center">
            <button
              type="button"
              onClick={onContinueDemo}
              className="text-xs text-charcoal-400 hover:text-charcoal-700 transition"
            >
              Skip auth & test in Demo Mode →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

