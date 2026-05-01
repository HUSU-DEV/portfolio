// Boot sequence — runs once on DOMContentLoaded.
// Typewriter drives each line; Terminal.init() unlocks input at the end.

window.addEventListener('DOMContentLoaded', () => {
  const outputEl = document.getElementById('terminal-output');

  // Restore saved color theme before anything renders
  const savedTheme = localStorage.getItem('portfolio-theme') || '';
  if (savedTheme) document.documentElement.dataset.theme = savedTheme;

  // Instantiate terminal (events bound; input locked until init() is called)
  const terminal = new Terminal();

  // Hide cursor during boot
  document.getElementById('cursor-block').style.display = 'none';

  // ── Skip state ───────────────────────────────────────────
  const skipState = {
    skip: false,
    _pendingDelay: null,
    triggerSkip() {
      if (this.skip) return;
      this.skip = true;
      if (this._pendingDelay) {
        this._pendingDelay();
        this._pendingDelay = null;
      }
      if (hintEl.parentNode) hintEl.remove();
    },
  };

  // Show skip hint at top of output
  const hintEl = document.createElement('div');
  hintEl.className = 'line color-green-muted';
  hintEl.textContent = '  [Press any key or click to skip boot sequence...]';
  outputEl.appendChild(hintEl);

  const onSkip = () => skipState.triggerSkip();
  document.addEventListener('keydown', onSkip);
  document.addEventListener('click',   onSkip);

  // ── Boot sequence descriptors ────────────────────────────
  const SEP = '  ' + '─'.repeat(56);
  const sequences = [
    { text: '  [BIOS v2.4.1] Initializing memory banks...............', speed: 14, color: 'green-dim', suffix: ' OK',       suffixColor: 'green'  },
    { text: '  [BIOS v2.4.1] Loading kernel modules...................', speed: 14, color: 'green-dim', suffix: ' OK',       suffixColor: 'green'  },
    { text: '  [BIOS v2.4.1] Mounting filesystem......................', speed: 14, color: 'green-dim', suffix: ' OK',       suffixColor: 'green'  },
    { blank: true },
    { text: '  PORTFOLIO OS v1.0.0  —  Built with caffeine & keystrokes', speed: 22, color: 'amber', bold: true, delay: 120 },
    { blank: true },
    { text: '  Scanning for recruiter presence.............', speed: 16, color: 'green-dim', suffix: ' DETECTED', suffixColor: 'amber', suffixBold: true, delay: 60 },
    { text: '  Loading personality matrix...................',  speed: 16, color: 'green-dim', suffix: ' LOADED',   suffixColor: 'green' },
    { text: '  Injecting charm subroutines.................',  speed: 16, color: 'green-dim', suffix: ' SUCCESS',  suffixColor: 'green' },
    { text: '  Checking coffee levels......................',   speed: 16, color: 'green-dim', suffix: ' CRITICAL', suffixColor: 'red'   },
    { blank: true },
    { text: '  System ready. All cylinders firing.', speed: 20, color: 'green', delay: 80 },
    { blank: true },
    { text: SEP, instant: true, color: 'green-muted' },
    { blank: true },
    { text: `  Welcome. You have found the portfolio of ${DATA.owner.name}.`, speed: 22, color: 'white', delay: 120 },
    { text: `  ${DATA.owner.role}. Problem solver. Coffee-to-code converter.`,  speed: 20, color: 'white' },
    { blank: true },
    { text: "  Type 'help' to see all commands.", speed: 18, color: 'green-dim' },
    { text: "  Type 'whoami' to start. Or 'projects' to skip ahead.", speed: 18, color: 'green-dim' },
    { blank: true },
    { text: SEP, instant: true, color: 'green-muted' },
    { blank: true },
  ];

  Typewriter.runSequence(sequences, outputEl, skipState, () => {
    // Remove skip hint (in case it survived to natural end)
    if (hintEl.parentNode) hintEl.remove();
    document.removeEventListener('keydown', onSkip);
    document.removeEventListener('click',   onSkip);
    terminal.init();
    setupKonami(terminal);
  });

  // ── Konami code listener ─────────────────────────────────
  function setupKonami(terminal) {
    const seq = [
      'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
      'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
      'b','a',
    ];
    let idx = 0;

    document.addEventListener('keydown', e => {
      const k = e.key;
      if (k === seq[idx] || k.toLowerCase() === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          terminal.printBlank();
          terminal.print('  ↑↑↓↓←→←→BA  —  Cheat code accepted.', 'amber', true);
          terminal.print('  Unlocking: God Mode...', 'green');
          terminal.printBlank();
          terminal.print('  All secrets revealed. All projects A+. All bugs squashed.', 'white');
          terminal.print('  (Okay fine, the bugs are still there. But nice try.)', 'green-muted');
          terminal.printBlank();
          terminal.scrollToBottom();
          terminal.pulseClass('pulse-rainbow', 2000);
          idx = 0;
        }
      } else {
        idx = (k === seq[0] || k.toLowerCase() === seq[0]) ? 1 : 0;
      }
    });
  }
});
