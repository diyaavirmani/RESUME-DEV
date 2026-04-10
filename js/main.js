/* ═══════════════════════════════════════════
   MAIN  –  Menus, dock, cursor, glue logic
   ═══════════════════════════════════════════ */
(function () {

  /* ══════════════════════════════════════════
     MENU DROPDOWNS
     ══════════════════════════════════════════ */
  var menuGroups = document.querySelectorAll('.menu-group');

  menuGroups.forEach(function (group) {
    var trigger  = group.querySelector('.menu-item');
    var dropdown = group.querySelector('.dropdown');

    if (trigger && dropdown) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();

        /* close all others */
        document.querySelectorAll('.dropdown.open').forEach(function (d) {
          if (d !== dropdown) d.classList.remove('open');
        });
        document.querySelectorAll('.menu-item.active').forEach(function (m) {
          if (m !== trigger) m.classList.remove('active');
        });

        dropdown.classList.toggle('open');
        trigger.classList.toggle('active');
      });
    }
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    document.querySelectorAll('.menu-item.active').forEach(function (m) { m.classList.remove('active'); });
  });

  /* ══════════════════════════════════════════
     FOLDER CLICKS  →  open window
     ══════════════════════════════════════════ */
  document.querySelectorAll('.folder').forEach(function (f) {
    f.addEventListener('click', function () {
      var id = f.dataset.win;
      if (id && typeof window.openWindow === 'function') {
        window.openWindow(id);
      }
    });
  });

  /* ══════════════════════════════════════════
     DOCK CLICKS  →  open window
     ══════════════════════════════════════════ */
  document.querySelectorAll('.dock-item[data-win]').forEach(function (item) {
    item.addEventListener('click', function () {
      var id = item.dataset.win;
      if (id && typeof window.openWindow === 'function') {
        window.openWindow(id);
      }
    });
  });

  /* ══════════════════════════════════════════
     CUSTOM CURSOR
     ══════════════════════════════════════════ */
  var ring = document.getElementById('cursor-ring');
  var dot  = document.getElementById('cursor-dot');

  if (ring && dot && window.matchMedia('(pointer: fine)').matches) {
    var mouseX = 0, mouseY = 0;
    var ringX  = 0, ringY  = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left    = mouseX + 'px';
      dot.style.top     = mouseY + 'px';
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    /* Smooth trailing ring */
    (function loop() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(loop);
    })();

    /* Hover effect on interactive elements */
    var INTERACTIVE = 'a, button, .folder, .dock-item, .menu-item, .dd-item, .social-btn, .project-card, .skill-pill, .win-dot, .hack-card, .contact-row';

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(INTERACTIVE)) {
        ring.classList.add('hovering');
        dot.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(INTERACTIVE)) {
        ring.classList.remove('hovering');
        dot.classList.remove('hovering');
      }
    });

    /* Click pulse */
    document.addEventListener('mousedown', function () {
      ring.classList.add('clicking');
    });
    document.addEventListener('mouseup', function () {
      ring.classList.remove('clicking');
    });

    /* Hide default cursor everywhere */
    document.body.style.cursor = 'none';

    /* Add cursor:none to new elements via style tag */
    var style = document.createElement('style');
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);
  }

  /* ══════════════════════════════════════════
     BATTERY WIDGET
     ══════════════════════════════════════════ */
  var batteryFill = document.getElementById('battery-fill');
  if (batteryFill) {
    if (navigator.getBattery) {
      navigator.getBattery().then(function (b) {
        batteryFill.style.width = (b.level * 100) + '%';
        if (b.level < 0.2) batteryFill.style.background = 'var(--red)';
      });
    } else {
      batteryFill.style.width = '85%';
    }
  }

  /* ══════════════════════════════════════════
     RESUME DOWNLOAD STUB
     ══════════════════════════════════════════ */
  var resumeBtn = document.getElementById('menu-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', function () {
      window.alert('Resume download coming soon!');
    });
  }

  /* ══════════════════════════════════════════
     KEYBOARD SHORTCUTS
     ══════════════════════════════════════════ */
  document.addEventListener('keydown', function (e) {
    /* Ctrl/Cmd + number → open window */
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
      var map = { '1': 'projects', '2': 'skills', '3': 'about', '4': 'hackathons', '5': 'github', '6': 'contact' };
      if (map[e.key] && typeof window.openWindow === 'function') {
        e.preventDefault();
        window.openWindow(map[e.key]);
      }
    }

    /* Escape → close topmost window */
    if (e.key === 'Escape') {
      var topWin = document.querySelector('.os-window.focused');
      if (topWin) {
        topWin.classList.add('minimizing');
        setTimeout(function () { topWin.remove(); }, 220);
      }
    }
  });

})();
