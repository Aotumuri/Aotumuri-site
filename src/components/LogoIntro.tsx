import { useEffect, useRef, useState } from 'react';
import { mountWALogo } from '../vendor/wa-logo.js';

export function hasSeenIntro() {
  try {
    return sessionStorage.getItem('aotumuri:visited') === 'true';
  } catch {
    return false;
  }
}

export function LogoIntro({
  onDone,
  reduced,
  returnFocus,
}: {
  onDone: () => void;
  reduced: boolean;
  returnFocus: HTMLElement | null;
}) {
  const host = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!leaving) return;
    const close = setTimeout(onDone, reduced ? 0 : 500);
    return () => clearTimeout(close);
  }, [leaving, onDone, reduced]);

  useEffect(() => {
    if (!ready || leaving) return;
    const proceed = () => setLeaving(true);
    const key = (event: KeyboardEvent) => {
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) proceed();
    };
    addEventListener('pointermove', proceed, { passive: true });
    addEventListener('pointerdown', proceed, { passive: true });
    addEventListener('wheel', proceed, { passive: true });
    addEventListener('keydown', key);
    return () => {
      removeEventListener('pointermove', proceed);
      removeEventListener('pointerdown', proceed);
      removeEventListener('wheel', proceed);
      removeEventListener('keydown', key);
    };
  }, [ready, leaving]);

  useEffect(() => {
    skip.current?.focus();
    const abort = new AbortController();
    let logo: ReturnType<typeof mountWALogo> | undefined;
    let hold: ReturnType<typeof setTimeout>;
    const fallback = setTimeout(() => setLeaving(true), 6000);
    fetch(`${import.meta.env.BASE_URL}images/wa-logo-integrated.svg`, { signal: abort.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Logo unavailable');
        return response.text();
      })
      .then((source) => {
        if (!host.current || abort.signal.aborted) return;
        logo = mountWALogo(host.current, source, { color: '#d1f0f2', width: 220 });
        clearTimeout(fallback);
        hold = setTimeout(() => setReady(true), reduced ? 350 : (logo.duration + 0.5) * 1000);
      })
      .catch(() => {
        if (!abort.signal.aborted) setLeaving(true);
      });
    // Only a failed or blocked asset times out; a loaded logo waits for interaction.
    try {
      sessionStorage.setItem('aotumuri:visited', 'true');
    } catch {
      /* Storage is optional. */
    }
    return () => {
      abort.abort();
      logo?.destroy();
      clearTimeout(hold);
      clearTimeout(fallback);
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [onDone, reduced, returnFocus]);
  return (
    <div
      className={`logo-intro ${leaving ? 'is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Aotumuri ロゴアニメーション"
    >
      <div className="intro-center">
        <div ref={host} className="intro-logo" />
        <span>AOTUMURI</span>
        <p>個人サイトです。</p>
        <p
          className={`intro-hint${ready ? ' is-ready' : ''}`}
          role="status"
          aria-hidden={!ready}
        >
          マウスを動かすか、タップ・キー操作で進めます。
        </p>
      </div>
      <button ref={skip} className="intro-skip text-button" onClick={onDone}>
        スキップ <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
