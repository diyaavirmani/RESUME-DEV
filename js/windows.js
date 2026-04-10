/* ═══════════════════════════════════════════════
   OS WINDOW MANAGER
   Draggable, resizable, focusable, closable windows
═══════════════════════════════════════════════ */

const WindowManager = (function () {
  const layer   = document.getElementById('windows-layer');
  let   zCounter = 100;
  const openWindows = {}; // id → DOM node

  /* ─── Window content definitions ─── */
  const WINDOWS = {
    projects: {
      title: 'projects',
      path: '~/projects',
      width: 460, height: 420,
      render: () => `
        <div class="win-section-title">Featured Projects</div>

        <div class="project-card">
          <h3>Veritas</h3>
          <div class="proj-sub">AI · Journalism · LLM Pipeline · 2026</div>
          <p>Autonomous AI journalism pipeline. Discovers trending news, cross-source fact-checks, writes Reuters/Economist-style articles via Groq + LLaMA 3, publishes to a clean editorial frontend.</p>
          <div class="tag-row">
            <span class="tag">Python</span><span class="tag">Groq</span><span class="tag">LLaMA 3</span>
            <span class="tag">FastAPI</span><span class="tag">React</span><span class="tag">Render</span>
          </div>
          <a class="proj-link" href="https://github.com/diyaavirmani/veritas" target="_blank">→ View on GitHub</a>
        </div>

        <div class="project-card">
          <h3>BlitzBuddy</h3>
          <div class="proj-sub">Web3 · Solidity · Monad Testnet · March 2026</div>
          <p>Onchain micro-bounty platform for live hackathon help. Solidity escrow smart contract with a 5-state machine &amp; ReentrancyGuard. Next.js frontend with wagmi / viem / RainbowKit.</p>
          <div class="tag-row">
            <span class="tag">Solidity</span><span class="tag">Next.js</span><span class="tag">wagmi</span>
            <span class="tag">viem</span><span class="tag">RainbowKit</span><span class="tag">Monad</span>
          </div>
          <a class="proj-link" href="https://github.com/diyaavirmani/blitzbuddy" target="_blank">→ View on GitHub</a>
        </div>

        <div class="project-card">
          <h3>DisasterAI</h3>
          <div class="proj-sub">CV · GeoSpatial · Deep Learning · 2025</div>
          <p>AI-powered disaster response & resource allocation. Satellite imagery segmentation (U-Net/HRNet), LSTM zone prediction, SAR/optical fusion (Sentinel-1/2, Landsat), PostGIS + Mapbox dashboard.</p>
          <div class="tag-row">
            <span class="tag">U-Net</span><span class="tag">HRNet</span><span class="tag">LSTM</span>
            <span class="tag">FastAPI</span><span class="tag">PostGIS</span><span class="tag">Mapbox</span>
          </div>
        </div>
      `
    },

    skills: {
      title: 'skills',
      path: '~/skills',
      width: 400, height: 500,
      render: () => `
        <div class="win-section-title">Tech Stack</div>
        
        <div class="skills-section">
          <h4>Technology</h4>
          <div class="skills-chips">
            <span class="skill-chip">Artificial Intelligence</span>
            <span class="skill-chip">Machine Learning</span>
            <span class="skill-chip">Deep Learning</span>
            <span class="skill-chip">Computer Vision</span>
            <span class="skill-chip">NLP</span>
            <span class="skill-chip">LLMs</span>
            <span class="skill-chip">Generative AI</span>
          </div>
        </div>

        <div class="skills-section">
          <h4>Data Science</h4>
          <div class="skills-chips">
            <span class="skill-chip">Data Preprocessing</span>
            <span class="skill-chip">Data Cleaning</span>
            <span class="skill-chip">Feature Engineering</span>
            <span class="skill-chip">Model Evaluation</span>
            <span class="skill-chip">Data Visualization</span>
          </div>
        </div>

        <div class="skills-section">
          <h4>Libraries & Frameworks</h4>
          <div class="skills-chips">
            <span class="skill-chip">PyTorch</span>
            <span class="skill-chip">TensorFlow</span>
            <span class="skill-chip">Scikit-learn</span>
            <span class="skill-chip">OpenCV</span>
            <span class="skill-chip">Hugging Face</span>
            <span class="skill-chip">YOLO</span>
            <span class="skill-chip">Pandas</span>
            <span class="skill-chip">NumPy</span>
            <span class="skill-chip">SpaCy</span>
          </div>
        </div>

        <div class="skills-section">
          <h4>Data & Analytics Tools</h4>
          <div class="skills-chips">
            <span class="skill-chip">SQL</span>
            <span class="skill-chip">Jupyter Notebook</span>
            <span class="skill-chip">Matplotlib</span>
            <span class="skill-chip">Seaborn</span>
          </div>
        </div>

        <div class="skills-section">
          <h4>Development & Deployment</h4>
          <div class="skills-chips">
            <span class="skill-chip">Python</span>
            <span class="skill-chip">Flask</span>
            <span class="skill-chip">FastAPI</span>
            <span class="skill-chip">Streamlit</span>
            <span class="skill-chip">Docker</span>
            <span class="skill-chip">GitHub</span>
            <span class="skill-chip">AWS Basics</span>
          </div>
        </div>

        <div class="skills-section">
          <h4>Web3</h4>
          <div class="skills-chips">
            <span class="skill-chip">Smart Contracts (Solidity)</span>
            <span class="skill-chip">wagmi / viem</span>
            <span class="skill-chip">RainbowKit</span>
            <span class="skill-chip">Monad Testnet</span>
          </div>
        </div>
      `
    },

    about: {
      title: 'about me',
      path: '~/about',
      width: 360, height: 300,
      render: () => `
        <div class="win-section-title">Diya Virmani</div>
        <div class="about-row"><span class="about-key">program</span><span class="about-val">AIDS @ VIPS</span></div>
        <div class="about-row"><span class="about-key">role</span><span class="about-val">Developer</span></div>
        <div class="about-row"><span class="about-key">institution</span><span class="about-val">VIPS, New Delhi</span></div>
        <div class="about-row"><span class="about-key">focus</span><span class="about-val">AI Engineering · Full-Stack · Web3</span></div>
        <div class="about-row"><span class="about-key">style</span><span class="about-val">Ships fast. Learns by building.</span></div>
        <div class="about-row"><span class="about-key">location</span><span class="about-val">Delhi, India</span></div>
        <div class="about-row"><span class="about-key">status</span><span class="about-val" style="color:var(--accent)">Open to opportunities</span></div>
        <br/>
        <p style="font-size:11px;color:var(--text-dim);line-height:1.8">
          I pursue large, technically ambitious projects through hackathons and independent work.
          Currently deep into LLMs, autonomous agents, and the intersection of AI with real-world infrastructure.
        </p>
      `
    },

    hackathons: {
      title: 'hackathons',
      path: '~/hackathons',
      width: 440, height: 520,
      render: () => `
        <div class="win-section-title">Hackathon History</div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--accent)"></div>
          <div class="hack-info">
            <h4>Vibeathon</h4>
            <div class="hack-date">APRIL 2026 · ONLINE</div>
            <p>Built <strong style="color:var(--text-primary)">Veritas</strong> — autonomous AI journalism pipeline. Groq + LLaMA 3 for article generation, cross-source fact-checking, editorial frontend. Deployed on Render.</p>
            <div class="tag-row"><span class="tag">Python</span><span class="tag">Groq</span><span class="tag">LLaMA 3</span><span class="tag">FastAPI</span><span class="tag">React</span></div>
          </div>
        </div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--blue)"></div>
          <div class="hack-info">
            <h4>Monad Blitz — New Delhi</h4>
            <div class="hack-date">MARCH 28, 2026 · IRL · 1 DAY</div>
            <p>Built <strong style="color:var(--text-primary)">BlitzBuddy</strong> with teammate Ankit Singh Raghuvanshi. Onchain micro-bounty platform on Monad Testnet. Solidity escrow with 5-state machine + ReentrancyGuard. Survived a mid-hackathon laptop crash.</p>
            <div class="tag-row"><span class="tag">Solidity</span><span class="tag">Next.js</span><span class="tag">wagmi</span><span class="tag">Monad</span></div>
          </div>
        </div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--amber)"></div>
          <div class="hack-info">
            <h4>FrostByte Hack <span style="color:var(--amber);font-size:9px;letter-spacing:0.08em">· THEME-BASED WINNER · $100</span></h4>
            <div class="hack-date">DEVPOST · ONLINE</div>
            <p>Built <strong style="color:var(--text-primary)">Scam Bait AI</strong> — an AI system that autonomously engages and wastes scammers' time. Won the theme category.</p>
            <div class="tag-row"><span class="tag">AI</span><span class="tag">Python</span><span class="tag">LLM</span></div>
          </div>
        </div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--pink)"></div>
          <div class="hack-info">
            <h4>Hacktivate <span style="color:var(--pink);font-size:9px;letter-spacing:0.08em">· 2ND PLACE</span></h4>
            <div class="hack-date">ONLINE</div>
            <p>Built <strong style="color:var(--text-primary)">Scam Bait AI</strong> — secured 2nd position overall with an AI that flips the script on scammers by keeping them engaged autonomously.</p>
            <div class="tag-row"><span class="tag">AI</span><span class="tag">Python</span><span class="tag">LLM</span></div>
          </div>
        </div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--purple)"></div>
          <div class="hack-info">
            <h4>GUVI — India AI Impact Buildathon <span style="color:var(--purple);font-size:9px;letter-spacing:0.08em">· TOP 2% FINALIST</span></h4>
            <div class="hack-date">NATIONAL · ONLINE</div>
            <p>Top 2% out of all national submissions with <strong style="color:var(--text-primary)">Scam Bait AI</strong> — recognized for real-world AI impact in consumer protection.</p>
            <div class="tag-row"><span class="tag">AI</span><span class="tag">Python</span><span class="tag">LLM</span></div>
          </div>
        </div>

        <div class="hackathon-item">
          <div class="hack-dot" style="background:var(--blue)"></div>
          <div class="hack-info">
            <h4>National Student Change Initiative Fest <span style="color:var(--blue);font-size:9px;letter-spacing:0.08em">· FINALIST</span></h4>
            <div class="hack-date">NATIONAL · IRL</div>
            <p>Finalist with <strong style="color:var(--text-primary)">Scam Bait AI</strong> — presented to a national jury as a social impact solution for digital fraud prevention.</p>
            <div class="tag-row"><span class="tag">AI</span><span class="tag">Python</span><span class="tag">LLM</span></div>
          </div>
        </div>
      `
    },

    github: {
      title: 'github activity',
      path: '~/github',
      width: 500, height: 320,
      render: () => `
        <div class="win-section-title">GitHub Activity</div>
        <div id="win-gh-grid-wrap" style="width:100%;overflow-x:auto;">
          <p style="font-size:10px;color:var(--text-dim);margin-bottom:10px">Contribution graph — past 52 weeks</p>
          <div class="gh-week-grid" id="win-gh-grid" style="min-width:390px;"></div>
          <div style="display:flex;gap:6px;align-items:center;margin-top:10px;font-size:9px;color:var(--text-dim)">
            <span>less</span>
            <div style="width:10px;height:10px;border-radius:1px;background:rgba(0,255,170,0.06)"></div>
            <div style="width:10px;height:10px;border-radius:1px;background:rgba(0,255,170,0.2)"></div>
            <div style="width:10px;height:10px;border-radius:1px;background:rgba(0,255,170,0.4)"></div>
            <div style="width:10px;height:10px;border-radius:1px;background:rgba(0,255,170,0.65)"></div>
            <div style="width:10px;height:10px;border-radius:1px;background:var(--accent)"></div>
            <span>more</span>
          </div>
        </div>
      `,
      afterRender: () => {
        // Populate contribution grid from cached data or randomly
        const grid = document.getElementById('win-gh-grid');
        if (!grid) return;
        const levels = ['', 'l1', 'l2', 'l3', 'l4'];
        
        // Use live array if we have it from github.js
        if (window._ghContribs && window._ghContribs.length > 0) {
          window._ghContribs.forEach(week => {
             week.forEach(val => {
               const cell = document.createElement('div');
               cell.className = 'gh-day';
               if (val > 0) {
                 const lvl = val < 2 ? 1 : val < 4 ? 2 : val < 7 ? 3 : 4;
                 cell.classList.add('l' + lvl);
               }
               grid.appendChild(cell);
             });
          });
        } else {
          for (let w = 0; w < 53; w++) {
            for (let d = 0; d < 7; d++) {
              const cell = document.createElement('div');
              cell.className = 'gh-day';
              const r = Math.random();
              if (r > 0.72) cell.classList.add(levels[Math.floor(Math.random() * 4) + 1]);
              grid.appendChild(cell);
            }
          }
        }
      }
    },

    contact: {
      title: 'contact',
      path: '~/contact',
      width: 340, height: 260,
      render: () => `
        <div class="win-section-title">Get in Touch</div>

        <a class="contact-link" href="https://linkedin.com/in/diya-virmani-3bb62b1a0" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0a66c2">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
          <span>linkedin.com/in/diya-virmani</span>
        </a>

        <a class="contact-link" href="https://github.com/diyaavirmani" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7C6.73 19.91 6.14 18 6.14 18c-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.52 1.02 1.52 1.02.88 1.51 2.31 1.07 2.87.82.09-.64.35-1.07.63-1.32-2.19-.25-4.5-1.1-4.5-4.88 0-1.08.39-1.96 1.02-2.65-.1-.25-.44-1.25.1-2.61 0 0 .83-.27 2.73 1.02A9.5 9.5 0 0 1 12 8.84c.84 0 1.69.11 2.48.33 1.89-1.29 2.72-1.02 2.72-1.02.54 1.36.2 2.36.1 2.61.64.69 1.02 1.57 1.02 2.65 0 3.79-2.31 4.62-4.51 4.87.36.31.67.92.67 1.85v2.74c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z"/></svg>
          <span>github.com/diyaavirmani</span>
        </a>

        <a class="contact-link" href="https://x.com/diyasversion" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.261 5.636L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span>x.com/diyasversion</span>
        </a>

        <a class="contact-link" href="https://instagram.com/diyaa.virmani/?hl=en" target="_blank">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="#e1306c" stroke="none"/>
          </svg>
          <span>instagram.com/diyaa.virmani</span>
        </a>
      `
    }
  };

  /* ─── Create window ─── */
  function create(id) {
    if (openWindows[id]) {
      focus(openWindows[id]);
      return;
    }

    const def = WINDOWS[id];
    if (!def) return;

    const win = document.createElement('div');
    win.className = 'os-window';
    win.dataset.winId = id;

    const baseX = Math.max(40, (window.innerWidth  - def.width)  / 2 + (Object.keys(openWindows).length * 24));
    const baseY = Math.max(40, (window.innerHeight - def.height) / 2 + (Object.keys(openWindows).length * 24));
    win.style.cssText = `left:${baseX}px; top:${baseY}px; width:${def.width}px; height:${def.height}px;`;

    win.innerHTML = `
      <div class="win-titlebar">
        <div class="win-controls">
          <button class="win-btn win-btn-close" data-action="close" title="Close"></button>
          <button class="win-btn win-btn-min"   data-action="min"   title="Minimize"></button>
          <button class="win-btn win-btn-max"   data-action="max"   title="Maximize"></button>
        </div>
        <div class="win-title">${def.title}</div>
        <div class="win-path">${def.path}</div>
      </div>
      <div class="win-content">${def.render()}</div>
      <div class="win-resize"></div>
    `;

    layer.appendChild(win);
    openWindows[id] = win;
    focus(win);
    makeDraggable(win);
    makeResizable(win);

    win.querySelector('[data-action="close"]').addEventListener('click', () => close(win, id));
    win.querySelector('[data-action="min"]').addEventListener('click', () => close(win, id));
    win.querySelector('[data-action="max"]').addEventListener('click', () => toggleMax(win, def));
    win.addEventListener('mousedown', () => focus(win));

    if (def.afterRender) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => def.afterRender());
      });
    }
  }

  /* ─── Focus ─── */
  function focus(win) {
    document.querySelectorAll('.os-window').forEach(w => w.classList.remove('focused'));
    win.classList.add('focused');
    win.style.zIndex = ++zCounter;
  }

  /* ─── Close ─── */
  function close(win, id) {
    win.classList.add('minimizing');
    setTimeout(() => {
      win.remove();
      delete openWindows[id];
    }, 160);
  }

  /* ─── Toggle maximize ─── */
  function toggleMax(win, def) {
    if (win._maximized) {
      win.style.left   = win._prevRect.left + 'px';
      win.style.top    = win._prevRect.top  + 'px';
      win.style.width  = win._prevRect.w    + 'px';
      win.style.height = win._prevRect.h    + 'px';
      win._maximized = false;
    } else {
      win._prevRect = { left: parseInt(win.style.left), top: parseInt(win.style.top), w: win.offsetWidth, h: win.offsetHeight };
      const mh = window.innerHeight;
      const mw = window.innerWidth;
      win.style.left   = '4px';
      win.style.top    = (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menubar-h')) + 4) + 'px';
      win.style.width  = (mw - 8) + 'px';
      win.style.height = (mh - 80) + 'px';
      win._maximized = true;
    }
  }

  /* ─── Drag ─── */
  function makeDraggable(win) {
    const bar = win.querySelector('.win-titlebar');
    let dx, dy, dragging = false;

    bar.addEventListener('mousedown', e => {
      if (e.target.classList.contains('win-btn')) return;
      dragging = true;
      dx = e.clientX - win.offsetLeft;
      dy = e.clientY - win.offsetTop;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      let nx = e.clientX - dx;
      let ny = e.clientY - dy;
      const mh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menubar-h')) || 28;
      nx = Math.max(0, Math.min(window.innerWidth  - win.offsetWidth,  nx));
      ny = Math.max(mh, Math.min(window.innerHeight - 60, ny));
      win.style.left = nx + 'px';
      win.style.top  = ny + 'px';
    });

    document.addEventListener('mouseup', () => {
      dragging = false;
      document.body.style.userSelect = '';
    });
  }

  /* ─── Resize ─── */
  function makeResizable(win) {
    const handle = win.querySelector('.win-resize');
    let startX, startY, startW, startH, resizing = false;

    handle.addEventListener('mousedown', e => {
      e.stopPropagation();
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', e => {
      if (!resizing) return;
      const nw = Math.max(280, startW + (e.clientX - startX));
      const nh = Math.max(180, startH + (e.clientY - startY));
      win.style.width  = nw + 'px';
      win.style.height = nh + 'px';
    });

    document.addEventListener('mouseup', () => {
      resizing = false;
      document.body.style.userSelect = '';
    });
  }

  return { create };
})();