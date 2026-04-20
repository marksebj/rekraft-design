import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window { __lenis?: Lenis }
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Lenis smooth scroll + GSAP ticker bridge
   Mobile/touch gets a softer duration so it doesn't feel swimmy.
   -------------------------------------------------------------------------- */

function initLenis() {
  if (prefersReducedMotion) return;

  const isTouch = matchMedia('(hover: none)').matches;

  const lenis = new Lenis({
    duration: isTouch ? 0.9 : 1.15,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.6,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  window.__lenis = lenis;
  document.documentElement.classList.add('lenis');

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* --------------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------------- */

function initProgressBar() {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   Cursor glow — rAF with auto-stop on idle
   -------------------------------------------------------------------------- */

function initCursorGlow() {
  const glow = document.querySelector<HTMLElement>('[data-glow]');
  if (!glow || matchMedia('(hover: none)').matches) return;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x, ty = y;
  let running = false;
  let idleTimeout: number | undefined;

  const raf = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
    if (Math.abs(tx - x) < 0.3 && Math.abs(ty - y) < 0.3) {
      running = false;
      return;
    }
    requestAnimationFrame(raf);
  };

  const start = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(raf);
  };

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    start();
    if (idleTimeout) window.clearTimeout(idleTimeout);
    idleTimeout = window.setTimeout(() => { running = false; }, 1500);
  });
}

/* --------------------------------------------------------------------------
   Word-splitter + kinetic reveal on hero / section headings
   Splits text into word spans so GSAP can stagger them.
   -------------------------------------------------------------------------- */

function splitWords(el: HTMLElement) {
  if (el.dataset.split === 'done') return;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n as Text);

  for (const node of nodes) {
    const text = node.nodeValue || '';
    if (!text.trim()) continue;
    const frag = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);
    for (const part of parts) {
      if (part.trim() === '') {
        frag.appendChild(document.createTextNode(part));
      } else {
        const word = document.createElement('span');
        word.className = 'word';
        const inner = document.createElement('span');
        inner.className = 'word-inner';
        inner.textContent = part;
        word.appendChild(inner);
        frag.appendChild(word);
      }
    }
    node.replaceWith(frag);
  }
  el.dataset.split = 'done';
}

function initHeroReveal() {
  const headline = document.querySelector<HTMLElement>('[data-hero-headline]');
  if (!headline) return;
  splitWords(headline);

  if (prefersReducedMotion) return;

  const inners = headline.querySelectorAll<HTMLElement>('.word-inner');
  gsap.set(inners, { yPercent: 110, opacity: 0 });
  gsap.to(inners, {
    yPercent: 0,
    opacity: 1,
    duration: 1.2,
    ease: 'expo.out',
    stagger: 0.055,
    delay: 0.25,
  });

  const eyebrow = document.querySelector<HTMLElement>('[data-hero-eyebrow]');
  const sub = document.querySelector<HTMLElement>('[data-hero-sub]');
  const ctas = document.querySelector<HTMLElement>('[data-hero-ctas]');
  if (eyebrow) gsap.from(eyebrow, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', delay: 0.1 });
  if (sub) gsap.from(sub, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', delay: 0.9 });
  if (ctas) gsap.from(ctas, { opacity: 0, y: 20, duration: 1, ease: 'expo.out', delay: 1.1 });
}

/* --------------------------------------------------------------------------
   Scroll-triggered reveals
   -------------------------------------------------------------------------- */

function initScrollReveals() {
  // Section headlines — split into words, reveal as they enter viewport
  document.querySelectorAll<HTMLElement>('[data-reveal-headline]').forEach((el) => {
    splitWords(el);
    const inners = el.querySelectorAll<HTMLElement>('.word-inner');
    if (!prefersReducedMotion) {
      gsap.set(inners, { yPercent: 110, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          gsap.to(inners, {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.045,
          });
        },
      });
    }
  });

  // Generic fade-up elements
  document.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => el.classList.add('is-in'),
    });
  });

  // Clip-reveal elements
  document.querySelectorAll<HTMLElement>('.clip-reveal').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-in'),
    });
  });

  // Image parallax inside [data-parallax] containers
  if (!prefersReducedMotion) {
    document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
      const depth = Number(el.dataset.parallax ?? 0.15);
      gsap.to(el, {
        yPercent: depth * -100,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }
}

/* --------------------------------------------------------------------------
   3D tilt — cursor-driven rotateX/rotateY on a [data-tilt3d] element
   inside a [data-tilt3d-parent] container. The parent provides the
   cursor-tracking surface; the target inside rotates.
   Idle auto-wobble starts when the cursor leaves, to signal interactivity.
   -------------------------------------------------------------------------- */

function initTilt3D() {
  if (prefersReducedMotion || matchMedia('(hover: none)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt3d-parent]').forEach((parent) => {
    const target = parent.querySelector<HTMLElement>('[data-tilt3d]');
    if (!target) return;

    // Per-element tuning via data attrs (with sensible defaults)
    const maxRotY = Number(parent.dataset.tiltY ?? 18);      // yaw range (°)
    const maxRotX = Number(parent.dataset.tiltX ?? 12);      // pitch range (°)
    const pullStrength = Number(parent.dataset.tiltPull ?? 0.02); // magnetic translate as fraction of dim
    const wobble = parent.hasAttribute('data-tilt3d-wobble');

    let hovering = false;
    let idleTween: gsap.core.Tween | null = null;

    const startIdleWobble = () => {
      if (!wobble) return;
      idleTween?.kill();
      const idle = { rx: 0, ry: 0 };
      idleTween = gsap.to(idle, {
        rx: maxRotX * 0.35,
        ry: -maxRotY * 0.4,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        onUpdate: () => {
          if (hovering) return;
          gsap.set(target, { rotateX: idle.rx, rotateY: idle.ry });
        },
      });
    };

    const stopIdleWobble = () => {
      idleTween?.kill();
      idleTween = null;
    };

    const onMove = (e: MouseEvent) => {
      hovering = true;
      stopIdleWobble();
      const rect = parent.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;   // 0..1
      const y = (e.clientY - rect.top) / rect.height;   // 0..1
      const rotateY = (x - 0.5) * 2 * maxRotY;          // symmetric around 0
      const rotateX = -(y - 0.5) * 2 * maxRotX;         // inverted: top tilts back
      const tx = (x - 0.5) * rect.width * pullStrength;
      const ty = (y - 0.5) * rect.height * pullStrength;

      gsap.to(target, {
        rotateY,
        rotateX,
        x: tx,
        y: ty,
        duration: 0.55,
        ease: 'power2.out',
        transformPerspective: 1200,
      });
    };

    const onLeave = () => {
      hovering = false;
      gsap.to(target, {
        rotateY: 0,
        rotateX: 0,
        x: 0,
        y: 0,
        duration: 1.3,
        ease: 'elastic.out(1, 0.45)',
        onComplete: () => { if (!hovering && wobble) startIdleWobble(); },
      });
    };

    parent.addEventListener('mousemove', onMove);
    parent.addEventListener('mouseleave', onLeave);

    if (wobble) gsap.delayedCall(2, () => { if (!hovering) startIdleWobble(); });
  });
}

/* --------------------------------------------------------------------------
   Magnetic hover — applies to [data-magnetic] elements
   Tracks the cursor within the element's bounds and translates subtly toward it.
   Uses GSAP for the tween so release has a spring feel.
   -------------------------------------------------------------------------- */

function initMagnetic() {
  if (prefersReducedMotion || matchMedia('(hover: none)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.3);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * strength,
        y: y * strength,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const onLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 1.0,
        ease: 'elastic.out(1, 0.35)',
      });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
  });
}

/* --------------------------------------------------------------------------
   Navigation state — shrinks on scroll
   -------------------------------------------------------------------------- */

function initNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > 40) nav.classList.add('is-scrolled'); else nav.classList.remove('is-scrolled');
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------------------- */

function boot() {
  document.documentElement.classList.add('js-ready');
  initLenis();
  initProgressBar();
  initCursorGlow();
  initHeroReveal();
  initScrollReveals();
  initMagnetic();
  initTilt3D();
  initNav();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
