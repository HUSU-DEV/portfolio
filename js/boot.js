// Boot sequence — runs once on DOMContentLoaded.
// Typewriter drives each line; Terminal.init() unlocks input at the end.

window.addEventListener('DOMContentLoaded', () => {
  const outputEl = document.getElementById('terminal-output');

  // Instantiate terminal (binds events; input locked until init() is called)
  const terminal = new Terminal();

  // Hide cursor during boot
  document.getElementById('cursor-block').style.display = 'none';

  // ── Boot sequence descriptors ────────────────────────────
  const SEP = '  ' + '─'.repeat(56);
  const sequences = [
    // BIOS lines
    { text: '  [BIOS v2.4.1] Initializing memory banks...............', speed: 14, color: 'green-dim',  suffix: ' OK',       suffixColor: 'green'     },
    { text: '  [BIOS v2.4.1] Loading kernel modules...................', speed: 14, color: 'green-dim',  suffix: ' OK',       suffixColor: 'green'     },
    { text: '  [BIOS v2.4.1] Mounting filesystem......................', speed: 14, color: 'green-dim',  suffix: ' OK',       suffixColor: 'green'     },
    { blank: true },
    // OS banner
    { text: '  PORTFOLIO OS v1.0.0  —  Built with caffeine & keystrokes', speed: 22, color: 'amber', bold: true, delay: 120 },
    { blank: true },
    // Status lines
    { text: '  Scanning for recruiter presence.............', speed: 16, color: 'green-dim', suffix: ' DETECTED', suffixColor: 'amber',     suffixBold: true, delay: 60 },
    { text: '  Loading personality matrix...................',  speed: 16, color: 'green-dim', suffix: ' LOADED',   suffixColor: 'green'      },
    { text: '  Injecting charm subroutines.................',  speed: 16, color: 'green-dim', suffix: ' SUCCESS',  suffixColor: 'green'      },
    { text: '  Checking coffee levels......................',   speed: 16, color: 'green-dim', suffix: ' CRITICAL', suffixColor: 'red'        },
    { blank: true },
    { text: '  System ready. All cylinders firing.', speed: 20, color: 'green', delay: 80 },
    { blank: true },
    { text: SEP, instant: true, color: 'green-muted' },
    { blank: true },
    // Welcome message
    { text: `  Welcome. You have found the portfolio of ${DATA.owner.name}.`, speed: 22, color: 'white', delay: 120 },
    { text: `  ${DATA.owner.role}. Problem solver. Coffee-to-code converter.`, speed: 20, color: 'white' },
    { blank: true },
    { text: "  Type 'help' to see all commands.", speed: 18, color: 'green-dim' },
    { text: "  Type 'whoami' to start. Or 'projects' to skip ahead.", speed: 18, color: 'green-dim' },
    { blank: true },
    { text: SEP, instant: true, color: 'green-muted' },
    { blank: true },
  ];

  Typewriter.runSequence(sequences, outputEl, () => {
    terminal.init();
    setupKonami(terminal);
  });

  // ── Konami code listener ────────────────────────────────
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
