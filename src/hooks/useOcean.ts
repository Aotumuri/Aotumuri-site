import { useEffect, useState } from 'react';

const sectionDepths = [0, 100, 500, 1000, 3000];

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

export function useOcean(enabled: boolean) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    if (!enabled) return;
    const elements = [...document.querySelectorAll<HTMLElement>('main section[id]')];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-25% 0px -50% 0px', threshold: 0 },
    );
    elements.forEach((element) => observer.observe(element));
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => reveal.observe(element));
    document.documentElement.classList.add('has-observer');
    let frame = 0;
    const update = () => {
      const range = document.documentElement.scrollHeight - innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
      document.documentElement.style.setProperty('--dive-progress', String(progress));
      // Match the meter to section labels, then interpolate between their anchors.
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const anchors = elements.map((element, index) => ({
        top: Math.max(0, element.offsetTop - padding),
        depth: sectionDepths[index],
      }));
      anchors.push({ top: range, depth: 3200 });
      let meters = 0;
      for (let i = 1; i < anchors.length; i++) {
        const start = anchors[i - 1];
        const end = anchors[i];
        if (scrollY >= start.top) {
          const fraction = Math.min(
            1,
            Math.max(0, (scrollY - start.top) / Math.max(1, end.top - start.top)),
          );
          meters = start.depth + fraction * (end.depth - start.depth);
        }
      }
      const depth = document.querySelector('[data-depth]');
      if (depth) depth.textContent = String(Math.round(meters)).padStart(3, '0');
      frame = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      observer.disconnect();
      reveal.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      document.documentElement.classList.remove('has-observer');
    };
  }, [enabled]);
  return active;
}

export function useAuroraShortcut(onDiscover: () => void) {
  useEffect(() => {
    const sequence = ['.', 'w', '.'];
    let index = 0;
    const listen = (event: KeyboardEvent) => {
      if (event.repeat || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (
        event.target instanceof HTMLElement &&
        (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName))
      )
        return;
      const key = event.key;
      index = key === sequence[index] ? index + 1 : key === sequence[0] ? 1 : 0;
      if (index === sequence.length) {
        index = 0;
        onDiscover();
      }
    };
    addEventListener('keydown', listen);
    return () => removeEventListener('keydown', listen);
  }, [onDiscover]);
}
