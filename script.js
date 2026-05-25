/* ============================================================
   BIOSYN PHARMACEUTICALS — SHARED SCRIPT
   ============================================================ */
(function () {
  // --- NAV scroll style + progress bar ---
  const nav = document.getElementById('nav');
  const progress = document.getElementById('scrollProgress');
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 50);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? (y / h) * 100 + '%' : '0%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile menu ---
  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navMobile');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('active');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  // --- Scroll reveal ---
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-animate]').forEach(el => io.observe(el));

  // --- Pipeline bars ---
  const pipeIo = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); pipeIo.unobserve(e.target); } });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pipe-card').forEach(el => pipeIo.observe(el));

  // --- Number counters ---
  function animateCount(el, target, dur = 1700) {
    const t0 = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor(target * ease(p)).toString();
      if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toString();
    }
    requestAnimationFrame(tick);
  }
  const cIo = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const t = parseInt(e.target.dataset.count, 10);
        if (!isNaN(t)) animateCount(e.target, t);
        cIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => cIo.observe(el));

  // --- Smooth scroll for in-page anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' }); }
      }
    });
  });

  // --- Resource tabs (resources page) ---
  const resTabs = document.querySelectorAll('.res-tab');
  const resCards = document.querySelectorAll('.res-card');
  if (resTabs.length) {
    resTabs.forEach(tab => tab.addEventListener('click', () => {
      resTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.tab;
      resCards.forEach(c => { c.style.display = (f === 'all' || c.dataset.type === f) ? 'flex' : 'none'; });
    }));
  }

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Message Sent';
      btn.style.background = 'var(--cyan-500)';
      btn.style.color = 'var(--navy-900)';
      setTimeout(() => { form.reset(); btn.disabled = false; btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; }, 3000);
    });
  }

  // --- Newsletter (footer) ---
  document.querySelectorAll('.footer-form').forEach(f => {
    f.addEventListener('submit', ev => { ev.preventDefault(); alert('Thank you for subscribing. We will be in touch.'); f.reset(); });
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // --- Year ---
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // --- Lucide ---
  if (window.lucide) lucide.createIcons();
})();
