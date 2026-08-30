// Click Ripple Wave Effect
document.addEventListener('pointerdown', (e) => {
  const ripple = document.createElement('div');
  ripple.className = 'click-ripple';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// ==========================================================================
// 1. DYNAMIC YEAR
// ==========================================================================
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ==========================================================================
// 2. LIVE LOCAL TIME CLOCK
// ==========================================================================
function updateLiveClock() {
  const clockEl = document.getElementById('clockTime');
  if (!clockEl) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  clockEl.textContent = `${timeStr} IST`;
}

updateLiveClock();
setInterval(updateLiveClock, 1000);

// ==========================================================================
// 3. DYNAMIC MORPHING TYPEWRITER ROLE
// ==========================================================================
const ROLES = [
  'Fullstack Developer',
  'Networking Enthusiast',
  'Gamer & Tech Tinkerer',
  'Digital Experience Creator',
];

const roleTextEl = document.getElementById('roleText');
if (roleTextEl) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeRole() {
    const currentRole = ROLES[roleIndex];

    if (isDeleting) {
      roleTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      roleTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      typingSpeed = 400;
    }

    setTimeout(typeRole, typingSpeed);
  }

  setTimeout(typeRole, 600);
}

// ==========================================================================
// 4. SPOTLIGHT GLOW & 3D PARALLAX TILT
// ==========================================================================
const tiltCard = document.getElementById('tiltCard');
const wrapper = document.querySelector('.card-perspective-wrapper');

if (tiltCard && wrapper) {
  function handleMouseMove(e) {
    const bounds = tiltCard.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    tiltCard.style.setProperty('--mouse-x', `${mouseX}px`);
    tiltCard.style.setProperty('--mouse-y', `${mouseY}px`);

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const centerX = mouseX - bounds.width / 2;
      const centerY = mouseY - bounds.height / 2;
      const rotateX = (-centerY / (bounds.height / 2)) * 6;
      const rotateY = (centerX / (bounds.width / 2)) * 6;

      tiltCard.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    }
  }

  function handleMouseLeave() {
    tiltCard.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }

  wrapper.addEventListener('mousemove', handleMouseMove);
  wrapper.addEventListener('mouseleave', handleMouseLeave);
}

// ==========================================================================
// 5. TOAST & FULL GLASSMORPHISM CLIPBOARD ACTIONS
// ==========================================================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

async function copyToClipboard(text, successMessage) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(successMessage);
  } catch (err) {
    console.error('Failed to copy: ', err);
    showToast('Failed to copy to clipboard');
  }
}

const dmDiscordBtn = document.getElementById('dmDiscordBtn');
if (dmDiscordBtn) {
  dmDiscordBtn.addEventListener('click', () => {
    copyToClipboard('anubh4b', '💬 Discord tag copied: anubh4b (Opening Discord...)');
    setTimeout(() => {
      window.open('https://discord.com/users/765917032281276426', '_blank');
    }, 400);
  });
}

const joinDiscordBtn = document.getElementById('joinDiscordBtn');
if (joinDiscordBtn) {
  joinDiscordBtn.addEventListener('click', () => {
    showToast("🚀 Opening ANUBH4B's Café Server...");
  });
}

// ==========================================================================
// 6. TIPPY TOOLTIPS CONFIGURATION
// ==========================================================================
if (typeof tippy !== 'undefined') {
  const tippyConfig = {
    theme: 'modern',
    animation: 'shift-away',
    arrow: true,
    placement: 'top',
    duration: [200, 150],
  };

  tippy('#github', { ...tippyConfig, content: 'GitHub: @ANUBH4B' });
  tippy('#email', { ...tippyConfig, content: 'Email: contactanubhab@gmail.com' });
  tippy('#steam', { ...tippyConfig, content: 'Steam: ANUBH4B' });
  tippy('#xbox', { ...tippyConfig, content: 'Xbox: ANUBH4B' });
  tippy('#twitter', { ...tippyConfig, content: 'X (Twitter): @ANUBH4B' });
  tippy('#youtube', { ...tippyConfig, content: 'YouTube: AnubhabGG' });
  tippy('#dmDiscordBtn', { ...tippyConfig, content: 'Copy tag & DM on Discord (@anubh4b)' });
  tippy('#joinDiscordBtn', { ...tippyConfig, content: "Join ANUBH4B's Café Discord Server" });
}

// ==========================================================================
// 7. MAGNETIC SOFT GLOW HALO CURSOR
// ==========================================================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let targetElement = null;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    cursorDot.classList.remove('cursor-hidden');
    cursorRing.classList.remove('cursor-hidden');
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.classList.add('cursor-hidden');
    cursorRing.classList.add('cursor-hidden');
  });

  document.addEventListener('mousedown', () => {
    cursorRing.classList.add('cursor-active');
  });

  document.addEventListener('mouseup', () => {
    cursorRing.classList.remove('cursor-active');
  });

  const hoverTargets = 'a, button, input, .skill-pill, .avatar-container, .copy-btn, .social-btn';
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverTargets);
    if (target) {
      targetElement = target;
      cursorRing.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      targetElement = null;
      cursorRing.classList.remove('cursor-hover');
    }
  });

  function renderCursor() {
    let destX = mouseX;
    let destY = mouseY;

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      destX = mouseX + (elemCenterX - mouseX) * 0.35;
      destY = mouseY + (elemCenterY - mouseY) * 0.35;
    }

    ringX += (destX - ringX) * 0.2;
    ringY += (destY - ringY) * 0.2;

    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
}

// ==========================================================================
// 8. FLOATING LIQUID GLASS METABALLS ENGINE
// ==========================================================================
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let time = 0;
  let mouse = { x: null, y: null, radius: 220 };

  const metaballDefs = [
    { baseR: 190, speedX: 0.35, speedY: 0.28, phase: 0, amp: 28, color: ['rgba(255, 255, 255, 0.16)', 'rgba(226, 232, 240, 0.04)', 'transparent'] },
    { baseR: 240, speedX: -0.25, speedY: 0.32, phase: 1.5, amp: 35, color: ['rgba(168, 85, 247, 0.12)', 'rgba(147, 51, 234, 0.03)', 'transparent'] },
    { baseR: 210, speedX: 0.30, speedY: -0.22, phase: 3.0, amp: 30, color: ['rgba(56, 189, 248, 0.13)', 'rgba(14, 165, 233, 0.03)', 'transparent'] },
    { baseR: 170, speedX: -0.38, speedY: -0.26, phase: 4.5, amp: 25, color: ['rgba(255, 255, 255, 0.18)', 'rgba(203, 213, 225, 0.04)', 'transparent'] },
    { baseR: 220, speedX: 0.22, speedY: 0.35, phase: 2.2, amp: 32, color: ['rgba(192, 132, 252, 0.10)', 'rgba(99, 102, 241, 0.02)', 'transparent'] },
    { baseR: 180, speedX: -0.28, speedY: 0.20, phase: 5.2, amp: 26, color: ['rgba(59, 130, 246, 0.12)', 'rgba(37, 99, 235, 0.03)', 'transparent'] },
  ];

  let metaballs = [];
  let stardust = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initMetaballs();
  }

  class Metaball {
    constructor(def) {
      this.def = def;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = def.speedX * (Math.random() * 0.4 + 0.8);
      this.vy = def.speedY * (Math.random() * 0.4 + 0.8);
      this.phase = def.phase;
      this.baseR = def.baseR;
      this.amp = def.amp;
      this.color = def.color;
      this.morphSpeed = Math.random() * 0.015 + 0.015;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Soft bounce within viewport boundaries
      if (this.x < -this.baseR * 0.5) { this.x = -this.baseR * 0.5; this.vx *= -1; }
      if (this.x > width + this.baseR * 0.5) { this.x = width + this.baseR * 0.5; this.vx *= -1; }
      if (this.y < -this.baseR * 0.5) { this.y = -this.baseR * 0.5; this.vy *= -1; }
      if (this.y > height + this.baseR * 0.5) { this.y = height + this.baseR * 0.5; this.vy *= -1; }

      // Mouse gentle fluid displacement
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3.5;
          this.y -= (dy / dist) * force * 3.5;
        }
      }
    }

    draw() {
      const currentRadius = this.baseR + Math.sin(time * this.morphSpeed + this.phase) * this.amp;
      
      const grad = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, Math.max(10, currentRadius)
      );

      grad.addColorStop(0, this.color[0]);
      grad.addColorStop(0.55, this.color[1]);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Specular liquid core highlight
      const specGrad = ctx.createRadialGradient(
        this.x - currentRadius * 0.25, this.y - currentRadius * 0.25, 0,
        this.x - currentRadius * 0.25, this.y - currentRadius * 0.25, currentRadius * 0.45
      );
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      specGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.arc(this.x - currentRadius * 0.25, this.y - currentRadius * 0.25, currentRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initMetaballs() {
    metaballs = metaballDefs.map(def => new Metaball(def));
    stardust = [];
    const count = Math.min(Math.floor((width * height) / 25000), 45);
    for (let i = 0; i < count; i++) {
      stardust.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  function renderMetaballs() {
    ctx.clearRect(0, 0, width, height);
    time++;

    ctx.globalCompositeOperation = 'screen';

    // Draw Liquid Metaballs
    for (let i = 0; i < metaballs.length; i++) {
      metaballs[i].update();
      metaballs[i].draw();
    }

    ctx.globalCompositeOperation = 'source-over';

    // Draw Floating Stardust Motes
    for (let i = 0; i < stardust.length; i++) {
      const p = stardust[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    requestAnimationFrame(renderMetaballs);
  }

  window.addEventListener('resize', resizeCanvas);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  renderMetaballs();
}