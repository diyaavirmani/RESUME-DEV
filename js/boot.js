/* ═══════════════════════════════════════════════
   BOOT SEQUENCE
   Typewriter terminal lines → progress bar → reveal desktop
═══════════════════════════════════════════════ */

(function () {
  const BOOT_LINES = [
    { text: 'BIOS v2.6.1  Copyright (c) Diya Systems Inc.', type: 'dim', delay: 0 },
    { text: '[ OK ]  Loaded kernel modules', type: 'ok', delay: 90 },
    { text: '[ OK ]  Started journaling service', type: 'ok', delay: 90 },
    { text: '[ OK ]  Mounted /dev/portfolio', type: 'ok', delay: 80 },
    { text: '[ WARN ] Suppressing imposter syndrome daemon…', type: 'warn', delay: 130 },
    { text: '[ OK ]  Initializing AI inference engine', type: 'ok', delay: 100 },
    { text: '[ OK ]  Loading neural network weights', type: 'ok', delay: 80 },
    { text: '[ OK ]  GitHub API connection established', type: 'ok', delay: 90 },
    { text: '[ OK ]  Spawning hackathon.service', type: 'ok', delay: 80 },
    { text: '[ OK ]  Compiling ambitions… done (6 projects linked)', type: 'ok', delay: 120 },
    { text: '[ OK ]  Building in public. Ship it.', type: 'ok', delay: 100 },
    { text: 'Starting diya-os.desktop …', type: 'dim', delay: 160 },
  ];

  const linesEl = document.getElementById('boot-lines');
  const barEl = document.getElementById('boot-bar');
  const barLabel = document.getElementById('boot-bar-label');
  const bootScreen = document.getElementById('boot-screen');
  const desktop = document.getElementById('desktop');

  let cumulativeDelay = 700; // initial pause

  function typeClass(type) {
    if (type === 'ok') return '<span class="ok">[ OK ] </span>';
    if (type === 'err') return '<span class="err">[ ERR ] </span>';
    if (type === 'warn') return '<span class="warn">[ WARN ] </span>';
    return '';
  }

  // Render each line with a staggered delay
  BOOT_LINES.forEach((item, idx) => {
    cumulativeDelay += item.delay;

    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'boot-line';

      if (item.type === 'dim') {
        span.innerHTML = `<span class="dim">${item.text}</span>`;
      } else {
        // Strip the bracket prefix from text since typeClass adds it
        let rawText = item.text.replace(/^\[.*?\]\s*/, '');
        span.innerHTML = typeClass(item.type) + rawText;
      }

      linesEl.appendChild(span);
      // Force reflow then animate in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => span.classList.add('visible'));
      });

      // Update progress bar
      const pct = Math.round(((idx + 1) / BOOT_LINES.length) * 100);
      barEl.style.setProperty('--p', pct + '%');
      barEl.querySelector
        ? null
        : null;

      // Manually set the ::after width via a CSS variable trick — use direct style hack instead
      barEl.setAttribute('data-pct', pct);
      barEl.style.cssText = `
        width: 100%; height: 3px;
        background: rgba(255,255,255,0.06);
        border-radius: 2px; overflow: hidden; margin-bottom: 8px;
        position: relative;
      `;
      // Update inner fill
      let fill = barEl._fill;
      if (!fill) {
        fill = document.createElement('div');
        fill.style.cssText = `
          position: absolute; top: 0; left: 0;
          height: 100%; border-radius: 2px;
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
          transition: width 0.12s ease;
        `;
        barEl.appendChild(fill);
        barEl._fill = fill;
      }
      fill.style.width = pct + '%';
      barLabel.textContent = `loading… ${pct}%`;

      // Last line — fade out boot, show desktop
      if (idx === BOOT_LINES.length - 1) {
        setTimeout(() => {
          barLabel.textContent = 'ready.';
          setTimeout(() => {
            bootScreen.classList.add('fade-out');
            desktop.classList.add('visible');
          }, 500);
        }, 400);
      }
    }, cumulativeDelay);
  });
})();