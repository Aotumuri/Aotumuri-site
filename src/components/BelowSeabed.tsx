import { useEffect, useState } from 'react';

const WHEEL_GESTURE_GAP = 450;

export default function BelowSeabed({ enabled }: { enabled: boolean }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight - innerHeight,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [revealed]);

  useEffect(() => {
    if (!enabled || revealed) return;
    // Stop before the real document end, leaving a short descent to discover.
    const limit = () => Math.max(0,
      document.documentElement.scrollHeight - innerHeight - Math.min(96, innerHeight * 0.13),
    );
    const atGate = () => scrollY >= limit() - 2;
    let stopped = false;
    let released = false;
    let lastWheelAt = 0;
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchStartedAtGate = false;

    const reveal = () => {
      released = true;
      setRevealed(true);
    };
    const stop = () => {
      if (!stopped) lastWheelAt = performance.now();
      stopped = true;
      window.scrollTo({ top: limit(), behavior: 'instant' });
    };
    const scroll = () => {
      if (released) return;
      if (atGate()) {
        if (!stopped || scrollY > limit() + 1) stop();
      } else {
        stopped = false;
      }
    };
    const wheel = (event: WheelEvent) => {
      if (released || event.ctrlKey || event.deltaY <= 0) return;
      const now = performance.now();
      const newGesture = now - lastWheelAt >= WHEEL_GESTURE_GAP;
      lastWheelAt = now;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (scrollY + delta < limit() && !atGate()) return;
      // Cancel native scrolling, including momentum, until a new downward gesture.
      event.preventDefault();
      if (stopped && atGate() && newGesture) reveal();
      else stop();
    };
    const touchStart = (event: TouchEvent) => {
      touchStartedAtGate = event.touches.length === 1 && stopped && atGate();
      touchStartY = lastTouchY = event.touches[0]?.clientY ?? 0;
    };
    const touchMove = (event: TouchEvent) => {
      if (released || event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      const delta = lastTouchY - y;
      lastTouchY = y;
      if (delta <= 0) return;
      if (touchStartedAtGate && atGate() && touchStartY - y > 24) {
        event.preventDefault();
        reveal();
      } else if (scrollY + delta >= limit() || atGate()) {
        event.preventDefault();
        stop();
      }
    };
    const key = (event: KeyboardEvent) => {
      if (released || event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (event.target instanceof HTMLElement) {
        if (event.target.isContentEditable || event.target.closest('input, textarea, select')) return;
        if (event.key === ' ' && event.target.closest('button, a')) return;
      }
      if (!['ArrowDown', 'PageDown', 'End', ' '].includes(event.key)) return;
      const delta = event.key === 'End' ? Infinity : event.key === 'ArrowDown' ? 40 : innerHeight * 0.9;
      if (scrollY + delta < limit() && !atGate()) return;
      event.preventDefault();
      if (stopped && atGate() && !event.repeat) reveal();
      else stop();
    };

    scroll();
    addEventListener('scroll', scroll, { passive: true });
    addEventListener('wheel', wheel, { passive: false });
    addEventListener('touchstart', touchStart, { passive: true });
    addEventListener('touchmove', touchMove, { passive: false });
    addEventListener('keydown', key);
    return () => {
      removeEventListener('scroll', scroll);
      removeEventListener('wheel', wheel);
      removeEventListener('touchstart', touchStart);
      removeEventListener('touchmove', touchMove);
      removeEventListener('keydown', key);
    };
  }, [enabled, revealed]);

  return (
    <div className="below-seabed">
      <span className="seabed-marker" aria-hidden="true">...</span>
      <div
        id="seabed-discovery"
        className={`seabed-discovery ${revealed ? 'is-revealed' : ''}`}
        aria-hidden={!revealed}
        inert={!revealed}
      >
        <a href={`${import.meta.env.BASE_URL}secret.html`}>
          さらに下へ...... <span aria-hidden="true">↓</span>
        </a>
      </div>
    </div>
  );
}
