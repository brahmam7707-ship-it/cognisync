export const INITIAL_TASKS = [
  {
    id: "task-1",
    title: "Draft Q3 engineering roadmap & OKR presentation",
    description: "Synthesize team goals, technical debt remediation timeline, and Q3 milestones for board sync.",
    priority: "High", // 'High' | 'Medium' | 'Low'
    energy: "High",   // 'High' | 'Medium' | 'Low'
    deadline: "Today, 5:00 PM",
    deadlineTimestamp: Date.now() + 1000 * 60 * 60 * 4, // in 4 hours
    dependsOn: null,
    completed: false,
    estimatedMinutes: 45,
    category: "Strategic"
  },
  {
    id: "task-2",
    title: "Review teammate PR #142 (Cognitive Context Cache)",
    description: "Verify state invalidation logic and check memory retention test coverage.",
    priority: "High",
    energy: "Medium",
    deadline: "Today, 7:00 PM",
    deadlineTimestamp: Date.now() + 1000 * 60 * 60 * 6,
    dependsOn: null,
    completed: false,
    estimatedMinutes: 20,
    category: "Code Review"
  },
  {
    id: "task-3",
    title: "Record 2-minute product walkthrough video demo",
    description: "Quick screencast demonstrating the brain dump parsing and adaptive energy routing.",
    priority: "High",
    energy: "High",
    deadline: "Tomorrow, 11:00 AM",
    deadlineTimestamp: Date.now() + 1000 * 60 * 60 * 22,
    dependsOn: "task-1", // Depends on roadmap deck completion
    completed: false,
    estimatedMinutes: 30,
    category: "Product"
  },
  {
    id: "task-4",
    title: "Reply to customer feedback & triage support inbox",
    description: "Clear pending tier-1 sync errors and respond to enterprise integration inquiry.",
    priority: "Medium",
    energy: "Low",
    deadline: "Tomorrow, 6:00 PM",
    deadlineTimestamp: Date.now() + 1000 * 60 * 60 * 29,
    dependsOn: null,
    completed: false,
    estimatedMinutes: 15,
    category: "Operations"
  },
  {
    id: "task-5",
    title: "Audit workspace browser tabs & archive outdated notes",
    description: "Low-mental-effort housekeeping to reduce cognitive clutter before evening.",
    priority: "Low",
    energy: "Low",
    deadline: null,
    deadlineTimestamp: null,
    dependsOn: null,
    completed: false,
    estimatedMinutes: 10,
    category: "Housekeeping"
  },
  {
    id: "task-6",
    title: "Configure SSL certificate renewal alert & domain DNS",
    description: "Ensure auto-renew webhook fires 14 days before certificate expiration.",
    priority: "Medium",
    energy: "Medium",
    deadline: "In 3 days",
    deadlineTimestamp: Date.now() + 1000 * 60 * 60 * 72,
    dependsOn: null,
    completed: true,
    estimatedMinutes: 25,
    category: "DevOps"
  }
];

export const SAMPLE_BRAIN_DUMP = `Need to finalize the Q3 product roadmap pitch deck for tomorrow morning at 10 AM.
First I must finish reviewing analytics metrics from last week.
Also replied to Sarah about the UX design tokens overhaul.
Oh, and I have to renew our domain name before Friday, plus schedule a dentist appointment when I get a break.
Don't forget to push git branch for cognitive load balancer prototype!`;

