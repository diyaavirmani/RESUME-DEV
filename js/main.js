/* ═══════════════════════════════════════════════
   MAIN — cursor, menubar, click wiring
═══════════════════════════════════════════════ */

(function () {
  /* ════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════ */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Ring follows with slight lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .folder, .dock-item, .social-btn, .dd-item, .menu-item, .win-btn, .contact-link, .project-card';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));

  /* ════════════════════════════════
     MENUBAR DROPDOWNS
  ════════════════════════════════ */
  document.querySelectorAll('.menu-item[data-menu]').forEach(item => {
    const menuId = item.dataset.menu;
    const dropdown = document.getElementById(`menu-${menuId}`);
    if (!dropdown) return;

    item.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        dropdown.classList.add('open');
        item.classList.add('active');
      }
    });
  });

  document.addEventListener('click', closeAllMenus);

  function closeAllMenus() {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.menu-item.active').forEach(m => m.classList.remove('active'));
  }

  /* ════════════════════════════════
     FOLDER CLICKS → open windows
  ════════════════════════════════ */
  document.querySelectorAll('.folder[data-win], .dock-item[data-win]').forEach(el => {
    el.addEventListener('click', () => {
      const winId = el.dataset.win;
      if (winId) WindowManager.create(winId);
    });
  });

  /* ════════════════════════════════
     MENUBAR ACTIONS
  ════════════════════════════════ */
  const resumeItem = document.getElementById('menu-resume');
  if (resumeItem) {
    resumeItem.addEventListener('click', () => {
      // Replace with your actual resume URL
      window.open('./resume.pdf', '_blank');
    });
  }

})();