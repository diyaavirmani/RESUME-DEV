/* ═══════════════════════════════════════════════
   SUDO EASTER EGG
   Type "sudo" anywhere on keyboard → secret screen
═══════════════════════════════════════════════ */

(function () {
  const overlay  = document.getElementById('sudo-overlay');
  const linesEl  = document.getElementById('sudo-lines');
  const closeBtn = document.getElementById('sudo-close');

  const TARGET  = 'sudo';
  let   buffer  = '';
  let   isOpen  = false;

  const SUDO_LINES = [
    'root@diya-os:~# accessing secured partition…',
    'root@diya-os:~# decrypting talent.enc …',
    'root@diya-os:~# ██████████████ 100%',
    'root@diya-os:~# cat /etc/diya/secret.txt',
    '',
    '  Hi recruiter 👾 since you typed "sudo"',
    '  you clearly know what you\'re doing.',
    '',
    '  Fun fact: she debugged a Solidity',
    '  reentrancy bug at 3am during Monad Blitz.',
    '',
    '  Hire her. You won\'t regret it.',
    '',
    'root@diya-os:~# ■',
  ];

  /* ─── Keyboard listener ─── */
  document.addEventListener('keydown', e => {
    if (isOpen) return;

    // Only capture printable chars, ignore modifier-only
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      buffer += e.key.toLowerCase();
      if (buffer.length > TARGET.length) {
        buffer = buffer.slice(-TARGET.length);
      }
      if (buffer === TARGET) {
        buffer = '';
        openSudo();
      }
    }
  });

  /* ─── Open ─── */
  function openSudo() {
    isOpen = true;
    linesEl.innerHTML = '';
    overlay.classList.add('open');

    let delay = 100;
    SUDO_LINES.forEach(text => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.className = 's-line';
        span.textContent = text;
        linesEl.appendChild(span);
        // auto-scroll
        linesEl.scrollTop = linesEl.scrollHeight;
      }, delay);
      delay += text === '' ? 60 : 110;
    });
  }

  /* ─── Close ─── */
  function closeSudo() {
    overlay.classList.remove('open');
    isOpen = false;
    buffer = '';
  }

  closeBtn.addEventListener('click', closeSudo);

  // Also close on Escape
  document.addEventListener('keydown', e => {
    if (isOpen && e.key === 'Escape') closeSudo();
  });
})();
