import React from 'react';
import { 
  Check, 
  ArrowRight, 
  Coffee, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Calendar,
  Layers,
  Inbox
} from 'lucide-react';

export default function FocusMode({
  recommendation,
  onCompleteTask,
  onSkipTask,
  onTakeBreak,
  tasks,
  onResetDemo,
  isDemoUser
}) {
  // If no task recommendation is calculated from user's tasks
  if (!recommendation || !recommendation.task) {
    return (
      <div className="bg-white rounded-2xl p-7 border border-paper-300 shadow-xs text-center">
        <div className="w-12 h-12 rounded-full bg-paper-100 text-charcoal-400 flex items-center justify-center mx-auto mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-charcoal-900 mb-1">
          {tasks.length === 0 ? 'Your Queue is Empty' : 'All Tasks Completed!'}
        </h3>
        <p className="text-xs text-charcoal-500 max-w-sm mx-auto mb-4">
          {tasks.length === 0 
            ? 'Add a task or run a Brain Dump below to calculate Your Next Step.'
            : 'Great work! You have finished all active tasks for this session.'}
        </p>
        {isDemoUser && (
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-paper-100 hover:bg-paper-200 border border-paper-300 text-charcoal-700 font-semibold text-xs transition"
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

  const energyColor = {
    High: 'text-accent-700 bg-accent-50 border-accent-200',
    Medium: 'text-amber-800 bg-amber-50 border-amber-200',
    Low: 'text-emerald-800 bg-emerald-50 border-emerald-200'
  }[task.energy] || 'text-charcoal-600 bg-paper-100 border-paper-300';

  return (
    <div className="bg-white rounded-2xl border border-paper-300 shadow-sm p-6 sm:p-7 relative overflow-hidden transition-all">
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-accent-600" />

      {/* Header: 'Your Next Step' */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-accent-700 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your Next Step</span>
        </div>

        {/* Dynamic calculation rationale */}
        <span className="text-[11px] text-charcoal-500 font-medium bg-paper-100 px-2.5 py-1 rounded-lg">
          {reason}
        </span>
      </div>

      {/* Prerequisite Alert */}
      {isPrereqUnfinished && (
        <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Prerequisite pending: <strong>{prereqTask.title}</strong>
          </span>
        </div>
      )}

      {/* Dynamic Task Title & Description */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-charcoal-900 tracking-tight leading-snug mb-2">
          {task.title}
        </h2>
        {task.description && (
          <p className="text-sm text-charcoal-600 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Metadata Chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
        <span className="px-2.5 py-0.5 rounded-md font-medium border bg-paper-50 text-charcoal-700 border-paper-300">
          {task.priority} Priority
        </span>

        <span className={`px-2.5 py-0.5 rounded-md font-medium border flex items-center gap-1 ${energyColor}`}>
          <Zap className="w-3 h-3" />
          {task.energy} Energy
        </span>

        {task.deadline && (
          <span className="px-2.5 py-0.5 rounded-md font-medium bg-paper-100 border border-paper-200 text-charcoal-700 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-charcoal-400" />
            Due: {task.deadline}
          </span>
        )}

        {task.estimatedMinutes && (
          <span className="text-charcoal-400 text-xs ml-auto">
            ~{task.estimatedMinutes} mins
          </span>
        )}
      </div>

      {/* 3 Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => onCompleteTask(task.id)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-accent-600 hover:bg-accent-700 text-white font-bold text-xs tracking-wider uppercase shadow-xs transition active:scale-[0.98]"
        >
          <Check className="w-4 h-4 stroke-[2.5]" />
          <span>DONE</span>
        </button>

        <button
          type="button"
          onClick={() => onSkipTask(task.id)}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-paper-100 hover:bg-paper-200 text-charcoal-700 font-bold text-xs tracking-wider uppercase border border-paper-300 transition active:scale-[0.98]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>NOT NOW</span>
        </button>

        <button
          type="button"
          onClick={onTakeBreak}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs tracking-wider uppercase border border-emerald-200 transition active:scale-[0.98]"
        >
          <Coffee className="w-4 h-4 text-emerald-600" />
          <span>TAKE A BREAK</span>
        </button>
      </div>
    </div>
  );
}
