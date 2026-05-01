// ============================================================
//  data.js — Edit this file to personalise your portfolio.
//  No other file needs changing for basic customisation.
// ============================================================

const DATA = {

  // ── Who are you? ──────────────────────────────────────
  owner: {
    name:      'Siddik Husamuddin',
    role:      'Frontend Developer',
    bio:       'I build fast, accessible web interfaces. Passionate about clean code, great UX, and turning complex problems into polished digital experiences.',
    location:  'London, UK',
    available: true,         // true = "Available for hire" badge
    email:     'siddikhusamuddin@gmail.com',
    github:    'https://github.com/HUSU-DEV',
    linkedin:  'https://linkedin.com/in/siddikhusamuddin',
  },

  // ── Skills ────────────────────────────────────────────
  // level: 0–10
  skills: {
    languages: [
      { name: 'JavaScript',  level: 9  },
      { name: 'HTML / CSS',  level: 10 },
      { name: 'TypeScript',  level: 7  },
      { name: 'Python',      level: 5  },
    ],
    frameworks: [
      { name: 'React',         level: 8 },
      { name: 'Node.js',       level: 7 },
      { name: 'Tailwind CSS',  level: 9 },
      { name: 'Express',       level: 6 },
    ],
    tools: [
      { name: 'Git / GitHub',  level: 9  },
      { name: 'Figma',         level: 7  },
      { name: 'VS Code',       level: 10 },
      { name: 'Docker',        level: 5  },
    ],
  },

  // ── Work Experience ────────────────────────────────────
  experience: [
    {
      company:  'Your Company Name',
      role:     'Frontend Developer',
      period:   '2023 – Present',
      location: 'London, UK',
      bullets: [
        'Built and maintained responsive web interfaces used by thousands of users',
        'Collaborated with designers to implement pixel-perfect UI components',
        'Improved page load performance by 40% through code splitting and lazy loading',
        'Mentored junior developers and led weekly code review sessions',
      ],
    },
    // Add more jobs here — duplicate the object above
  ],

  // ── Education ─────────────────────────────────────────
  education: [
    {
      institution: 'London South Bank University',
      degree:      'BSc Computer Science',
      year:        '2021 – 2024',
      detail:      'Focus on Software Engineering and Web Technologies',
    },
  ],

  // ── Projects ──────────────────────────────────────────
  // slug: short name used in "projects <slug>" command
  projects: [
    {
      name:    'Project Alpha',
      slug:    'alpha',
      tagline: 'Replace this with a one-line description of your first project',
      stack:   ['JavaScript', 'HTML', 'CSS', 'Node.js'],
      status:  'In Progress',
      bullets: [
        'Edit js/data.js to replace these bullets with your real achievements',
        'Describe the problem you solved and how you solved it',
        'Mention scale, metrics, or impact — numbers impress recruiters',
      ],
      github: 'https://github.com/HUSU-DEV',
      live:   null,   // set to 'https://your-live-demo.com' or leave null
    },
    {
      name:    'Project Beta',
      slug:    'beta',
      tagline: 'Replace this with a one-line description of your second project',
      stack:   ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      status:  'Completed',
      bullets: [
        'Edit js/data.js to replace these bullets with your real achievements',
        'Open source contributions and side projects show initiative',
        'Link to the live site or npm package if available',
      ],
      github: 'https://github.com/HUSU-DEV',
      live:   null,
    },
    {
      name:    'Project Gamma',
      slug:    'gamma',
      tagline: 'Replace this with a one-line description of your third project',
      stack:   ['Next.js', 'TypeScript', 'PostgreSQL', 'Tailwind'],
      status:  'Open Source',
      bullets: [
        'Edit js/data.js to replace these bullets with your real achievements',
        'Full-stack projects demonstrate breadth across the stack',
        'Consider highlighting architectural decisions you made',
      ],
      github: 'https://github.com/HUSU-DEV',
      live:   null,
    },
  ],

};
