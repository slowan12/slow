/* Rendu produit photoréaliste — Chromium headless.
   Pas de photographie possible (aucun échantillon, banques d'images injoignables) :
   ces scènes sont composées en SVG/CSS avec matières, éclairage directionnel,
   profondeur de champ et grain. À remplacer par de vraies photos. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.argv[2] || path.join(import.meta.dirname, 'photo');
fs.mkdirSync(OUT, { recursive: true });

/* ---------- Matières ---------- */

const MAT = {
  noir:   { a: '#14161A', b: '#3C4148', c: '#0C0E11', spec: '#8D97A3', name: 'Noir mat' },
  ivoire: { a: '#CFC7B8', b: '#FBF8F1', c: '#B3AA99', spec: '#FFFFFF', name: 'Blanc ivoire' },
  laiton: { a: '#8A6626', b: '#EFC97F', c: '#6E4E18', spec: '#FFF0C9', name: 'Laiton brossé' },
};

/* Dégradé métal : sombre au bord, clair au tiers, sombre à l'autre bord.
   C'est ce profil asymétrique qui fait lire « cylindre » plutôt que « rectangle ». */
const metal = (id, m, x1 = 0, x2 = 1) => `
<linearGradient id="${id}" x1="${x1}" y1="0" x2="${x2}" y2="0">
  <stop offset="0"    stop-color="${m.c}"/>
  <stop offset="0.18" stop-color="${m.a}"/>
  <stop offset="0.38" stop-color="${m.b}"/>
  <stop offset="0.52" stop-color="${m.a}"/>
  <stop offset="1"    stop-color="${m.c}"/>
</linearGradient>`;

/* ---------- La lampe ---------- */

function lampSVG(key, { glow = 1 } = {}) {
  const m = MAT[key];
  const u = key;
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  ${metal(`stem-${u}`, m)}
  ${metal(`shade-${u}`, m)}
  ${metal(`base-${u}`, m)}

  <radialGradient id="bulb-${u}" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0"   stop-color="#FFF6DF"/>
    <stop offset="0.45" stop-color="#FFD98F"/>
    <stop offset="1"   stop-color="#E9A63F" stop-opacity="0.75"/>
  </radialGradient>

  <linearGradient id="cone-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="#FFCF84" stop-opacity="${0.5 * glow}"/>
    <stop offset="0.55" stop-color="#FFC06A" stop-opacity="${0.16 * glow}"/>
    <stop offset="1"   stop-color="#FFB85C" stop-opacity="0"/>
  </linearGradient>

  <linearGradient id="glass-${u}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#FFFFFF" stop-opacity="0.30"/>
    <stop offset="0.10" stop-color="#FFFFFF" stop-opacity="0.07"/>
    <stop offset="0.50" stop-color="#FFFFFF" stop-opacity="0.03"/>
    <stop offset="0.88" stop-color="#FFFFFF" stop-opacity="0.10"/>
    <stop offset="1"    stop-color="#FFFFFF" stop-opacity="0.34"/>
  </linearGradient>

  <linearGradient id="wax-${u}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="#D8CDB6"/>
    <stop offset="0.34" stop-color="#F6EFDF"/>
    <stop offset="0.72" stop-color="#E7DDC7"/>
    <stop offset="1"    stop-color="#C9BDA4"/>
  </linearGradient>

  <filter id="soft-${u}" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="16"/>
  </filter>
  <filter id="softer-${u}" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="34"/>
  </filter>
  <filter id="tiny-${u}" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="3"/>
  </filter>
</defs>

<!-- halo général -->
<ellipse cx="392" cy="330" rx="210" ry="215" fill="#FFB85C" opacity="${0.16 * glow}" filter="url(#softer-${u})"/>

<!-- socle -->
<ellipse cx="196" cy="654" rx="118" ry="21" fill="url(#base-${u})"/>
<ellipse cx="196" cy="649" rx="118" ry="21" fill="url(#base-${u})"/>
<path d="M78 649a118 21 0 0 0 236 0v5a118 21 0 0 1-236 0z" fill="${m.c}"/>
<ellipse cx="196" cy="647" rx="92" ry="14" fill="${m.b}" opacity="0.30"/>
<ellipse cx="163" cy="643" rx="34" ry="6" fill="${m.spec}" opacity="0.28" filter="url(#tiny-${u})"/>

<!-- colonne + col de cygne -->
<path d="M186 646V236a54 54 0 0 1 54-54h112a54 54 0 0 1 54 54v34"
      stroke="url(#stem-${u})" stroke-width="21" stroke-linecap="round"/>
<path d="M191 640V240a49 49 0 0 1 49-49h108"
      stroke="${m.spec}" stroke-width="3" stroke-linecap="round" opacity="0.32"/>

<!-- abat-jour -->
<path d="M318 268h164l-26 96H344z" fill="url(#shade-${u})"/>
<path d="M318 268h164l-3 11H321z" fill="${m.b}" opacity="0.55"/>
<path d="M344 364h112l-2 7H346z" fill="${m.c}"/>
<path d="M336 276l-14 84" stroke="${m.spec}" stroke-width="5" opacity="0.22" filter="url(#tiny-${u})"/>

<!-- ampoule + faisceau -->
<ellipse cx="400" cy="366" rx="56" ry="11" fill="url(#bulb-${u})"/>
<ellipse cx="400" cy="366" rx="34" ry="7" fill="#FFF8E6" opacity="${0.95 * glow}" filter="url(#tiny-${u})"/>
<path d="M346 370h108l44 158H302z" fill="url(#cone-${u})" filter="url(#soft-${u})"/>

<!-- ombre portée du pot sur le plan -->
<ellipse cx="400" cy="672" rx="76" ry="13" fill="#2A241A" opacity="0.30" filter="url(#soft-${u})"/>
<!-- pot en verre : la base s'aligne sur celle du socle -->
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z" fill="url(#glass-${u})"/>
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z"
      stroke="#FFFFFF" stroke-opacity="0.34" stroke-width="2"/>
<!-- cire -->
<path d="M330 528h140l-10 119a13 13 0 0 1-13 12H353a13 13 0 0 1-13-12z" fill="url(#wax-${u})"/>
<!-- bain de cire fondue, éclairé par le dessus -->
<ellipse cx="400" cy="528" rx="70" ry="13" fill="#F3E6C8"/>
<ellipse cx="400" cy="527" rx="58" ry="10" fill="#FFE9B8" opacity="0.92"/>
<ellipse cx="381" cy="525" rx="22" ry="4" fill="#FFFAEC" opacity="0.85" filter="url(#tiny-${u})"/>
<path d="M400 514v13" stroke="#6B5A3E" stroke-width="3" stroke-linecap="round"/>
<!-- spéculaires sur le verre -->
<path d="M337 514l-7 138" stroke="#FFFFFF" stroke-opacity="0.50" stroke-width="7" stroke-linecap="round" filter="url(#tiny-${u})"/>
<path d="M466 518l-6 128" stroke="#FFFFFF" stroke-opacity="0.26" stroke-width="4" stroke-linecap="round" filter="url(#tiny-${u})"/>
<ellipse cx="400" cy="668" rx="63" ry="9" fill="#FFFFFF" opacity="0.10"/>
</svg>`;
}

/* ---------- Bougie seule ---------- */

function candleSVG(label, tint) {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.34"/>
    <stop offset="0.12" stop-color="#FFFFFF" stop-opacity="0.08"/>
    <stop offset="0.55" stop-color="#FFFFFF" stop-opacity="0.04"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.36"/>
  </linearGradient>
  <linearGradient id="cw" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#D5C9B0"/>
    <stop offset="0.34" stop-color="#F8F2E3"/>
    <stop offset="1" stop-color="#C6BAA0"/>
  </linearGradient>
  <linearGradient id="lbl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${tint}" stop-opacity="0.92"/>
    <stop offset="0.4" stop-color="${tint}"/>
    <stop offset="1" stop-color="${tint}" stop-opacity="0.82"/>
  </linearGradient>
  <filter id="b1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<!-- un pot de 180 g est presque aussi large que haut -->
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" fill="url(#cg)"/>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" stroke="#FFFFFF" stroke-opacity="0.32" stroke-width="2"/>
<path d="M220 412h180l-9 200a16 16 0 0 1-16 15H245a16 16 0 0 1-16-15z" fill="url(#cw)"/>
<ellipse cx="310" cy="412" rx="90" ry="16" fill="#EFE5CC"/>
<ellipse cx="310" cy="411" rx="76" ry="13" fill="#FBF3DE"/>
<path d="M310 388v24" stroke="#6B5A3E" stroke-width="4" stroke-linecap="round"/>
<rect x="232" y="470" width="156" height="96" rx="3" fill="url(#lbl)"/>
<text x="310" y="514" text-anchor="middle" font-family="Georgia,serif" font-size="27" fill="#FFFDF7">${label}</text>
<text x="310" y="543" text-anchor="middle" font-family="Georgia,serif" font-size="15" letter-spacing="3" fill="#FFFDF7" opacity="0.78">180 G</text>
<path d="M228 396l-7 216" stroke="#FFFFFF" stroke-opacity="0.50" stroke-width="8" stroke-linecap="round" filter="url(#b1)"/>
<path d="M396 402l-6 206" stroke="#FFFFFF" stroke-opacity="0.24" stroke-width="5" stroke-linecap="round" filter="url(#b1)"/>
</svg>`;
}

/* ---------- Ampoules ---------- */

function bulbsSVG() {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="col" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#7E8892"/><stop offset="0.30" stop-color="#E9EEF2"/>
    <stop offset="0.56" stop-color="#AEB7C0"/><stop offset="1" stop-color="#6E7780"/>
  </linearGradient>
  <linearGradient id="body" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#C8BFA8"/><stop offset="0.32" stop-color="#F7F1E2"/>
    <stop offset="0.62" stop-color="#E2D9C3"/><stop offset="1" stop-color="#B8AE96"/>
  </linearGradient>
  <radialGradient id="lens" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#FFF9E9"/><stop offset="0.55" stop-color="#F3E3BC"/>
    <stop offset="1" stop-color="#CFBE94"/>
  </radialGradient>
  <filter id="ub" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>

<!-- Un GU10 est trapu : ~50 mm de diamètre pour ~55 mm de haut.
     Les deux posent sur le même plan, la seconde en retrait. -->
<g>
  <!-- ampoule en retrait : plus petite, base un peu plus haute (plan qui fuit) -->
  <g opacity="0.96">
    <path d="M330 468h148l-6 108a16 16 0 0 1-11 14 126 22 0 0 1-114 0 16 16 0 0 1-11-14z" fill="url(#body)"/>
    <ellipse cx="404" cy="580" rx="63" ry="12" fill="url(#lens)"/>
    <ellipse cx="404" cy="578" rx="46" ry="8" fill="#FFF7E1" opacity="0.82" filter="url(#ub)"/>
    <rect x="356" y="424" width="96" height="46" rx="7" fill="url(#col)"/>
    <path d="M374 396v28M434 396v28" stroke="#8A939C" stroke-width="12" stroke-linecap="round"/>
    <path d="M342 480l-3 88" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="7" stroke-linecap="round" filter="url(#ub)"/>
  </g>

  <!-- ampoule au premier plan -->
  <g>
    <path d="M186 452h170l-7 124a18 18 0 0 1-13 16 146 26 0 0 1-130 0 18 18 0 0 1-13-16z" fill="url(#body)"/>
    <ellipse cx="271" cy="592" rx="73" ry="14" fill="url(#lens)"/>
    <ellipse cx="271" cy="589" rx="53" ry="10" fill="#FFF9E6" opacity="0.9" filter="url(#ub)"/>
    <rect x="216" y="400" width="110" height="52" rx="8" fill="url(#col)"/>
    <path d="M237 370v30M305 370v30" stroke="#8A939C" stroke-width="14" stroke-linecap="round"/>
    <path d="M228 412l-3 34" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="8" filter="url(#ub)"/>
    <path d="M200 464l-6 104" stroke="#FFFFFF" stroke-opacity="0.38" stroke-width="8" stroke-linecap="round" filter="url(#ub)"/>
  </g>
</g>
</svg>`;
}

/* ---------- Coffret ---------- */

function boxSVG() {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="kx" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#1B2E24"/><stop offset="0.42" stop-color="#31503F"/>
    <stop offset="1" stop-color="#16251D"/>
  </linearGradient>
  <linearGradient id="kl" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#243B2E"/><stop offset="0.4" stop-color="#3E6450"/>
    <stop offset="1" stop-color="#1C2E24"/>
  </linearGradient>
  <linearGradient id="rb" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#B8912F"/><stop offset="0.45" stop-color="#F0CE84"/>
    <stop offset="1" stop-color="#9E7A22"/>
  </linearGradient>
  <filter id="kb" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>
<path d="M118 316h384l-26 300H144z" fill="url(#kx)"/>
<path d="M104 254h412l-14 62H118z" fill="url(#kl)"/>
<path d="M104 254h412l-3 9H107z" fill="#4C7960" opacity="0.6"/>
<path d="M284 254h52l-22 362h-52z" fill="url(#rb)" opacity="0.92"/>
<path d="M310 254c-26-38-56-54-72-38-15 15 4 34 72 38 68-4 87-23 72-38-16-16-46 0-72 38Z" fill="url(#rb)"/>
<ellipse cx="310" cy="256" rx="17" ry="12" fill="#C9A344"/>
<path d="M132 330l-10 270" stroke="#6E9C84" stroke-opacity="0.35" stroke-width="7" filter="url(#kb)"/>
<text x="310" y="470" text-anchor="middle" font-family="Georgia,serif" font-size="30" letter-spacing="7" fill="#DCE9E0" opacity="0.55">LUEUR</text>
</svg>`;
}

/* ---------- Scène : studio ou intérieur ---------- */

const GRAIN = `
<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;

function scene({ art, w, h, mode = 'studio', caption = '', scale = 0.74,
                 shiftX = 0, shiftY = 24, baseline = 0.9375 }) {
  const studio = mode === 'studio';
  // Où le sujet touche le plan, en pixels dans la scène.
  // Sans ça l'ombre reste à hauteur fixe et les objets à petite échelle flottent.
  const artH    = h * scale;
  const artTop  = h / 2 + shiftY - artH / 2;
  const ground  = Math.round(artTop + artH * baseline);
  const shW     = Math.round(w * 0.50 * (scale / 0.74));
  const shH     = Math.round(h * 0.052 * (scale / 0.74));
  const horizon = Math.round(ground - h * 0.14);   // l'arête passe derrière le sujet
  const surfH   = h - horizon;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#000}
  body{width:${w}px;height:${h}px;overflow:hidden;font-family:Georgia,serif}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:${studio
      ? `radial-gradient(120% 90% at 50% 26%, #FFFFFF 0%, #F4F2ED 44%, #E4E1D9 78%, #D2CEC4 100%)`
      : `radial-gradient(90% 70% at 62% 34%, #4A3A27 0%, #2B2119 40%, #171310 74%, #0C0A08 100%)`};}

  /* mur / plan de fond, légèrement flou : c'est la profondeur de champ */
  .backdrop{position:absolute;inset:0;filter:blur(${studio ? 0 : 16}px)}
  .surface{position:absolute;left:0;right:0;bottom:0;height:${surfH}px;
    background:${studio
      ? 'linear-gradient(180deg, rgba(150,145,134,.20), rgba(120,115,104,.05) 40%, transparent)'
      : 'linear-gradient(180deg, rgba(92,66,38,.55), rgba(38,28,20,.92) 60%, #0B0907)'};}
  .horizon{position:absolute;left:0;right:0;top:${horizon}px;height:1px;
    background:${studio ? 'rgba(120,116,106,.22)' : 'rgba(180,130,70,.22)'};}

  ${studio ? '' : `
  .bokeh{position:absolute;border-radius:50%;filter:blur(30px);opacity:.5}
  .b1{width:170px;height:170px;left:6%;top:14%;background:#C98B3A}
  .b2{width:110px;height:110px;left:20%;top:44%;background:#8E5F27;opacity:.36}
  .b3{width:230px;height:230px;right:4%;top:8%;background:#6B4520;opacity:.34}`}

  /* nappe de lumière au sol, centrée sur le point d'appui */
  .pool{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-42%);
    width:${Math.round(w * 0.62 * (scale / 0.74))}px;height:${Math.round(h * 0.16)}px;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,196,110,${studio ? .42 : .58}) 0%, rgba(255,180,90,0) 72%);
    filter:blur(${Math.round(w * 0.018)}px)}

  /* ombre de contact : serrée au point d'appui, diffuse en s'éloignant */
  .shadow{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-50%);width:${shW}px;height:${shH}px;
    border-radius:50%;background:rgba(${studio ? '60,56,48' : '0,0,0'},${studio ? .26 : .62});
    filter:blur(${Math.round(w * 0.016)}px)}
  .shadow2{position:absolute;left:calc(50% + ${shiftX}px);top:${ground - Math.round(h * 0.006)}px;
    transform:translate(-50%,-50%);width:${Math.round(shW * 0.52)}px;height:${Math.round(shH * 0.42)}px;
    border-radius:50%;background:rgba(${studio ? '48,44,38' : '0,0,0'},${studio ? .34 : .72});
    filter:blur(${Math.round(w * 0.006)}px)}

  .art{position:absolute;left:calc(50% + ${shiftX}px);top:calc(50% + ${shiftY}px);
    transform:translate(-50%,-50%);height:${Math.round(h * scale)}px;width:auto;aspect-ratio:620/720}
  .art svg{width:100%;height:100%;display:block;
    filter:drop-shadow(0 ${Math.round(h * 0.012)}px ${Math.round(h * 0.03)}px rgba(20,16,10,${studio ? .22 : .5}))}

  /* vignettage */
  .vig{position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(120% 92% at 50% 44%, transparent 42%, rgba(${studio ? '90,86,78' : '0,0,0'},${studio ? .16 : .55}) 100%)}
  /* grain photographique */
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:${studio ? .040 : .060};
    mix-blend-mode:${studio ? 'multiply' : 'overlay'};pointer-events:none}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * 0.045)}px;text-align:center;
    font-size:${Math.round(h * 0.022)}px;letter-spacing:.2em;text-transform:uppercase;
    color:${studio ? 'rgba(86,89,79,.72)' : 'rgba(240,222,190,.62)'}}
</style></head><body>
<div class="scene">
  <div class="backdrop">
    ${studio ? '' : '<div class="bokeh b1"></div><div class="bokeh b2"></div><div class="bokeh b3"></div>'}
    <div class="surface"></div><div class="horizon"></div>
  </div>
  <div class="pool"></div>
  <div class="shadow"></div><div class="shadow2"></div>
  <div class="art">${art}</div>
  <div class="vig"></div>
  ${GRAIN}
  ${caption ? `<div class="cap">${caption}</div>` : ''}
</div></body></html>`;
}

/* ---------- Duo : deux lampes, une nette une en retrait ---------- */

function duoScene(w, h) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(120% 90% at 50% 26%, #FFFFFF 0%, #F4F2ED 44%, #E3E0D8 80%, #D1CDC3 100%)}
  .surface{position:absolute;left:0;right:0;bottom:0;height:${Math.round(h * .30)}px;
    background:linear-gradient(180deg, rgba(150,145,134,.20), rgba(120,115,104,.05) 40%, transparent)}
  .pool{position:absolute;left:50%;transform:translateX(-50%);bottom:${Math.round(h * .12)}px;
    width:${Math.round(w * .70)}px;height:${Math.round(h * .17)}px;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,196,110,.40), rgba(255,180,90,0) 72%);
    filter:blur(${Math.round(w * .016)}px)}
  .unit{position:absolute;bottom:${Math.round(h * .14)}px}
  .back{left:${Math.round(w * .10)}px;height:${Math.round(h * .60)}px;filter:blur(2.4px);opacity:.86}
  .front{right:${Math.round(w * .08)}px;height:${Math.round(h * .70)}px}
  .unit svg{height:100%;width:auto;display:block;
    filter:drop-shadow(0 ${Math.round(h * .012)}px ${Math.round(h * .028)}px rgba(20,16,10,.22))}
  .sh{position:absolute;border-radius:50%;background:rgba(60,56,48,.26);filter:blur(${Math.round(w * .014)}px)}
  .sh-b{left:${Math.round(w * .09)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .30)}px;height:${Math.round(h * .042)}px}
  .sh-f{right:${Math.round(w * .07)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .34)}px;height:${Math.round(h * .050)}px}
  .vig{position:absolute;inset:0;background:radial-gradient(120% 92% at 50% 44%, transparent 42%, rgba(90,86,78,.16) 100%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.04;mix-blend-mode:multiply}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * .045)}px;text-align:center;
    font-family:Georgia,serif;font-size:${Math.round(h * .022)}px;letter-spacing:.2em;
    text-transform:uppercase;color:rgba(86,89,79,.72)}
</style></head><body><div class="scene">
  <div class="surface"></div><div class="pool"></div>
  <div class="sh sh-b"></div><div class="sh sh-f"></div>
  <div class="unit back">${lampSVG('ivoire', { glow: 0.8 })}</div>
  <div class="unit front">${lampSVG('noir')}</div>
  <div class="vig"></div>${GRAIN}
</div></body></html>`;
}

/* ---------- Plan détail : le bain de cire ---------- */

function detailScene(w, h) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(70% 60% at 50% 40%, #40301F 0%, #241A12 46%, #100C09 100%)}
  .halo{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
    width:${Math.round(w * .78)}px;height:${Math.round(w * .78)}px;border-radius:50%;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,204,124,.60), rgba(255,180,90,0) 68%);
    filter:blur(${Math.round(w * .03)}px)}
  .art{position:absolute;left:50%;top:12%;transform:translate(-50%,-50%) scale(2.0);
    height:${Math.round(h * .8)}px;aspect-ratio:620/720}
  .art svg{width:100%;height:100%;display:block}
  .mask{position:absolute;inset:0;background:radial-gradient(62% 58% at 50% 50%, transparent 26%, rgba(8,6,5,.90) 80%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.07;mix-blend-mode:overlay}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * .05)}px;text-align:center;
    font-family:Georgia,serif;font-size:${Math.round(h * .026)}px;letter-spacing:.2em;
    text-transform:uppercase;color:rgba(245,220,180,.66)}
</style></head><body><div class="scene">
  <div class="halo"></div>
  <div class="art">${lampSVG('noir')}</div>
  <div class="mask"></div>${GRAIN}
</div></body></html>`;
}

/* ---------- Rendu ---------- */

const SQ = 1500, WIDE_W = 2000, WIDE_H = 1250;

const jobs = [
  ['lampe-noir',    scene({ art: lampSVG('noir'),   w: SQ, h: SQ })],
  ['lampe-ivoire',  scene({ art: lampSVG('ivoire'), w: SQ, h: SQ })],
  ['lampe-laiton',  scene({ art: lampSVG('laiton'), w: SQ, h: SQ })],
  ['bougie-cedre',   scene({ art: candleSVG('C&#232;dre', '#2C4739'),  w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['bougie-vanille', scene({ art: candleSVG('Vanille', '#7A5423'), w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['bougie-figue',   scene({ art: candleSVG('Figue', '#5B2B3E'),   w: SQ, h: SQ, scale: .78, baseline: .892, shiftY: -30 })],
  ['coffret',   scene({ art: boxSVG(),   w: SQ, h: SQ, scale: .78, baseline: .856, shiftY: -40 })],
  ['ampoules',  scene({ art: bulbsSVG(), w: SQ, h: SQ, scale: .92, baseline: .842, shiftY: -60 })],
  ['hero',      scene({ art: lampSVG('noir'), w: WIDE_W, h: WIDE_H, mode: 'interior', scale: .80, shiftX: 210, shiftY: -30, baseline: .9375 })],
  ['duo',       duoScene(SQ, SQ)],
  ['detail',    detailScene(WIDE_W, WIDE_H)],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [name, html] of jobs) {
  const m = html.match(/body\{width:(\d+)px;height:(\d+)px/);
  const [w, h] = [Number(m[1]), Number(m[2])];
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  const file = `${OUT}/${name}.jpg`;
  await p.screenshot({ path: file, type: 'jpeg', quality: 90 });
  await ctx.close();
  console.log('ok', name, `${w}x${h}`, Math.round(fs.statSync(file).size / 1024) + 'kB');
}
await browser.close();
