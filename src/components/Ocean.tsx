import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import './OceanScenery.css';

export function Fish({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`fish ${className}`}
      viewBox="0 0 100 45"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 22C23 6 56 5 78 20L97 9 92 23 97 37 77 26C56 41 24 39 9 26Q5 24 9 22Z" />
      <path d="m42 10 13-9 5 12M44 33l12 10 5-11" />
    </svg>
  );
}

export function Jellyfish({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 260" className={`jellyfish ${className}`} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`jelly-${className}`} cx=".4" cy=".2" r=".9">
          <stop stopColor="#c0f1ee" stopOpacity=".65" />
          <stop offset="1" stopColor="#6ba6d3" stopOpacity=".06" />
        </radialGradient>
      </defs>
      <path
        d="M29 96C25 9 149 4 150 96Q138 106 126 97Q114 109 102 98Q90 109 78 98Q66 108 54 98Q42 107 29 96Z"
        fill={`url(#jelly-${className})`}
        stroke="currentColor"
      />
      <path
        d="M41 96Q66 48 90 26Q119 49 138 97M56 101Q37 136 69 156T65 211M80 104Q100 130 76 155T86 249M104 102Q84 133 116 159T110 236M127 100Q147 135 122 150T140 203"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path d="M90 39Q66 74 58 93M99 42Q119 70 125 92" stroke="currentColor" opacity=".45" />
    </svg>
  );
}

export default function Ocean() {
  const scenery = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const main = document.getElementById('main');
    if (!main) return;
    const placeScenery = () => {
      for (const id of ['about', 'works', 'skills', 'contact']) {
        const section = document.getElementById(id);
        if (!section) continue;
        scenery.current?.style.setProperty(`--${id}-top`, `${section.offsetTop}px`);
        scenery.current?.style.setProperty(`--${id}-height`, `${section.offsetHeight}px`);
      }
    };
    placeScenery();
    const observer = new ResizeObserver(placeScenery);
    observer.observe(main);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scenery} className="ocean-scenery" aria-hidden="true">
      <div className="surface-glow" />
      <div className="light-rays">
        <i />
        <i />
        <i />
      </div>
      <svg className="water-surface" viewBox="0 0 1440 250" preserveAspectRatio="none" fill="none">
        <path
          d="M-80 49Q90 130 302 65T680 58T1090 51T1540 18"
          stroke="#c1f6f6"
          strokeWidth="2"
          opacity=".3"
        />
        <path d="M-80 65Q100 145 320 80T730 80T1110 67T1540 42" stroke="#b9eff1" opacity=".2" />
        <path d="M-80 97Q120 160 390 107T830 99T1260 86T1540 74" stroke="#b9eff1" opacity=".13" />
        <path
          d="M-80 9Q90 92 302 24T680 16T1090 12T1540 -27"
          stroke="#c1f6f6"
          strokeWidth="16"
          opacity=".06"
        />
      </svg>
      <div className="bubble-field">
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            style={
              {
                '--x': `${8 + ((i * 31) % 87)}%`,
                '--y': `${12 + i * 9}%`,
                '--size': `${4 + ((i * 7) % 14)}px`,
                '--delay': `${-i * 2.7}s`,
                '--duration': `${18 + i * 2}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="shoal shoal-two">
        <Fish />
        <Fish />
        <Fish />
      </div>
      <div className="shallow-water-light" />
      <svg className="water-reflections" viewBox="0 0 1100 300" fill="none">
        <path d="M-40 110Q140 18 320 95T690 85T1160 60M-70 140Q150 55 340 125T720 112T1170 96M30 196Q180 126 430 187T870 173T1130 154" />
        <path d="M50 43Q260 109 460 44T930 30M-30 235Q160 162 390 232T890 212" />
      </svg>
      <div className="shoal shoal-shallow"><Fish/><Fish/><Fish/><Fish/></div>
      <div className="shoal shoal-midwater"><Fish/><Fish/><Fish/><Fish/><Fish/></div>
      <svg className="manta-shadow" viewBox="0 0 400 330" fill="currentColor">
        <path d="M177 74Q181 57 190 61L200 72 210 61Q220 57 223 74L225 91Q268 73 351 111L385 143Q329 128 290 148L232 186Q213 202 200 200Q187 202 168 186L110 148Q71 128 15 143L49 111Q131 73 175 91Z"/>
        <path d="M200 187Q185 237 209 272T205 323" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      </svg>
      <div className="deep-fauna">
        <Jellyfish className="jelly-distant-one"/>
        <Jellyfish className="jelly-distant-two"/>
        <div className="deep-lights">{[
          ['4%', '12%', '0s'], ['95%', '28%', '-6s'], ['7%', '51%', '-3s'],
          ['92%', '68%', '-9s'], ['3%', '82%', '-4s'], ['97%', '95%', '-7s'],
        ].map(([x, y, delay], i) => <i key={i} style={{ '--x': x, '--y': y, '--delay': delay } as CSSProperties}/>)}</div>
      </div>
      <svg className="reef-spires" viewBox="0 0 260 510" fill="currentColor">
        <path d="M0 510V205L24 187 31 116 65 92 91 111 99 185 123 173 138 59 166 39 185 57 194 239 214 218 234 232 246 318 260 334V510Z"/>
        <path d="m31 116 24 86-10 112M138 59l21 152-17 117M99 185l17 132-10 93" fill="none" stroke="#446d7a" strokeOpacity=".23"/>
      </svg>
      <svg className="sunken-arch" viewBox="0 0 400 500" fill="currentColor">
        <path fillRule="evenodd" d="M40 454V233L48 223V121L74 105 77 79 110 58 142 63 160 39 203 34 221 43 241 28 281 47 294 81 318 90 325 148 334 162V454H40ZM111 454H264V239Q264 162 189 161Q111 163 111 239V454Z"/>
        <path d="M20 454h340v18H20zM0 476h381v24H0z"/>
        <g fill="none" stroke="#4d7984" strokeOpacity=".2">
          <path d="M54 119 112 131 133 83M155 47l14 81M233 41l-21 87M289 81l-40 58 74 11M48 223l63 2M41 298h70m154-56 65 2M264 318h68M42 380h69m154 8h67"/>
        </g>
      </svg>
      <svg className="seaweed seaweed-left" viewBox="0 0 160 260" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M79 255Q32 205 73 157T66 56Q55 28 68 9" strokeWidth="9"/>
        <path d="M77 255Q115 216 100 176T124 82M77 256Q27 242 29 205T13 150" strokeWidth="7"/>
        <path d="M102 188q31-2 34-33M57 179q-25-3-27-24M69 93q30-10 29-37M36 226q-19-7-24-23" strokeWidth="4"/>
      </svg>
      <svg className="seaweed seaweed-right" viewBox="0 0 150 260" fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M73 255Q106 205 75 169T88 84Q104 50 82 14M76 255Q22 214 47 175T35 91M76 255Q118 231 121 195" strokeWidth="8"/>
        <path d="M73 160q31-3 38-29M87 81q-25-6-30-30M43 183q-24-10-24-32" strokeWidth="4"/>
      </svg>
      <svg className="seabed" viewBox="0 0 1440 400" preserveAspectRatio="none">
        <path
          d="M0 170 42 155 55 111 102 85 117 139 161 149 178 221 212 238 239 198 273 193 286 252 343 263 380 300 490 310 620 345 780 329 900 303 985 297 1023 243 1086 249 1101 174 1145 156 1159 104 1203 85 1235 110 1246 194 1303 174 1328 92 1384 54 1440 67V400H0Z"
          fill="#010711"
        />
        <path
          d="M0 306 180 270 330 322 510 345 680 371 900 339 1070 302 1270 270 1440 300V400H0Z"
          fill="#01050c"
        />
      </svg>
    </div>
  );
}
