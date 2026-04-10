/* ═══════════════════════════════════════════════
   GITHUB  –  Sparkline + Live stats for sidebar
═══════════════════════════════════════════════ */
(function () {
  const canvas    = document.getElementById('gh-sparkline');
  const ctx       = canvas.getContext('2d');
  const loadingEl = document.getElementById('gh-loading');
  const totalEl   = document.getElementById('gh-total');
  const streakEl  = document.getElementById('gh-streak');
  const reposEl   = document.getElementById('gh-repos');

  // We expose this so windows.js can render the identical real grid
  window._ghContribs = [];

  /* ── Draw bar sparkline on the canvas ── */
  function drawSparkline(data) {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w   = canvas.clientWidth;
    const h   = canvas.clientHeight;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const max  = Math.max(...data) || 1; // Prevent div by 0
    const gap  = 1.5;
    const barW = (w - gap * (data.length - 1)) / data.length;

    // We only render up to the latest 52 datapoints if more exist
    const renderData = data.slice(-52);

    renderData.forEach((val, i) => {
      // Ensure minimum 1px height so a bar is visible for 0 commits
      const rawH = (val / max) * (h - 6);
      const barH = val === 0 ? 1 : Math.max(2, rawH); 
      const x    = i * (barW + gap);
      const y    = h - barH;

      /* gradient fill inside the bars matching the UI mockup */
      const grad = ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, '#6c63ff');
      grad.addColorStop(1, 'rgba(108, 99, 255, 0.15)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, Math.max(barW, 1), barH, 1);
      } else {
        ctx.rect(x, y, Math.max(barW, 1), barH);
      }
      ctx.fill();
    });
  }

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
        // Fallback to empty flatline if proxy is down
        drawSparkline(new Array(52).fill(0));
        return;
      }

      // Format for windows.js dynamic mapping
      const matrix = [];
      const weeklyTotals = [];
      let flatDays = [];

      contribData.contributions.forEach(week => {
        let weekSum = 0;
        let weekArr = [];
        week.forEach(day => {
          const count = day.contributionCount;
          weekSum += count;
          weekArr.push(count);
          flatDays.push(count);
        });
        matrix.push(weekArr);
        weeklyTotals.push(weekSum);
      });

      // Export for the pop-up modal view
      window._ghContribs = matrix;

      // Draw sparkline with weekly totals
      drawSparkline(weeklyTotals);

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
      const grid = document.getElementById('win-gh-grid');
      if (grid && typeof window.WindowManager !== 'undefined') {
        const ghWin = WindowManager.getOpenWindows().github;
        if (ghWin) ghWin.innerHTML = ghWin.innerHTML; // Simple but hacky force redraw or leave it
      }

    } catch (err) {
      console.warn("Could not fetch GitHub data:", err);
      if (loadingEl) loadingEl.textContent = 'failed to load';
    }
  }

  /* ── Init ── */
  fetchGithubStats();

  /* Redraw on resize */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (loadingEl && loadingEl.style.display === 'none') {
        // Redraw with the window._ghContribs we cached
        if (window._ghContribs && window._ghContribs.length > 0) {
          const sums = window._ghContribs.map(w => w.reduce((a, b) => a + b, 0));
          drawSparkline(sums);
        }
      }
    }, 200);
  });
})();
