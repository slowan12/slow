# Visuels produits

JPEG générés par `render-photo.mjs` (Chromium headless via Playwright), utilisés par
`site/vitrine.html` et par les 4 fiches produits Shopify.

```
node render-photo.mjs            # écrit dans ./photo
```

## Ce que c'est, et ce que ce n'est pas

**Ce ne sont pas des photographies.** Aucun échantillon n'a été commandé, et les banques
d'images ne sont pas joignables depuis l'environnement où ces fichiers ont été produits.
Ce sont des **rendus** composés en SVG et CSS : matières (métal brossé, verre, cire),
éclairage directionnel chaud, ombre de contact, profondeur de champ, grain.

C'est délibérément préférable aux visuels du fournisseur, qui posent un problème de droits
et donnent une fiche produit identique à celle de tous les autres vendeurs. Mais **ça ne
convertira pas aussi bien qu'une vraie photo** : remplace-les dès réception de l'échantillon.

## Le principe de la scène

Chaque objet déclare son `baseline` — la hauteur, dans son propre viewBox, où il touche le
plan. L'ombre de contact, la nappe de lumière et l'arête mur/plan en sont déduites. Sans ça,
un objet rendu à une autre échelle flotte au-dessus de son ombre : c'est le défaut qui trahit
le plus sûrement un rendu.

## Les fichiers

| Fichier | Usage |
|---|---|
| `lampe-noir` / `-ivoire` / `-laiton` | Fiche produit, sélecteur de coloris |
| `detail` | Bandeau « la chaleur vient du dessus » + galerie produit |
| `hero` | Bandeau d'accueil, scène d'intérieur au crépuscule |
| `duo` | Offre « la 2ᵉ lampe à −15 % » |
| `coffret`, `bougie-*`, `ampoules` | Catalogue et fiches |

Les couleurs suivent la charte de `site/vitrine.html` : papier, vert pin, miel.
