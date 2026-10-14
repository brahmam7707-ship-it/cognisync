import React, { useState, useEffect } from 'react';
import { X, Check, Clock, Calendar, Zap, AlertTriangle, Layers } from 'lucide-react';

export default function TaskEditModal({ 
  task, 
  allTasks, 
  isOpen, 
  onClose, 
  onSave 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [energy, setEnergy] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [dependsOn, setDependsOn] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [category, setCategory] = useState('General');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setEnergy(task.energy || 'Medium');
      setDeadline(task.deadline || '');
      setDependsOn(task.dependsOn || '');
      setEstimatedMinutes(task.estimatedMinutes || 25);
      setCategory(task.category || 'General');
    } else {
      // New task defaults
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setEnergy('Medium');
      setDeadline('');
      setDependsOn('');
      setEstimatedMinutes(25);
      setCategory('General');
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Calculate deadline timestamp if recognized
    let deadlineTimestamp = null;
    if (deadline) {
      if (/today/i.test(deadline)) {
        deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 5;
      } else if (/tomorrow/i.test(deadline)) {
        deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 24;
      } else {
        deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 48;
      }
    }

    onSave({
      id: task ? task.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      energy,
      deadline: deadline.trim() || null,
      deadlineTimestamp: deadline.trim() ? deadlineTimestamp : null,
      dependsOn: dependsOn || null,
      estimatedMinutes: Number(estimatedMinutes) || 20,
      category: category.trim() || 'General',
      completed: task ? task.completed : false
    });

    onClose();
  };

  // Filter out self from dependency candidate list
  const dependencyCandidates = allTasks.filter(t => !task || t.id !== task.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-paper-300 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-paper-200">
          <h3 className="text-base font-bold text-charcoal-900">
            {task ? 'Edit Task Details' : 'Create New Structured Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-900 hover:bg-paper-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize quarterly architecture doc"
              className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
              Description / Context
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key notes, links, or criteria for completion..."
              className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600 resize-none"
            />
          </div>

          {/* Priority & Energy Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600 bg-white"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                Cognitive Energy Required
              </label>
              <select
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600 bg-white"
              >
                <option value="High">🔥 High (Deep Focus)</option>
                <option value="Medium">⚡ Medium (Flow)</option>
                <option value="Low">🌿 Low (Restorative/Easy)</option>
              </select>
            </div>
          </div>

          {/* Deadline & Estimated Minutes */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                Deadline (Optional)
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Today, 5:00 PM or Friday"
                className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1">
                Est. Duration (Mins)
              </label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600"
              />
            </div>
          </div>

          {/* Dependency Selector */}
          <div>
            <label className="block text-xs font-semibold text-charcoal-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-accent-600" />
              <span>Prerequisite Dependency</span>
            </label>
            <select
              value={dependsOn}
              onChange={(e) => setDependsOn(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-paper-300 text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-600 bg-white"
            >
              <option value="">None (Can start immediately)</option>
              {dependencyCandidates.map(cand => (
                <option key={cand.id} value={cand.id}>
                  Depends on: {cand.title} {cand.completed ? '✓' : '(Pending)'}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-charcoal-400 mt-1">
              Focus mode will hold this task until its prerequisite is marked complete.
            </p>
          </div>

          {/* Form Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-paper-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 hover:bg-paper-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold shadow-sm transition active:scale-95"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

