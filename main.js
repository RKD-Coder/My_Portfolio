const navLinks = document.querySelectorAll('.ul-list li a');
const sections = document.querySelectorAll('section');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const ulList = document.querySelector('.ul-list');

// Mobile menu toggle
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    ulList.classList.toggle('active');
  });
}

function removeActive() {
  navLinks.forEach(link => link.parentElement.classList.remove('active'));
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: 'smooth'
      });
    }

    removeActive();
    link.parentElement.classList.add('active');

    // Close mobile menu after clicking a link
    if (window.innerWidth <= 768) {
      mobileMenuToggle.classList.remove('active');
      ulList.classList.remove('active');
    }
  });
});

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      removeActive();
      const activeLink = document.querySelector(`.ul-list li a[href="#${section.id}"]`);
      if (activeLink) activeLink.parentElement.classList.add('active');
    }
  });

  if (window.scrollY > 500) {
    backToTop.style.display = "flex";
  } else {
    backToTop.style.display = "none";
  }

  revealElements.forEach(el => {
    const windowHeight = window.innerHeight;
    const elementTop = el.getBoundingClientRect().top;
    const revealPoint = 150;

    if (elementTop < windowHeight - revealPoint) {
      el.classList.add('active-reveal');
    }
  });
});

const revealElements = document.querySelectorAll('.about-container, .projects-container, .services-container, .contact-content');
revealElements.forEach(el => el.classList.add('reveal'));

// Make home container visible immediately
const homeContainer = document.querySelector('.home-container');
if (homeContainer) {
  homeContainer.classList.add('active-reveal');
}


const backToTop = document.createElement('div');
backToTop.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
backToTop.className = "back-to-top";
document.body.appendChild(backToTop);

backToTop.style.cssText = `
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: #474af0;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 999;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(71, 74, 240, 0.4);
`;

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseover', () => backToTop.style.transform = 'scale(1.2)');
backToTop.addEventListener('mouseout', () => backToTop.style.transform = 'scale(1)');

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!ulList.contains(e.target) && !mobileMenuToggle.contains(e.target) && ulList.classList.contains('active')) {
      mobileMenuToggle.classList.remove('active');
      ulList.classList.remove('active');
    }
  }
});

const cards = document.querySelectorAll('.project-card, .c1, .service-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-8px) scale(1.05)');
  card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0) scale(1)');
});

const typingElement = document.querySelector('.info-home h3');
const words = ["Data Analyst", "Data Scientist", "AI/ML Enthusiast", "Full Stack Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
  const currentWord = words[wordIndex];
  let displayedText = currentWord.substring(0, charIndex);

  typingElement.innerHTML = displayedText + '<span class="cursor">|</span>';

  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(type, typingSpeed);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, typingSpeed / 2);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) {
      wordIndex = (wordIndex + 1) % words.length;
    }
    setTimeout(type, 1000);
  }
}

document.addEventListener('DOMContentLoaded', type);

document.addEventListener("DOMContentLoaded", () => {
  const loadingText = document.getElementById("loading-text");
  const mainIcon = document.querySelector(".main-icon");
  const subIcons = document.querySelectorAll(".sub-icons i");
  const designerText = document.getElementById("designer-text");
  const mainPage = document.getElementById("main-page");
  const loadingScreen = document.getElementById("loading-screen");

  function showElement(element, delay = 0) {
    setTimeout(() => {
      element.classList.remove("hidden");
      element.classList.add("fall");
    }, delay);
  }

  showElement(loadingText, 0);
  showElement(mainIcon, 800);
  subIcons.forEach((icon, idx) => {
    showElement(icon, 1600 + idx * 400);
  });
  showElement(designerText, 2800);

  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => loadingScreen.style.display = 'none', 500);
    if (mainPage) mainPage.classList.add("visible");
  }, 4000);
});

// Contact Form Handling with Web3Forms
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

    // Honeypot Check
    const honeypot = this.querySelector('input[name="botcheck"]');
    if (honeypot && honeypot.value) {
      return; // Silently fail for bots
    }

    // Rate Limiting
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
        // Success feedback
        btn.innerText = '✓ Sent!';
        btn.style.backgroundColor = '#10b981';
        btn.style.opacity = '1';

        const userEmail = this.querySelector('input[name="email"]').value;
        alert(`✅ Message sent successfully!\n\nWe received your message and will get back to you at ${userEmail} soon.`);

        contactForm.reset();
        localStorage.setItem('lastEmailSent', Date.now());

        setTimeout(() => {
          btn.innerText = originalBtnText;
          btn.style.backgroundColor = '';
          btn.disabled = false;
          btn.style.opacity = '1';
        }, 3000);
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      // Error feedback
      btn.innerText = '✗ Failed';
      btn.style.backgroundColor = '#ef4444';
      btn.style.opacity = '1';

      alert(`❌ Failed to send message.\n\nPlease try again later or contact us directly at ritikdeswal14@gmail.com`);

      setTimeout(() => {
        btn.innerText = originalBtnText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
        btn.style.opacity = '1';
      }, 3000);
    }
  });
}