// ==========================================================================
// NAVBAR — mobile menu toggle
// ==========================================================================

const navbar = document.getElementById('navbar');
const burger = document.getElementById('navbarBurger');
const themeToggle = document.getElementById('themeToggle');
const navLinks = document.querySelectorAll('.navbar__link');

const getSavedTheme = () => {
  try {
    return localStorage.getItem('portfolio-theme');
  } catch (error) {
    return null;
  }
};

const saveTheme = (theme) => {
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (error) {
    // Storage can be unavailable when the page is opened directly from disk.
  }
};

const savedTheme = getSavedTheme();
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
const initialTheme = savedTheme || preferredTheme;

const setTheme = (theme) => {
  const isLight = theme === 'light';
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute('aria-pressed', String(isLight));
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  saveTheme(theme);
};

setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
});

burger.addEventListener('click', () => {
  navbar.classList.toggle('navbar--open');
});

// Close mobile menu when a link is clicked
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((navLink) => {
      navLink.classList.remove('navbar__link--active');
    });
    link.classList.add('navbar__link--active');
    navbar.classList.remove('navbar--open');
  });
});

const animateHero = () => {
  const heroContent = document.querySelector('.hero__content');
  const heroVisual = document.querySelector('.hero__visual');

  if (!window.gsap || !heroContent || !heroVisual || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const heroItems = heroContent.querySelectorAll('.hero__eyebrow, .hero__headline, .hero__text, .hero__cta, .hero__stats');

  gsap.from(heroItems, {
    duration: 1.5,
    y: 24,
    opacity: 0,
    stagger: 0.22,
    ease: 'power2.out'
  });

  gsap.from(heroVisual, {
    duration: 1.8,
    x: 32,
    opacity: 0,
    delay: 0.50,
    ease: 'power2.out'
  });
};

animateHero();

const animateAboutCards = () => {
  const aboutSection = document.querySelector('.about');
  const serviceCards = document.querySelectorAll('.about__service-card');

  if (!window.gsap || !aboutSection || !serviceCards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const revealCards = () => {
    gsap.from(serviceCards, {
      duration: 0.9,
      y: 32,
      opacity: 0,
      scale: 0.96,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity'
    });
  };

  const observer = new IntersectionObserver((entries, currentObserver) => {
    if (!entries[0].isIntersecting) {
      return;
    }

    revealCards();
    currentObserver.disconnect();
  }, { threshold: 0.2 });

  observer.observe(aboutSection);
};

animateAboutCards();

// ==========================================================================
// TESTIMONIALS — carousel (arrows + dots)
// ==========================================================================

const initTestimonialsCarousel = () => {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsWrap = document.getElementById('testimonialDots');

  if (!track || !prevBtn || !nextBtn || !dotsWrap) {
    return;
  }

  const slides = Array.from(track.querySelectorAll('.testimonials__slide'));
  const dots = Array.from(dotsWrap.querySelectorAll('.testimonials__dot'));
  const slideCount = slides.length;

  if (!slideCount) {
    return;
  }

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 3500;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const goToSlide = (index) => {
    // Wrap around in both directions so Prev from slide 0 goes to the last slide, and vice versa.
    currentIndex = (index + slideCount) % slideCount;

    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('testimonials__dot--active', dotIndex === currentIndex);
    });
  };

  const showNext = () => goToSlide(currentIndex + 1);
  const showPrev = () => goToSlide(currentIndex - 1);

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  const startAutoplay = () => {
    if (prefersReducedMotion || slideCount < 2) {
      return;
    }
    stopAutoplay();
    autoplayTimer = setInterval(showNext, AUTOPLAY_DELAY);
  };

  nextBtn.addEventListener('click', () => {
    showNext();
    startAutoplay();
  });

  prevBtn.addEventListener('click', () => {
    showPrev();
    startAutoplay();
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIndex = Number(dot.dataset.index);
      goToSlide(targetIndex);
      startAutoplay();
    });
  });

  // Pause autoplay while the user's cursor is over the carousel.
  const carousel = track.closest('.testimonials__carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  goToSlide(0);
  startAutoplay();
};

initTestimonialsCarousel();