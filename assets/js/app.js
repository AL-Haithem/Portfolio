'use strict';

/* â”€â”€â”€ Escape HTML to prevent XSS â”€â”€â”€ */
function esc(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* â”€â”€â”€ Fetch JSON with fallback â”€â”€â”€ */
async function fetchJson(url, fallback) {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    const data = await res.json();
    const empty = Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0;
    return empty ? fallback : data;
  } catch {
    return fallback;
  }
}

/* â”€â”€â”€ Skeleton HTML â”€â”€â”€ */
function skeleton(n = 3) {
  return Array.from({ length: n }, () => `
    <div class="skeleton-card">
      <div class="sk-line short skeleton" style="height:10px; margin-bottom:14px;"></div>
      <div class="sk-line skeleton"></div>
      <div class="sk-line skeleton" style="width:80%;"></div>
      <div style="display:flex;gap:6px;margin-top:10px;">
        <div class="skeleton" style="width:56px;height:22px;border-radius:999px;"></div>
        <div class="skeleton" style="width:70px;height:22px;border-radius:999px;"></div>
        <div class="skeleton" style="width:48px;height:22px;border-radius:999px;"></div>
      </div>
    </div>
  `).join('');
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SKILLS â€” three-phase tab system
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const FALLBACK_SKILLS = {
  known: {
    label: 'Already know',
    color: 'green',
    categories: [
      { name: 'Backend Development', items: ['Node.js','Express.js','REST APIs','JWT','Middleware','Routing','Authentication','Error Handling'] },
      { name: 'Databases', items: ['MongoDB','CRUD','Schema Design','Aggregation'] },
      { name: 'Security', items: ['bcrypt','CORS','Helmet','Rate Limiting','XSS','CSRF'] },
      { name: 'Git & Collaboration', items: ['Git','GitHub','Branches','Pull Requests'] }
    ]
  },
  learning: {
    label: 'Learning now',
    color: 'yellow',
    categories: [
      { name: 'Databases', items: ['PostgreSQL','Redis','Transactions'] },
      { name: 'DevOps', items: ['Docker','Docker Compose','Nginx','Linux'] },
      { name: 'Testing', items: ['Jest','Supertest','Unit Testing'] }
    ]
  },
  future: {
    label: 'Future goals',
    color: 'red',
    categories: [
      { name: 'Backend', items: ['TypeScript','NestJS','GraphQL','gRPC'] },
      { name: 'DevOps & Cloud', items: ['Kubernetes','CI/CD','GitHub Actions','AWS'] }
    ]
  }
};

function renderCategoryGrid(categories, color, gridId, countId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  let totalItems = 0;

  grid.innerHTML = categories.map((cat, index) => {
    const items = Array.isArray(cat.items) ? cat.items : [];
    totalItems += items.length;
    // Staggered animation delay based on card index
    const delay = index * 80;
    return `
      <div class="category-card animate-in" style="animation-delay: ${delay}ms">
        <div class="cat-name">${esc(cat.name)}</div>
        <div class="tag-list">
          ${items.map(item => `<span class="tag">${esc(item)}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  if (Array.isArray(countId)) {
    countId.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${totalItems} topics`;
    });
  } else {
    const countEl = document.getElementById(countId);
    if (countEl) countEl.textContent = `${totalItems} topics`;
  }
}

async function renderSkills() {
  // Show skeleton in all grids
  ['grid-known','grid-learning','grid-future'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = skeleton(3);
  });

  // Artificial delay to demonstrate skeleton loading
  await new Promise(resolve => setTimeout(resolve, 1200));

  const data = await fetchJson('data/skills.json', FALLBACK_SKILLS);

  // Render each phase
  const phases = ['known', 'learning', 'future'];
  phases.forEach(phase => {
    const phaseData = data[phase];
    if (!phaseData) return;

    const categories = phaseData.categories || [];
    const color = phaseData.color || 'green';

    renderCategoryGrid(categories, color, `grid-${phase}`, [`count-${phase}`, `count-${phase}-label`]);
  });
}

/* â”€â”€â”€ Phase Tab Switching â”€â”€â”€ */
function setupPhaseTabs() {
  const tabs = document.querySelectorAll('.phase-card');
  const panels = document.querySelectorAll('.phase-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.phase;

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach(p => {
        const isTarget = p.id === `panel-${target}`;
        p.classList.toggle('active', isTarget);
        if (isTarget) {
          p.removeAttribute('hidden');
          // Trigger reveal on newly shown items
          p.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
          });
        } else {
          p.setAttribute('hidden', '');
        }
      });
    });
  });
}



/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   JOURNEY / TIMELINE
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

const FALLBACK_JOURNEY = [
];

async function renderJourney() {
  const container = document.getElementById('journey-container');
  if (!container) return;

  container.innerHTML = skeleton(3);

  const journey = await fetchJson('data/journey.json', FALLBACK_JOURNEY);

  if (!Array.isArray(journey) || !journey.length) {
    container.innerHTML = '<p style="color:var(--muted)">No journey data.</p>';
    return;
  }

  container.innerHTML = journey.map(item => `
    <div class="tl-item">
      <div class="tl-left">
        <div class="tl-dot ${esc(item.state || 'completed')}"></div>
        <div class="tl-line"></div>
      </div>
      <div class="tl-right">
        <span class="tl-period">${esc(item.period)}</span>
        <div class="tl-content">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.description)}</p>
          ${item.points ? `
          <ul class="tl-points">
            ${item.points.map(point => `<li>${esc(point)}</li>`).join('')}
          </ul>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAVBAR â€” scroll + mobile toggle
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function setupNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  // Scroll elevation
  const onScroll = () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    menu.addEventListener('click', e => {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Active section tracking
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-links a');
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -65% 0px' });

  sections.forEach(s => sectionObs.observe(s));
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SCROLL REVEAL
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   CONTACT FORM
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function setupForm() {
  const form   = document.getElementById('contact-form');
  const btn    = document.getElementById('btn-submit');
  if (!form || !btn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Simple required check
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--red)';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        if (valid) field.focus();
        valid = false;
      }
    });
    if (!valid) return;

    btn.disabled    = true;
    btn.textContent = 'Sendingâ€¦';

    await new Promise(r => setTimeout(r, 1000));

    btn.textContent = 'âœ“ Sent!';
    btn.style.background = 'var(--green)';
    form.reset();

    setTimeout(() => {
      btn.disabled         = false;
      btn.textContent      = 'Send message';
      btn.style.background = '';
    }, 3000);
  });
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INTERACTIVE ELEMENTS
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function setupCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    glow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

function setupJourneyGlow() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const dot = e.target.querySelector('.tl-dot');
      if (e.isIntersecting && dot) {
        dot.style.transform = 'scale(1.4)';
        dot.style.boxShadow = '0 0 16px var(--blue)';
        setTimeout(() => {
          dot.style.transform = '';
          dot.style.boxShadow = '';
        }, 500);
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  items.forEach(el => obs.observe(el));
}

function setupTerminal() {
  const term = document.getElementById('terminal-body');
  if (!term) return;

  const lines = [
    { text: "curl -X GET https://api.example.com/v1/profile", delay: 800, type: "cmd" },
    { text: "{\n  \"name\": \"AL Haithem\",\n  \"role\": \"Backend Engineer\",\n  \"stack\": [\"Node.js\", \"Express\", \"MongoDB\", \"Docker\"],\n  \"status\": \"Open to work\",\n  \"response_time\": \"24ms\"\n}", delay: 300, type: "output" },
    { text: "alhaithem@demo-server: ~ $ ", delay: 100, type: "prompt" }
  ];

  let currentLine = 0;
  term.innerHTML = "alhaithem@demo-server: ~ $ <span class=\"tw-cursor\"></span>";

  async function typeLine(lineObj) {
    if (lineObj.type === 'cmd') {
      let currentText = "alhaithem@demo-server: ~ $ ";
      term.innerHTML = currentText + "<span class=\"tw-cursor\"></span>";
      for (let i = 0; i < lineObj.text.length; i++) {
        currentText += lineObj.text.charAt(i);
        term.innerHTML = currentText + "<span class=\"tw-cursor\"></span>";
        await new Promise(r => setTimeout(r, Math.random() * 50 + 20));
      }
    } else if (lineObj.type === 'output') {
      const current = term.innerHTML.replace("<span class=\"tw-cursor\"></span>", "");
      term.innerHTML = current + "\n\n<span style='color: #a5d6ff;'>" + lineObj.text + "</span>\n<span class=\"tw-cursor\"></span>";
    } else if (lineObj.type === 'prompt') {
      const current = term.innerHTML.replace("<span class=\"tw-cursor\"></span>", "");
      term.innerHTML = current + "\n" + lineObj.text + "<span class=\"tw-cursor\"></span>";
    }
    await new Promise(r => setTimeout(r, lineObj.delay));
  }

  async function runSequence() {
    // wait before starting
    await new Promise(r => setTimeout(r, 1000));
    for (const line of lines) {
      await typeLine(line);
    }
  }

  // trigger on observe
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      runSequence();
      obs.disconnect();
    }
  });
  obs.observe(term);
}



/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   INIT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yr = document.getElementById('footer-year');
  if (yr) yr.textContent = new Date().getFullYear();

  setupNavbar();
  setupReveal();
  setupForm();
  setupPhaseTabs();
  setupCursorGlow();
  setupTerminal();

  renderSkills();
  renderJourney().then(() => {
    // Setup journey glow after rendering
    setupJourneyGlow();
  });
});
