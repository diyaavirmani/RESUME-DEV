/* ═══════════════════════════════════════════
   SUDO  –  Access-granted overlay
   ═══════════════════════════════════════════ */
(function () {
  var overlay   = document.getElementById('sudo-overlay');
  var sudoLines = document.getElementById('sudo-lines');
  var closeBtn  = document.getElementById('sudo-close');

  var msgs = [
    '> sudo access granted',
    '> welcome back, diya',
    '> loading workspace…',
    '> all systems ready ✓',
  ];

  var typed = false;

  function typeMessages() {
    if (typed) return;
    typed = true;
    var idx = 0;

    function next() {
      if (idx >= msgs.length) return;
      var div = document.createElement('div');
      div.className = 's-line';
      div.textContent = msgs[idx];
      sudoLines.appendChild(div);
      idx++;
      setTimeout(next, 280);
    }

    setTimeout(next, 400);
  }

  /* Watch for .visible class */
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (overlay.classList.contains('open')) {
        typeMessages();
      }
    });
  });

  observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });

  /* Close button */
  closeBtn.addEventListener('click', function () {
    overlay.classList.remove('open');
    overlay.style.visibility = 'hidden';
    overlay.style.opacity = '0';
    observer.disconnect();
  });
})();
