/* ═══════════════════════════════════════════
   SOLO LEVELING PORTFOLIO — script.js
   Shadow Monarch: Thule Leela Vardhan
   ═══════════════════════════════════════════ */

'use strict';

/* ─── CUSTOM CURSOR ─────────────────────────────── */
(function initCursor() {
  const outer = document.getElementById('cursorOuter');
  const inner = document.getElementById('cursorInner');
  if (!outer || !inner) return;

  let mouseX = -200, mouseY = -200;
  let outerX = -200, outerY = -200;
  let raf;

  // Instantly snap inner dot; smoothly trail outer ring
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    inner.style.left = mouseX + 'px';
    inner.style.top  = mouseY + 'px';
  });

  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    outer.style.left = outerX + 'px';
    outer.style.top  = outerY + 'px';
    raf = requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Hover expand on interactive elements
  const interactiveSelector = 'a, button, [role="button"], input, textarea, .skill-card, .project-card, .social-btn, .nav-link';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      outer.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      outer.classList.remove('hovering');
    }
  });

  // Hide cursor when leaving the window
  document.addEventListener('mouseleave', () => {
    outer.style.opacity = '0';
    inner.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    outer.style.opacity = '1';
    inner.style.opacity = '1';
  });

  // Click ripple effect on inner dot
  document.addEventListener('mousedown', () => {
    inner.style.transform = 'translate(-50%, -50%) scale(2.5)';
    inner.style.opacity   = '0.5';
  });
  document.addEventListener('mouseup', () => {
    inner.style.transform = 'translate(-50%, -50%) scale(1)';
    inner.style.opacity   = '1';
  });
})();


/* ─── PARTICLE CANVAS ───────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLE_COUNT = 90;

  function randomParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4 - 0.15,
      r:     Math.random() * 1.4 + 0.4,
      alpha: Math.random() * 0.5 + 0.15,
      hue:   Math.random() < 0.6 ? 190 : 265, // cyan or violet
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(randomParticle());

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10 || p.x < -10 || p.x > W + 10) {
        particles[i] = randomParticle();
        particles[i].y = H + 10;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });

    // Faint connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
})();


/* ─── NAVBAR ────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();


/* ─── TYPEWRITER ─────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Full Stack Developer',
    'Deep Learning Researcher',
    'Web Application Developer',
    'Python Developer',
    'CSE Undergraduate · 2026',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = deleting
      ? current.substring(0, charIdx--)
      : current.substring(0, charIdx++);

    let delay = deleting ? 60 : 110;

    if (!deleting && charIdx > current.length) {
      delay = 2000;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      charIdx = 0;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
})();


/* ─── COUNTER ANIMATION ──────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, 40);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─── ATTRIBUTE BARS ─────────────────────────────── */
(function initAttrBars() {
  const fills = document.querySelectorAll('.attr-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.width = el.dataset.width + '%';
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


/* ─── SKILL PROGRESS BARS ────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-progress[data-w]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.width = el.dataset.w + '%';
      observer.unobserve(el);
    });
  }, { threshold: 0.2 });

  bars.forEach(b => observer.observe(b));
})();


/* ─── SCROLL REVEAL ──────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─── CONTACT FORM ───────────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"] span:last-child');
    if (btn) {
      const original = btn.textContent;
      btn.textContent = 'MESSAGE SENT ✓';
      form.reset();
      setTimeout(() => { btn.textContent = original; }, 3000);
    }
  });
})();


/* ─── AVATAR PARTICLE BURST ──────────────────────── */
(function initAvatarParticles() {
  const container = document.getElementById('avatarParticles');
  if (!container) return;

  function spawnDot() {
    const dot = document.createElement('div');
    const angle = Math.random() * 360;
    const dist  = 100 + Math.random() * 30;
    dot.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      border-radius: 50%;
      background: ${Math.random() < 0.6 ? '#00e5ff' : '#8b5cf6'};
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(${angle}deg) translateX(${dist}px);
      opacity: ${0.3 + Math.random() * 0.5};
      animation: dotFloat ${2 + Math.random() * 2}s ease-in-out infinite alternate;
      box-shadow: 0 0 4px currentColor;
    `;
    container.appendChild(dot);
  }

  // Add CSS keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes dotFloat {
      from { opacity: 0.2; transform: translate(-50%, -50%) rotate(var(--a, 0deg)) translateX(var(--d, 110px)) scale(1); }
      to   { opacity: 0.7; transform: translate(-50%, -50%) rotate(var(--a, 0deg)) translateX(var(--d, 130px)) scale(1.4); }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 12; i++) spawnDot();
})();


/* ─── GLITCH HOVER ON HERO NAME ──────────────────── */
(function initNameGlitch() {
  const names = document.querySelectorAll('.name-line');
  names.forEach(n => {
    n.addEventListener('mouseenter', () => {
      n.style.animation = 'nameGlitch 0.4s steps(2) forwards';
    });
    n.addEventListener('mouseleave', () => {
      n.style.animation = '';
    });
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes nameGlitch {
      0%  { text-shadow: 2px 0 #00e5ff, -2px 0 #8b5cf6; }
      25% { text-shadow: -3px 0 #ef4444, 3px 0 #00e5ff; clip-path: inset(20% 0 50% 0); }
      50% { text-shadow: 3px 0 #8b5cf6, -3px 0 #00e5ff; clip-path: inset(60% 0 10% 0); }
      75% { text-shadow: -2px 0 #f59e0b, 2px 0 #8b5cf6; }
      100%{ text-shadow: none; }
    }
  `;
  document.head.appendChild(style);
})();


/* ─── SKILL CARD TILT ────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.skill-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-4px) rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ─── REVEAL ALL SECTION CHILDREN ───────────────── */
(function markRevealElements() {
  const selectors = [
    '.skill-card',
    '.project-card',
    '.about-container',
    '.contact-container',
    '.hero-stats',
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  // Re-run reveal observer after marking
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();
