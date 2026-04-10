/* ═══════════════════════════════════════════════
   GITHUB  –  Live GitHub Grid Stats for sidebar
═══════════════════════════════════════════════ */
(function () {
  const gridEl    = document.getElementById('ui-gh-grid');
  const loadingEl = document.getElementById('gh-loading');
  const totalEl   = document.getElementById('gh-total');
  const streakEl  = document.getElementById('gh-streak');
  const reposEl   = document.getElementById('gh-repos');

  // We expose this so windows.js can render the identical real grid
  window._ghContribs = [];

  /* ── Animate a number from 0 → target ── */
  function animateNum(el, target) {
    if (!el) return;
    let cur = 0;
    const step = Math.max(1, target / 30);
    const iv = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(iv);
      }
      el.textContent = Math.round(cur);
    }, 35);
  }

  /* ── Render HTML Grid Cells ── */
  function renderGrid(matrix) {
    if (!gridEl) return;
    gridEl.innerHTML = ''; // Keep it clean
    
    // Matrix is array of weeks, containing arrays of days
    matrix.forEach(week => {
      week.forEach(val => {
        const cell = document.createElement('div');
        cell.className = 'gh-day';
        if (val > 0) {
          const lvl = val < 2 ? 1 : val < 4 ? 2 : val < 7 ? 3 : 4;
          cell.classList.add('l' + lvl);
        }
        gridEl.appendChild(cell);
      });
    });
  }

  /* ── Fetch Real Data ── */
  async function fetchGithubStats() {
    try {
      const username = 'diyaavirmani';
      
      // 1. Fetch public profile for repo count
      const profilePromise = fetch(`https://api.github.com/users/${username}`)
        .then(res => res.ok ? res.json() : { public_repos: '--' });

      // 2. Fetch unauth community contribution proxy
      const contribsPromise = fetch(`https://github-contributions-api.deno.dev/${username}.json`)
        .then(res => res.ok ? res.json() : null);

      const [profileData, contribData] = await Promise.all([profilePromise, contribsPromise]);

      // Hide loading text
      if (loadingEl) loadingEl.style.display = 'none';

      // Repos
      if (reposEl) {
        let repoCount = profileData.public_repos;
        if (typeof repoCount === 'number') animateNum(reposEl, repoCount);
        else reposEl.textContent = repoCount;
      }

      if (!contribData || !contribData.contributions) {
        return;
      }

      const matrix = [];
      let flatDays = [];

      contribData.contributions.forEach(week => {
        let weekArr = [];
        week.forEach(day => {
          const count = day.contributionCount;
          weekArr.push(count);
          flatDays.push(count);
        });
        matrix.push(weekArr);
      });

      // Export for the pop-up modal view
      window._ghContribs = matrix;

      // Draw horizontal grid in sidebar
      renderGrid(matrix);

      // Scroll horizontal grid completely to the right so we see recent days!
      const wrap = document.getElementById('ui-gh-wrap');
      if (wrap) {
        // give dom a moment to lay out
        setTimeout(() => {
           wrap.scrollLeft = wrap.scrollWidth;
        }, 50);
      }

      // Animate total commits this year
      if (totalEl) animateNum(totalEl, contribData.totalContributions || 0);

      // Calculate streak
      flatDays.reverse();
      let streak = 0;
      let started = false;
      for (let i = 0; i < flatDays.length; i++) {
        if (flatDays[i] > 0) {
          started = true;
          streak++;
        } else if (started) {
          break; // Broken streak
        } else if (i > 0) {
          // If flatDays[0] (today) is 0 but we haven't started, skip today. 
          // If flatDays[1] (yesterday) is also 0, streak is 0.
          break;
        }
      }

      if (streakEl) animateNum(streakEl, streak);

      // Tell window.js to re-render github window if it's already open
      const winGrid = document.getElementById('win-gh-grid');
      if (winGrid && typeof window.WindowManager !== 'undefined') {
        const ghWin = WindowManager.getOpenWindows().github;
        if (ghWin) ghWin.innerHTML = ghWin.innerHTML; 
      }

    } catch (err) {
      console.warn("Could not fetch GitHub data:", err);
      if (loadingEl) loadingEl.textContent = 'failed to load';
    }
  }

  /* ── Init ── */
  fetchGithubStats();

})();
