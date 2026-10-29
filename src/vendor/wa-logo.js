/** WA logo controller. No dependencies. Use SVG files directly, or mount inline for controls. */
let waInstance = 0;

export function mountWALogo(host, source, options = {}) {
  if (typeof host === 'string') host = document.querySelector(host);
  if (!host) throw new Error('Logo container was not found.');
  const original = new DOMParser().parseFromString(source, 'image/svg+xml').documentElement;
  if (original.localName !== 'svg' || original.querySelector('parsererror')) throw new Error('Invalid SVG.');
  const integrated = original.dataset.waVariant === 'integrated';
  let settings = {
    awStart: Number(original.dataset.awStart),
    barStart: Number(original.dataset.barStart || 0),
    waveGrow: Number(original.dataset.waveGrow),
    color: '#000000', width: '100%', speed: 1,
    autoplay: true, respectReducedMotion: true, ...options
  };
  let svg, finish;
  const prefix = `wa-instance-${++waInstance}-`;
  function prepare() {
    const root = original.cloneNode(true);
    const { awStart, barStart, waveGrow, speed } = settings;
    for (const [key, value] of Object.entries({ awStart, barStart, waveGrow, speed })) {
      if (!Number.isFinite(Number(value)) || Number(value) < 0 || (key === 'speed' && Number(value) === 0)) throw new Error(`Invalid ${key}.`);
    }
    if (Number(waveGrow) < .05) throw new Error('waveGrow must be at least 0.05 seconds.');
    finish = Math.max(1, Number(awStart) + .95, integrated ? 0 : Number(barStart) + .25) + .05;
    root.querySelectorAll('[data-wa-role]').forEach(el => {
      const role = el.dataset.waRole;
      if (role === 'letters-reveal') el.setAttribute('begin', `${awStart}s`);
      if (role === 'bar-reveal') el.setAttribute('begin', `${barStart}s`);
      if (role === 'bar-fill') el.setAttribute('begin', `${Number(barStart) + .20}s`);
      if (role === 'wave-grow') el.setAttribute('dur', `${Math.max(.01, Number(waveGrow) + Number(el.dataset.waGrowOffset))}s`);
      if (role === 'finish') el.setAttribute('begin', `${finish}s`);
    });
    // Scale every timed event together, including the final frame replacement.
    root.querySelectorAll('animate, animateTransform, set').forEach(el => {
      for (const attr of ['begin', 'dur']) {
        const val = el.getAttribute(attr);
        if (val && /^\d*\.?\d+s$/.test(val)) el.setAttribute(attr, `${Number.parseFloat(val) / Number(speed)}s`);
      }
    });
    // Tint the ink while keeping the original grey-to-black progression. Masks remain white.
    if (!CSS.supports('color', settings.color)) throw new Error('Invalid color.');
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = settings.color; ctx.fillRect(0, 0, 1, 1);
    const rgb = ctx.getImageData(0, 0, 1, 1).data;
    function tint(value) {
      const match = /^#([\da-f]{3}|[\da-f]{6})$/i.exec(value || '');
      if (!match) return value;
      const hex = match[1].length === 3 ? [...match[1]].map(x => x + x).join('') : match[1];
      const grey = parseInt(hex.slice(0, 2), 16) / 255;
      return `rgb(${[0, 1, 2].map(i => Math.round(rgb[i] + (255 - rgb[i]) * grey)).join(',')})`;
    }
    root.querySelectorAll('[fill], animate[attributeName="fill"]').forEach(el => {
      if (el.closest('defs,mask')) return;
      if (el.hasAttribute('fill') && el.getAttribute('fill') !== 'freeze') el.setAttribute('fill', tint(el.getAttribute('fill')));
      if (el.localName === 'animate' && el.getAttribute('attributeName') === 'fill') {
        for (const attr of ['from', 'to']) if (el.hasAttribute(attr)) el.setAttribute(attr, tint(el.getAttribute(attr)));
      }
    });
    // Each inline instance gets its own IDs, so multiple logos can coexist on a page.
    const ids = new Map([...root.querySelectorAll('[id]')].map(el => [el.id, prefix + el.id]));
    [root, ...root.querySelectorAll('*')].forEach(el => {
      for (const attr of [...el.attributes]) {
        let value = attr.value;
        if (attr.name === 'id') value = ids.get(value) || value;
        else if (attr.name === 'aria-labelledby') value = value.split(' ').map(x => ids.get(x) || x).join(' ');
        else value = value.replace(/url\(#([^)]+)\)/g, (_, id) => `url(#${ids.get(id) || id})`);
        el.setAttribute(attr.name, value);
      }
    });
    root.style.width = typeof settings.width === 'number' ? `${settings.width}px` : settings.width;
    root.style.height = 'auto'; root.style.display = 'block'; root.style.maxWidth = '100%';
    root.dataset.awStart = String(awStart); root.dataset.waveGrow = String(waveGrow);
    if (!integrated) root.dataset.barStart = String(barStart);
    return root;
  }
  function render() {
    svg = document.importNode(prepare(), true); host.replaceChildren(svg); svg.setCurrentTime(0);
    const reduce = settings.respectReducedMotion && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { svg.setCurrentTime(finish / settings.speed + .01); svg.pauseAnimations(); }
    else if (settings.autoplay) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }
  render();
  return {
    play() { svg.setCurrentTime(0); svg.unpauseAnimations(); },
    pause() { svg.pauseAnimations(); },
    resume() { svg.unpauseAnimations(); },
    seek(seconds) { svg.pauseAnimations(); svg.setCurrentTime(Math.max(0, seconds)); },
    update(next) { settings = { ...settings, ...next }; render(); },
    get duration() { return finish / Number(settings.speed); },
    get element() { return svg; },
    exportSVG() {
      const output = prepare();
      const size = typeof settings.width === 'number' ? settings.width : 1024;
      output.setAttribute('width', size); output.setAttribute('height', size);
      output.removeAttribute('style');
      return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(output);
    },
    destroy() { host.replaceChildren(); }
  };
}

export async function loadWALogo(host, url, options = {}) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not load SVG: ${response.status}`);
  return mountWALogo(host, await response.text(), options);
}
