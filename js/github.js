/* ═══════════════════════════════════════════
   GITHUB  –  Sparkline + stats for sidebar
   ═══════════════════════════════════════════ */
(function () {
  var canvas    = document.getElementById('gh-sparkline');
  var ctx       = canvas.getContext('2d');
  var loadingEl = document.getElementById('gh-loading');
  var totalEl   = document.getElementById('gh-total');
  var streakEl  = document.getElementById('gh-streak');
  var reposEl   = document.getElementById('gh-repos');

  /* ── Generate simulated weekly commit data ── */
  function generateData() {
    var data = [];
    for (var w = 0; w < 52; w++) {
      data.push(Math.floor(Math.random() * 22) + 3);
    }
    return data;
  }

  /* ── Draw bar sparkline on the canvas ── */
  function drawSparkline(data) {
    var dpr = window.devicePixelRatio || 1;
    var w   = canvas.clientWidth;
    var h   = canvas.clientHeight;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    var max  = Math.max.apply(null, data);
    var gap  = 1;
    var barW = (w - gap * (data.length - 1)) / data.length;

    data.forEach(function (val, i) {
      var barH = (val / max) * (h - 4);
      var x    = i * (barW + gap);
      var y    = h - barH;

      /* gradient fill */
      var grad = ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, '#6c63ff');
      grad.addColorStop(1, 'rgba(108, 99, 255, 0.15)');

      ctx.fillStyle = grad;
      ctx.beginPath();

      /* roundRect compat */
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
    var cur  = 0;
    var step = target / 30;
    var iv   = setInterval(function () {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(iv);
      }
      el.textContent = Math.round(cur);
    }, 35);
  }

  /* ── Init after short delay (simulate fetch) ── */
  setTimeout(function () {
    var data = generateData();
    loadingEl.style.display = 'none';
    drawSparkline(data);

    animateNum(totalEl,  487);
    animateNum(streakEl,  23);
    animateNum(reposEl,   18);
  }, 1800);

  /* Redraw on resize */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (loadingEl.style.display === 'none') {
        drawSparkline(generateData());
      }
    }, 200);
  });
})();
