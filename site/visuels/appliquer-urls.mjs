/* Bascule les visuels du site vers d'autres sources (URLs fournisseur, CDN Shopify…).
 *
 *   node appliquer-urls.mjs urls.json
 *
 * urls.json : { "lampe-noir": "https://ae01.alicdn.com/...jpg", ... }
 * Les clés absentes gardent leur valeur actuelle. */

import fs from 'node:fs';
import path from 'node:path';

const CLES = ['lampe-noir', 'lampe-ivoire', 'lampe-laiton', 'detail', 'hero', 'duo',
              'coffret', 'bougie-cedre', 'bougie-vanille', 'bougie-figue', 'ampoules'];

const src = process.argv[2];
if (!src) { console.error('usage : node appliquer-urls.mjs urls.json'); process.exit(1); }

const nouvelles = JSON.parse(fs.readFileSync(src, 'utf8'));
const inconnues = Object.keys(nouvelles).filter(k => !CLES.includes(k));
if (inconnues.length) {
  console.error('clé(s) inconnue(s) :', inconnues.join(', '));
  console.error('clés valides       :', CLES.join(', '));
  process.exit(1);
}

const page = path.join(import.meta.dirname, '..', 'vitrine.html');
let html = fs.readFileSync(page, 'utf8');

const debut = html.indexOf('  var VISUELS = {');
const fin = html.indexOf('};', debut) + 2;
if (debut < 0 || fin < 2) { console.error('bloc VISUELS introuvable dans vitrine.html'); process.exit(1); }

// relire les valeurs en place pour ne remplacer que ce qui est fourni
const actuel = {};
for (const ligne of html.slice(debut, fin).split('\n')) {
  const m = ligne.match(/"([^"]+)":\s*"([^"]*)"/);
  if (m) actuel[m[1]] = m[2];
}

const largeur = Math.max(...CLES.map(k => k.length)) + 3;
const lignes = CLES.map((k, i) => {
  const val = nouvelles[k] ?? actuel[k] ?? '';
  const cle = `"${k}":`.padEnd(largeur + 1);
  return `    ${cle} ${JSON.stringify(val)}${i < CLES.length - 1 ? ',' : ''}`;
});

html = html.slice(0, debut) + '  var VISUELS = {\n' + lignes.join('\n') + '\n  };' + html.slice(fin);
fs.writeFileSync(page, html);

const changees = Object.keys(nouvelles).filter(k => nouvelles[k] !== actuel[k]);
console.log(`${changees.length} visuel(s) mis à jour : ${changees.join(', ') || '(aucun)'}`);
console.log('Les images distantes ne sont pas téléchargées : le navigateur du visiteur les charge.');
