import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

declare global {
  interface Window {
    __juanpauloScrollCleanup?: () => void;
    gsap?: typeof gsap;
  }
}

const initScrollAnimations = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.__juanpauloScrollCleanup?.();
  gsap.registerPlugin(ScrollTrigger);
  window.gsap = gsap;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    gsap.set(
      '.js-reveal, .js-card, .js-hero-parallax, .js-timeline-line, .js-bg-parallax, .js-float-layer, .js-particles, .js-embers',
      {
        clearProps: 'all',
        opacity: 1,
      },
    );
    return;
  }

  const lenis = new Lenis({
    anchors: {
      offset: -72,
      duration: 1.15,
    },
    autoRaf: false,
    duration: 1.25,
    easing: (time: number) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false,
    touchMultiplier: 1.05,
    wheelMultiplier: 0.92,
  });

  lenis.on('scroll', ScrollTrigger.update);

  const updateLenis = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);

  gsap.to('.js-bg-parallax', {
    yPercent: -5,
    scale: 1.08,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.8,
    },
  });

  gsap.to('.js-float-layer', {
    xPercent: 1.5,
    yPercent: -2,
    duration: 8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  gsap.to('.js-particles', {
    backgroundPosition: '80px 160px, 168px 260px',
    duration: 18,
    ease: 'none',
    repeat: -1,
  });

  gsap.to('.js-embers', {
    backgroundPosition: '70px -220px, 160px -120px',
    duration: 22,
    ease: 'none',
    repeat: -1,
  });

  gsap.to('.js-hero-parallax', {
    yPercent: 3,
    ease: 'none',
    scrollTrigger: {
      trigger: '.js-hero-parallax',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.4,
    },
  });

  gsap.utils.toArray<HTMLElement>('.js-reveal').forEach((section) => {
    gsap.fromTo(
      section,
      {
        autoAlpha: 0,
        y: 54,
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          once: true,
        },
      },
    );

    const cards = section.querySelectorAll<HTMLElement>('.js-card');

    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        {
          autoAlpha: 0,
          y: 34,
          scale: 0.985,
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.82,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 74%',
            once: true,
          },
        },
      );
    }
  });

  gsap.utils.toArray<HTMLElement>('.js-timeline-line').forEach((line) => {
    gsap.fromTo(
      line,
      {
        scaleY: 0,
      },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: line.parentElement ?? line,
          start: 'top 76%',
          end: 'bottom 58%',
          scrub: 1,
        },
      },
    );
  });

  gsap.utils.toArray<HTMLElement>('.campaign').forEach((campaign) => {
    gsap.fromTo(
      campaign,
      {
        clipPath: 'inset(0 100% 0 0)',
      },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: campaign,
          start: 'top 82%',
          once: true,
        },
      },
    );
  });

  const menuLinks = gsap.utils.toArray<HTMLAnchorElement>('.js-menu-link');

  menuLinks.forEach((link) => {
    const targetId = link.getAttribute('href');

    if (!targetId?.startsWith('#')) {
      return;
    }

    const target = document.querySelector<HTMLElement>(targetId);

    if (!target) {
      return;
    }

    ScrollTrigger.create({
      trigger: target,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        menuLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      },
      onEnterBack: () => {
        menuLinks.forEach((item) => item.classList.remove('is-active'));
        link.classList.add('is-active');
      },
    });
  });

  ScrollTrigger.refresh();

  window.__juanpauloScrollCleanup = () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    gsap.killTweensOf(
      '.js-reveal, .js-card, .js-hero-parallax, .js-timeline-line, .js-bg-parallax, .js-float-layer, .js-particles, .js-embers, .campaign',
    );
    gsap.ticker.remove(updateLenis);
    lenis.destroy();
    delete window.__juanpauloScrollCleanup;
  };
};

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations, { once: true });
  } else {
    initScrollAnimations();
  }
}
