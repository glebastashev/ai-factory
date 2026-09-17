import { useEffect, useRef } from 'react';
import './page-motion.css';

export function PageMotion() {
  const progress = useRef(null);
  const cursor = useRef(null);
  const halo = useRef(null);

  useEffect(() => {
    let frame = 0;
    const draw = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      progress.current.style.transform = `scaleX(${fraction})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    draw();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    let observer;
    const stop = () => {
      observer?.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    const animate = (element, delay = 0) => {
      const animation = element.animate([
        { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ], { duration: 720, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const start = () => {
      stop();
      if (preference.matches || !('IntersectionObserver' in window)) return;
      if (window.scrollY < window.innerHeight / 2) {
        document.querySelectorAll('.hero-copy > *').forEach((element, index) => animate(element, index * 75));
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          animate(entry.target);
        });
      }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
      // Animate content rather than section backgrounds, which stay visually stable.
      document.querySelectorAll('main > section:not(.hero)').forEach(section => {
        const content = section.querySelector(':scope > .container');
        observer.observe(content || section);
      });
    };
    start();
    preference.addEventListener('change', start);
    return () => { stop(); preference.removeEventListener('change', start); };
  }, []);

  useEffect(() => {
    const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const root = document.documentElement;
    const point = cursor.current;
    const trail = halo.current;
    let cleanup = () => {};
    const setup = () => {
      cleanup();
      if (!enabled.matches) return;
      let frame = 0;
      let visible = false;
      let x = 0, y = 0, followX = 0, followY = 0, previousTime = 0;
      const moveTrail = time => {
        const dt = previousTime ? Math.min(time - previousTime, 64) : 16;
        previousTime = time;
        const ease = 1 - Math.exp(-dt / 85);
        followX += (x - followX) * ease;
        followY += (y - followY) * ease;
        trail.style.transform = `translate3d(${followX}px, ${followY}px, 0)`;
        if (Math.abs(x - followX) + Math.abs(y - followY) > .1) {
          frame = requestAnimationFrame(moveTrail);
        } else { frame = 0; previousTime = 0; }
      };
      const hide = () => {
        visible = false;
        root.classList.remove('has-art-cursor');
        point.classList.remove('is-visible');
        trail.classList.remove('is-visible');
        cancelAnimationFrame(frame);
        frame = 0;
        previousTime = 0;
      };
      const move = event => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        const target = event.target instanceof Element ? event.target : null;
        // Native controls and the dialog top layer retain their normal cursor.
        if (target?.closest('input, textarea, select, [contenteditable="true"], dialog')) {
          hide(); return;
        }
        x = event.clientX; y = event.clientY;
        if (!visible) {
          followX = x; followY = y; visible = true;
          trail.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          root.classList.add('has-art-cursor');
          point.classList.add('is-visible');
          trail.classList.add('is-visible');
        }
        point.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        trail.classList.toggle('is-link', !!target?.closest('a, button, summary, [role="tab"]'));
        if (!frame) frame = requestAnimationFrame(moveTrail);
      };
      const leave = event => { if (!event.relatedTarget) hide(); };
      const keyboard = event => { if (event.key === 'Tab') hide(); };
      const visibility = () => { if (document.hidden) hide(); };
      window.addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerout', leave);
      window.addEventListener('blur', hide);
      window.addEventListener('keydown', keyboard);
      document.addEventListener('visibilitychange', visibility);
      cleanup = () => {
        hide();
        window.removeEventListener('pointermove', move);
        document.removeEventListener('pointerout', leave);
        window.removeEventListener('blur', hide);
        window.removeEventListener('keydown', keyboard);
        document.removeEventListener('visibilitychange', visibility);
      };
    };
    setup();
    enabled.addEventListener('change', setup);
    return () => { cleanup(); enabled.removeEventListener('change', setup); };
  }, []);

  return <>
    <div className="reading-progress" ref={progress} aria-hidden="true" />
    <div className="cursor-halo" ref={halo} aria-hidden="true"><span /></div>
    <div className="art-cursor" ref={cursor} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="M12 1 15.2 8.8 23 12l-7.8 3.2L12 23l-3.2-7.8L1 12l7.8-3.2Z" /></svg>
    </div>
  </>;
}
