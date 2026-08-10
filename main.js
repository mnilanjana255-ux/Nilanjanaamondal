/* =========================================
   NILANJANA MONDAL – MAIN JAVASCRIPT
   Portfolio Website JS
   ========================================= */

'use strict';

// ---- DOM Ready ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initTypingAnimation();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initTestimonialSlider();
  initBackToTop();
  initPortfolioFilter();
  initContactForm();
  setActiveNavLink();
});

// ---- NAVBAR SCROLL ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ---- HAMBURGER MENU ----
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');
  if (!hamburger || !navLinks) return;

  const toggle = () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  };

  const close = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', close);

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });
}

// ---- TYPING ANIMATION ----
function initTypingAnimation() {
  const el = document.getElementById('typingText');
  if (!el) return;
  const phrases = [
    'Digital Marketing Expert',
    'SEO Strategist',
    'Social Media Specialist',
    'Content Creator',
    'Growth Hacker'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false, speed = 100;

  // Add cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  el.parentElement.appendChild(cursor);

  function type() {
    const current = phrases[phraseIdx];
    if (deleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 50;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 100;
    }
    if (!deleting && charIdx === current.length) {
      speed = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 800);
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ---- COUNTER ANIMATION ----
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ---- SKILL BARS ----
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill, .skill-bar-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.dataset.width || el.style.width;
        el.style.width = '0';
        setTimeout(() => { el.style.width = width; }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => {
    const w = el.style.width;
    el.dataset.width = w;
    el.style.width = '0';
    observer.observe(el);
  });
}

// ---- TESTIMONIAL SLIDER ----
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let cardsVisible = getCardsVisible();
  const total = Math.ceil(cards.length / cardsVisible);

  function getCardsVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, total - 1));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardsVisible * cardWidth}px)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto slide
  let autoSlide = setInterval(() => goTo((current + 1) % total), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo((current + 1) % total), 5000); });

  // Responsive
  window.addEventListener('resize', () => {
    cardsVisible = getCardsVisible();
    goTo(0);
  });
}

// ---- BACK TO TOP ----
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---- PORTFOLIO FILTER ----
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-full-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const successMsg = document.getElementById('formSuccess');

    // Validate
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#EF4444';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    // Simulate sending
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }, 2000);
  });
}

// ---- ACTIVE NAV LINK ----
function setActiveNavLink() {
  const links = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === currentPage || (currentPage === '' && href === 'index.html'));
  });
}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
