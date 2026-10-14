/**
 * CogniSync Thought Organizer Parser
 * 
 * Note: Uses local natural-language heuristic parsing by default (clearly labeled Demo Mode).
 * Can optionally connect to Gemini if user provides their key in runtime settings.
 */

export function parseBrainDumpDemo(text) {
  if (!text || !text.trim()) return [];

  // Normalize lines and split by line breaks or numbered points or bullet points
  const rawSegments = text
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])|^\s*[-*•]\s+/m)
    .map(s => s.trim().replace(/^[-*•\d.)\s]+/, ''))
    .filter(s => s.length > 5);

  const parsedTasks = [];
  let previousTaskId = null;

  rawSegments.forEach((segment, idx) => {
    const lower = segment.toLowerCase();
    
    // Determine energy
    let energy = 'Medium';
    if (/design|architect|roadmap|pitch|deck|prototype|implement|code|build|refactor|write proposal|debug complex|analyze/i.test(lower)) {
      energy = 'High';
    } else if (/email|reply|inbox|tabs|clean|archive|dentist|appointment|order|coffee|groceries|quick check|browse/i.test(lower)) {
      energy = 'Low';
    } else {
      energy = 'Medium';
    }

    // Determine priority
    let priority = 'Medium';
    if (/urgent|critical|must|asap|first|immediately|today|tomorrow morning|important|10 am/i.test(lower)) {
      priority = 'High';
    } else if (/when i get a break|someday|eventually|leisure|optional|if time/i.test(lower)) {
      priority = 'Low';
    }

    // Extract deadline clues
    let deadline = null;
    let deadlineTimestamp = null;
    if (/tomorrow morning|tomorrow at 10 am|tomorrow/i.test(lower)) {
      deadline = 'Tomorrow, 10:00 AM';
      deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 20;
    } else if (/today|before 5 pm|this afternoon/i.test(lower)) {
      deadline = 'Today, 5:00 PM';
      deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 5;
    } else if (/friday/i.test(lower)) {
      deadline = 'This Friday, 5:00 PM';
      deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 72;
    } else if (/in (\d+) days/i.test(lower)) {
      const match = lower.match(/in (\d+) days/i);
      deadline = `In ${match[1]} days`;
      deadlineTimestamp = Date.now() + 1000 * 60 * 60 * 24 * parseInt(match[1]);
    }

    // Dependency detection: e.g. "First I must finish..." vs following tasks
    let dependsOn = null;
    if (/after|once .* is done|following/i.test(lower) && previousTaskId) {
      dependsOn = previousTaskId;
    } else if (/pitch deck|presentation|slides/i.test(lower) && parsedTasks.some(t => /analytics|metrics|review/i.test(t.title))) {
      const prerequisite = parsedTasks.find(t => /analytics|metrics|review/i.test(t.title));
      if (prerequisite) dependsOn = prerequisite.id;
    }

    // Clean title & description
    let title = segment.charAt(0).toUpperCase() + segment.slice(1);
    if (title.length > 70) {
      const words = title.split(' ');
      title = words.slice(0, 8).join(' ') + '...';
    }

    const taskId = `task-dump-${Date.now()}-${idx}`;

    parsedTasks.push({
      id: taskId,
      title: title.replace(/[.!?]+$/, ''),
      description: segment,
      priority,
      energy,
      deadline,
      deadlineTimestamp,
      dependsOn,
      completed: false,
      estimatedMinutes: energy === 'High' ? 45 : energy === 'Medium' ? 25 : 15,
      category: energy === 'High' ? 'Deep Work' : energy === 'Medium' ? 'Tactical' : 'Light Admin'
    });

    previousTaskId = taskId;
  });

  // Re-link if "First I must..." was parsed:
  // If task B mentions "First I must...", it should actually be done before task A!
  return parsedTasks;
}

