/* Rendu produit CERA — Chromium headless.
 *
 * Pas de photographie possible ici (aucun échantillon, banques d'images et
 * AliExpress bloqués par la politique réseau). Ces scènes sont composées en
 * SVG/CSS, sur le modèle des visuels marchands du rayon : abat-jour en tissu,
 * pot en verre ambré, plan de travail en bois, lumière d'intérieur chaude.
 *
 * Ce qui rapproche une scène d'une vraie photo, dans l'ordre d'importance :
 *
 *   1. le sujet repose vraiment sur le plan  (baseline -> ombre de contact)
 *   2. une matière qui a une texture         (fil du bois, trame du lin)
 *   3. la lumière traverse ce qui est fin    (le tissu s'allume, l'ambre aussi)
 *   4. clé chaude / appoint froid            (le contraste de température fait le volume)
 *   5. ombres bleutées, jamais grises        (une ombre prend la couleur du ciel)
 *   6. grain + vignettage                    (une optique n'est jamais parfaite)
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

/* L'abat-jour est en tissu : il ne réfléchit pas, il s'allume par transparence. */
const TISSU = {
  noir:   { bord: '#907A5B', base: '#CDB795', chaud: '#F7E1B6', nom: 'lin écru' },
  ivoire: { bord: '#A2937B', base: '#DDD0B8', chaud: '#FBECCE', nom: 'lin blanc' },
  laiton: { bord: '#7B6446', base: '#B79C78', chaud: '#F0D3A1', nom: 'lin taupe' },
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

/* Verre ambré — la teinte du pot sur la photo de référence. */
const ambre = (id) => `
<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0"    stop-color="#48230A"/>
  <stop offset="0.07" stop-color="#7E4411"/>
  <stop offset="0.20" stop-color="#C2782B"/>
  <stop offset="0.38" stop-color="#E5A04A"/>
  <stop offset="0.54" stop-color="#BE7024"/>
  <stop offset="0.76" stop-color="#6E3A0D"/>
  <stop offset="0.91" stop-color="#A25D1B"/>
  <stop offset="1"    stop-color="#47230A"/>
</linearGradient>`;

/* Trame du lin : deux familles de fils à très faible contraste.
   À 1500 px elle ne se voit pas, elle se sent — c'est exactement le but. */
const TRAME = `
<pattern id="trame" width="4" height="4" patternUnits="userSpaceOnUse">
  <path d="M0 .8h4M0 2.8h4" stroke="#4A3A24" stroke-width=".7" opacity=".10"/>
  <path d="M.8 0v4M2.8 0v4" stroke="#FFF6E2" stroke-width=".6" opacity=".09"/>
</pattern>`;

/* ---------- La lampe ---------- */

function lampSVG(key, { glow = 1, cable = true } = {}) {
  const m = MAT[key], t = TISSU[key], u = key;
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  ${metal(`stem-${u}`, m)}
  ${metal(`base-${u}`, m)}
  ${metal(`knob-${u}`, m)}
  ${ambre(`pot-${u}`)}
  ${TRAME}

  <!-- le tissu vu de face : sombre aux bords, allumé au centre -->
  <linearGradient id="tissu-${u}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0"    stop-color="${t.bord}"/>
    <stop offset="0.10" stop-color="${t.base}"/>
    <stop offset="0.40" stop-color="${t.chaud}"/>
    <stop offset="0.62" stop-color="${t.base}"/>
    <stop offset="0.88" stop-color="${t.bord}"/>
    <stop offset="1"    stop-color="${t.base}"/>
  </linearGradient>
  <!-- et la lumière qui sort par le bas : le tissu chauffe vers l'ouverture -->
  <linearGradient id="tissu-bas-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="#5C4526" stop-opacity="0.34"/>
    <stop offset="0.16" stop-color="#5C4526" stop-opacity="0.06"/>
    <stop offset="0.58" stop-color="${CHAUD}" stop-opacity="${0.16 * glow}"/>
    <stop offset="1"    stop-color="${CHAUD_VIF}" stop-opacity="${0.52 * glow}"/>
  </linearGradient>

  <radialGradient id="bulb-${u}" cx="0.5" cy="0.4" r="0.6">
    <stop offset="0"    stop-color="#FFFFFF"/>
    <stop offset="0.3"  stop-color="${CHAUD_VIF}"/>
    <stop offset="0.7"  stop-color="${CHAUD}"/>
    <stop offset="1"    stop-color="${MIEL}" stop-opacity="0.8"/>
  </radialGradient>

  <linearGradient id="cone-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="${CHAUD_VIF}" stop-opacity="${0.50 * glow}"/>
    <stop offset="0.5"  stop-color="${CHAUD}"     stop-opacity="${0.16 * glow}"/>
    <stop offset="1"    stop-color="${CHAUD}"     stop-opacity="0"/>
  </linearGradient>

  <!-- l'ambre s'éclaire par le haut, là où la lampe tape -->
  <linearGradient id="pot-haut-${u}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"   stop-color="${CHAUD_VIF}" stop-opacity="${0.46 * glow}"/>
    <stop offset="0.4" stop-color="${CHAUD}"     stop-opacity="${0.16 * glow}"/>
    <stop offset="1"   stop-color="#2A1405"      stop-opacity="0.30"/>
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
  <filter id="mid-${u}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
</defs>

<!-- halo diffus : un abat-jour en tissu rayonne de toute sa surface -->
<ellipse cx="400" cy="336" rx="188" ry="206" fill="${CHAUD}" opacity="${0.24 * glow}" filter="url(#softer-${u})"/>

${cable ? `<!-- câble : il part du socle et sort du cadre, comme sur une vraie table -->
<path d="M240 650c60 14 122 4 170-18" stroke="${m.c}" stroke-width="7" stroke-linecap="round" opacity="0.55"/>` : ''}

<!-- socle : l'ombre de contact est dessinée ici, pas dans la scène,
     parce que le socle n'est pas au centre du cadre -->
<ellipse cx="200" cy="676" rx="146" ry="24" fill="rgb(${OMBRE})" opacity="0.30" filter="url(#soft-${u})"/>
<ellipse cx="196" cy="668" rx="112" ry="15" fill="rgb(${OMBRE})" opacity="0.42" filter="url(#tiny-${u})"/>
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

<!-- colonne + arceau, qui vient se terminer au centre de l'abat-jour -->
<path d="M186 648V236a54 54 0 0 1 54-54h106a54 54 0 0 1 54 54v16"
      stroke="url(#stem-${u})" stroke-width="22" stroke-linecap="round"/>
<path d="M192 640V240a48 48 0 0 1 48-48h100"
      stroke="${m.spec}" stroke-width="3.4" stroke-linecap="round" opacity="0.34"/>
<path d="M180 640V240a60 60 0 0 1 60-60"
      stroke="${FROID}" stroke-width="2.4" stroke-linecap="round" opacity="0.30"/>

<!-- ABAT-JOUR EN TISSU : cylindre légèrement évasé, ouvert en bas -->
<path d="M320 252 L312 396 A88 21 0 0 0 488 396 L480 252 Z" fill="url(#tissu-${u})"/>
<path d="M320 252 L312 396 A88 21 0 0 0 488 396 L480 252 Z" fill="url(#trame)"/>
<path d="M320 252 L312 396 A88 21 0 0 0 488 396 L480 252 Z" fill="url(#tissu-bas-${u})"/>
<!-- bords doux : un tissu n'a pas d'arête -->
<path d="M317 258l-4 132" stroke="${t.bord}" stroke-width="9" opacity="0.45" filter="url(#tiny-${u})"/>
<path d="M483 258l4 132" stroke="#4A3A26" stroke-width="10" opacity="0.30" filter="url(#tiny-${u})"/>
<path d="M356 262l-6 128" stroke="#FFFFFF" stroke-width="10" opacity="0.16" filter="url(#mid-${u})"/>
<!-- couture verticale, à droite, discrète -->
<path d="M452 256l5 136" stroke="${t.bord}" stroke-width="1.6" opacity="0.40"/>

<!-- rebord supérieur : on plonge très légèrement dans l'abat-jour -->
<ellipse cx="400" cy="252" rx="80" ry="18" fill="${t.bord}"/>
<ellipse cx="400" cy="252" rx="73" ry="15" fill="#3B2C1C"/>
<ellipse cx="400" cy="256" rx="66" ry="12" fill="#6A4E2C" opacity="0.55"/>
<ellipse cx="400" cy="254" rx="73" ry="15" fill="${CHAUD}" opacity="${0.10 * glow}"/>
<path d="M327 252a73 15 0 0 1 146 0" stroke="#FFF7E6" stroke-opacity="0.30" stroke-width="2"/>
<!-- douille et fixation -->
<ellipse cx="400" cy="248" rx="22" ry="8" fill="url(#knob-${u})"/>

<!-- ouverture basse : la lumière déborde par le bord -->
<path d="M312 396a88 21 0 0 0 176 0" stroke="${CHAUD_VIF}" stroke-width="5" stroke-opacity="${0.75 * glow}" filter="url(#tiny-${u})"/>
<ellipse cx="400" cy="400" rx="86" ry="20" fill="${CHAUD}" opacity="${0.40 * glow}" filter="url(#soft-${u})"/>
<ellipse cx="400" cy="398" rx="46" ry="11" fill="url(#bulb-${u})" opacity="${0.85 * glow}" filter="url(#tiny-${u})"/>

<!-- faisceau vers le pot -->
<path d="M330 404h140l38 122H292z" fill="url(#cone-${u})" filter="url(#soft-${u})"/>

<!-- ombre portée du pot -->
<ellipse cx="400" cy="672" rx="78" ry="13" fill="rgb(${OMBRE})" opacity="0.38" filter="url(#soft-${u})"/>

<!-- POT EN VERRE AMBRÉ -->
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z" fill="url(#pot-${u})"/>
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z" fill="url(#pot-haut-${u})"/>
<path d="M316 498h168l-11 152a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z"
      stroke="#E7AE63" stroke-opacity="0.34" stroke-width="2"/>
<!-- cire vue à travers l'ambre : une masse claire, assombrie par le verre -->
<path d="M332 530h136l-10 116a13 13 0 0 1-13 12H355a13 13 0 0 1-13-12z" fill="url(#wax-${u})" opacity="0.34"/>
<!-- fond épais du pot, et la caustique qu'il pose -->
<path d="M329 636h142l-2 14a20 20 0 0 1-20 18H347a20 20 0 0 1-20-18z" fill="#3A1C06" opacity="0.55"/>
<ellipse cx="400" cy="660" rx="52" ry="8" fill="${MIEL}" opacity="0.55" filter="url(#tiny-${u})"/>
<!-- bain de cire fondue, au ras du col -->
<ellipse cx="400" cy="500" rx="84" ry="16" fill="#8A5116"/>
<ellipse cx="400" cy="499" rx="74" ry="13" fill="#F2E4C4"/>
<ellipse cx="400" cy="498" rx="62" ry="10" fill="${CHAUD_VIF}" opacity="0.95"/>
<ellipse cx="379" cy="496" rx="23" ry="4" fill="#FFFFFF" opacity="0.9" filter="url(#tiny-${u})"/>
<path d="M400 486v12" stroke="#6B5A3E" stroke-width="3" stroke-linecap="round"/>
<!-- étiquette papier -->
<rect x="350" y="556" width="100" height="62" rx="3" fill="#F3E8D2" opacity="0.93"/>
<text x="400" y="584" text-anchor="middle" font-family="Georgia,serif" font-size="19" letter-spacing="5" fill="#4A3A24">CERA</text>
<text x="400" y="604" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="3" fill="#7A6547">SANS FLAMME</text>
<!-- spéculaires du verre -->
<path d="M334 512l-7 132" stroke="#FFFFFF" stroke-opacity="0.50" stroke-width="7.5" stroke-linecap="round" filter="url(#tiny-${u})"/>
<path d="M468 516l-6 122" stroke="${FROID}" stroke-opacity="0.34" stroke-width="4.5" stroke-linecap="round" filter="url(#tiny-${u})"/>
<ellipse cx="400" cy="668" rx="63" ry="9" fill="${MIEL}" opacity="0.20"/>
</svg>`;
}

/* ---------- Bougie ---------- */

function candleSVG(label, tint) {
  return `
<svg viewBox="0 0 620 720" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  ${ambre('cg')}
  <linearGradient id="chaut" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0"    stop-color="${CHAUD_VIF}" stop-opacity="0.26"/>
    <stop offset="0.30" stop-color="${CHAUD}"     stop-opacity="0.07"/>
    <stop offset="0.62" stop-color="#3A1C06"      stop-opacity="0.16"/>
    <stop offset="1"    stop-color="#2A1405"      stop-opacity="0.44"/>
  </linearGradient>
  <linearGradient id="cw" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#CDC1A8"/><stop offset="0.30" stop-color="#F9F3E4"/>
    <stop offset="0.72" stop-color="#E4DAC2"/><stop offset="1" stop-color="#BCB097"/>
  </linearGradient>
  <filter id="b1" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" fill="url(#cg)"/>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" fill="url(#chaut)"/>
<path d="M202 380h216l-11 238a26 26 0 0 1-26 24H239a26 26 0 0 1-26-24z" stroke="#E7AE63" stroke-opacity="0.32" stroke-width="2"/>
<path d="M222 414h176l-9 196a16 16 0 0 1-16 15H247a16 16 0 0 1-16-15z" fill="url(#cw)" opacity="0.32"/>
<path d="M215 606h190l-2 12a26 26 0 0 1-26 24H243a26 26 0 0 1-26-24z" fill="#3A1C06" opacity="0.5"/>
<ellipse cx="310" cy="382" rx="108" ry="20" fill="#8A5116"/>
<ellipse cx="310" cy="381" rx="94" ry="17" fill="#EEE3C9"/>
<ellipse cx="310" cy="380" rx="78" ry="13" fill="#FCF5E1"/>
<path d="M310 358v24" stroke="#6B5A3E" stroke-width="4" stroke-linecap="round"/>
<rect x="226" y="462" width="168" height="108" rx="3" fill="#F3E8D2" opacity="0.94"/>
<rect x="226" y="462" width="168" height="7" rx="2" fill="${tint}" opacity="0.9"/>
<text x="310" y="508" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#3C2F1E">${label}</text>
<text x="308" y="534" text-anchor="middle" font-family="Georgia,serif" font-size="12" letter-spacing="4" fill="${tint}">CERA</text>
<text x="309" y="556" text-anchor="middle" font-family="Georgia,serif" font-size="10" letter-spacing="1.6" fill="#8A7859">180 G · CIRE DE SOJA</text>
<path d="M228 396l-7 216" stroke="#FFFFFF" stroke-opacity="0.46" stroke-width="8" stroke-linecap="round" filter="url(#b1)"/>
<path d="M396 402l-6 206" stroke="${FROID}" stroke-opacity="0.32" stroke-width="5" stroke-linecap="round" filter="url(#b1)"/>
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
<!-- celle du fond, légèrement plus petite et plus haute : c'est ce décalage
     qui donne la profondeur, pas un flou -->
<g opacity="0.95">
  <path d="M372 462 L352 556a66 17 0 0 0 132 0L462 462Z" fill="url(#body)"/>
  <ellipse cx="418" cy="572" rx="86" ry="27" fill="url(#halo-lens)"/>
  <ellipse cx="418" cy="558" rx="66" ry="16" fill="url(#lens)"/>
  <ellipse cx="418" cy="555" rx="47" ry="10" fill="#FFFDF4" opacity="0.85" filter="url(#ub)"/>
  <ellipse cx="417" cy="462" rx="45" ry="10" fill="#E6EAEF"/>
  <rect x="375" y="426" width="84" height="38" rx="7" fill="url(#col)"/>
  <ellipse cx="417" cy="426" rx="42" ry="8" fill="#EDF1F5" opacity="0.85"/>
  <path d="M397 410v16M437 410v16" stroke="#9AA4B0" stroke-width="8" stroke-linecap="round"/>
  <path d="M397 408v4M437 408v4" stroke="#DCE3EA" stroke-width="8" stroke-linecap="round"/>
  <path d="M368 472l-12 78" stroke="#FFFFFF" stroke-opacity="0.42" stroke-width="7" stroke-linecap="round" filter="url(#ub)"/>
</g>
<g>
  <path d="M228 452 L200 570a82 20 0 0 0 164 0L336 452Z" fill="url(#body)"/>
  <ellipse cx="282" cy="588" rx="106" ry="32" fill="url(#halo-lens)"/>
  <ellipse cx="282" cy="572" rx="82" ry="20" fill="url(#lens)"/>
  <ellipse cx="282" cy="568" rx="59" ry="12" fill="#FFFEF7" opacity="0.92" filter="url(#ub)"/>
  <ellipse cx="282" cy="452" rx="54" ry="12" fill="#E6EAEF"/>
  <rect x="236" y="410" width="92" height="44" rx="8" fill="url(#col)"/>
  <ellipse cx="282" cy="410" rx="46" ry="9" fill="#EDF1F5" opacity="0.85"/>
  <path d="M260 392v18M304 392v18" stroke="#9AA4B0" stroke-width="9" stroke-linecap="round"/>
  <path d="M260 390v4M304 390v4" stroke="#DCE3EA" stroke-width="9" stroke-linecap="round"/>
  <path d="M220 466l-16 96" stroke="#FFFFFF" stroke-opacity="0.44" stroke-width="9" stroke-linecap="round" filter="url(#ub)"/>
  <path d="M340 464l14 94" stroke="${FROID}" stroke-opacity="0.36" stroke-width="7" stroke-linecap="round" filter="url(#ub)"/>
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

/* ---------- Le plan de travail ---------- */

/* Le fil du bois est une turbulence très étirée : basse fréquence en x, haute
   en y. C'est le seul moyen, sans photo, d'obtenir une matière qui ne se répète
   pas. Les joints de lames se resserrent vers l'horizon — c'est la perspective
   qui fait qu'on lit une table et pas un aplat. */
function boisSVG(w, h, sombre) {
  const p = sombre
    ? { loin: '#241709', pres: '#6B4526', veine: '0.18 0.10 0.04', joint: '#140C05', lueur: '.10' }
    : { loin: '#6E4A26', pres: '#B98A53', veine: '0.30 0.18 0.08', joint: '#573818', lueur: '.14' };
  const joints = [0.04, 0.11, 0.21, 0.36, 0.58, 0.87].map(f =>
    `<rect x="0" y="${(h * f).toFixed(1)}" width="${w}" height="${Math.max(1, h * f * 0.03).toFixed(1)}" fill="${p.joint}" opacity="0.5"/>`
  ).join('');
  const [vr, vg, vb] = p.veine.split(' ');
  return `
<svg class="bois" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="fond-bois" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.loin}"/>
    <stop offset="0.45" stop-color="${p.pres}"/>
    <stop offset="1" stop-color="${p.loin}"/>
  </linearGradient>
  <filter id="veine" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.0022 0.09" numOctaves="5" seed="17"/>
    <feColorMatrix type="matrix"
      values="0 0 0 0 ${vr}  0 0 0 0 ${vg}  0 0 0 0 ${vb}  0 0 0 0.62 0"/>
  </filter>
  <filter id="veine2" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.0009 0.021" numOctaves="3" seed="4"/>
    <feColorMatrix type="matrix"
      values="0 0 0 0 ${vr}  0 0 0 0 ${vg}  0 0 0 0 ${vb}  0 0 0 0.40 0"/>
  </filter>
  <radialGradient id="vernis" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0"    stop-color="#FFD9A0" stop-opacity="1"/>
    <stop offset="0.24" stop-color="#FFD9A0" stop-opacity="0.72"/>
    <stop offset="0.46" stop-color="#FFD6A0" stop-opacity="0.40"/>
    <stop offset="0.66" stop-color="#FFD2A0" stop-opacity="0.18"/>
    <stop offset="0.84" stop-color="#FFCEA0" stop-opacity="0.05"/>
    <stop offset="1"    stop-color="#FFCEA0" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="fondu" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="0.55"/>
    <stop offset="0.22" stop-color="#000" stop-opacity="0.10"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect width="${w}" height="${h}" fill="url(#fond-bois)"/>
<rect width="${w}" height="${h}" filter="url(#veine2)" style="mix-blend-mode:multiply" opacity="0.7"/>
<rect width="${w}" height="${h}" filter="url(#veine)" style="mix-blend-mode:multiply"/>
${joints}
<!-- vernis : la table renvoie un peu du plafond -->
<ellipse cx="${w * 0.5}" cy="${h * 0.40}" rx="${w * 0.52}" ry="${h * 0.62}"
         fill="url(#vernis)" opacity="${p.lueur}" style="mix-blend-mode:screen"/>
<!-- assombrissement au contact du mur -->
<rect width="${w}" height="${h}" fill="url(#fondu)"/>
</svg>`;
}

/* ---------- Grain ---------- */

const GRAIN = `
<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>`;

/* ---------- Scène ---------- */

/* modes :
 *   bois      — mur clair chaud + chêne : la photo catalogue
 *   interior  — mur sombre + noyer : l'ambiance du soir
 *   studio    — fond dégradé neutre, pour les planches techniques
 */
function scene({ art, w, h, mode = 'bois', legende = '', scale = 0.74,
                 shiftX = 0, shiftY = 24, baseline = 0.9375, reflet = 0.20,
                 ombre = true }) {
  const studio = mode === 'studio';
  const sombre = mode === 'interior';
  const artH   = h * scale;
  const artTop = h / 2 + shiftY - artH / 2;
  const ground = Math.round(artTop + artH * baseline);
  const ech    = Math.min(scale / 0.74, 1.05);   // l'emprise au sol, elle, ne s'agrandit pas
  const shW    = Math.round(w * 0.50 * ech);
  const shH    = Math.round(h * 0.052 * ech);
  const horizon = Math.round(ground - h * 0.14);
  const surfH   = h - horizon;
  const artW    = Math.round(artH * 620 / 720);
  // une ombre prend la couleur de ce qui l'entoure : bleue sous un ciel de
  // studio, brune sur un plateau de chêne sous une lampe au tungstène
  const teinteOmbre = studio ? OMBRE : '52,34,18';

  const mur = studio
    ? 'radial-gradient(130% 100% at 46% 22%, #FFFDFA 0%, #F5F3EE 40%, #E6E4DD 74%, #D3D2CC 100%)'
    : sombre
      ? 'radial-gradient(95% 78% at 62% 30%, #55412B 0%, #2E2319 38%, #161109 72%, #090706 100%)'
      : 'radial-gradient(120% 96% at 50% 20%, #F6EBDA 0%, #E6D6BF 40%, #CDBA9E 74%, #AE9A7E 100%)';

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:#000}
  body{width:${w}px;height:${h}px;overflow:hidden;font-family:Georgia,serif}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;background:${mur}}

  .surface{position:absolute;left:0;right:0;bottom:0;height:${surfH}px;overflow:hidden}
  .surface .bois{position:absolute;inset:0;width:100%;height:100%;display:block}
  .surface.plat{background:linear-gradient(180deg, rgba(196,192,182,.34), rgba(160,156,146,.12) 34%, rgba(150,146,138,.05))}
  /* le pli mur/table : une ligne de contact, jamais un trait net */
  .pli{position:absolute;left:0;right:0;top:${horizon - Math.round(h * 0.03)}px;height:${Math.round(h * 0.06)}px;
    background:linear-gradient(180deg, rgba(0,0,0,0), rgba(${sombre ? '0,0,0' : '60,40,22'},.38));
    filter:blur(${Math.round(h * 0.008)}px)}

  ${studio || sombre ? '' : `
  /* ombre du sujet sur le mur : c'est la lumière de la pièce, pas celle de la lampe */
  .murombre{position:absolute;left:calc(50% + ${shiftX - Math.round(w * 0.11)}px);top:calc(50% + ${shiftY - Math.round(h * 0.02)}px);
    transform:translate(-50%,-50%) skewX(-7deg) scale(1.05);
    width:${artW}px;height:${artH}px;opacity:.13;filter:blur(${Math.round(h * 0.03)}px) brightness(0) saturate(0)}
  .murombre svg{width:100%;height:100%;display:block}`}

  ${sombre ? `
  .bokeh{position:absolute;border-radius:50%;filter:blur(34px)}
  .b1{width:180px;height:180px;left:5%;top:12%;background:${MIEL};opacity:.42}
  .b2{width:120px;height:120px;left:19%;top:44%;background:#8E5F27;opacity:.30}
  .b3{width:240px;height:240px;right:3%;top:6%;background:#6B4520;opacity:.30}` : ''}

  /* réflexion : l'objet retourné sous la ligne de sol, atténué et fondu.
     C'est ce qui fait qu'une surface se lit comme une surface. */
  .reflet{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translateX(-50%) scaleY(-1);
    width:${artW}px;height:${artH}px;opacity:${reflet};filter:blur(2.8px);
    -webkit-mask-image:linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.22) 34%, transparent 62%);
    mask-image:linear-gradient(to bottom, rgba(0,0,0,.85) 0%, rgba(0,0,0,.22) 34%, transparent 62%);
    pointer-events:none}
  .reflet svg{width:100%;height:100%;display:block}

  .pool{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-42%);
    width:${Math.round(w * 0.78 * ech)}px;height:${Math.round(h * 0.22)}px;
    mix-blend-mode:${studio ? 'normal' : 'screen'};
    background:radial-gradient(50% 50% at 50% 50%,
      rgba(255,198,116,${(studio ? .26 : sombre ? .40 : .32).toFixed(3)}) 0%,
      rgba(255,196,114,${(studio ? .20 : sombre ? .31 : .25).toFixed(3)}) 20%,
      rgba(255,192,110,${(studio ? .13 : sombre ? .20 : .16).toFixed(3)}) 38%,
      rgba(255,188,106,${(studio ? .07 : sombre ? .11 : .09).toFixed(3)}) 55%,
      rgba(255,184,100,${(studio ? .03 : sombre ? .05 : .04).toFixed(3)}) 72%,
      rgba(255,180,94,0.010) 86%, rgba(255,180,90,0) 100%);
    filter:blur(${Math.round(w * 0.05)}px)}

  .shadow{position:absolute;left:calc(50% + ${shiftX}px);top:${ground}px;
    transform:translate(-50%,-50%);width:${shW}px;height:${shH}px;border-radius:50%;
    background:rgba(${teinteOmbre},${studio ? .30 : sombre ? .62 : .46});filter:blur(${Math.round(w * 0.016)}px)}
  .shadow2{position:absolute;left:calc(50% + ${shiftX}px);top:${ground - Math.round(h * 0.006)}px;
    transform:translate(-50%,-50%);width:${Math.round(shW * 0.5)}px;height:${Math.round(shH * 0.4)}px;
    border-radius:50%;background:rgba(${teinteOmbre},${studio ? .40 : sombre ? .74 : .58});filter:blur(${Math.round(w * 0.006)}px)}

  .art{position:absolute;left:calc(50% + ${shiftX}px);top:calc(50% + ${shiftY}px);
    transform:translate(-50%,-50%);height:${artH}px;width:${artW}px}
  .art svg{width:100%;height:100%;display:block;
    filter:drop-shadow(0 ${Math.round(h * 0.012)}px ${Math.round(h * 0.028)}px rgba(${teinteOmbre},${studio ? .26 : .48}))}

  .vig{position:absolute;inset:0;pointer-events:none;
    background:radial-gradient(125% 95% at 48% 42%, transparent 40%, rgba(${studio ? '92,90,84' : sombre ? '0,0,0' : '44,30,16'},${studio ? .20 : sombre ? .58 : .34}) 100%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:${studio ? .042 : .055};
    mix-blend-mode:${studio ? 'multiply' : 'overlay'};pointer-events:none}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(h * 0.045)}px;text-align:center;
    font-size:${Math.round(h * 0.022)}px;letter-spacing:.2em;text-transform:uppercase;
    color:${studio ? 'rgba(86,89,79,.7)' : 'rgba(240,222,190,.62)'}}
</style></head><body>
<div class="scene">
  ${sombre ? '<div class="bokeh b1"></div><div class="bokeh b2"></div><div class="bokeh b3"></div>' : ''}
  ${studio || sombre ? '' : `<div class="murombre">${art}</div>`}
  <div class="surface${studio ? ' plat' : ''}">${studio ? '' : boisSVG(w, surfH, sombre)}</div>
  <div class="pli"></div>
  <div class="pool"></div>
  <div class="reflet">${art}</div>
  ${ombre ? '<div class="shadow"></div><div class="shadow2"></div>' : ''}
  <div class="art">${art}</div>
  <div class="vig"></div>
  ${GRAIN}
  ${legende ? `<div class="cap">${legende}</div>` : ''}
</div></body></html>`;
}

/* ---------- Scènes particulières ---------- */

function duoScene(w, h) {
  const arriere = lampSVG('ivoire', { glow: 0.85 }), avant = lampSVG('noir');
  const surfH = Math.round(h * .34);
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0}
  body{width:${w}px;height:${h}px;overflow:hidden}
  .scene{position:relative;width:${w}px;height:${h}px;overflow:hidden;
    background:radial-gradient(120% 96% at 50% 20%, #F6EBDA 0%, #E6D6BF 40%, #CDBA9E 74%, #AE9A7E 100%)}
  .surface{position:absolute;left:0;right:0;bottom:0;height:${surfH}px;overflow:hidden}
  .surface .bois{position:absolute;inset:0;width:100%;height:100%;display:block}
  .pli{position:absolute;left:0;right:0;bottom:${surfH - Math.round(h * .03)}px;height:${Math.round(h * .06)}px;
    background:linear-gradient(180deg, rgba(0,0,0,0), rgba(60,40,22,.38));filter:blur(${Math.round(h * .008)}px)}
  .pool{position:absolute;left:50%;transform:translateX(-50%);bottom:${Math.round(h * .12)}px;
    width:${Math.round(w * .74)}px;height:${Math.round(h * .18)}px;
    background:radial-gradient(50% 50% at 50% 50%, rgba(255,198,116,.50), rgba(255,180,90,0) 72%);
    filter:blur(${Math.round(w * .016)}px)}
  .unit{position:absolute;bottom:${Math.round(h * .14)}px}
  .back{left:${Math.round(w * .09)}px;height:${Math.round(h * .60)}px;filter:blur(2.6px);opacity:.88}
  .front{right:${Math.round(w * .07)}px;height:${Math.round(h * .70)}px}
  .unit svg{height:100%;width:auto;display:block;
    filter:drop-shadow(0 ${Math.round(h * .012)}px ${Math.round(h * .028)}px rgba(${OMBRE},.42))}
  .sh{position:absolute;border-radius:50%;background:rgba(${OMBRE},.46);filter:blur(${Math.round(w * .014)}px)}
  .sh-b{left:${Math.round(w * .08)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .30)}px;height:${Math.round(h * .042)}px}
  .sh-f{right:${Math.round(w * .06)}px;bottom:${Math.round(h * .125)}px;width:${Math.round(w * .34)}px;height:${Math.round(h * .05)}px}
  .vig{position:absolute;inset:0;background:radial-gradient(125% 95% at 48% 42%, transparent 40%, rgba(44,30,16,.34) 100%)}
  .grain{position:absolute;inset:0;width:100%;height:100%;opacity:.055;mix-blend-mode:overlay}
</style></head><body><div class="scene">
  <div class="surface">${boisSVG(w, surfH, false)}</div>
  <div class="pli"></div>
  <div class="pool"></div>
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
  ['lampe-noir',    scene({ art: lampSVG('noir'),   w: SQ, h: SQ, scale: .90, shiftY: -84, ombre: false })],
  ['lampe-ivoire',  scene({ art: lampSVG('ivoire'), w: SQ, h: SQ, scale: .90, shiftY: -84, ombre: false })],
  ['lampe-laiton',  scene({ art: lampSVG('laiton'), w: SQ, h: SQ, scale: .90, shiftY: -84, ombre: false })],
  ['bougie-cedre',   scene({ art: candleSVG('Cèdre', '#2C4739'),   w: SQ, h: SQ, scale: 1.30, baseline: .892, shiftY: -380 })],
  ['bougie-vanille', scene({ art: candleSVG('Vanille', '#7A5423'), w: SQ, h: SQ, scale: 1.30, baseline: .892, shiftY: -380 })],
  ['bougie-figue',   scene({ art: candleSVG('Figue', '#5B2B3E'),   w: SQ, h: SQ, scale: 1.30, baseline: .892, shiftY: -380 })],
  ['coffret',   scene({ art: boxSVG(),   w: SQ, h: SQ, scale: .95, baseline: .856, shiftY: -160 })],
  ['ampoules',  scene({ art: bulbsSVG(), w: SQ, h: SQ, scale: 1.15, baseline: .820, shiftY: -312 })],
  ['hero',      scene({ art: lampSVG('noir'), w: W, h: H, mode: 'interior', scale: .92, shiftX: 210, shiftY: -96, reflet: .14, ombre: false })],
  ['duo',       duoScene(SQ, SQ)],
  ['detail',    macroScene(W, H, { cible: lampSVG('noir'), scale: 2.0, top: 14, legende: 'La cire fond par le dessus' })],
  ['macro-abatjour', macroScene(SQ, SQ, { cible: lampSVG('laiton'), scale: 2.3, top: 58, legende: '35 W · 2700 K' })],
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
  await p.waitForTimeout(350);
  const f = `${OUT}/${nom}.jpg`;
  await p.screenshot({ path: f, type: 'jpeg', quality: 91 });
  await ctx.close();
  console.log('ok', nom, `${w}x${h}`, Math.round(fs.statSync(f).size / 1024) + 'kB');
}
await browser.close();
