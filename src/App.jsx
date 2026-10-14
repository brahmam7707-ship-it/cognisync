import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import EnergySelector from './components/EnergySelector';
import FocusMode from './components/FocusMode';
import BrainDump from './components/BrainDump';
import TaskList from './components/TaskList';
import TaskEditModal from './components/TaskEditModal';
import BreakModal from './components/BreakModal';
import Auth from './components/Auth';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { INITIAL_TASKS } from './data/sampleTasks';
import { parseBrainDumpDemo } from './utils/parser';
import { getRecommendedTask } from './utils/recommender';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [inDemoMode, setInDemoMode] = useState(!isSupabaseConfigured);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [currentEnergy, setCurrentEnergy] = useState('Medium');
  const [skippedTaskIds, setSkippedTaskIds] = useState(new Set());
  const [isParsing, setIsParsing] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('cognisync_gemini_key') || '');
  
  // Modals & Feedback
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Helper to map DB row to internal task format
  const mapDbTask = (row) => ({
    id: row.id,
    title: row.title,
    description: row.description || '',
    priority: row.priority || 'Medium',
    energy: row.energy || 'Medium',
    deadline: row.deadline || null,
    deadlineTimestamp: row.deadline_timestamp ? Number(row.deadline_timestamp) : null,
    dependsOn: row.depends_on || null,
    completed: Boolean(row.completed),
    estimatedMinutes: row.estimated_minutes || 25,
    category: row.category || 'General'
  });

  // Helper to map internal task to DB row
  const mapTaskToDb = (task, userId) => ({
    id: task.id,
    user_id: userId,
    title: task.title,
    description: task.description || null,
    priority: task.priority || 'Medium',
    energy: task.energy || 'Medium',
    deadline: task.deadline || null,
    deadline_timestamp: task.deadlineTimestamp || null,
    depends_on: task.dependsOn || null,
    completed: Boolean(task.completed),
    estimated_minutes: task.estimatedMinutes || 25,
    category: task.category || 'General'
  });

  // Fetch tasks for authenticated user
  const fetchUserTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase tasks fetch error (table may not exist yet):', error.message);
        // Fallback to local storage for this user
        const local = localStorage.getItem(`cognisync_tasks_${userId}`);
        setTasks(local ? JSON.parse(local) : []);
      } else {
        setTasks((data || []).map(mapDbTask));
      }
    } catch (err) {
      console.warn('Fetch tasks error:', err);
      setTasks([]);
    }
  };

  // Check Supabase session on startup
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthChecked(true);
      // Load demo tasks
      const saved = localStorage.getItem('cognisync_tasks_demo');
      setTasks(saved ? JSON.parse(saved) : INITIAL_TASKS);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setInDemoMode(false);
        fetchUserTasks(session.user.id);
      } else {
        // No session, load demo tasks in case they browse
        const saved = localStorage.getItem('cognisync_tasks_demo');
        setTasks(saved ? JSON.parse(saved) : INITIAL_TASKS);
      }
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setInDemoMode(false);
        setShowAuthModal(false);
        fetchUserTasks(session.user.id);
        showToast(`Signed in as ${session.user.email}`);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Save tasks to local cache
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cognisync_tasks_${user.id}`, JSON.stringify(tasks));
    } else if (inDemoMode) {
      localStorage.setItem('cognisync_tasks_demo', JSON.stringify(tasks));
    }
  }, [tasks, user, inDemoMode]);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setInDemoMode(true);
    const saved = localStorage.getItem('cognisync_tasks_demo');
    setTasks(saved ? JSON.parse(saved) : INITIAL_TASKS);
    showToast('Signed out. Switched to Demo Mode.');
  };

  const handleResetDemo = () => {
    setTasks(INITIAL_TASKS);
    setCurrentEnergy('Medium');
    setSkippedTaskIds(new Set());
    showToast('Reset to sample tasks', 'info');
  };

  // Brain Dump / Thought Organizer
  const handleOrganizeThoughts = async (rawText) => {
    setIsParsing(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const newTasks = parseBrainDumpDemo(rawText);

      // Persist to Supabase if authenticated
      if (user && isSupabaseConfigured) {
        const rows = newTasks.map(t => mapTaskToDb(t, user.id));
        const { error } = await supabase.from('tasks').insert(rows);
        if (error) console.warn('Supabase insert error:', error.message);
      }

      setTasks(prev => [...newTasks, ...prev]);
      showToast(`Organized ${newTasks.length} tasks from your brain dump`, 'success');
    } catch (err) {
      console.warn('Parser error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  // Toggle complete
  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const nextCompleted = !task.completed;

    if (user && isSupabaseConfigured) {
      await supabase
        .from('tasks')
        .update({ completed: nextCompleted })
        .eq('id', taskId)
        .eq('user_id', user.id);
    }

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: nextCompleted } : t));
    if (nextCompleted) {
      showToast(`Completed: ${task.title.slice(0, 28)}...`);
    }
  };

  // Focus actions
  const handleFocusDone = (taskId) => {
    handleToggleComplete(taskId);
    setSkippedTaskIds(prev => {
      const copy = new Set(prev);
      copy.delete(taskId);
      return copy;
    });
  };

  const handleFocusSkip = (taskId) => {
    setSkippedTaskIds(prev => new Set(prev).add(taskId));
    showToast('Deferred to later in queue', 'info');
  };

  // Add or update task
  const handleSaveTask = async (taskData) => {
    if (user && isSupabaseConfigured) {
      const row = mapTaskToDb(taskData, user.id);
      const { error } = await supabase.from('tasks').upsert(row);
      if (error) console.warn('Supabase upsert error:', error.message);
    }

    setTasks(prev => {
      const index = prev.findIndex(t => t.id === taskData.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = taskData;
        showToast('Task updated');
        return updated;
      } else {
        showToast('New task added');
        return [taskData, ...prev];
      }
    });
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (user && isSupabaseConfigured) {
      await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);
    }

    setTasks(prev => prev.filter(t => t.id !== taskId).map(t => {
      if (t.dependsOn === taskId) return { ...t, dependsOn: null };
      return t;
    }));
    showToast('Task removed', 'info');
  };

  // Calculate "Your Next Step" dynamically from user's own tasks
  const recommendation = useMemo(() => {
    return getRecommendedTask(tasks, currentEnergy, skippedTaskIds);
  }, [tasks, currentEnergy, skippedTaskIds]);

  const completedCount = tasks.filter(t => t.completed).length;

  // Show Auth view if requested or if Supabase is configured and user is not signed in and not explicitly in demo mode
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-paper-100 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (showAuthModal || (!user && !inDemoMode)) {
    return (
      <Auth 
        onContinueDemo={() => {
          setInDemoMode(true);
          setShowAuthModal(false);
          const saved = localStorage.getItem('cognisync_tasks_demo');
          setTasks(saved ? JSON.parse(saved) : INITIAL_TASKS);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper-100 flex flex-col font-sans selection:bg-accent-100 selection:text-accent-800">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-4 duration-150">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-charcoal-900 text-white shadow-lg text-xs font-medium">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-accent-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onResetDemo={handleResetDemo}
        completedCount={completedCount}
        totalCount={tasks.length}
        user={user}
        onSignOut={handleSignOut}
        onShowAuthModal={() => setShowAuthModal(true)}
        isDemoMode={inDemoMode || !user}
      />

      {/* Main Focused Single-Column Layout */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-5">
        {/* Supabase Status Banner if in Demo Mode */}
        {inDemoMode && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900">
            <span className="font-medium">
              Running in Local Demo Mode. Tasks are stored in local storage.
            </span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-accent-700 hover:text-accent-900 font-bold underline ml-2 shrink-0"
            >
              Sign In with Supabase
            </button>
          </div>
        )}

        {/* 1. Current Energy Selector */}
        <EnergySelector
          currentEnergy={currentEnergy}
          onEnergyChange={setCurrentEnergy}
        />

        {/* 2. Your Next Step (Dynamic Focus Recommendation from User's Own Tasks) */}
        <FocusMode
          recommendation={recommendation}
          onCompleteTask={handleFocusDone}
          onSkipTask={handleFocusSkip}
          onTakeBreak={() => setIsBreakModalOpen(true)}
          tasks={tasks}
          onResetDemo={handleResetDemo}
          isDemoUser={inDemoMode || !user}
        />

        {/* 3. Brain Dump */}
        <BrainDump
          onOrganize={handleOrganizeThoughts}
          isParsing={isParsing}
          apiKey={apiKey}
          onSaveApiKey={(k) => setApiKey(k)}
        />

        {/* 4. Collapsible 'View All Tasks' */}
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={(task) => {
            setEditingTask(task);
            setIsEditModalOpen(true);
          }}
          onDeleteTask={handleDeleteTask}
          onAddNewTask={() => {
            setEditingTask(null);
            setIsEditModalOpen(true);
          }}
        />
      </main>

      {/* Task Edit Modal */}
      <TaskEditModal
        task={editingTask}
        allTasks={tasks}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Break Modal */}
      <BreakModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-charcoal-400">
        CogniSync • {user ? `Signed in as ${user.email}` : 'Demo Mode (Offline Local Storage)'}
      </footer>
    </div>
  );
}
