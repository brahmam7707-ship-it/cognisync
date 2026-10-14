/**
 * CogniSync Cognitive Recommendation Engine
 * Matches current user energy, deadline urgency, priority, and dependency readiness.
 */

export function getRecommendedTask(tasks, userEnergy, skippedTaskIds = new Set()) {
  const uncompleted = tasks.filter(t => !t.completed);
  if (uncompleted.length === 0) return null;

  // Map of completed task IDs
  const completedIds = new Set(tasks.filter(t => t.completed).map(t => t.id));

  // Determine readiness: dependencies must be satisfied
  const readyTasks = uncompleted.filter(task => {
    if (!task.dependsOn) return true;
    return completedIds.has(task.dependsOn);
  });

  if (readyTasks.length === 0) {
    // If all tasks are blocked, return the task that unblocks the most dependencies
    return {
      task: uncompleted[0],
      reason: "Blocked dependency cycle detected. Prioritize resolving root prerequisites.",
      isBlocked: true
    };
  }

  // Score candidate tasks
  const scored = readyTasks.map(task => {
    let score = 0;
    let reasons = [];

    // 1. Energy compatibility
    if (userEnergy === 'High') {
      if (task.energy === 'High') {
        score += 50;
        reasons.push("Matches your peak high energy");
      } else if (task.energy === 'Medium') {
        score += 25;
      } else {
        score += 10;
      }
    } else if (userEnergy === 'Medium') {
      if (task.energy === 'Medium') {
        score += 50;
        reasons.push("Ideal match for steady medium energy");
      } else if (task.energy === 'Low') {
        score += 35;
      } else {
        score -= 20; // High energy task when user is medium
      }
    } else if (userEnergy === 'Low') {
      if (task.energy === 'Low') {
        score += 60;
        reasons.push("Low friction task perfect for low energy recovery");
      } else if (task.energy === 'Medium') {
        score -= 10;
      } else {
        score -= 45; // Avoid high energy overload
      }
    }

    // 2. Deadline Urgency
    if (task.deadlineTimestamp) {
      const now = Date.now();
      const hoursRemaining = (task.deadlineTimestamp - now) / (1000 * 60 * 60);

      if (hoursRemaining <= 6) {
        score += 45;
        reasons.push("Urgent deadline within 6 hours");
      } else if (hoursRemaining <= 24) {
        score += 30;
        reasons.push("Due within 24 hours");
      } else if (hoursRemaining <= 72) {
        score += 15;
      }
    }

    // 3. Priority Weighting
    if (task.priority === 'High') {
      score += 30;
      reasons.push("Marked as High Priority");
    } else if (task.priority === 'Medium') {
      score += 15;
    }

    // 4. Penalty for recently skipped in this session
    if (skippedTaskIds.has(task.id)) {
      score -= 100;
    }

    return {
      task,
      score,
      reasons,
      isBlocked: false
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const top = scored[0];
  const primaryReason = top.reasons.length > 0 
    ? top.reasons.slice(0, 2).join(' • ')
    : "Next available item aligned with cognitive capacity";

  return {
    task: top.task,
    score: top.score,
    reason: primaryReason,
    isBlocked: false
  };
}

