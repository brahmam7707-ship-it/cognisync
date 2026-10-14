import React from 'react';
import { 
  Check, 
  ArrowRight, 
  Coffee, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Calendar,
  Inbox,
  Timer,
  Tag
} from 'lucide-react';

const ENERGY_CONFIG = {
  High: { label: 'High Energy', color: 'text-accent-700', bg: 'bg-accent-50', border: 'border-accent-200', dot: 'bg-accent-500' },
  Medium: { label: 'Medium Energy', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  Low: { label: 'Low Energy', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
};

const PRIORITY_CONFIG = {
  High: { label: 'High Priority', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  Medium: { label: 'Med Priority', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200' },
  Low: { label: 'Low Priority', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
};

export default function FocusMode({
  recommendation,
  onCompleteTask,
  onSkipTask,
  onTakeBreak,
  tasks,
  onResetDemo,
  isDemoUser
}) {
  if (!recommendation || !recommendation.task) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-paper-300 shadow-sm text-center card-enter">
        <div className="w-14 h-14 rounded-2xl bg-paper-100 text-charcoal-300 flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-charcoal-900 mb-1.5">
          {tasks.length === 0 ? 'Queue is Empty' : '🎉 All Tasks Done!'}
        </h3>
        <p className="text-sm text-charcoal-500 max-w-xs mx-auto mb-5 leading-relaxed">
          {tasks.length === 0
            ? 'Add a task or run a Brain Dump below to calculate your next step.'
            : 'Amazing work! You\'ve crushed all active tasks for this session.'}
        </p>
        {isDemoUser && (
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-50 hover:bg-accent-100 border border-accent-200 text-accent-700 font-bold text-xs transition active:scale-95"
          >
            <span>Reload Demo Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  const { task, reason } = recommendation;
  const prereqTask = task.dependsOn ? tasks.find(t => t.id === task.dependsOn) : null;
  const isPrereqUnfinished = prereqTask && !prereqTask.completed;

  const energyCfg = ENERGY_CONFIG[task.energy] || ENERGY_CONFIG.Medium;
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.Medium;

  return (
    <div className="bg-white rounded-2xl border-2 border-accent-200 shadow-lg focus-glow relative overflow-hidden card-enter">
      {/* Top gradient accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700" />

      <div className="p-5 sm:p-6">
        {/* Header badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-3 h-3" />
            Your Next Step
          </div>
          <span className="text-[11px] text-charcoal-400 font-medium bg-paper-100 px-2.5 py-1 rounded-lg border border-paper-200 truncate max-w-[160px]">
            {reason}
          </span>
        </div>

        {/* Prerequisite warning */}
        {isPrereqUnfinished && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Prerequisite pending: <strong>{prereqTask.title}</strong></span>
          </div>
        )}

        {/* Task title & description */}
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight leading-snug mb-1.5">
            {task.title}
          </h2>
          {task.description && (
            <p className="text-sm text-charcoal-500 leading-relaxed">{task.description}</p>
          )}
        </div>

        {/* Metadata chips */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5 text-[11px]">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold ${energyCfg.color} ${energyCfg.bg} ${energyCfg.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${energyCfg.dot}`} />
            {energyCfg.label}
          </span>
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold ${priorityCfg.color} ${priorityCfg.bg} ${priorityCfg.border}`}>
            <Zap className="w-3 h-3" />
            {priorityCfg.label}
          </span>
          {task.deadline && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paper-100 border border-paper-200 text-charcoal-600 font-medium">
              <Calendar className="w-3 h-3 text-charcoal-400" />
              {task.deadline}
            </span>
          )}
          {task.estimatedMinutes && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paper-100 border border-paper-200 text-charcoal-500 font-medium">
              <Timer className="w-3 h-3" />
              ~{task.estimatedMinutes}m
            </span>
          )}
          {task.category && task.category !== 'General' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-paper-100 border border-paper-200 text-charcoal-500 font-medium">
              <Tag className="w-3 h-3" />
              {task.category}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onCompleteTask(task.id)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-extrabold text-xs tracking-widest uppercase shadow-md hover:shadow-accent-200 transition-all active:scale-[0.97]"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            DONE ✓
          </button>
          <button
            type="button"
            onClick={() => onSkipTask(task.id)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-paper-100 hover:bg-paper-200 text-charcoal-700 font-bold text-xs tracking-wider uppercase border border-paper-300 transition active:scale-[0.97]"
          >
            <ArrowRight className="w-4 h-4" />
            NOT NOW
          </button>
          <button
            type="button"
            onClick={onTakeBreak}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs tracking-wider uppercase border border-emerald-200 transition active:scale-[0.97]"
          >
            <Coffee className="w-4 h-4" />
            BREAK
          </button>
        </div>
      </div>
    </div>
  );
}
