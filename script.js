(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nameButton = document.querySelector('.name-button');
  const profilePhoto = document.querySelector('.profile-photo');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.querySelector('.back-to-top');
  const year = document.querySelector('#current-year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (nameButton) {
    let waveAnimationsRemaining = 0;
    nameButton.querySelectorAll('[data-name]').forEach((line) => {
      const text = line.getAttribute('data-name') || '';
      line.textContent = '';
      Array.from(text).forEach((character, index) => {
        const letter = document.createElement('span');
        letter.className = character === ' ' ? 'letter space' : 'letter';
        letter.setAttribute('aria-hidden', 'true');
        letter.style.setProperty('--index', String(index));
        if (character !== ' ') letter.textContent = character;
        line.append(letter);
      });
    });

    if (reducedMotion) {
      nameButton.classList.add('ready');
    } else {
      window.setTimeout(() => nameButton.classList.add('ready'), 80);
    }

    nameButton.addEventListener('click', () => {
      if (reducedMotion) return;
      nameButton.classList.remove('wave');
      void nameButton.offsetWidth;
      waveAnimationsRemaining = nameButton.querySelectorAll('.letter').length;
      nameButton.classList.add('wave');
    });
    nameButton.addEventListener('animationend', (event) => {
      if (event.animationName !== 'name-wave' || !(event.target instanceof Element) || !event.target.classList.contains('letter')) return;
      waveAnimationsRemaining -= 1;
      if (waveAnimationsRemaining <= 0) nameButton.classList.remove('wave');
    });
    nameButton.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || reducedMotion) return;
      nameButton.querySelectorAll('.letter').forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const proximity = Math.max(0, 1 - distance / 105);
        const horizontal = (event.clientX - (rect.left + rect.width / 2)) / 32;
        letter.style.transform = `translate(${Math.max(-2, Math.min(2, horizontal * proximity))}px, ${-2.5 * proximity}px)`;
        letter.style.textShadow = `0 0 ${Math.round(16 * proximity)}px rgba(56, 189, 248, ${(.42 * proximity).toFixed(2)})`;
      });
    });
    nameButton.addEventListener('pointerleave', () => {
      nameButton.querySelectorAll('.letter').forEach((letter) => {
        letter.style.removeProperty('transform');
        letter.style.removeProperty('text-shadow');
      });
    });
  }

  if (profilePhoto) {
    profilePhoto.addEventListener('load', () => profilePhoto.classList.add('loaded'));
    profilePhoto.addEventListener('error', () => profilePhoto.remove());
    if (profilePhoto.complete && profilePhoto.naturalWidth > 0) profilePhoto.classList.add('loaded');
  }

  document.querySelectorAll('.project-card').forEach((projectCard) => {
    const projectGallery = projectCard.querySelector('.project-gallery');
    if (!projectGallery) return;

    const slides = Array.from(projectGallery.querySelectorAll('.project-gallery-slide'));
    const counter = projectGallery.querySelector('.project-gallery-count');
    let activeSlide = 0;
    let autoplayTimer = 0;

    const showSlide = (index, announce = false) => {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const isActive = slideIndex === activeSlide;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      if (counter) {
        counter.textContent = `${activeSlide + 1} / ${slides.length}`;
        counter.setAttribute('aria-live', announce ? 'polite' : 'off');
      }
    };

    const stopAutoplay = () => {
      if (!autoplayTimer) return;
      window.clearInterval(autoplayTimer);
      autoplayTimer = 0;
    };

    projectCard.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'touch' || reducedMotion || autoplayTimer || slides.length < 2) return;
      showSlide(activeSlide + 1);
      autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 2500);
    });
    projectCard.addEventListener('pointerleave', stopAutoplay);
    projectGallery.querySelectorAll('[data-gallery-step]').forEach((button) => {
      button.addEventListener('click', () => {
        stopAutoplay();
        showSlide(activeSlide + Number(button.getAttribute('data-gallery-step')), true);
      });
    });
  });

  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
      navLinks.classList.toggle('open', !isOpen);
      document.body.classList.toggle('menu-open', !isOpen);
    });
    navLinks.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navItems.forEach((link) => {
          const current = link.getAttribute('href') === `#${entry.target.id}`;
          if (current) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
          link.classList.toggle('active', current);
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const updateScrollControls = () => {
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 420);
  };
  window.addEventListener('scroll', updateScrollControls, { passive: true });
  updateScrollControls();
  if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
})();
