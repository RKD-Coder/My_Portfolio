/* ==========================================
   RITIK DESWAL PORTFOLIO — MAIN JAVASCRIPT
   Three.js 3D • Gooey Text • Theme • Animations
   ========================================== */
// ===== THEME SYSTEM =====
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  // Rebuild 3D background with new colors
  if (window.threeBgInstance) {
    window.threeBgInstance.updateTheme(theme);
  }
}

// Load saved theme or default to light
const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      themeToggle.click();
    }
  });
}

// ===== LOADING SCREEN =====
document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingText = document.getElementById('loading-text');
  const subIcons = document.querySelectorAll('.sub-icons i');
  const designerText = document.getElementById('designer-text');

  function showElement(element, delay = 0) {
    setTimeout(() => {
      element.classList.remove('hidden');
      element.classList.add('fall');
    }, delay);
  }

  showElement(loadingText, 300);
  subIcons.forEach((icon, idx) => {
    showElement(icon, 1000 + idx * 300);
  });
  showElement(designerText, 2200);

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display = 'none', 600);
  }, 3500);
});

// ===== NAVIGATION =====
const navItems = document.querySelectorAll('.ul-list li');
const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const ulList = document.querySelector('.ul-list');

function removeActive() {
  navItems.forEach(li => li.classList.remove('active'));
}

navItems.forEach(li => {
  li.addEventListener('click', e => {
    const link = li.querySelector('a');
    if (!link) return;

    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetId === 'home' || targetId === '') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }

    removeActive();
    li.classList.add('active');

    // Close mobile menu
    if (window.innerWidth <= 768) {
      mobileMenuToggle.classList.remove('active');
      ulList.classList.remove('active');
    }
  });
});

// Mobile menu toggle
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    ulList.classList.toggle('active');
  });
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && ulList && mobileMenuToggle) {
    if (!ulList.contains(e.target) && !mobileMenuToggle.contains(e.target) && ulList.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      ulList.classList.remove('active');
    }
  }
});

// ===== SCROLL HANDLING =====
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.className = 'back-to-top';
backToTop.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTop);

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;

  // Active nav highlight
  let activeSectionFound = false;

  if (window.scrollY < 100) {
    // If we're at the very top, set Home as active
    removeActive();
    const homeLink = document.querySelector('.ul-list li a[href="#home"]');
    if (homeLink) homeLink.parentElement.classList.add('active');
    activeSectionFound = true;
  }

  if (!activeSectionFound) {
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        removeActive();
        const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
        if (activeLink) activeLink.parentElement.classList.add('active');
      }
    });
  }

  // Back to top visibility
  backToTop.style.display = window.scrollY > 500 ? 'flex' : 'none';
});

// ===== SCROLL REVEAL (Intersection Observer) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      // Animate skill bars when revealed
      if (entry.target.classList.contains('skill-category')) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const width = fill.getAttribute('data-width');
          if (width) {
            setTimeout(() => { fill.style.width = width + '%'; }, 200);
          }
        });
      }
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal-el').forEach(el => {
  revealObserver.observe(el);
});

// ===== TYPING TEXT EFFECT =====
(function initTypingText() {
  const texts = ['Data Scientist', 'AI/ML Engineer', 'Full Stack Developer', 'Agentic AI Developer'];
  const typingText = document.querySelector('.typing-text');

  if (!typingText) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
  }

  setTimeout(type, 1000);
})();


// ===== THREE.JS DOTTED WAVE SURFACE =====
(function initThreeBackground() {
  const container = document.getElementById('three-bg');
  if (!container || typeof THREE === 'undefined') return;

  const SEPARATION = 120;
  const AMOUNTX = 50;
  const AMOUNTY = 50;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0, 400, 1400);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Create particle geometry
  const positions = [];
  const colors = [];

  function getParticleColor() {
    const theme = html.getAttribute('data-theme');
    return theme === 'dark' ? [0.6, 0.6, 0.6] : [0.15, 0.15, 0.25];
  }

  let pColor = getParticleColor();
  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
      positions.push(x, 0, z);
      colors.push(pColor[0], pColor[1], pColor[2]);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 6,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;
  let animationId;

  function animateThree() {
    animationId = requestAnimationFrame(animateThree);

    const positionAttribute = geometry.attributes.position;
    const pos = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;
        pos[index + 1] =
          Math.sin((ix + count) * 0.3) * 50 +
          Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }

    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.06;
  }

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', handleResize);
  animateThree();

  // Expose theme updater
  window.threeBgInstance = {
    updateTheme: function (theme) {
      const colorAttr = geometry.attributes.color;
      const c = theme === 'dark' ? [0.6, 0.6, 0.6] : [0.15, 0.15, 0.25];
      for (let i = 0; i < colorAttr.count; i++) {
        colorAttr.setXYZ(i, c[0], c[1], c[2]);
      }
      colorAttr.needsUpdate = true;
    }
  };
})();

// ===== SERVICE CAROUSEL (Circular Testimonials Style) =====
(function initServiceCarousel() {
  const services = [
    {
      name: 'Web Development',
      category: 'Frontend & Backend',
      desc: 'Building responsive, high-performance websites using modern technologies like React, JavaScript, and Python to deliver seamless user experiences across all devices.',
      gradient: 'linear-gradient(135deg, #111 0%, #333 100%)',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      icon: 'fa-solid fa-globe',
      label: 'WEB DEV'
    },
    {
      name: 'Data Science & Analytics',
      category: 'ML / AI / Data',
      desc: 'Transforming raw data into actionable insights using Python, Pandas, Scikit-learn, and statistical analysis. Building predictive models and automated data pipelines.',
      gradient: 'linear-gradient(135deg, #111 0%, #333 100%)',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      icon: 'fa-solid fa-chart-bar',
      label: 'DATA SCI'
    },
    {
      name: 'UI/UX Design',
      category: 'Design & Prototyping',
      desc: 'Creating intuitive and visually appealing user interfaces that enhance user experience and brand identity through modern design principles and micro-animations.',
      gradient: 'linear-gradient(135deg, #111 0%, #333 100%)',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
      icon: 'fa-solid fa-pen-ruler',
      label: 'DESIGN'
    },
    {
      name: 'Data Visualization',
      category: 'Dashboards & Reports',
      desc: 'Transforming complex datasets into clear, actionable visual stories through interactive dashboards using Power BI, Tableau, Matplotlib, and Seaborn.',
      gradient: 'linear-gradient(135deg, #111 0%, #333 100%)',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
      icon: 'fa-solid fa-chart-pie',
      label: 'DATA VIZ'
    }
  ];

  const imagesContainer = document.getElementById('service-carousel-images');
  const textContainer = document.getElementById('service-carousel-text');
  const prevBtn = document.getElementById('service-prev');
  const nextBtn = document.getElementById('service-next');

  if (!imagesContainer || !textContainer) return;

  let activeIndex = 0;
  let autoplayInterval;

  // Create visual cards
  services.forEach((service, i) => {
    const card = document.createElement('div');
    card.className = 'service-visual-card';
    card.style.background = service.gradient;
    card.innerHTML = `
      <img src="${service.image}" alt="${service.name}" class="service-bg-img">
      <i class="${service.icon} service-icon"></i>
      <span class="service-label">${service.label}</span>
    `;
    card.dataset.index = i;
    imagesContainer.appendChild(card);
  });

  const cards = imagesContainer.querySelectorAll('.service-visual-card');

  function getCardStyle(index) {
    const containerWidth = imagesContainer.offsetWidth;
    const gap = Math.min(80, containerWidth * 0.08);
    const maxStick = gap * 0.7;
    const isActive = index === activeIndex;
    const isLeft = (activeIndex - 1 + services.length) % services.length === index;
    const isRight = (activeIndex + 1) % services.length === index;

    if (isActive) {
      return {
        zIndex: 3, opacity: 1, pointerEvents: 'auto',
        transform: 'translateX(0px) translateY(0px) scale(1) rotateY(0deg)'
      };
    }
    if (isLeft) {
      return {
        zIndex: 2, opacity: 1, pointerEvents: 'auto',
        transform: `translateX(-${gap}px) translateY(-${maxStick}px) scale(0.85) rotateY(15deg)`
      };
    }
    if (isRight) {
      return {
        zIndex: 2, opacity: 1, pointerEvents: 'auto',
        transform: `translateX(${gap}px) translateY(-${maxStick}px) scale(0.85) rotateY(-15deg)`
      };
    }
    return {
      zIndex: 1, opacity: 0, pointerEvents: 'none',
      transform: 'translateX(0px) translateY(0px) scale(0.8) rotateY(0deg)'
    };
  }

  function updateCards() {
    cards.forEach((card, i) => {
      const style = getCardStyle(i);
      Object.assign(card.style, {
        zIndex: style.zIndex,
        opacity: style.opacity,
        pointerEvents: style.pointerEvents,
        transform: style.transform,
        transition: 'all 0.8s cubic-bezier(0.4, 2, 0.3, 1)'
      });
    });
  }

  function updateText() {
    const s = services[activeIndex];
    // Word-by-word blur reveal
    const words = s.desc.split(' ');
    const wordsHtml = words.map((word, i) => {
      const delay = (0.025 * i).toFixed(3);
      return `<span style="display:inline-block;opacity:0;filter:blur(10px);transform:translateY(5px);animation:wordReveal 0.25s ease ${delay}s forwards;">${word}&nbsp;</span>`;
    }).join('');

    textContainer.innerHTML = `
      <h3>${s.name}</h3>
      <p class="service-category">${s.category}</p>
      <p class="service-desc">${wordsHtml}</p>
    `;
  }

  function goTo(index) {
    activeIndex = ((index % services.length) + services.length) % services.length;
    updateCards();
    updateText();
  }

  // Initial render
  updateCards();
  updateText();

  // Arrow controls
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(activeIndex - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(activeIndex + 1); resetAutoplay(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { goTo(activeIndex - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(activeIndex + 1); resetAutoplay(); }
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => goTo(activeIndex + 1), 5000);
  }
  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }
  startAutoplay();

  // Resize handler
  window.addEventListener('resize', updateCards);

  // Add word reveal animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes wordReveal {
      to {
        opacity: 1;
        filter: blur(0);
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
})();

// ===== 3D CARD TILT EFFECT =====
document.querySelectorAll('.project-card, .skill-category').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== CONTACT FORM (Web3Forms) =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const keyField = document.getElementById('web3forms-key');
  if (keyField) {
    keyField.value = atob('OGVhMjQ4YWItZmRmNS00NzdlLTlhOGItNTE5NmI4MjdhZGFm');
  }

  contactForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const btn = contactForm.querySelector('.btn-send');
    const originalBtnText = btn.innerText;

    // Honeypot check
    const honeypot = this.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.value) return;

    // Rate limiting
    const lastSent = localStorage.getItem('lastEmailSent');
    const now = Date.now();
    const COOLDOWN = 5 * 60 * 1000;

    if (lastSent && (now - lastSent < COOLDOWN)) {
      const waitTime = Math.ceil((COOLDOWN - (now - lastSent)) / 60000);
      alert(`⏱️ Please wait ${waitTime} minute(s) before sending another message.`);
      return;
    }

    btn.innerText = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(this)
      });

      const data = await response.json();

      if (data.success) {
        btn.innerText = '✓ Sent!';
        btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        btn.style.opacity = '1';

        const userEmail = this.querySelector('input[name="email"]').value;
        alert(`✅ Message sent successfully!\n\nWe received your message and will get back to you at ${userEmail} soon.`);

        contactForm.reset();
        localStorage.setItem('lastEmailSent', Date.now());

        setTimeout(() => {
          btn.innerText = originalBtnText;
          btn.style.background = '';
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      btn.innerText = '✗ Failed';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      btn.style.opacity = '1';

      alert(`❌ Failed to send message.\n\nPlease try again later or contact us directly at ritikdeswal3@gmail.com`);

      setTimeout(() => {
        btn.innerText = originalBtnText;
        btn.style.background = '';
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 3000);
    }
  });
}