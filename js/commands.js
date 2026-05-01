// ── Helper: Generate and print CV via browser print dialog ──
function _generateAndPrintCV(terminal) {
  const d = DATA.owner;
  const el = document.getElementById('cv-printable');

  const allSkills = [
    ...DATA.skills.languages,
    ...DATA.skills.frameworks,
    ...DATA.skills.tools,
  ];

  el.innerHTML = `
    <p class="cv-name">${d.name}</p>
    <p class="cv-meta">${d.role} &nbsp;&middot;&nbsp; ${d.location} &nbsp;&middot;&nbsp; ${d.email} &nbsp;&middot;&nbsp; ${d.github}</p>

    <p class="cv-section-title">Experience</p>
    ${DATA.experience.map(j => `
      <div class="cv-entry">
        <div class="cv-entry-title">${j.role} &mdash; ${j.company}</div>
        <div class="cv-entry-sub">${j.period} &middot; ${j.location}</div>
        <ul class="cv-bullets">${j.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>`).join('')}

    <p class="cv-section-title">Education</p>
    ${DATA.education.map(e => `
      <div class="cv-entry">
        <div class="cv-entry-title">${e.degree} &mdash; ${e.institution}</div>
        <div class="cv-entry-sub">${e.year}${e.detail ? ' &middot; ' + e.detail : ''}</div>
      </div>`).join('')}

    <p class="cv-section-title">Projects</p>
    ${DATA.projects.map(p => `
      <div class="cv-entry">
        <div class="cv-entry-title">${p.name}</div>
        <div class="cv-entry-sub">${p.stack.join(', ')} &middot; ${p.status}</div>
        <ul class="cv-bullets">${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
        ${p.github ? `<div class="cv-entry-sub">${p.github}</div>` : ''}
      </div>`).join('')}

    <p class="cv-section-title">Skills</p>
    <div class="cv-skills">
      ${allSkills.map(s => `<div class="cv-skill">&bull; ${s.name}</div>`).join('')}
    </div>
  `;

  terminal.print('  Opening print dialog — select "Save as PDF" to download.', 'green');
  terminal.print('  Tip: Portrait · A4/Letter · margins = None for best result.', 'green-muted');
  setTimeout(() => window.print(), 600);
}

// ── Helper: ASCII skill bar ────────────────────────────────
function _bar(level, max = 10) {
  return '[' + '█'.repeat(level) + '░'.repeat(max - level) + ']';
}

// ── Helper: Print the name banner ─────────────────────────
function _printBanner(terminal) {
  terminal.printBlank();
  const art = [
    '   ___  ___ ____  ____  ___ _  __',
    '  / __|_ _|  _ \\|  _ \\|_ _| |/ /',
    '  \\__ \\| || | | | | | || || \' / ',
    '  |___/___|____/|____/|___|_|\\_\\',
  ];
  art.forEach(l => terminal.print(l, 'green', true));
  terminal.printBlank();
  terminal.print('  H U S A M U D D I N  ·  Frontend Developer  ·  London UK', 'amber', true);
  terminal.printBlank();
}

// ── Helper: Print skills ───────────────────────────────────
function _printSkills(terminal) {
  terminal.printBlank();
  terminal.print('  SKILLS', 'amber', true);
  terminal.print('  ' + '─'.repeat(50), 'green-muted');

  const sections = [
    { label: 'LANGUAGES',  key: 'languages'  },
    { label: 'FRAMEWORKS', key: 'frameworks' },
    { label: 'TOOLS',      key: 'tools'      },
  ];

  sections.forEach(({ label, key }) => {
    terminal.printBlank();
    terminal.print(`  ${label}`, 'amber');
    DATA.skills[key].forEach(s => {
      terminal.print(`    ${s.name.padEnd(16)}  ${_bar(s.level)}  ${s.level}/10`, 'green');
    });
  });

  terminal.printBlank();
  terminal.print('  ' + '─'.repeat(50), 'green-muted');
  terminal.printBlank();
}

// ── Helper: Print resume ───────────────────────────────────
function _printResume(terminal) {
  const d = DATA.owner;
  const W = 54;
  const row  = (t, c = 'white') => terminal.print(`  ║ ${String(t).slice(0, W).padEnd(W)} ║`, c);
  const sep  = (c = 'amber')    => terminal.print(`  ╠${'═'.repeat(W + 2)}╣`, c);
  const hsep = (c = 'green-muted') => terminal.print(`  ║ ${'─'.repeat(W)} ║`, c);

  terminal.printBlank();
  terminal.print(`  ╔${'═'.repeat(W + 2)}╗`, 'amber', true);
  row(d.name, 'amber');
  row(`${d.role}  ·  ${d.location}`);
  row(d.email, 'green-dim');
  sep(); row('EDUCATION', 'amber'); hsep();
  DATA.education.forEach(e => {
    row(e.institution);
    row(`${e.degree}  ·  ${e.year}`, 'green-dim');
    if (e.detail) row(e.detail);
  });
  sep(); row('EXPERIENCE', 'amber'); hsep();
  DATA.experience.forEach(j => {
    row(`${j.company}  ·  ${j.role}`);
    row(`${j.period}  ·  ${j.location}`, 'green-dim');
    j.bullets.forEach(b => row('  • ' + b));
  });
  sep(); row('PROJECTS', 'amber'); hsep();
  DATA.projects.forEach(p => {
    row(`${p.name}  (${p.stack.slice(0, 3).join(', ')})`);
    row(p.tagline, 'green-dim');
  });
  sep();
  row("Type 'projects' for full details with links", 'green-muted');
  terminal.print(`  ╚${'═'.repeat(W + 2)}╝`, 'amber');
  terminal.printBlank();
}

// ── Helper: Matrix rain canvas ────────────────────────────
function _triggerNeo(terminal) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;' +
    'z-index:9998;pointer-events:none;opacity:1;transition:opacity 1s';
  document.body.appendChild(canvas);

  const ctx    = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();

  const cols  = Math.floor(canvas.width / 16);
  const drops = Array.from({ length: cols }, () => Math.random() * -50);
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01234567890ABCDEF<>{}[]|\\/?';
  const start = Date.now();

  function draw() {
    const elapsed = Date.now() - start;

    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '14px JetBrains Mono, monospace';

    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      const x  = i * 16;
      // bright head
      ctx.fillStyle = '#ffffff';
      ctx.fillText(ch, x, y * 16);
      // green body
      ctx.fillStyle = '#00ff41';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, (y - 1) * 16);

      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    });

    if (elapsed < 3500) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.opacity = '0';
      setTimeout(() => canvas.remove(), 1000);
    }
  }

  requestAnimationFrame(draw);

  terminal.print('  Wake up, Neo...', 'green-dim');
  setTimeout(() => terminal.print('  The Matrix has you.', 'green'), 600);
  setTimeout(() => terminal.print('  Follow the white rabbit.', 'green'), 1400);
  setTimeout(() => {
    terminal.print('  [Matrix rain fading in 4s...]', 'green-muted');
    terminal.scrollToBottom();
  }, 2200);
}

// ── Helper: Fake rm -rf / sequence ────────────────────────
function _triggerRmRf(terminal) {
  const paths = ['/bin', '/usr', '/lib', '/etc', '/home', '/var', '/opt', '/tmp'];
  let delay = 0;

  paths.forEach(p => {
    setTimeout(() => {
      terminal.print(`  Removing ${p}...`, 'red');
      terminal.scrollToBottom();
    }, delay);
    delay += 280;
  });

  const bars = [
    { b: '████████████', n: '100%', c: 'green'  },
    { b: '████████░░░░', n: ' 66%', c: 'amber'  },
    { b: '█████░░░░░░░', n: ' 41%', c: 'amber'  },
    { b: '███░░░░░░░░░', n: ' 25%', c: 'red'    },
    { b: '░░░░░░░░░░░░', n: '  0%', c: 'red'    },
  ];

  setTimeout(() => terminal.printBlank(), delay);
  bars.forEach((bar, i) => {
    setTimeout(() => {
      terminal.print(`  System integrity: [${bar.b}] ${bar.n}`, bar.c);
      terminal.scrollToBottom();
    }, delay + 80 + i * 380);
  });

  const total = delay + bars.length * 380 + 200;

  setTimeout(() => {
    terminal.printBlank();
    terminal.print('  ╔══════════════════════════════════════╗', 'red');
    terminal.print('  ║   FATAL: System destroyed.           ║', 'red');
    terminal.print('  ║   Initiating reboot sequence...      ║', 'red');
    terminal.print('  ╚══════════════════════════════════════╝', 'red');
  }, total);

  [1000, 1700, 2400].forEach((t, i) =>
    setTimeout(() => terminal.print('  ' + '.'.repeat(i + 1), 'green-muted'), total + t)
  );

  setTimeout(() => {
    terminal.printBlank();
    terminal.print("  Just kidding. You're safe. Welcome back.", 'green');
    terminal.print('  (Please never do this on a real machine.)', 'green-muted');
    terminal.printBlank();
    terminal.scrollToBottom();
  }, total + 3200);
}

// ── Command registry ──────────────────────────────────────
const COMMANDS = {

  // ---- help -----------------------------------------------
  help: {
    description: 'List available commands',
    hidden: false,
    execute(args, terminal) {
      const visible = Object.entries(COMMANDS).filter(([, v]) => !v.hidden);
      terminal.printBlank();
      terminal.print('  AVAILABLE COMMANDS', 'amber', true);
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      terminal.printBlank();
      visible.forEach(([name, def]) => {
        terminal.printColumns(`    ${name}`, def.description);
      });
      terminal.printBlank();
      terminal.print('  Tab to autocomplete  ·  ↑↓ for history  ·  Ctrl+L to clear', 'green-muted');
      terminal.printBlank();
    },
  },

  // ---- whoami / about -------------------------------------
  whoami: {
    description: 'Display information about this developer',
    hidden: false,
    execute(args, terminal) {
      const d = DATA.owner;
      _printBanner(terminal);
      terminal.print(`  ${d.bio}`, 'white');
      terminal.printBlank();
      terminal.print(`  Location  :  ${d.location}`, 'white');
      terminal.print(
        `  Status    :  ${d.available ? '● Available for hire' : '○ Currently employed'}`,
        d.available ? 'green' : 'green-dim'
      );
      terminal.printBlank();
      terminal.print("  Type 'projects' to see my work.", 'green-muted');
      terminal.printBlank();
    },
  },

  about: {
    description: 'Alias for whoami',
    hidden: false,
    execute(args, terminal) { COMMANDS.whoami.execute(args, terminal); },
  },

  // ---- projects -------------------------------------------
  projects: {
    description: 'List projects, or view details: projects <slug>',
    hidden: false,
    execute(args, terminal) {
      if (args.length === 0) {
        terminal.printBlank();
        terminal.print('  PROJECTS', 'amber', true);
        terminal.print('  ' + '─'.repeat(52), 'green-muted');
        terminal.printBlank();
        DATA.projects.forEach((p, i) => {
          terminal.print(`  [${String(i + 1).padStart(2, '0')}]  ${p.name}`, 'cyan');
          terminal.print(`        ${p.tagline}`, 'white');
          terminal.print(`        Stack: ${p.stack.join(', ')}`, 'green-dim');
          terminal.printBlank();
        });
        terminal.print("  Use 'projects <slug>' for full detail.", 'green-muted');
        terminal.print(`  Slugs: ${DATA.projects.map(p => p.slug).join(', ')}`, 'green-muted');
        terminal.printBlank();
      } else {
        const q = args.join(' ').toLowerCase();
        const p = DATA.projects.find(
          x => x.slug.toLowerCase() === q || x.name.toLowerCase().includes(q)
        );
        if (!p) {
          terminal.print(`  Error: project '${args.join(' ')}' not found.`, 'red');
          terminal.print(`  Available slugs: ${DATA.projects.map(x => x.slug).join(', ')}`, 'green-muted');
        } else {
          terminal.printProjectCard(p);
        }
      }
    },
  },

  // ---- skills ---------------------------------------------
  skills: {
    description: 'Show skills and proficiency levels',
    hidden: false,
    execute(args, terminal) { _printSkills(terminal); },
  },

  // ---- experience -----------------------------------------
  experience: {
    description: 'Show work experience',
    hidden: false,
    execute(args, terminal) {
      terminal.printBlank();
      terminal.print('  WORK EXPERIENCE', 'amber', true);
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      DATA.experience.forEach(j => {
        terminal.printBlank();
        terminal.print(`  ${j.company}`, 'amber');
        terminal.print(`  ${j.role}`, 'green');
        terminal.print(`  ${j.period}  ·  ${j.location}`, 'green-dim');
        terminal.printBlank();
        j.bullets.forEach(b => terminal.print(`    • ${b}`, 'white'));
      });
      terminal.printBlank();
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      terminal.printBlank();
    },
  },

  // ---- education ------------------------------------------
  education: {
    description: 'Show education background',
    hidden: false,
    execute(args, terminal) {
      terminal.printBlank();
      terminal.print('  EDUCATION', 'amber', true);
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      DATA.education.forEach(e => {
        terminal.printBlank();
        terminal.print(`  ${e.institution}`, 'amber');
        terminal.print(`  ${e.degree}`, 'green');
        terminal.print(`  ${e.year}`, 'green-dim');
        if (e.detail) terminal.print(`  ${e.detail}`, 'white');
      });
      terminal.printBlank();
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      terminal.printBlank();
    },
  },

  // ---- contact / social -----------------------------------
  contact: {
    description: 'Show contact information',
    hidden: false,
    execute(args, terminal) {
      const d = DATA.owner;
      terminal.printBlank();
      terminal.print('  CONTACT', 'amber', true);
      terminal.print('  ' + '─'.repeat(52), 'green-muted');
      terminal.printBlank();
      terminal.print(`  [>]  Email     :  ${d.email}`, 'white');
      terminal.print(`  [>]  GitHub    :  ${d.github}`, 'cyan');
      terminal.print(`  [>]  LinkedIn  :  ${d.linkedin}`, 'cyan');
      terminal.printBlank();
      terminal.print(
        `  Status  :  ${d.available ? '● Available for hire' : '○ Currently employed'}`,
        d.available ? 'green' : 'green-dim'
      );
      terminal.printBlank();
      terminal.print("  Type 'open github' or 'open linkedin' to visit.", 'green-muted');
      terminal.printBlank();
    },
  },

  social: {
    description: 'Alias for contact',
    hidden: false,
    execute(args, terminal) { COMMANDS.contact.execute(args, terminal); },
  },

  // ---- open -----------------------------------------------
  open: {
    description: 'Open a link: open <github|linkedin|email>',
    hidden: false,
    execute(args, terminal) {
      const d = DATA.owner;
      const map = {
        github:   d.github,
        linkedin: d.linkedin,
        email:    `mailto:${d.email}`,
      };
      const target = (args[0] || '').toLowerCase();
      if (!target || !map[target]) {
        terminal.print('  Usage: open <github|linkedin|email>', 'red');
        return;
      }
      window.open(map[target], '_blank', 'noopener');
      terminal.print(`  Opening ${target}...`, 'green');
    },
  },

  // ---- clear / cls ----------------------------------------
  clear: {
    description: 'Clear the terminal',
    hidden: false,
    execute(args, terminal) { terminal.clear(); },
  },

  cls: {
    description: 'Alias for clear',
    hidden: false,
    execute(args, terminal) { terminal.clear(); },
  },

  // ---- ls -------------------------------------------------
  ls: {
    description: 'List directory contents',
    hidden: false,
    execute(args, terminal) {
      terminal.printBlank();
      terminal.print('  total 7', 'green-dim');
      terminal.print('  drwxr-xr-x  visitor  projects/', 'green');
      terminal.print('  -rw-r--r--  visitor  about.txt', 'white');
      terminal.print('  -rw-r--r--  visitor  skills.txt', 'white');
      terminal.print('  -rw-r--r--  visitor  experience.txt', 'white');
      terminal.print('  -rw-r--r--  visitor  education.txt', 'white');
      terminal.print('  -rw-r--r--  visitor  contact.txt', 'white');
      terminal.print('  -rw-r--r--  visitor  resume.txt', 'white');
      terminal.printBlank();
      terminal.print("  Try: cat about.txt  ·  cat projects  ·  curl resume", 'green-muted');
      terminal.printBlank();
    },
  },

  // ---- cat ------------------------------------------------
  cat: {
    description: 'Read a file: cat <about|skills|projects|contact|resume>',
    hidden: false,
    execute(args, terminal) {
      const fileMap = {
        'about.txt': 'whoami', 'about': 'whoami',
        'skills.txt': 'skills', 'skills': 'skills',
        'projects.txt': 'projects', 'projects': 'projects',
        'experience.txt': 'experience', 'experience': 'experience',
        'education.txt': 'education', 'education': 'education',
        'contact.txt': 'contact', 'contact': 'contact',
        'resume.txt': '_resume', 'resume': '_resume',
      };
      const key = fileMap[(args[0] || '').toLowerCase()];
      if (key === '_resume') {
        _printResume(terminal);
      } else if (key) {
        COMMANDS[key].execute([], terminal);
      } else if (args[0]) {
        terminal.print(`  cat: ${args[0]}: No such file or directory`, 'red');
        terminal.print('  Try: about.txt, skills.txt, projects.txt, contact.txt, resume.txt', 'green-muted');
      } else {
        terminal.print('  Usage: cat <filename>', 'red');
      }
    },
  },

  // ---- pwd ------------------------------------------------
  pwd: {
    description: 'Print working directory',
    hidden: false,
    execute(args, terminal) {
      terminal.print('  /home/visitor/portfolio', 'green');
    },
  },

  // ---- date -----------------------------------------------
  date: {
    description: 'Display current date and time',
    hidden: false,
    execute(args, terminal) {
      terminal.print(`  ${new Date().toString()}`, 'green');
    },
  },

  // ---- uptime ---------------------------------------------
  uptime: {
    description: 'Time since page loaded',
    hidden: false,
    execute(args, terminal) {
      const ms   = Date.now() - terminal.sessionStart;
      const mins = Math.floor(ms / 60000);
      const secs = Math.floor((ms % 60000) / 1000);
      terminal.printBlank();
      terminal.print(
        `  System uptime: ${mins} minute${mins !== 1 ? 's' : ''}, ${secs} second${secs !== 1 ? 's' : ''}`,
        'green'
      );
      if (ms > 60000) {
        terminal.print(
          `  You've been here ${mins} minute${mins !== 1 ? 's' : ''} without hiring me.`,
          'amber'
        );
        terminal.print("  Type 'contact' to fix that.", 'green-muted');
      }
      terminal.printBlank();
    },
  },

  // ---- history --------------------------------------------
  history: {
    description: 'Show command history for this session',
    hidden: false,
    execute(args, terminal) {
      if (terminal.history.length === 0) {
        terminal.print('  No history yet.', 'green-muted');
        return;
      }
      terminal.printBlank();
      [...terminal.history].reverse().forEach((cmd, i) => {
        terminal.printColumns(`  ${String(i + 1).padStart(3)}.`, cmd);
      });
      terminal.printBlank();
    },
  },

  // ---- man ------------------------------------------------
  man: {
    description: 'Manual page for a command: man <cmd>',
    hidden: false,
    execute(args, terminal) {
      const cmd = args[0];
      if (!cmd || !COMMANDS[cmd]) {
        terminal.print('  Usage: man <command>', 'red');
        terminal.print(`  Try: man ${Object.keys(COMMANDS).filter(k => !COMMANDS[k].hidden)[0]}`, 'green-muted');
        return;
      }
      terminal.printBlank();
      terminal.print(`  MAN PAGE: ${cmd.toUpperCase()}`, 'amber', true);
      terminal.print('  ' + '─'.repeat(44), 'green-muted');
      terminal.print(`  ${COMMANDS[cmd].description || 'No description available.'}`, 'white');
      terminal.printBlank();
    },
  },

  // ---- theme ----------------------------------------------
  theme: {
    description: 'Switch color theme: matrix, amber, blood, ice',
    hidden: false,
    execute(args, terminal) {
      const themes = ['matrix', 'amber', 'blood', 'ice'];
      const name   = (args[0] || '').toLowerCase();
      if (!name || !themes.includes(name)) {
        terminal.print(`  Usage: theme <${themes.join('|')}>`, 'red');
        terminal.print(
          `  Current: ${document.documentElement.dataset.theme || 'matrix'}`,
          'green-dim'
        );
        return;
      }
      const val = name === 'matrix' ? '' : name;
      document.documentElement.dataset.theme = val;
      localStorage.setItem('portfolio-theme', val);
      terminal.print(`  Theme switched → ${name}`, 'green');
      terminal.print("  (Type 'theme matrix' to reset to default)", 'green-muted');
    },
  },

  // ---- banner ---------------------------------------------
  banner: {
    description: 'Display the ASCII name banner',
    hidden: false,
    execute(args, terminal) { _printBanner(terminal); },
  },

  // ---- download -------------------------------------------
  download: {
    description: 'Download CV as PDF: download cv',
    hidden: false,
    execute(args, terminal) {
      if ((args[0] || '').toLowerCase() !== 'cv') {
        terminal.print('  Usage: download cv', 'red');
        return;
      }
      _generateAndPrintCV(terminal);
    },
  },

  // ---- curl -----------------------------------------------
  curl: {
    description: 'Fetch resources: curl resume',
    hidden: false,
    execute(args, terminal) {
      if ((args[0] || '').toLowerCase() === 'resume') {
        _printResume(terminal);
      } else {
        terminal.print('  Usage: curl resume', 'red');
        terminal.print('  (Only one endpoint available in this terminal)', 'green-muted');
      }
    },
  },

  // ---- sudo -----------------------------------------------
  sudo: {
    description: undefined,
    hidden: true,
    execute(args, terminal) {
      if (args[0] === 'hire' || args[0] === 'hire-me') {
        COMMANDS.hire.execute([], terminal);
        return;
      }
      terminal.print('  [sudo] password for visitor: ', 'white');
      setTimeout(() => {
        terminal.print('', 'white');
        terminal.print('  Sorry, try again.', 'red');
        setTimeout(() => {
          terminal.print('  [sudo] password for visitor: ', 'white');
          setTimeout(() => {
            terminal.print('', 'white');
            terminal.print('  visitor is not in the sudoers file.', 'red');
            terminal.print('  This incident will be reported.', 'red');
            terminal.printBlank();
            terminal.scrollToBottom();
          }, 1600);
        }, 800);
      }, 1400);
    },
  },

  // ---- exit -----------------------------------------------
  exit: {
    description: 'Exit the terminal',
    hidden: false,
    execute(args, terminal) {
      terminal.printBlank();
      terminal.print('  "You can check out any time you like,', 'amber');
      terminal.print('   but you can never leave."', 'amber');
      terminal.print('    — Hotel California, Eagles', 'green-dim');
      terminal.printBlank();
      terminal.print('  This terminal cannot be exited.', 'white');
      terminal.print('  Refresh the page if you dare.', 'green-muted');
      terminal.printBlank();
      terminal.pulseClass('glitch-shake', 900);
    },
  },

  // ---- hire (HIDDEN easter egg) ---------------------------
  hire: {
    description: undefined,
    hidden: true,
    execute(args, terminal) {
      const d = DATA.owner;
      const W = 48;
      const row = (t, c = 'amber') =>
        terminal.print(`  ║ ${String(t).slice(0, W).padEnd(W)} ║`, c);

      terminal.printBlank();
      terminal.print(`  ╔${'═'.repeat(W + 2)}╗`, 'amber', true);
      row('');
      row('  Excellent taste.', 'amber');
      row(`  You are looking at the portfolio of`, 'white');
      row(`  ${d.name}.`, 'amber');
      row('');
      row(
        d.available
          ? '  Currently available for hire.'
          : '  Open to interesting opportunities.',
        'green'
      );
      row('');
      row("  Let's make something great together.", 'white');
      row('');
      terminal.print(`  ╚${'═'.repeat(W + 2)}╝`, 'amber', true);
      terminal.printBlank();
      terminal.print(`  Email    :  ${d.email}`, 'cyan');
      terminal.print(`  GitHub   :  ${d.github}`, 'cyan');
      terminal.print(`  LinkedIn :  ${d.linkedin}`, 'cyan');
      terminal.printBlank();
      terminal.pulseClass('pulse-amber', 1800);
      terminal.scrollToBottom();
    },
  },

  // ---- neo (HIDDEN easter egg) ----------------------------
  neo: {
    description: undefined,
    hidden: true,
    execute(args, terminal) { _triggerNeo(terminal); },
  },

};

// ── Dispatch ──────────────────────────────────────────────
function dispatch(rawInput, terminal) {
  const input = rawInput.trim();

  // Special multi-word commands
  if (input === 'rm -rf /' || input === 'rm -rf *' || input === 'rm -rf .') {
    _triggerRmRf(terminal);
    return;
  }
  if (input === 'curl resume') {
    _printResume(terminal);
    return;
  }

  const [cmd, ...args] = input.toLowerCase().split(/\s+/);
  if (!cmd) return;

  if (COMMANDS[cmd]) {
    COMMANDS[cmd].execute(args, terminal);
  } else {
    terminal.print(`  bash: ${cmd}: command not found`, 'red');
    terminal.print("  Type 'help' for available commands.", 'green-muted');
  }
}
