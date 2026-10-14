import React from 'react';
import { CheckCircle2, Flame, Clock, Battery, TrendingUp } from 'lucide-react';

export default function ProgressStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Remaining tasks energy breakdown
  const remaining = tasks.filter(t => !t.completed);
  const highEnergyCount = remaining.filter(t => t.energy === 'High').length;
  const medEnergyCount = remaining.filter(t => t.energy === 'Medium').length;
  const lowEnergyCount = remaining.filter(t => t.energy === 'Low').length;

  const remainingMins = remaining.reduce((acc, t) => acc + (t.estimatedMinutes || 20), 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-paper-300 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-600" />
          <h2 className="text-sm font-semibold tracking-wide text-charcoal-900 uppercase">
            Cognitive Load & Progress
          </h2>
        </div>
        <span className="text-xs font-bold text-accent-700 bg-accent-50 border border-accent-200/80 px-2 py-0.5 rounded-full">
          {percent}% Finished
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-paper-200 rounded-full h-2.5 overflow-hidden mb-4">
        <div 
          className="bg-accent-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
          <div className="flex items-center justify-center gap-1 text-charcoal-400 text-xs mb-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tasks Done</span>
          </div>
          <div className="text-lg font-bold text-charcoal-900">
            {completed} <span className="text-xs font-normal text-charcoal-400">/ {total}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
          <div className="flex items-center justify-center gap-1 text-charcoal-400 text-xs mb-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-accent-600" />
            <span>Est. Remaining</span>
          </div>
          <div className="text-lg font-bold text-charcoal-900">
            {remainingMins} <span className="text-xs font-normal text-charcoal-400">mins</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
          <div className="flex items-center justify-center gap-1 text-charcoal-400 text-xs mb-1 font-medium">
            <Flame className="w-3.5 h-3.5 text-rose-500" />
            <span>High Strain</span>
          </div>
          <div className="text-lg font-bold text-charcoal-900">
            {highEnergyCount} <span className="text-xs font-normal text-charcoal-400">deep work</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-paper-50 border border-paper-200 text-center">
          <div className="flex items-center justify-center gap-1 text-charcoal-400 text-xs mb-1 font-medium">
            <Battery className="w-3.5 h-3.5 text-emerald-600" />
            <span>Low Strain</span>
          </div>
          <div className="text-lg font-bold text-charcoal-900">
            {lowEnergyCount} <span className="text-xs font-normal text-charcoal-400">quick wins</span>
          </div>
        </div>
      </div>
    </div>
  );
}

