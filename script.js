/* ═══════════════════════════════════════════════════════════════════
   PORTFOLIO JAVASCRIPT ENGINE — ALL CLICKS & CONTROLS ACTIVE
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. THEME TOGGLE ─────────────────────────────────────────── */
  const THEME_KEY = 'sp_portfolio_theme';
  const themeToggle = document.getElementById('themeToggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }


 /* ── SMOOTH PRELOADER WITH FAILSAFE FALLBACK ────────────────── */
  const preloaderStartTime = Date.now();
  const MIN_DISPLAY_TIME = 1200; 
  let preloaderDismissed = false;

  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;

    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const elapsedTime = Date.now() - preloaderStartTime;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none'; 
        preloader.remove();
      }, 700);
    }, remainingTime);
  }

  
  window.addEventListener('load', dismissPreloader);

  
  setTimeout(dismissPreloader, 3000);


/* ── A. TYPEWRITER EFFECT ───────────────────────────────────── */
  const typewriterElement = document.getElementById('typewriterText');
  if (typewriterElement) {
    const roles = [
      'Creative Web Developer',
      'UI & Graphic Designer',
      'Full-Stack Enthusiast',
      'Problem Solver'
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
      }

      let typingSpeed = isDeleting ? 45 : 85;

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 1800; // লেখা শেষ হলে কিছুক্ষণ থামবে
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // নতুন শব্দ শুরুর আগে বিরতি
      }

      setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
  }

  /* ── B. INTERSECTION OBSERVER (SCROLL REVEAL) ──────────────── */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // একবার অ্যানিমেশন হলে আর ট্রিগার হবে না
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // ফলব্যাক: ব্রাউজারে সাপোর্ট না থাকলে সরাসরি দৃশ্যমান হবে
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ── C. SCROLL TO TOP CONTROLLER ────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('show-scroll');
      } else {
        scrollTopBtn.classList.remove('show-scroll');
      }
    }, { passive: true });

    scrollTopBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
  }












  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
      }
    }
  }

  applyTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.onclick = function () {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    };
  }

  /* ── 2. MOBILE NAVIGATION TOGGLE ────────────────────────────── */
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinksList = document.getElementById('navLinks');

  if (mobileToggle && navLinksList) {
    mobileToggle.onclick = function (e) {
      e.stopPropagation();
      const isOpen = navLinksList.classList.toggle('active-mobile');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
      }
    };

    navLinksList.querySelectorAll('a').forEach((link) => {
      link.onclick = function () {
        navLinksList.classList.remove('active-mobile');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      };
    });

    document.onclick = function (e) {
      if (!navLinksList.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinksList.classList.remove('active-mobile');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'bi bi-list';
      }
    };
  }

  /* ── 3. SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.onclick = function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  });

  /* ── 4. SCROLL WATCHER FOR ACTIVE NAV LINKS ─────────────────── */
  const navItems = document.querySelectorAll('.nav-links .nav-item');
  const sections = document.querySelectorAll('section[id]');

  function onScrollSpy() {
    const scrollPos = window.scrollY + 160;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ── 5. CONTACT FORM (LIVE FORMSPREE SUBMISSION) ────────────── */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.onsubmit = async function (e) {
      e.preventDefault();

      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      const formData = new FormData(this);

      btn.innerHTML = `<span>Sending...</span> <i class="bi bi-arrow-repeat"></i>`;
      btn.style.pointerEvents = 'none';

      try {
        const res = await fetch(this.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (res.ok) {
          btn.innerHTML = `<span>Message Sent!</span> <i class="bi bi-check2"></i>`;
          showToast('Thank you! Message transmitted successfully.', 'success');
          this.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        btn.innerHTML = `<span>Failed</span> <i class="bi bi-exclamation-circle"></i>`;
        showToast('Failed to transmit. Please email directly.', 'error');
      } finally {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.pointerEvents = '';
        }, 4000);
      }
    };
  }

  function showToast(msg, type) {
    const prev = document.querySelector('.toast-notice');
    if (prev) prev.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.style.cssText = `
      margin-top: 14px;
      padding: 12px 18px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 500;
      color: ${type === 'error' ? '#f87171' : '#4ade80'};
      background: ${type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'};
      border: 1px solid ${type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'};
    `;
    toast.textContent = msg;
    contactForm.appendChild(toast);

    setTimeout(() => toast.remove(), 4500);
  }

  /* ── 6. DYNAMIC YEAR ────────────────────────────────────────── */
  const yearSpan = document.getElementById('footerYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
})();