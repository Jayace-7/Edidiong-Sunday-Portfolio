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