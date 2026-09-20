import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const OUT = '/tmp/claude-0/-home-user-slow/6ef3e119-e28c-54cd-9758-12438b36c393/scratchpad/img';
const S = 1600;

const P = {
  paper: '#FFFFFF', paperAlt: '#F6F6F3', ink3: '#8B8E84',
  pine: '#2C4739', pineTint: '#E9F0EA',
  honey: '#C4862B', honeyLit: '#F0C46B', wax: '#E6DFCE',
};

const lamp = (body, outline) => `
<svg viewBox="0 0 200 220" fill="none">
  <path d="M100 44v34" stroke="${body}" stroke-width="4" stroke-linecap="round"/>
  <path d="M100 46c0-13-10-20-22-20H54c-6 0-10 4-10 10v138" stroke="${body}" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="44" cy="176" rx="34" ry="7" fill="${body}"/>
  <path d="M72 60h56l-7 26H79z" fill="${body}" ${outline ? `stroke="${P.ink3}" stroke-width="1.2"` : ''}/>
  <ellipse cx="100" cy="86" rx="21" ry="4.6" fill="${P.honeyLit}"/>
  <path d="M81 90h38l7 42H74z" fill="${P.honey}" opacity="0.11"/>
  <path d="M78 126h44l-3 42a5 5 0 0 1-5 4.6H86a5 5 0 0 1-5-4.6z" stroke="${P.ink3}" stroke-width="1.6"/>
  <path d="M81 138h38l-2.6 30a3 3 0 0 1-3 2.8H86.6a3 3 0 0 1-3-2.8z" fill="${P.wax}"/>
  <ellipse cx="100" cy="138" rx="19" ry="3.4" fill="${P.honeyLit}"/>
  <path d="M100 130v7" stroke="${P.ink3}" stroke-width="1.6" stroke-linecap="round"/>
</svg>`;

const candle = (label) => `
<svg viewBox="0 0 200 220" fill="none">
  <path d="M62 64h76l-6 106a8 8 0 0 1-8 7.4H76a8 8 0 0 1-8-7.4z" stroke="${P.ink3}" stroke-width="1.8"/>
  <path d="M68 84h64l-5 84a5 5 0 0 1-5 4.6H78a5 5 0 0 1-5-4.6z" fill="${P.wax}"/>
  <ellipse cx="100" cy="84" rx="32" ry="5.6" fill="${P.honeyLit}"/>
  <path d="M100 72v12" stroke="${P.ink3}" stroke-width="1.8" stroke-linecap="round"/>
  <rect x="72" y="112" width="56" height="34" rx="2" fill="${P.paper}" stroke="${P.ink3}" stroke-width="1.4"/>
  <text x="100" y="133" text-anchor="middle" font-family="Georgia,serif" font-size="9" fill="${P.pine}">${label}</text>
</svg>`;

const box = () => `
<svg viewBox="0 0 200 220" fill="none">
  <path d="M36 84h128l-8 92H44z" stroke="${P.ink3}" stroke-width="1.8"/>
  <path d="M28 62h144l-6 22H34z" fill="${P.pineTint}" stroke="${P.ink3}" stroke-width="1.8"/>
  <path d="M92 62h16v114H92z" fill="${P.pine}" opacity="0.55"/>
  <path d="M100 62c-12-14-24-20-31-13-6 6 1 13 31 13 30 0 37-7 31-13-7-7-19-1-31 13Z" fill="${P.pine}" opacity="0.8"/>
</svg>`;

const bulbs = () => `
<svg viewBox="0 0 200 220" fill="none">
  <g transform="translate(-14 4)">
    <path d="M72 92h56l-10 52a10 10 0 0 1-10 8h-16a10 10 0 0 1-10-8z" stroke="${P.ink3}" stroke-width="1.8"/>
    <ellipse cx="100" cy="146" rx="16" ry="5.4" fill="${P.honeyLit}"/>
    <rect x="78" y="74" width="44" height="18" rx="3" fill="${P.ink3}" opacity="0.35" stroke="${P.ink3}" stroke-width="1.6"/>
    <path d="M86 66v9M114 66v9" stroke="${P.ink3}" stroke-width="2.4" stroke-linecap="round"/>
  </g>
  <g transform="translate(40 40) scale(0.76)">
    <path d="M72 92h56l-10 52a10 10 0 0 1-10 8h-16a10 10 0 0 1-10-8z" stroke="${P.ink3}" stroke-width="2.2"/>
    <rect x="78" y="74" width="44" height="18" rx="3" fill="${P.paper}" stroke="${P.ink3}" stroke-width="2.2"/>
    <path d="M86 66v9M114 66v9" stroke="${P.ink3}" stroke-width="3" stroke-linecap="round"/>
  </g>
</svg>`;

// duo: two lamps side by side (the "lot de 2" offer)
const duo = () => `
<svg viewBox="0 0 200 220" fill="none">
  <g transform="translate(-30 18) scale(0.82)">${lamp('#26282A', false).replace(/<\/?svg[^>]*>/g, '')}</g>
  <g transform="translate(58 18) scale(0.82)">${lamp('#DED8CB', true).replace(/<\/?svg[^>]*>/g, '')}</g>
</svg>`;

const page = (inner, caption) => `<!doctype html><html><head><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0}
  body{width:${S}px;height:${S}px;display:grid;place-items:center;
       background:radial-gradient(ellipse at 50% 38%, ${P.paper} 0%, ${P.paperAlt} 72%, #ECECE7 100%);
       font-family:Georgia, 'Times New Roman', serif;}
  .stage{position:relative;width:${S}px;height:${S}px;display:grid;place-items:center}
  .shadow{position:absolute;left:50%;top:78%;transform:translate(-50%,-50%);
          width:${Math.round(S*0.46)}px;height:${Math.round(S*0.06)}px;border-radius:50%;
          background:rgba(25,26,24,.12);filter:blur(${Math.round(S*0.022)}px)}
  .art{position:relative;width:${Math.round(S*0.62)}px;height:${Math.round(S*0.68)}px}
  .art svg{width:100%;height:100%;display:block;
           filter:drop-shadow(0 ${Math.round(S*0.012)}px ${Math.round(S*0.024)}px rgba(25,26,24,.10))}
  .cap{position:absolute;left:0;right:0;bottom:${Math.round(S*0.055)}px;text-align:center;
       font-size:${Math.round(S*0.024)}px;letter-spacing:.14em;text-transform:uppercase;
       color:${P.ink3}}
</style></head><body>
<div class="stage"><div class="shadow"></div><div class="art">${inner}</div>
${caption ? `<div class="cap">${caption}</div>` : ''}</div>
</body></html>`;

const jobs = [
  ['lampe-noir.png',   lamp('#26282A', false), 'Lueur — Noir mat'],
  ['lampe-ivoire.png', lamp('#DED8CB', true),  'Lueur — Blanc ivoire'],
  ['lampe-laiton.png', lamp('#B08D57', false), 'Lueur — Laiton brossé'],
  ['duo.png',          duo(),                  'Duo Lueur — lot de 2'],
  ['coffret.png',      box(),                  'Coffret Lueur'],
  ['bougie-cedre.png',   candle('Cèdre'),   'Bois de cèdre — 180 g'],
  ['bougie-vanille.png', candle('Vanille'), 'Vanille &amp; ambre — 180 g'],
  ['bougie-figue.png',   candle('Figue'),   'Figue &amp; cassis — 180 g'],
  ['ampoules.png',     bulbs(),                'Ampoules GU10 — lot de 2'],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width: S, height: S }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
for (const [name, svg, cap] of jobs) {
  await p.setContent(page(svg, cap), { waitUntil: 'load' });
  await p.screenshot({ path: `${OUT}/${name}`, type: 'png' });
  console.log('ok', name, fs.statSync(`${OUT}/${name}`).size);
}
await browser.close();
