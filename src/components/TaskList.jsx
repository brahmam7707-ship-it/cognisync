import React, { useState } from 'react';
import { 
  Check, 
  Clock, 
  Zap, 
  Calendar, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function TaskList({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onAddNewTask
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [search, setSearch] = useState('');

  const completedCount = tasks.filter(t => t.completed).length;

  const energyStyles = {
    High: 'bg-indigo-50 text-accent-700 border-accent-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-sky-50 text-sky-700 border-sky-200',
    Low: 'bg-gray-50 text-charcoal-600 border-paper-300'
  };

  const filteredTasks = tasks.filter(task => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-paper-300 shadow-sm overflow-hidden card-enter">
      {/* Collapsible Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-paper-50 transition border-b border-paper-200"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-charcoal-900">All Tasks</span>
          <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-bold">
            {tasks.filter(t => !t.completed).length}
          </span>
          <span className="text-xs text-charcoal-400 font-medium">
            ({completedCount}/{tasks.length} done)
          </span>
        </div>
        <div className="flex items-center gap-2 text-charcoal-400">
          <span className="text-xs font-medium">{isOpen ? 'Hide' : 'Show'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>


      {/* Collapsible Content */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-paper-200">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 py-3 border-b border-paper-100">
            {/* Filters */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'all'
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-paper-100 text-charcoal-600 hover:bg-paper-200'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('active')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'active'
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-paper-100 text-charcoal-600 hover:bg-paper-200'
                }`}
              >
                To Do ({tasks.filter(t => !t.completed).length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  filter === 'completed'
                    ? 'bg-charcoal-900 text-white'
                    : 'bg-paper-100 text-charcoal-600 hover:bg-paper-200'
                }`}
              >
                Done ({completedCount})
              </button>
            </div>

            {/* Search & Add */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="px-2.5 py-1 rounded-lg border border-paper-300 text-xs bg-paper-50 focus:bg-white focus:outline-none focus:border-accent-600 text-charcoal-900 w-36"
              />
              <button
                type="button"
                onClick={onAddNewTask}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent-600 hover:bg-accent-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Tasks List */}
          <div className="mt-3 space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-6 text-charcoal-400 text-xs">
                No tasks match current filter.
              </div>
            ) : (
              filteredTasks.map(task => {
                const prereqTask = task.dependsOn ? tasks.find(t => t.id === task.dependsOn) : null;
                const isBlocked = prereqTask && !prereqTask.completed && !task.completed;

                return (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all ${
                      task.completed
                        ? 'bg-paper-50/50 border-paper-200 opacity-60'
                        : isBlocked
                        ? 'bg-amber-50/20 border-amber-200'
                        : 'bg-white border-paper-300 hover:border-paper-400'
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleComplete(task.id)}
                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition shrink-0 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-paper-400 bg-white hover:border-accent-600'
                      }`}
                    >
                      {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-xs font-semibold leading-snug ${
                            task.completed ? 'line-through text-charcoal-400' : 'text-charcoal-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        {isBlocked && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
                            Blocked
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-[11px] text-charcoal-500 line-clamp-1 mb-1.5">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className={`px-1.5 py-0.2 rounded border font-medium ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
                          {task.priority}
                        </span>

                        <span className={`px-1.5 py-0.2 rounded border font-medium flex items-center gap-0.5 ${energyStyles[task.energy] || energyStyles.Medium}`}>
                          <Zap className="w-2.5 h-2.5" />
                          {task.energy}
                        </span>

                        {task.deadline && (
                          <span className="px-1.5 py-0.2 rounded bg-paper-100 border border-paper-200 text-charcoal-600 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 text-charcoal-400" />
                            {task.deadline}
                          </span>
                        )}

                        {prereqTask && (
                          <span className="text-charcoal-400 flex items-center gap-0.5">
                            <Layers className="w-2.5 h-2.5" />
                            After: {prereqTask.title.slice(0, 14)}...
                          </span>
                        )}

                        {task.estimatedMinutes && (
                          <span className="text-charcoal-400 ml-auto">
                            {task.estimatedMinutes}m
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        className="p-1 text-charcoal-400 hover:text-accent-600 hover:bg-paper-100 rounded transition"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
