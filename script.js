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
        if (!isNaN(t)) { e.target.textContent = '0'; animateCount(e.target, t); }
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

  // --- Contact form (Netlify Forms via AJAX) ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending...';
      const data = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data })
        .then(() => {
          btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Message Sent';
          btn.style.background = 'var(--cyan-500)';
          btn.style.color = 'var(--navy-900)';
          let note = form.querySelector('.form-success');
          if (!note) {
            note = document.createElement('p');
            note.className = 'form-success';
            form.appendChild(note);
          }
          note.innerHTML = 'Thank you! Your message has been sent successfully. Our team will respond within one business day.';
          note.style.display = 'block';
          setTimeout(() => { form.reset(); btn.disabled = false; btn.innerHTML = orig; btn.style.background = ''; btn.style.color = ''; }, 4000);
        })
        .catch(() => {
          btn.disabled = false; btn.innerHTML = orig;
          alert('Sorry, something went wrong. Please email us directly at Info@biosyn-ph.com');
        });
    });
  }

  // --- Newsletter (footer) ---
  document.querySelectorAll('.footer-form').forEach(f => {
    f.addEventListener('submit', ev => { ev.preventDefault(); alert('Thank you for subscribing. We will be in touch.'); f.reset(); });
  });

  // --- Job application modal ---
  const applyModal = document.getElementById('applyModal');
  if (applyModal) {
    const jobName = document.getElementById('applyJobName');
    const positionField = document.getElementById('applyPosition');
    const applyForm = document.getElementById('applyForm');
    const successBox = document.getElementById('applySuccess');
    const cvInput = document.getElementById('aCV');
    const cvText = document.getElementById('aCVText');
    const cvLabel = document.getElementById('aCVLabel');

    function openModal(job) {
      jobName.textContent = job;
      positionField.value = job;
      applyModal.classList.add('open');
      applyModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    }
    function closeModal() {
      applyModal.classList.remove('open');
      applyModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      setTimeout(() => {
        applyForm.reset();
        applyForm.querySelectorAll('.apply-field').forEach(f => f.classList.remove('invalid'));
        successBox.classList.remove('show');
        applyForm.querySelector('.apply-submit').style.display = '';
        if (cvText) cvText.textContent = 'Choose file (PDF or Word)';
        if (cvLabel) cvLabel.classList.remove('has-file');
      }, 250);
    }

    document.querySelectorAll('.apply-btn').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.dataset.job || 'this position'));
    });
    document.getElementById('applyClose').addEventListener('click', closeModal);
    document.getElementById('applyOverlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && applyModal.classList.contains('open')) closeModal(); });

    if (cvInput) {
      cvInput.addEventListener('change', () => {
        if (cvInput.files.length) {
          cvText.textContent = cvInput.files[0].name;
          cvLabel.classList.add('has-file');
          cvInput.closest('.apply-field').classList.remove('invalid');
        }
      });
    }

    applyForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;
      const fields = [
        { id: 'aName', check: v => v.trim().length > 0 },
        { id: 'aMobile', check: v => v.trim().length > 0 },
        { id: 'aEmail', check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: 'aCV', check: () => cvInput.files.length > 0 }
      ];
      fields.forEach(f => {
        const el = document.getElementById(f.id);
        const wrap = el.closest('.apply-field');
        if (!f.check(el.value)) { wrap.classList.add('invalid'); valid = false; }
        else wrap.classList.remove('invalid');
      });
      if (!valid) return;

      const btn = applyForm.querySelector('.apply-submit');
      btn.disabled = true;
      btn.innerHTML = 'Submitting...';
      const formData = new FormData(applyForm);
      fetch('/', { method: 'POST', body: formData })
        .then(() => { btn.style.display = 'none'; successBox.classList.add('show'); })
        .catch(() => {
          btn.disabled = false;
          btn.innerHTML = 'Submit Application';
          alert('Sorry, something went wrong. Please email your CV directly to Info@biosyn-ph.com');
        });
    });
  }

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
