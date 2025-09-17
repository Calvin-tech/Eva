// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Hamburger clicked, current classes:', navLinks.className);
    
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    
    console.log('After toggle, classes:', navLinks.className);
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
      console.log('Menu opened');
    } else {
      document.body.style.overflow = '';
      console.log('Menu closed');
    }
  });
  
  // Close menu when clicking on overlay or nav links
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    } else if (e.target === navLinks) {
      // Close when clicking on the overlay (empty space)
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
  
  // Close menu on window resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// Highlight active nav link based on current path and maintain scroll position
(function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('#nav-links a');
  const navLinks = document.getElementById('nav-links');
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const target = href.split('/').pop();
    if (target === currentPath || (currentPath === '' && target === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
      
      // Scroll to active link and maintain position
      if (navLinks && window.innerWidth > 768) {
        setTimeout(() => {
          const linkRect = link.getBoundingClientRect();
          const navRect = navLinks.getBoundingClientRect();
          const scrollLeft = navLinks.scrollLeft;
          const linkCenter = linkRect.left - navRect.left + scrollLeft - (navRect.width / 2) + (linkRect.width / 2);
          
          navLinks.scrollTo({
            left: linkCenter,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
})();

// Maintain scroll position on navigation
(function maintainNavScroll() {
  const navLinks = document.getElementById('nav-links');
  if (!navLinks) return;
  
  // Save scroll position when clicking nav links
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      const scrollPosition = navLinks.scrollLeft;
      sessionStorage.setItem('navScrollPosition', scrollPosition);
    }
  });
  
  // Restore scroll position on page load
  window.addEventListener('load', () => {
    const savedPosition = sessionStorage.getItem('navScrollPosition');
    if (savedPosition && window.innerWidth > 768) {
      navLinks.scrollLeft = parseInt(savedPosition);
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const savedPosition = sessionStorage.getItem('navScrollPosition');
      if (savedPosition) {
        navLinks.scrollLeft = parseInt(savedPosition);
      }
    }
  });
})();

// Smooth scroll for in-page anchors
(function smoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  internalLinks.forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    });
  });
})();

// Simple form handlers
function handleForm(id, successMessage) {
  const form = document.getElementById(id);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    setTimeout(() => {
      alert(successMessage);
      form.reset();
      if (submitBtn) submitBtn.disabled = false;
    }, 400);
  });
}

handleForm('salvation-form', 'Thank you. We will reach out to you soon.');
handleForm('contact-form', 'Message sent! We will get back to you.');
