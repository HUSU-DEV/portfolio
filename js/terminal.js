// Terminal — orchestrator class.
// Instantiated once in boot.js; passed to every command as `terminal`.
class Terminal {
  constructor() {
    this.outputEl     = document.getElementById('terminal-output');
    this.inputEl      = document.getElementById('terminal-input');
    this.typedEl      = document.getElementById('typed-text');
    this.cursorEl     = document.getElementById('cursor-block');
    this.promptEl     = document.getElementById('prompt-text');
    this.titleEl      = document.getElementById('titlebar-text');
    this.container    = document.getElementById('terminal-container');

    this.history      = [];    // command history (newest first)
    this.historyIdx   = -1;    // arrow-key position
    this.isLocked     = true;  // true during boot sequence
    this.sessionStart = Date.now();

    this._bindEvents();
  }

  // Called by boot.js after boot sequence completes.
  init() {
    this.isLocked = false;
    this.cursorEl.style.display = '';
    this.inputEl.focus();
    this.scrollToBottom();
    this._startIdleGlitch();
    if ('ontouchstart' in window) this._injectMobileBar();
  }

  // ── Event bindings ──────────────────────────────────────
  _bindEvents() {
    // Click anywhere on terminal → focus hidden input
    this.container.addEventListener('click', () => {
      if (!this.isLocked) this.inputEl.focus();
    });

    // Mirror typed text to visible span
    this.inputEl.addEventListener('input', () => {
      this.typedEl.textContent = this.inputEl.value;
    });

    this.inputEl.addEventListener('keydown', e => {
      if (this.isLocked) return;
      switch (e.key) {
        case 'Enter':
          this._handleSubmit();
          break;
        case 'ArrowUp':
          this._historyUp(e);
          break;
        case 'ArrowDown':
          this._historyDown(e);
          break;
        case 'Tab':
          this._handleTab(e);
          break;
        case 'l':
          if (e.ctrlKey) { dispatch('clear', this); e.preventDefault(); }
          break;
      }
    });
  }

  _handleSubmit() {
    const value = this.inputEl.value.trim();
    this.inputEl.value = '';
    this.typedEl.textContent = '';
    if (!value) return;

    this._echoInput(value);

    this.history.unshift(value);
    this.historyIdx = -1;

    dispatch(value, this);
    this.scrollToBottom();
  }

  _historyUp(e) {
    e.preventDefault();
    if (this.historyIdx < this.history.length - 1) {
      this.historyIdx++;
      this._setInput(this.history[this.historyIdx]);
    }
  }

  _historyDown(e) {
    e.preventDefault();
    if (this.historyIdx > 0) {
      this.historyIdx--;
      this._setInput(this.history[this.historyIdx]);
    } else {
      this.historyIdx = -1;
      this._setInput('');
    }
  }

  _setInput(val) {
    this.inputEl.value      = val;
    this.typedEl.textContent = val;
  }

  _handleTab(e) {
    e.preventDefault();
    const partial = this.inputEl.value.trim().toLowerCase();
    if (!partial) return;
    const matches = Object.keys(COMMANDS).filter(
      k => !COMMANDS[k].hidden && k.startsWith(partial)
    );
    if (matches.length === 1) {
      this._setInput(matches[0]);
    } else if (matches.length > 1) {
      this._echoInput(partial);
      this.print('  ' + matches.join('   '), 'green-dim');
    }
  }

  // ── Output helpers ──────────────────────────────────────
  createLine(colorClass = 'white', bold = false) {
    const div = document.createElement('div');
    div.className = `line color-${colorClass}${bold ? ' bold' : ''}`;
    this.outputEl.appendChild(div);
    return div;
  }

  print(text, colorClass = 'white', bold = false) {
    const div = this.createLine(colorClass, bold);
    div.textContent = text;
    return div;
  }

  printBlank() {
    const div = document.createElement('div');
    div.className = 'line';
    this.outputEl.appendChild(div);
  }

  // Two-column output: left in green, right in white.
  printColumns(left, right, leftWidth = 22) {
    const div = document.createElement('div');
    div.className = 'line columns';
    const l = document.createElement('span');
    l.className = 'col-left color-green';
    l.textContent = left.padEnd(leftWidth);
    const r = document.createElement('span');
    r.className = 'col-right color-white';
    r.textContent = right;
    div.appendChild(l);
    div.appendChild(r);
    this.outputEl.appendChild(div);
  }

  // Box-drawing project card.
  printProjectCard(project) {
    const W = 52;
    const pad = (s) => String(s).slice(0, W).padEnd(W);

    this.printBlank();
    this.print(`  ╔${'═'.repeat(W + 2)}╗`, 'amber', true);
    this.print(`  ║ ${pad(project.name)} ║`, 'amber', true);
    this.print(`  ║ ${pad(project.tagline)} ║`, 'white');
    this.print(`  ╠${'═'.repeat(W + 2)}╣`, 'amber');
    this.print(`  ║ ${'Stack  : ' + project.stack.join(', ').slice(0, W - 9).padEnd(W - 9)} ║`, 'green');
    this.print(`  ║ ${'Status : ' + project.status.padEnd(W - 9)} ║`, 'green');
    this.print(`  ╚${'═'.repeat(W + 2)}╝`, 'amber');
    this.printBlank();
    project.bullets.forEach(b => this.print(`    • ${b}`, 'white'));
    this.printBlank();

    if (project.github) {
      const line = this._linkLine(`    GitHub  :  `, project.github);
      this.outputEl.appendChild(line);
    }
    if (project.live) {
      const line = this._linkLine(`    Live    :  `, project.live);
      this.outputEl.appendChild(line);
    }
    this.printBlank();
  }

  _linkLine(label, url) {
    const div = document.createElement('div');
    div.className = 'line';
    const labelSpan = document.createElement('span');
    labelSpan.className = 'color-green-dim';
    labelSpan.textContent = label;
    const a = document.createElement('a');
    a.className = 'link-hover';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = url;
    div.appendChild(labelSpan);
    div.appendChild(a);
    return div;
  }

  _echoInput(value) {
    const div = document.createElement('div');
    div.className = 'line echo-line';
    const prompt = document.createElement('span');
    prompt.className = 'color-green-dim';
    prompt.textContent = 'visitor@portfolio:~$ ';
    const cmd = document.createElement('span');
    cmd.className = 'color-white';
    cmd.textContent = value;
    div.appendChild(prompt);
    div.appendChild(cmd);
    this.outputEl.appendChild(div);
  }

  clear() {
    this.outputEl.innerHTML = '';
  }

  scrollToBottom() {
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  // ── Pulse animation (css class toggled) ─────────────────
  pulseClass(className, durationMs) {
    this.container.classList.add(className);
    setTimeout(() => this.container.classList.remove(className), durationMs);
  }

  // ── Idle glitch on titlebar ──────────────────────────────
  _startIdleGlitch() {
    let lastActivity = Date.now();
    const glyphPool = '█▒░▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌';
    const originalText = this.titleEl.textContent;

    const resetTimer = () => { lastActivity = Date.now(); };
    document.addEventListener('keydown', resetTimer);
    document.addEventListener('click',   resetTimer);

    setInterval(() => {
      if (this.isLocked) return;
      if (Date.now() - lastActivity < 30000) return;

      let glitched = '';
      for (const ch of originalText) {
        glitched += (ch !== ' ' && Math.random() < 0.28)
          ? glyphPool[Math.floor(Math.random() * glyphPool.length)]
          : ch;
      }
      this.titleEl.textContent = glitched;
      setTimeout(() => { this.titleEl.textContent = originalText; }, 600);
    }, 5000);
  }

  // ── Mobile quick-command bar ─────────────────────────────
  _injectMobileBar() {
    const bar = document.createElement('div');
    bar.className = 'mobile-quickbar';

    ['help', 'whoami', 'projects', 'skills', 'contact', 'clear'].forEach(cmd => {
      const btn = document.createElement('button');
      btn.className = 'mobile-btn';
      btn.textContent = cmd;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._setInput(cmd);
        this._handleSubmit();
      });
      bar.appendChild(btn);
    });

    // Insert before input line
    const inputLine = document.getElementById('terminal-inputline');
    inputLine.parentNode.insertBefore(bar, inputLine);
  }
}
