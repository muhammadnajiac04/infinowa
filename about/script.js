/* =========================================================
   SCORPION FIX – script.js
   ========================================================= */

(function () {
  'use strict';

  /* ---- Sticky header shadow on scroll ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ---- Hamburger / mobile nav ---- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  /* Hamburger lines animation */
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `;
  document.head.appendChild(style);

  /* Mobile: toggle dropdowns inside nav */
  nav.querySelectorAll('.has-dropdown').forEach(item => {
    item.querySelector('.nav-link').addEventListener('click', (e) => {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  /* Close nav on resize if it was open */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${sec.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---- Smooth-close mega menu on outside click ---- */
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown').forEach(d => d.classList.remove('open'));
    }
  });

  /* ---- Image error fallback placeholders ---- */
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      if (this.dataset.fallbackApplied) return;
      this.dataset.fallbackApplied = 'true';

      const w = this.naturalWidth  || this.width  || this.offsetWidth  || 200;
      const h = this.naturalHeight || this.height || this.offsetHeight || 150;
      const alt = encodeURIComponent(this.alt || 'Image');

      // Replace with a styled placeholder div
      const placeholder = document.createElement('div');
      placeholder.style.cssText = `
        width:100%; min-height:${Math.min(h, 300)}px;
        background: linear-gradient(135deg, #f0f2f8 0%, #e5e7ef 100%);
        display:flex; align-items:center; justify-content:center;
        border-radius: 8px; border: 2px dashed #d1d5e0;
        font-size: .8rem; color: #999; text-align:center; padding: 12px;
        font-family: sans-serif;
      `;
      placeholder.textContent = `[${decodeURIComponent(alt)} — asset not loaded]`;
      this.parentNode.replaceChild(placeholder, this);
    }, { once: true });
  });

  /* ---- Counter animation (if stat numbers are present) ---- */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target, +entry.target.dataset.count);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---- Smooth anchor scrolling ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
