// Typewriter engine — types text into DOM elements char by char.
// Supports skip: pass a skipState object from boot.js to allow instant-skip.
const Typewriter = (() => {

  // Types `text` into `element`. Respects skipState — dumps all chars immediately if skip=true.
  function type(element, text, speedMs = 18, skipState = null) {
    return new Promise(resolve => {
      if (!text) { resolve(); return; }

      if (skipState && skipState.skip) {
        element.textContent = text;
        resolve();
        return;
      }

      let i = 0;
      const tick = setInterval(() => {
        if (skipState && skipState.skip) {
          element.textContent = text;
          clearInterval(tick);
          resolve();
          return;
        }
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
  // Signature: runSequence(sequences, container, [skipState], onComplete)
  // skipState is optional — omit for sequences that should never be skippable.
  async function runSequence(sequences, container, skipState, onComplete) {
    // Handle legacy call without skipState
    if (typeof skipState === 'function') {
      onComplete  = skipState;
      skipState   = null;
    }

    for (const seq of sequences) {
      // Cancellable delay
      if (seq.delay) {
        if (skipState && skipState.skip) {
          // already skipping — no delay needed
        } else {
          await new Promise(r => {
            const t = setTimeout(r, seq.delay);
            if (skipState) {
              skipState._pendingDelay = () => { clearTimeout(t); r(); };
            }
          });
          if (skipState) skipState._pendingDelay = null;
        }
      }

      if (seq.blank || seq.text === '') {
        container.appendChild(document.createElement('div'));
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

      const isSkipping = skipState && skipState.skip;

      if (seq.instant || isSkipping) {
        line.textContent = seq.text;
      } else {
        await type(line, seq.text, seq.speed || 18, skipState);
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
