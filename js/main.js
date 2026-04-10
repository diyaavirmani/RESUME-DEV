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

  /* ════════════════════════════════
     FOLDER RANDOMIZATION (Scattering)
  ════════════════════════════════ */
  function randomizeFolders() {
    const folders = document.querySelectorAll('.folder');
    if (!folders.length) return;

    const placed = [];
    const minDistance = 15; // Minimum % distance between folders

    // Define a "Center-Right Safe Zone" to avoid hero text & sidebar
    const minX = 42; 
    const maxX = 75; 
    const minY = 15; 
    const maxY = 75; 

    folders.forEach((folder, idx) => {
      let randomX, randomY, collision;
      let attempts = 0;

      do {
        collision = false;
        randomX = minX + Math.random() * (maxX - minX);
        randomY = minY + Math.random() * (maxY - minY);

        // Check against all already placed folders
        for (const pos of placed) {
          const dist = Math.sqrt(Math.pow(pos.x - randomX, 2) + Math.pow(pos.y - randomY, 2));
          if (dist < minDistance) {
            collision = true;
            break;
          }
        }
        attempts++;
      } while (collision && attempts < 50);

      placed.push({ x: randomX, y: randomY });
      
      const randomRot = (Math.random() - 0.5) * 8; 

      folder.style.left = `${randomX}%`;
      folder.style.top = `${randomY}%`;
      folder.style.filter = `hue-rotate(${idx * 12}deg)`; 
      
      const body = folder.querySelector('.folder-body');
      if (body) {
        body.style.transform = `rotate(${randomRot}deg)`;
      }
    });
  }

  // Initialize positions
  randomizeFolders();

})();

/* -- Dock Magnification Logic -- */
(function() {
  const dock = document.getElementById("dock");
  const dockItems = document.querySelectorAll(".dock-item, .dock-sep");
  
  if (!dock) return;

  dock.addEventListener("mousemove", (e) => {
    dockItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      const dist = Math.abs(e.clientX - itemCenter);
      
      // Calculate scale based on distance (max 1.5, min 1.0)
      const maxDist = 150;
      let scale = 1;
      
      if (dist < maxDist) {
        scale = 1 + (1 - dist / maxDist) * 0.45;
      }
      
      item.style.transform = `scale(${scale})`;
      item.style.margin = `0 ${Math.max(4, 12 * (scale - 1))}px`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    dockItems.forEach(item => {
      item.style.transform = "scale(1)";
      item.style.margin = "0 4px";
    });
  });
})();

