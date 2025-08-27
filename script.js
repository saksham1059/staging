document.addEventListener('DOMContentLoaded', function() {
// Typing effect for hero
const typedText = document.getElementById('typed-text');
const phrases = [
  'Web Developer',
  'Programmer',
  'UI/UX Enthusiast',
  'Tech Problem Solver',
  'Open Source Contributor'
];
let phraseIdx = 0, charIdx = 0, typing = true;
function typeLoop() {
  if (!typedText) return;
  if (typing) {
    if (charIdx < phrases[phraseIdx].length) {
      typedText.textContent += phrases[phraseIdx][charIdx++];
      setTimeout(typeLoop, 80);
    } else {
      typing = false;
      setTimeout(typeLoop, 1200);
    }
  } else {
    if (charIdx > 0) {
      typedText.textContent = phrases[phraseIdx].slice(0, --charIdx);
      setTimeout(typeLoop, 30);
    } else {
      typing = true;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
    }
  }
}
typeLoop();

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');
function toggleMenu(force) {
  const willOpen = typeof force === 'boolean' ? force : !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', willOpen);
  hamburger.classList.toggle('open', willOpen);
  menuOverlay.classList.toggle('open', willOpen);
  hamburger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
}
hamburger.addEventListener('click', () => toggleMenu());
// Close menu on link click (mobile)
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    menuOverlay.classList.remove('open');
  });
});
// Close menu on overlay click
menuOverlay.addEventListener('click', () => toggleMenu(false));

// Scrollspy
const sections = ['hero', 'projects', 'techstack', 'timeline', 'services', 'about', 'faq', 'contact', 'socials'];
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 120;
  for (let id of sections) {
    const sec = document.getElementById(id);
    if (sec && sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const active = document.querySelector('.nav-link[href="#' + id + '"]');
      if (active) active.classList.add('active');
    }
  }
});

// Smooth scroll for nav links
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      // Wave transition overlay
      const tc = document.getElementById('transition-container');
      if (tc) {
        tc.classList.add('is-visible');
        tc.classList.remove('hideTopTransition');
        tc.classList.add('showTransition');
        setTimeout(() => {
          document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
          tc.classList.remove('showTransition');
          tc.classList.add('hideTopTransition');
          setTimeout(() => { tc.classList.remove('hideTopTransition'); tc.classList.remove('is-visible'); }, 800);
        }, 150);
      } else {
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Contact form feedback
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out! I will get back to you soon.');
    form.reset();
  });
}

// FAQ accordion
const faqButtons = document.querySelectorAll('.faq-item');
faqButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    const panel = btn.nextElementSibling;
    if (!panel) return;
    if (panel.hasAttribute('hidden')) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
    const icon = btn.querySelector('.faq-icon');
    if (icon) icon.textContent = expanded ? '+' : '−';
  });
});

// Animated reveal on scroll
function revealProjects() {
  const trigger = window.innerHeight * 0.92;
  document.querySelectorAll('.project-card').forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < trigger) {
      card.classList.add('visible');
    }
  });
  // Animate tech icons
  document.querySelectorAll('.tech-icons div').forEach(icon => {
    const rect = icon.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) {
      icon.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealProjects);
window.addEventListener('load', revealProjects);

// Animate About Me skill bars
function revealAboutMe() {
  const aboutLeft = document.querySelector('.aboutme-lab-left');
  if (!aboutLeft) return;
  const rect = aboutLeft.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.92) {
    aboutLeft.classList.add('visible');
  }
}
window.addEventListener('scroll', revealAboutMe);
window.addEventListener('load', revealAboutMe);

// 3D tilt effect
// Use fresh query each time to avoid undefined errors
function addTiltEffect() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * -10;
      card.classList.add('tilt');
      card.style.transform = `translateY(0) scale(1.03) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('tilt');
      card.style.transform = '';
    });
  });
}
addTiltEffect();

// Animated counters for About stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach((el) => {
    const target = Number(el.getAttribute('data-count') || '0');
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 60));
    const update = () => {
      current = Math.min(target, current + increment);
      el.textContent = current;
      if (current < target) requestAnimationFrame(update);
    };
    update();
  });
}
window.addEventListener('load', animateCounters);

// Back to Top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Custom smooth cursor
const cursor = document.getElementById('custom-cursor');
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let cursorX = mouseX, cursorY = mouseY;
function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.18;
  cursorY += (mouseY - cursorY) * 0.18;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
// Cursor hover effect
const hoverables = ['a', 'button', '.cta-btn', '.project-card', '.nav-link', '.tags span', '.service-card', '.faq-item', 'img', '.tech-icon', '.skill-item', '.aboutme-skill', '.aboutme-stat', '.project-card img', '.service-card img'];
document.querySelectorAll(hoverables.join(',')).forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('cursor-hover');
    el.classList.add('cursor-captured');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('cursor-hover');
    el.classList.remove('cursor-captured');
  });
});

// Remove dark mode logic from floating-action-btn
const fab = document.getElementById('floating-action-btn');
const fabIcon = document.getElementById('fab-icon');
function updateFabIcon() {
  fab.classList.add('fab-up');
  fabIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;
}
window.addEventListener('scroll', updateFabIcon);
updateFabIcon();
fab.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Staggered entrance animations
const animatedEls = document.querySelectorAll('.animated, .fade-in, .slide-up, .scale-in, .reveal-up, .reveal-fade, .reveal-left, .reveal-right');
const observer = new window.IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
animatedEls.forEach(el => observer.observe(el));

// Parallax effect for .parallax-shape
const parallaxShapes = document.querySelectorAll('.parallax-shape');
document.addEventListener('mousemove', e => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  parallaxShapes.forEach((shape, i) => {
    const factor = (i + 1) * 18;
    shape.style.transform = `translate(${x * factor}px, ${y * factor}px) scale(1)`;
  });
});
}); 