// Typewriter engine — types text into DOM elements char by char.
// Stateless IIFE module; all state lives in callers.
const Typewriter = (() => {

  // Types `text` into `element` at `speedMs` ms/char. Returns a Promise.
  function type(element, text, speedMs = 18) {
    return new Promise(resolve => {
      if (!text) { resolve(); return; }
      let i = 0;
      const tick = setInterval(() => {
        element.textContent += text[i];
        i++;
        if (i >= text.length) {
          clearInterval(tick);
          resolve();
        }
      }, speedMs);
    });
  }

  // Runs an array of sequence descriptors one after another.
  // Each descriptor:
  //   { text, delay?, speed?, color?, bold?, suffix?, suffixColor?, pre?, instant?, blank? }
  // `container` is the DOM element to append lines to.
  // `onComplete` called when all lines are done.
  async function runSequence(sequences, container, onComplete) {
    for (const seq of sequences) {
      if (seq.delay) {
        await new Promise(r => setTimeout(r, seq.delay));
      }

      if (seq.blank || seq.text === '') {
        const blank = document.createElement('div');
        blank.className = 'line';
        container.appendChild(blank);
        container.scrollTop = container.scrollHeight;
        continue;
      }

      const line = document.createElement('div');
      let cls = 'line';
      if (seq.color) cls += ` color-${seq.color}`;
      if (seq.bold)  cls += ' bold';
      line.className = cls;
      if (seq.pre) line.style.whiteSpace = 'pre';
      container.appendChild(line);
      container.scrollTop = container.scrollHeight;

      if (seq.instant) {
        line.textContent = seq.text;
      } else {
        await type(line, seq.text, seq.speed || 18);
      }

      if (seq.suffix) {
        const span = document.createElement('span');
        span.className = `color-${seq.suffixColor || 'green'}${seq.suffixBold ? ' bold' : ''}`;
        span.textContent = seq.suffix;
        line.appendChild(span);
      }

      container.scrollTop = container.scrollHeight;
    }

    if (onComplete) onComplete();
  }

  return { type, runSequence };
})();
