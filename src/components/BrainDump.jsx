import React, { useState } from 'react';
import { Sparkles, FileText, AlertCircle, Settings2 } from 'lucide-react';
import { SAMPLE_BRAIN_DUMP } from '../data/sampleTasks';

export default function BrainDump({ 
  onOrganize, 
  isParsing, 
  apiKey, 
  onSaveApiKey 
}) {
  const [text, setText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');

  const handleLoadExample = () => {
    setText(SAMPLE_BRAIN_DUMP);
    setErrorMsg('');
  };

  const handleOrganize = () => {
    if (!text.trim()) {
      setErrorMsg('Enter some thoughts or load the example to test.');
      return;
    }
    setErrorMsg('');
    onOrganize(text);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    onSaveApiKey(tempKey.trim());
    setShowConfig(false);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-paper-300 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-600" />
          <h3 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
            Brain Dump
          </h3>
          <span className="text-[10px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            {apiKey ? 'Gemini Live' : 'Demo Parser'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadExample}
            className="text-xs font-semibold text-accent-700 hover:text-accent-900 bg-accent-50 hover:bg-accent-100 px-2.5 py-1 rounded-lg transition"
          >
            Load Example
          </button>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-lg transition"
            title="AI Parser Settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional API Settings */}
      {showConfig && (
        <form onSubmit={handleSaveKey} className="mb-3 p-3 bg-paper-50 rounded-xl border border-paper-200 text-xs flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="password"
            placeholder="Optional: Gemini API Key (stored in memory only)"
            value={tempKey}
            onChange={(e) => setTempKey(e.target.value)}
            className="flex-1 w-full px-3 py-1.5 rounded-lg border border-paper-300 bg-white text-xs text-charcoal-900 focus:outline-none focus:border-accent-600"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-3 py-1.5 bg-charcoal-900 text-white rounded-lg font-medium text-xs hover:bg-charcoal-800"
          >
            {tempKey ? 'Save Key' : 'Clear / Use Demo'}
          </button>
        </form>
      )}

      {/* Input */}
      <textarea
        rows={3}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (errorMsg) setErrorMsg('');
        }}
        placeholder="Dump unstructured thoughts here (e.g. 'Must finish roadmap deck before tomorrow 10am after reviewing analytics, also check support inbox...')"
        className="w-full p-3.5 rounded-xl border border-paper-300 bg-paper-50/40 text-charcoal-900 text-sm placeholder:text-charcoal-400 focus:outline-none focus:ring-1 focus:ring-accent-500 focus:bg-white transition resize-none leading-relaxed"
      />

      {errorMsg && (
        <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-3 flex items-center justify-end">
        <button
          type="button"
          onClick={handleOrganize}
          disabled={isParsing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 disabled:opacity-60 text-white font-semibold text-xs tracking-wide shadow-xs transition active:scale-95"
        >
          {isParsing ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Organizing...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Organize My Thoughts</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
