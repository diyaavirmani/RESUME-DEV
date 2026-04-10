/* ═══════════════════════════════════════════════
   REAL-TIME CLOCK
═══════════════════════════════════════════════ */

(function () {
  const timeEl = document.getElementById('clock-time');
  const ampmEl = document.getElementById('clock-ampm');

  function tick() {
    const now = new Date();
    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    timeEl.textContent = `${h}:${m}`;
    ampmEl.textContent = ampm;
  }

  tick();
  setInterval(tick, 1000);
})();