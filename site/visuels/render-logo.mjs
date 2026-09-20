/* Logotype CERA pour l'en-tête Shopify + favicon.
   PNG à fond transparent : Dawn affiche le logo à la place de shop.name. */

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(import.meta.dirname, 'photo');
fs.mkdirSync(OUT, { recursive: true });

const PINE = '#2C4739', HONEY = '#C4862B', HONEY_LIT = '#F0C46B', INK = '#191A18';

/* La marque : une nappe de lumière au-dessus d'un pot de cire.
   Même géométrie que le logo du site, pour que les deux coïncident. */
const marque = (taille) => `
<svg viewBox="0 0 24 24" width="${taille}" height="${taille}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="12" cy="7.5" rx="7" ry="2.6" fill="${HONEY}"/>
  <path d="M6 12h12l-1.3 8.2a1.6 1.6 0 0 1-1.6 1.3H8.9a1.6 1.6 0 0 1-1.6-1.3z" fill="${PINE}"/>
  <ellipse cx="12" cy="12" rx="6" ry="1.9" fill="${HONEY_LIT}"/>
</svg>`;

const page = (inner, w, h) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0;background:transparent}
  body{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;gap:${Math.round(h*0.16)}px}
  .mot{font-family:Archivo,'Helvetica Neue',Arial,sans-serif;font-weight:600;
       font-size:${Math.round(h*0.56)}px;letter-spacing:${Math.round(h*0.09)}px;
       color:${INK};line-height:1;padding-left:${Math.round(h*0.09)}px}
</style></head><body>${inner}</body></html>`;

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
});

const jobs = [
  ['cera-logo', 900, 240, page(`${marque(140)}<span class="mot">CERA</span>`, 900, 240)],
  ['cera-favicon', 256, 256, page(marque(200), 256, 256)],
];

for (const [nom, w, h, html] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.setContent(html, { waitUntil: 'load' });
  // la police distante peut être injoignable ici : on n'attend pas indéfiniment
  await p.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 6000 })
    .catch(() => console.log(`  (${nom} : police de repli)`));
  await p.waitForTimeout(250);
  await p.screenshot({ path: `${OUT}/${nom}.png`, type: 'png', omitBackground: true });
  await ctx.close();
  console.log('ok', nom, `${w}x${h}`, Math.round(fs.statSync(`${OUT}/${nom}.png`).size / 1024) + 'kB');
}
await browser.close();
