/* Rendu produit CERA — Chromium headless.
 *
 * Pas de photographie possible ici (aucun échantillon, banques d'images et
 * AliExpress bloqués par la politique réseau). Ces scènes sont composées en
 * SVG/CSS. Ce qui les rapproche d'une vraie photo, dans l'ordre d'importance :
 *
 *   1. le sujet repose vraiment sur le plan  (baseline -> ombre de contact)
 *   2. une réflexion atténuée sous l'objet   (une surface réelle renvoie la lumière)
 *   3. clé chaude / appoint froid            (le contraste de température fait le volume)
 *   4. ombres bleutées, jamais grises        (une ombre prend la couleur du ciel)
 *   5. grain + vignettage                    (une optique n'est jamais parfaite)
 */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2] || path.join(import.meta.dirname, 'photo');
fs.mkdirSync(OUT, { recursive: true });

/* ---------- Matières ---------- */

const MAT = {
  noir:   { a: '#191C20', b: '#454B54', c: '#0A0C0F', spec: '#A8B4C2', nom: 'noir mat' },
  ivoire: { a: '#D2CABA', b: '#FDFBF6', c: '#ADA391', spec: '#FFFFFF', nom: 'blanc ivoire' },
  laiton: { a: '#916A22', b: '#F6D48C', c: '#6B4A12', spec: '#FFF3D2', nom: 'laiton brossé' },
};

const CHAUD = '#FFC878', CHAUD_VIF = '#FFF2D4', MIEL = '#C4862B';
const FROID = '#B8C6D8';            // appoint froid : ce qui sculpte le bord opposé
const OMBRE = '42,48,58';           // une ombre tire vers le bleu, jamais vers le gris

/* Profil de cylindre : sombre au bord, clair au tiers, sombre à l'autre bord. */
const metal = (id, m) => `
<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0"    stop-color="${m.c}"/>
  <stop offset="0.16" stop-color="${m.a}"/>
  <stop offset="0.36" stop-color="${m.b}"/>
  <stop offset="0.54" stop-color="${m.a}"/>
  <stop offset="0.88" stop-color="${m.c}"/>
  <stop offset="1"    stop-color="${m.a}"/>
</linearGradient>`;

/* ---------- La lampe ---------- */

function lampSVG(key, { glow = 1, cable = true } = {}) {
  const m = MAT[key], u = key;
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  ${metal(`stem-${u}`, m)}
  ${metal(`shade-${u}`, m)}
  ${metal(`base-${u}`, m)}
  ${metal(`knob-${u}`, m)}

  <radialGradient id="bulb-${u}" cx="0.5" cy="0.4" r="0.6">
    <stop offset="0"    stop-color="#FFFFFF"/>
    <stop offset="0.3"  stop-color="${CHAUD_VIF}"/>
    <stop offset="0.7"  stop-color="${CHAUD}"/>
    <stop offset="1"    stop-color="${MIEL}" stop-opacity="0.8"/>
  </radialGradient>

  <linearGradient id="reflecteur-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${CHAUD}" stop-opacity="0.35"/>
    <stop offset="1" stop-color="${CHAUD_VIF}" stop-opacity="0.9"/>
  </linearGradient>

  <linearGradient id="cone-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="${CHAUD_VIF}" stop-opacity="${0.55 * glow}"/>
    <stop offset="0.5"  stop-color="${CHAUD}"     stop-opacity="${0.18 * glow}"/>
    <stop offset="1"    stop-color="${CHAUD}"     stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="glass-${u}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#FFFFFF" stop-opacity="0.34"/>
    <stop offset="0.09" stop-color="#FFFFFF" stop-opacity="0.06"/>
    <stop offset="0.48" stop-color="#FFFFFF" stop-opacity="0.03"/>
    <stop offset="0.86" stop-color="${FROID}" stop-opacity="0.14"/>
    <stop offset="1"    stop-color="#FFFFFF" stop-opacity="0.40"/>
  </linearGradient>

  <linearGradient id="wax-${u}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#CDC1A8"/>
    <stop offset="0.30" stop-color="#F8F2E2"/>
    <stop offset="0.70" stop-color="#E6DCC5"/>
    <stop offset="1"    stop-color="#BFB39A"/>
  </linearGradient>

  <filter id="soft-${u}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="17"/></filter>
  <filter id="softer-${u}" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="40"/></filter>
  <filter id="tiny-${u}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>

<!-- halo diffus autour de la source -->
<ellipse cx="400" cy="330" rx="225" ry="230" fill="${CHAUD}" opacity="${0.20 * glow}" filter="url(#softer-${u})"/>

${cable ? `<!-- câble : il part du socle et sort du cadre, comme sur une vraie table -->
<path d="M240 650c60 14 122 4 170-18" stroke="${m.c}" stroke-width="7" stroke-linecap="round" opacity="0.55"/>` : ''}

<!-- socle -->
<ellipse cx="196" cy="656" rx="120" ry="22" fill="url(#base-${u})"/>
<ellipse cx="196" cy="650" rx="120" ry="22" fill="url(#base-${u})"/>
<path d="M76 650a120 22 0 0 0 240 0v6a120 22 0 0 1-240 0z" fill="${m.c}"/>
<ellipse cx="196" cy="647" rx="94" ry="14" fill="${m.b}" opacity="0.26"/>
<ellipse cx="160" cy="642" rx="36" ry="6" fill="${m.spec}" opacity="0.30" filter="url(#tiny-${u})"/>
<!-- molette de variateur, à l'avant du socle -->
<ellipse cx="272" cy="640" rx="26" ry="9" fill="url(#knob-${u})"/>
<path d="M246 626v14a26 9 0 0 0 52 0v-14z" fill="url(#knob-${u})"/>
<ellipse cx="272" cy="626" rx="26" ry="9" fill="${m.b}" opacity="0.5"/>
<path d="M272 620v-5" stroke="${m.spec}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>

<!-- colonne + col de cygne -->
<path d="M186 648V236a54 54 0 0 1 54-54h112a54 54 0 0 1 54 54v34"
      stroke="url(#stem-${u})" stroke-width="22" stroke-linecap="round"/>
<path d="M192 640V240a48 48 0 0 1 48-48h106"
      stroke="${m.spec}" stroke-width="3.4" stroke-linecap="round" opacity="0.34"/>
<path d="M180 640V240a60 60 0 0 1 60-60"
      stroke="${FROID}" stroke-width="2.4" stroke-linecap="round" opacity="0.30"/>

<!-- abat-jour -->
<path d="M316 266h168l-27 98H343z" fill="url(#shade-${u})"/>
<path d="M316 266h168l-3 11H319z" fill="${m.b}" opacity="0.6"/>
<path d="M334 274l-15 86" stroke="${m.spec}" stroke-width="5.5" opacity="0.24" filter="url(#tiny-${u})"/>
<path d="M470 276l-13 84" stroke="${FROID}" stroke-width="4" opacity="0.26" filter="url(#tiny-${u})"/>
<!-- réflecteur intérieur, visible par la tranche -->
<ellipse cx="400" cy="364" rx="58" ry="12" fill="url(#reflecteur-${u})"/>
<ellipse cx="400" cy="366" rx="57" ry="11" fill="url(#bulb-${u})"/>
<ellipse cx="400" cy="365" rx="32" ry="6" fill="#FFFFFF" opacity="${0.95 * glow}" filter="url(#tiny-${u})"/>
<path d="M343 364h114l2 7H341z" fill="${m.c}"/>

<!-- faisceau -->
<path d="M346 372h108l44 156H302z" fill="url(#cone-${u})" filter="url(#soft-${u})"/>

<!-- ombre portée du pot -->
<ellipse cx="400" cy="672" rx="78" ry="13" fill="rgb(${OMBRE})" opacity="0.34" filter="url(#soft-${u})"/>
<!-- pot en verre : base alignée sur celle du socle -->
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z" fill="url(#glass-${u})"/>
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z"
      stroke="#FFFFFF" stroke-opacity="0.36" stroke-width="2"/>
<path d="M330 528h140l-10 119a13 13 0 0 1-13 12H353a13 13 0 0 1-13-12z" fill="url(#wax-${u})"/>
<!-- bain de cire fondue -->
<ellipse cx="400" cy="528" rx="70" ry="13" fill="#F2E4C4"/>
<ellipse cx="400" cy="527" rx="58" ry="10" fill="${CHAUD_VIF}" opacity="0.95"/>
<ellipse cx="379" cy="525" rx="23" ry="4" fill="#FFFFFF" opacity="0.9" filter="url(#tiny-${u})"/>
<path d="M400 514v13" stroke="#6B5A3E" stroke-width="3" stroke-linecap="round"/>
<path d="M337 514l-7 138" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="7.5" stroke-linecap="round" filter="url(#tiny-${u})"/>
<path d="M466 518l-6 128" stroke="${FROID}" stroke-opacity="0.40" stroke-width="4.5" stroke-linecap="round" filter="url(#tiny-${u})"/>
<ellipse cx="400" cy="668" rx="63" ry="9" fill="#FFFFFF" opacity="0.12"/>
</svg>`;
}

/* ---------- Bougie ---------- */

function candleSVG(label, tint) {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.36"/>
    <stop offset="0.11" stop-color="#FFFFFF" stop-opacity="0.07"/>
    <stop offset="0.52" stop-color="#FFFFFF" stop-opacity="0.03"/>
    <stop offset="0.85" stop-color="${FROID}" stop-opacity="0.16"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.40"/>
  </linearGradient>
  <linearGradient id="cw" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#CDC1A8"/><stop offset="0.30" stop-color="#F9F3E4"/>
    <stop offset="0.72" stop-color="#E4DAC2"/><stop offset="1" stop-color="#BCB097"/>
  </linearGradient>
  <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${tint}" stop-opacity="0.88"/>
    <stop offset="0.38" stop-color="${tint}"/>
    <stop offset="1" stop-color="${tint}" stop-opacity="0.78"/>
  </linearGradient>
  <filter id="b1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" fill="url(#cg)"/>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" stroke="#FFFFFF" stroke-opacity="0.34" stroke-width="2"/>
<path d="M220 412h180l-9 200a16 16 0 0 1-16 15H245a16 16 0 0 1-16-15z" fill="url(#cw)"/>
<ellipse cx="310" cy="412" rx="90" ry="16" fill="#EEE3C9"/>
<ellipse cx="310" cy="411" rx="76" ry="13" fill="#FCF5E1"/>
<path d="M310 388v24" stroke="#6B5A3E" stroke-width="4" stroke-linecap="round"/>
<rect x="232" y="470" width="156" height="96" rx="3" fill="url(#lbl)"/>
<text x="310" y="508" text-anchor="middle" font-family="Georgia,serif" font-size="25" fill="#FFFDF7">${label}</text>
<text x="310" y="537" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="4" fill="#FFFDF7" opacity="0.72">CERA</text>
<text x="310" y="556" text-anchor="middle" font-family="Georgia,serif" font-size="11" letter-spacing="3" fill="#FFFDF7" opacity="0.6">180 G</text>
<path d="M228 396l-7 216" stroke="#FFFFFF" stroke-opacity="0.52" stroke-width="8" stroke-linecap="round" filter="url(#b1)"/>
<path d="M396 402l-6 206" stroke="${FROID}" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round" filter="url(#b1)"/>
</svg>`;
}

/* ---------- Ampoules ---------- */

function bulbsSVG() {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="col" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#78828E"/><stop offset="0.28" stop-color="#EDF1F5"/>
    <stop offset="0.55" stop-color="#A9B3BE"/><stop offset="1" stop-color="#666F7A"/>
  </linearGradient>
  <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#C2B9A2"/><stop offset="0.30" stop-color="#F9F4E6"/>
    <stop offset="0.66" stop-color="#E0D7C1"/><stop offset="1" stop-color="#B2A892"/>
  </linearGradient>
  <radialGradient id="lens" cx="0.5" cy="0.45" r="0.58">
    <stop offset="0"    stop-color="#FFFFFF"/>
    <stop offset="0.34" stop-color="${CHAUD_VIF}"/>
    <stop offset="0.72" stop-color="${CHAUD}"/>
    <stop offset="1"    stop-color="#C9A45E"/>
  </radialGradient>
  <radialGradient id="halo-lens" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="${CHAUD}" stop-opacity="0.55"/>
    <stop offset="1" stop-color="${CHAUD}" stop-opacity="0"/>
  </radialGradient>
  <filter id="ub" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<g opacity="0.96">
  <path d="M330 468h148l-6 108a16 16 0 0 1-11 14 126 22 0 0 1-114 0 16 16 0 0 1-11-14z" fill="url(#body)"/>
  <ellipse cx="404" cy="592" rx="96" ry="30" fill="url(#halo-lens)"/>
  <ellipse cx="404" cy="580" rx="63" ry="12" fill="url(#lens)"/>
  <ellipse cx="404" cy="578" rx="46" ry="8" fill="#FFFDF4" opacity="0.85" filter="url(#ub)"/>
  <rect x="356" y="424" width="96" height="46" rx="7" fill="url(#col)"/>
  <path d="M374 396v28M434 396v28" stroke="#7D8794" stroke-width="12" stroke-linecap="round"/>
  <path d="M342 480l-3 88" stroke="#FFFFFF" stroke-opacity="0.44" stroke-width="7" stroke-linecap="round" filter="url(#ub)"/>
</g>
<g>
  <path d="M186 452h170l-7 124a18 18 0 0 1-13 16 146 26 0 0 1-130 0 18 18 0 0 1-13-16z" fill="url(#body)"/>
  <ellipse cx="271" cy="606" rx="112" ry="34" fill="url(#halo-lens)"/>
  <ellipse cx="271" cy="592" rx="73" ry="14" fill="url(#lens)"/>
  <ellipse cx="271" cy="589" rx="53" ry="10" fill="#FFFEF7" opacity="0.92" filter="url(#ub)"/>
  <rect x="216" y="400" width="110" height="52" rx="8" fill="url(#col)"/>
  <path d="M237 370v30M305 370v30" stroke="#7D8794" stroke-width="14" stroke-linecap="round"/>
  <path d="M228 412l-3 34" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="8" filter="url(#ub)"/>
  <path d="M200 464l-6 104" stroke="#FFFFFF" stroke-opacity="0.40" stroke-width="8" stroke-linecap="round" filter="url(#ub)"/>
  <path d="M348 462l-6 108" stroke="${FROID}" stroke-opacity="0.38" stroke-width="6" stroke-linecap="round" filter="url(#ub)"/>
</g>
</svg>`;
}

/* ---------- Coffret ---------- */

function boxSVG() {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="kx" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#16271E"/><stop offset="0.38" stop-color="#355645"/>
    <stop offset="0.72" stop-color="#22392C"/><stop offset="1" stop-color="#121F18"/>
  </linearGradient>
  <linearGradient id="kl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#1F3327"/><stop offset="0.36" stop-color="#436A55"/>
    <stop offset="1" stop-color="#18281E"/>
  </linearGradient>
  <linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#A67F26"/><stop offset="0.4" stop-color="#F4D48F"/>
    <stop offset="0.7" stop-color="#C9A344"/><stop offset="1" stop-color="#8E6C1C"/>
  </linearGradient>
  <filter id="kb" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>
<path d="M118 316h384l-26 300H144z" fill="url(#kx)"/>
<path d="M104 254h412l-14 62H118z" fill="url(#kl)"/>
<path d="M104 254h412l-3 9H107z" fill="#55836A" opacity="0.65"/>
<path d="M284 254h52l-22 362h-52z" fill="url(#rb)" opacity="0.94"/>
<path d="M310 254c-26-38-56-54-72-38-15 15 4 34 72 38 68-4 87-23 72-38-16-16-46 0-72 38Z" fill="url(#rb)"/>
<ellipse cx="310" cy="256" rx="17" ry="12" fill="#C9A344"/>
<path d="M132 330l-10 270" stroke="#7FB096" stroke-opacity="0.30" stroke-width="8" filter="url(#kb)"/>
<path d="M470 332l-18 268" stroke="${FROID}" stroke-opacity="0.22" stroke-width="6" filter="url(#kb)"/>
<text x="196" y="470" text-anchor="middle" font-family="Georgia,serif" font-size="26" letter-spacing="8" fill="#D8E6DD" opacity="0.5">CERA</text>
</svg>`;
}

/* ---------- Grain ---------- */

const GRAIN = `
<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;

/* ---------- Scène ---------- */

function scene({ art, w, h, mode = 'studio', legende = '', scale = 0.74,
                 shiftX = 0, shiftY = 24, baseline = 0.9375, reflet = 0.20 }) {
  const studio = mode === 'studio';
  const artH   = h * scale;
  const artTop = h / 2 + shiftY - artH / 2;
  const ground = Math.round(artTop + artH * baseline);
  const shW    = Math.round(w * 0.50 * (scale / 0.74));
  const shH    = Math.round(h * 0.052 * (scale / 0.74));
  const horizon = Math.round(ground - h * 0.14);
  const surfH   = h - horizon;
  const artW    = Math.round(artH * 620 / 720);

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#000}
  body{width:${w}px;height:${h}px;overflow:hidden;font-family:Georgia,serif}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:${studio
      ? `radial-gradient(130% 100% at 46% 22%, #FFFDFA 0%, #F5F3EE 40%, #E6E4DD 74%, #D3D2CC 100%)`
      : `radial-gradient(95% 75% at 64% 32%, #55412B 0%, #2E2319 38%, #181310 72%, #0A0807 100%)`};}

  .surface{position:absolute;left:0;right:0;bottom:0;height:${surfH}px;
    background:${studio
      ? 'linear-gradient(180deg, rgba(196,192,182,.34), rgba(160,156,146,.12) 34%, rgba(150,146,138,.05))'
      : 'linear-gradient(180deg, rgba(104,74,42,.52), rgba(42,31,22,.9) 55%, #0A0806)'};}
  .horizon{position:absolute;left:0;right:0;top:${horizon}px;height:1px;
    background:${studio ? 'rgba(120,116,106,.26)' : 'rgba(190,140,78,.24)'}}

  ${studio ? '' : `
  .bokeh{position:absolute;border-radius:50%;filter:blur(34px)}
  .b1{width:180px;height:180px;left:5%;top:12%;background:${MIEL};opacity:.42}
  .b2{width:120px;height:120px;left:19%;top:44%;background:#8E5F27;opacity:.30}
  .b3{width:240px;height:240px;right:3%;top:6%;background:#6B4520;opacity:.30}`}

  /* réflexion : l'objet retourné sous la ligne de sol, atténué et fondu.
     C'est ce qui fait qu'une surface se lit comme une surface. */
  .reflet{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translateX(-50%) scaleY(-1);
    width:${artW}px;height:${artH}px;opacity:${reflet};filter:blur(2.4px);
    -webkit-mask-image:linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.22) 34%, transparent 62%);
    mask-image:linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.22) 34%, transparent 62%);
    pointer-events:none}
  .reflet svg{width:100%;height:100%;display:block}

  .pool{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-42%);
    width:${Math.round(w * 0.64 * (scale / 0.74))}px;height:${Math.round(h * 0.17)}px;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,198,116,${studio ? .46 : .62}) 0%, rgba(255,180,90,0) 72%);
    filter:blur(${Math.round(w * 0.018)}px)}

  .shadow{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-50%);width:${shW}px;height:${shH}px;border-radius:50%;
    background:rgba(${OMBRE},${studio ? .30 : .62});filter:blur(${Math.round(w * 0.016)}px)}
  .shadow2{position:absolute;left:calc(50% + ${shiftX}px);top:${ground - Math.round(h * 0.006)}px;
    transform:translate(-50%,-50%);width:${Math.round(shW * 0.5)}px;height:${Math.round(shH * 0.4)}px;
    border-radius:50%;background:rgba(${OMBRE},${studio ? .40 : .74});filter:blur(${Math.round(w * 0.006)}px)}

  .art{position:absolute;left:calc(50% + ${shiftX}px);top:calc(50% + ${shiftY}px);
    transform:translate(-50%,-50%);height:${artH}px;width:${artW}px}
  .art svg{width:100%;height:100%;display:block;
    filter:drop-shadow(0 ${Math.round(h * 0.012)}px ${Math.round(h * 0.028)}px rgba(${OMBRE},${studio ? .26 : .5}))}

  .vig{position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(125% 95% at 48% 42%, transparent 40%, rgba(${studio ? '92,90,84' : '0,0,0'},${studio ? .20 : .58}) 100%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:${studio ? .042 : .062};
    mix-blend-mode:${studio ? 'multiply' : 'overlay'};pointer-events:none}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * 0.045)}px;text-align:center;
    font-size:${Math.round(h * 0.022)}px;letter-spacing:.2em;text-transform:uppercase;
    color:${studio ? 'rgba(86,89,79,.7)' : 'rgba(240,222,190,.62)'}}
</style></head><body>
<div class="scene">
  ${studio ? '' : '<div class="bokeh b1"></div><div class="bokeh b2"></div><div class="bokeh b3"></div>'}
  <div class="surface"></div><div class="horizon"></div>
  <div class="pool"></div>
  <div class="reflet">${art}</div>
  <div class="shadow"></div><div class="shadow2"></div>
  <div class="art">${art}</div>
  <div class="vig"></div>
  ${GRAIN}
  ${legende ? `<div class="cap">${legende}</div>` : ''}
</div></body></html>`;
}

/* ---------- Scènes particulières ---------- */

function duoScene(w, h) {
  const arriere = lampSVG('ivoire', { glow: 0.85 }), avant = lampSVG('noir');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(130% 100% at 46% 22%, #FFFDFA 0%, #F5F3EE 40%, #E6E4DD 76%, #D2D1CB 100%)}
  .surface{position:absolute;left:0;right:0;bottom:0;height:${Math.round(h * .32)}px;
    background:linear-gradient(180deg, rgba(196,192,182,.34), rgba(160,156,146,.12) 34%, transparent)}
  .pool{position:absolute;left:50%;transform:translateX(-50%);bottom:${Math.round(h * .12)}px;
    width:${Math.round(w * .74)}px;height:${Math.round(h * .18)}px;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,198,116,.44), rgba(255,180,90,0) 72%);
    filter:blur(${Math.round(w * .016)}px)}
  .unit{position:absolute;bottom:${Math.round(h * .14)}px}
  .back{left:${Math.round(w * .09)}px;height:${Math.round(h * .60)}px;filter:blur(2.6px);opacity:.88}
  .front{right:${Math.round(w * .07)}px;height:${Math.round(h * .70)}px}
  .unit svg{height:100%;width:auto;display:block;
    filter:drop-shadow(0 ${Math.round(h * .012)}px ${Math.round(h * .028)}px rgba(${OMBRE},.26))}
  .sh{position:absolute;border-radius:50%;background:rgba(${OMBRE},.30);filter:blur(${Math.round(w * .014)}px)}
  .sh-b{left:${Math.round(w * .08)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .30)}px;height:${Math.round(h * .042)}px}
  .sh-f{right:${Math.round(w * .06)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .34)}px;height:${Math.round(h * .05)}px}
  .vig{position:absolute;inset:0;background:radial-gradient(125% 95% at 48% 42%, transparent 40%, rgba(92,90,84,.20) 100%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.042;mix-blend-mode:multiply}
</style></head><body><div class="scene">
  <div class="surface"></div><div class="pool"></div>
  <div class="sh sh-b"></div><div class="sh sh-f"></div>
  <div class="unit back">${arriere}</div>
  <div class="unit front">${avant}</div>
  <div class="vig"></div>${GRAIN}
</div></body></html>`;
}

function macroScene(w, h, { cible, scale, top, legende }) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(72% 62% at 50% 42%, #4A3826 0%, #281E15 44%, #100C09 100%)}
  .halo{position:absolute;left:50%;top:48%;transform:translate(-50%,-50%);
    width:${Math.round(w * .82)}px;height:${Math.round(w * .82)}px;border-radius:50%;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,206,130,.62), rgba(255,180,90,0) 68%);
    filter:blur(${Math.round(w * .03)}px)}
  .art{position:absolute;left:50%;top:${top}%;transform:translate(-50%,-50%) scale(${scale});
    height:${Math.round(h * .8)}px;aspect-ratio:620/720}
  .art svg{width:100%;height:100%;display:block}
  .mask{position:absolute;inset:0;background:radial-gradient(64% 60% at 50% 50%, transparent 24%, rgba(8,6,5,.9) 80%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.07;mix-blend-mode:overlay}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * .05)}px;text-align:center;
    font-family:Georgia,serif;font-size:${Math.round(h * .026)}px;letter-spacing:.2em;
    text-transform:uppercase;color:rgba(245,220,180,.66)}
</style></head><body><div class="scene">
  <div class="halo"></div>
  <div class="art">${cible}</div>
  <div class="mask"></div>${GRAIN}
  ${legende ? `<div class="cap">${legende}</div>` : ''}
</div></body></html>`;
}

/* Cote technique : la hauteur réglable est un argument de vente, pas un détail. */
function cotesScene(w, h) {
  const L = lampSVG('noir', { glow: 0.9, cable: false });
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden;font-family:Georgia,serif}
  .scene{position:relative;width:${w}px;height:${h}px;background:#FAF9F6;overflow:hidden}
  .art{position:absolute;left:46%;top:50%;transform:translate(-50%,-50%);height:${Math.round(h * .78)}px;aspect-ratio:620/720}
  .art svg{width:100%;height:100%;display:block}
  .cote{position:absolute;color:#56594F}
  .ligne{position:absolute;background:#8B8E84}
  .v{width:1px}.hl{height:1px}
  .txt{position:absolute;font-size:${Math.round(h * .032)}px;color:#191A18;background:#FAF9F6;padding:0 10px}
  .sous{font-size:${Math.round(h * .022)}px;color:#8B8E84}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.03;mix-blend-mode:multiply}
</style></head><body><div class="scene">
  <div class="art">${L}</div>
  <div class="ligne v" style="left:${Math.round(w * .74)}px;top:${Math.round(h * .16)}px;height:${Math.round(h * .68)}px"></div>
  <div class="ligne hl" style="left:${Math.round(w * .70)}px;top:${Math.round(h * .16)}px;width:${Math.round(w * .08)}px"></div>
  <div class="ligne hl" style="left:${Math.round(w * .70)}px;top:${Math.round(h * .84)}px;width:${Math.round(w * .08)}px"></div>
  <div class="txt" style="left:${Math.round(w * .77)}px;top:${Math.round(h * .46)}px">26 – 34 cm<br><span class="sous">hauteur réglable</span></div>
  <div class="ligne hl" style="left:${Math.round(w * .18)}px;top:${Math.round(h * .88)}px;width:${Math.round(w * .30)}px"></div>
  <div class="txt" style="left:${Math.round(w * .21)}px;top:${Math.round(h * .90)}px">Ø 16 cm<br><span class="sous">socle lesté</span></div>
  ${GRAIN}
</div></body></html>`;
}

/* ---------- Rendu ---------- */

const SQ = 1500, W = 2000, H = 1250;

const jobs = [
  ['lampe-noir',    scene({ art: lampSVG('noir'),   w: SQ, h: SQ })],
  ['lampe-ivoire',  scene({ art: lampSVG('ivoire'), w: SQ, h: SQ })],
  ['lampe-laiton',  scene({ art: lampSVG('laiton'), w: SQ, h: SQ })],
  ['bougie-cedre',   scene({ art: candleSVG('Cèdre', '#2C4739'),   w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['bougie-vanille', scene({ art: candleSVG('Vanille', '#7A5423'), w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['bougie-figue',   scene({ art: candleSVG('Figue', '#5B2B3E'),   w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['coffret',   scene({ art: boxSVG(),   w: SQ, h: SQ, scale: .78, baseline: .856, shiftY: -40 })],
  ['ampoules',  scene({ art: bulbsSVG(), w: SQ, h: SQ, scale: .92, baseline: .842, shiftY: -60 })],
  ['hero',      scene({ art: lampSVG('noir'), w: W, h: H, mode: 'interior', scale: .80, shiftX: 210, shiftY: -30, reflet: .14 })],
  ['duo',       duoScene(SQ, SQ)],
  ['detail',    macroScene(W, H, { cible: lampSVG('noir'), scale: 2.0, top: 12, legende: 'La cire fond par le dessus' })],
  ['macro-abatjour', macroScene(SQ, SQ, { cible: lampSVG('laiton'), scale: 2.3, top: 56, legende: '35 W · 2700 K' })],
  ['cotes',     cotesScene(W, H)],
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
});
for (const [nom, html] of jobs) {
  const m = html.match(/body\{width:(\d+)px;height:(\d+)px/);
  const [w, h] = [Number(m[1]), Number(m[2])];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  await p.waitForTimeout(200);
  const f = `${OUT}/${nom}.jpg`;
  await p.screenshot({ path: f, type: 'jpeg', quality: 91 });
  await ctx.close();
  console.log('ok', nom, `${w}x${h}`, Math.round(fs.statSync(f).size / 1024) + 'kB');
}
await browser.close();
