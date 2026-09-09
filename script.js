/* ═══════════════════════════════════════════════════════════════════
   SAMPRITI PRADHAN — Portfolio JavaScript Engine
   Theme Engine | Dynamic Meters | AOS Init | Live Form Transmission
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM Elements ─────────────────────────────────────────────── */
  const navbar       = document.getElementById('navbar');
  const themeToggle  = document.getElementById('themeToggle');
  const menuToggle   = document.getElementById('menuToggle');
  const navLinks     = document.getElementById('navLinks');
  const btnTop       = document.getElementById('btnTop');
  const contactForm  = document.getElementById('contactForm');
  const meterFills   = document.querySelectorAll('.meter-fill');

  /* ══════════════════════════════════════════════════════════════════
     1. THEME ENGINE (Dark/Light Mode with localStorage Persistence)
     ══════════════════════════════════════════════════════════════════ */
  const THEME_KEY = 'sp-portfolio-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  // Initialize theme before full render
  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     2. NAVBAR — Scroll Backdrop & Active Link Highlighting
     ══════════════════════════════════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    const scrollY = window.scrollY;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    sections.forEach((section) => {
      const top = section.offsetTop - 180;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════════════════════════════════════
     3. MOBILE MENU TOGGLE (FIXED FOR TOUCH & CLICK)
     ══════════════════════════════════════════════════════════════════ */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('show');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
      }
    });

    // Close menu when clicking any nav item
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        const icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !navLinks.contains(e.target)) {
        if (navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          const icon = menuToggle.querySelector('i');
          if (icon) icon.className = 'bi bi-list';
        }
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     4. ANIMATED PROFICIENCY METERS (DeveloperFolio Trigger)
     ══════════════════════════════════════════════════════════════════ */
  if ('IntersectionObserver' in window && meterFills.length > 0) {
    const meterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const meter = entry.target;
            const targetWidth = meter.getAttribute('style')?.match(/width:\s*([^;]+)/)?.[1] || '80%';
            meter.style.width = '0%';
            setTimeout(() => {
              meter.style.width = targetWidth;
            }, 100);
            observer.unobserve(meter);
          }
        });
      },
      { threshold: 0.25 }
    );

    meterFills.forEach((meter) => meterObserver.observe(meter));
  }

  /* ══════════════════════════════════════════════════════════════════
     5. SMOOTH SCROLL FOR ALL ANCHOR LINKS
     ══════════════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ══════════════════════════════════════════════════════════════════
     6. BACK TO TOP BUTTON
     ══════════════════════════════════════════════════════════════════ */
  if (btnTop) {
    btnTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     7. AOS (Animate On Scroll) INITIALIZATION (MOBILE COMPATIBLE)
     ══════════════════════════════════════════════════════════════════ */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 750,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: window.innerWidth < 768, // মোবাইলে অপাসিটি যেন আটকে না থাকে
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     8. CONTACT FORM — Live Transmission to Email (Formspree API)
     ══════════════════════════════════════════════════════════════════ */
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = this.querySelector('#formName').value.trim();
      const email   = this.querySelector('#formEmail').value.trim();
      const message = this.querySelector('#formMessage').value.trim();

      if (!name || !email || !message) {
        showFormFeedback('Please fill in all fields.', 'error');
        return;
      }

      const btn = this.querySelector('.btn-submit');
      const originalText = btn.innerHTML;
      const formData = new FormData(this);

      // Loading UI
      btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Transmitting...';
      btn.style.pointerEvents = 'none';

      try {
        const response = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i> Transmission Received!';
          showFormFeedback('Thank you! Your message reached my terminal.', 'success');
          this.reset();
        } else {
          throw new Error('Transmission Failed');
        }
      } catch (error) {
        btn.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i> Error!';
        showFormFeedback('Failed to transmit. Please email directly.', 'error');
      } finally {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.pointerEvents = '';
        }, 4000);
      }
    });
  }

  function showFormFeedback(msg, type) {
    const existing = document.querySelector('.form-feedback');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = 'form-feedback';
    el.style.cssText = `
      padding: 10px 16px;
      margin-top: 14px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 500;
      color: ${type === 'error' ? '#f87171' : '#4ade80'};
      background: ${type === 'error' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(74, 222, 128, 0.1)'};
      border: 1px solid ${type === 'error' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(74, 222, 128, 0.2)'};
    `;
    el.textContent = msg;
    contactForm.appendChild(el);

    setTimeout(() => el.remove(), 4500);
  }

  /* ══════════════════════════════════════════════════════════════════
     9. MAGNETIC BUTTON MICRO-INTERACTION (DESKTOP ONLY)
     ══════════════════════════════════════════════════════════════════ */
  if (window.innerWidth > 992) {
    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      });

      btn.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     10. DYNAMIC YEAR IN FOOTER
     ══════════════════════════════════════════════════════════════════ */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();