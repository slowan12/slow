# CERA — boutique Shopify hiver 2026

Kit complet pour lancer une boutique mono-produit autour d'une **lampe chauffe-bougie**,
produit retenu après comparaison de 6 candidats hivernaux.

**Boutique concernée :** `954abe-d3.myshopify.com` — plan Basic, EUR, France.
La boutique est **montée et active**. Ce qu'il reste à faire tient dans quatre actions que je ne
peux pas exécuter à ta place — elles demandent ton navigateur ou ta carte. Elles sont listées
en bas de ce fichier.

## Ce qui est en ligne sur Shopify

**Les 4 produits sont actifs et publiés sur la Boutique en ligne**, visuels compris.

| Élément | Prix | Statut |
|---|---|---|
| Lampe Chauffe-Bougie CERA (3 coloris) | 44,90 € / 49,90 € | **Actif, 5 visuels** |
| Coffret CERA (lampe + 2 bougies) | 59,90 € | **Actif, 1 visuel** |
| Bougie parfumée 180 g (3 parfums) | 19,90 € | **Actif, 3 visuels** |
| Ampoules GU10, lot de 2 | 9,90 € | **Actif, 1 visuel** |
| Collection « Collection Hiver — CERA » | — | Créée |
| Collection « Idées cadeaux » (automatique, par tag) | — | Créée |
| Promotion automatique « La 2ᵉ lampe à −15 % » | — | **Active** |
| Page « Questions fréquentes » | — | **Publiée** |
| Pages Livraison, Mentions légales, Rétractation | — | Créées, **non publiées** |

**Suivi de stock désactivé** sur toutes les variantes — c'est le réglage correct en
dropshipping : aucune vente n'est bloquée par un compteur qui ne reflète rien. Les poids sont
renseignés (700 g la lampe, 1 150 g le coffret, 330 g la bougie, 90 g les ampoules).

### Deux choses délibérément laissées en attente

**Les trois pages légales ne sont pas publiées.** Elles contiennent encore des champs entre
crochets — `[Raison sociale]`, `[SIREN]`, `[contact@domaine.fr]`, le médiateur de la
consommation. Une page de mentions légales en ligne avec « [Raison sociale] » écrit dessus est
pire que pas de page du tout. Remplis les crochets, puis passe-les en visibles.

**Les visuels sont des rendus, pas des photographies.** Impossible de photographier un article
qui n'a pas été commandé, et reprendre les images du fournisseur pose un double problème —
droits d'image et fiche produit identique à celle de tous les autres vendeurs. Ce sont donc des
rendus composés en SVG/CSS (matières, éclairage directionnel, ombre de contact, profondeur de
champ, grain), générés par `site/visuels/render-photo.mjs`. Détail dans
`site/visuels/README.md`. **Remplace-les par de vraies photos dès réception de l'échantillon** :
c'est ce qui convertit.

## Le dépôt

```
analyse/analyse-import-hiver-2026.md  Analyse de marché : droit de 3 €, filtre import, verdict
analyse/analyse-produits.md     Comparaison des 6 produits, matrice de scoring, économie unitaire
marketing/angles-publicitaires.md  4 angles, budget de test, règles de coupe
marketing/scripts-ugc.md        5 scripts vidéo prêts à tourner
boutique/faq.md                 FAQ à coller sur la fiche produit
boutique/emails-relance.md      Séquences panier abandonné et post-achat
boutique/pages-legales/         Modèles : mentions légales, livraison, rétractation
ops/checklist-lancement.md      Ordre d'exécution avant la première pub
ops/conformite-ce-gpsr.md       CE, GPSR, DEEE — obligatoire sur un produit électrique
ops/dsers-connexion.md          Installation DSers, mapping, grille de sourcing, seuils
marketing/nom-de-marque.md      Le nom CERA : pourquoi, et ce qui reste a verifier
site/visuels/photos-fournisseur.md  Basculer le site et Shopify sur les photos AliExpress
shopify-import/produits.csv     Sauvegarde / réimport du catalogue
```

## Le résumé en trois chiffres

- **22,87 €** de marge brute par lampe vendue à 44,90 € (TVA 20 % et frais de paiement déduits).
- **1,96** de ROAS au point mort. En dessous, tu perds de l'argent.
- **22 €** de CPA maximum. Au-delà, coupe.

## Les quatre choses à faire avant de dépenser en publicité

Aucune ne peut être faite à ta place — les trois premières demandent ton navigateur ou ta carte.

1. **Installer DSers et mapper les variantes.** L'installation d'une app Shopify passe par un
   consentement OAuth sous ton compte : l'API ne le permet pas à un tiers. Vingt minutes,
   pas à pas dans `ops/dsers-connexion.md`. Une variante non mappée = une commande qui échoue
   après que tu as payé la publicité.
2. **Remplir les trois pages légales et les publier.** Elles sont créées mais masquées tant que
   les crochets ne sont pas remplis.
3. **Commander un échantillon.** Tu ne peux pas vendre un appareil électrique que tu n'as pas
   tenu en main, ni filmer des créas sans lui — ni remplacer les illustrations par de vraies
   photos.
4. **Obtenir la déclaration UE de conformité** (marquage CE) et **vérifier la saturation** dans
   la Meta Ad Library, filtre France. Sans le premier document, ne vends pas. Le second est le
   risque numéro un de ce produit, documenté sans être minimisé dans l'analyse.

## Avertissements

- Les chiffres de l'analyse sont des **estimations de marché** issues de la recherche sectorielle
  2026, pas des données scrapées en direct. Les vérifications de `analyse/analyse-produits.md`
  §6 sont à faire avant tout engagement budgétaire.
- Le nom **CERA** est posé partout (site, Shopify, SKU, documents) mais **son antériorité
  n'a pas pu être vérifiée** depuis cet environnement. Recherche INPI classes 4, 11 et 3 avant
  toute dépense publicitaire — voir `marketing/nom-de-marque.md`.
- Les pages légales sont des **modèles à compléter et à faire relire**, pas des documents validés.
- Rien ici n'est un conseil juridique, comptable ou financier.

## Le site

`site/vitrine.html` — boutique complete, publiee ici :
https://claude.ai/artifact/RfYSscVv9ia1i4bHmGzo4Y

Quatre pages avec navigation par ancre (`#/`, `#/lampe`, `#/boutique`, `#/aide`,
`#/panier`) : accueil, fiche produit avec selecteur de coloris, catalogue, aide et
panier fonctionnel (ajout, quantites, retrait, sous-total, persistance locale).

Le site est desormais porte par l'image : bandeau d'accueil pleine largeur sur une scene
d'interieur au crepuscule, second bandeau sur le plan detail du bain de cire, galerie produit
avec les trois coloris et le plan rapproche, vignettes de catalogue en 4/5.

Direction artistique : papier blanc, encre neutre, un vert pin comme unique couleur
de marque, un miel reserve a la lumiere de l'ampoule. Typographie Schibsted Grotesk
(structure) et Newsreader (texte courant). Themes clair et sombre.

Les visuels sont generes par `site/visuels/render-photo.mjs` (Chromium headless) et
stockes dans `site/visuels/photo/`. Ce sont des rendus, pas des photographies — voir
`site/visuels/README.md`. Le paiement n'est pas connecte.

Toutes les sources d'images sont regroupees dans une table `VISUELS` unique, en tete du
script de `vitrine.html`. Chaque valeur accepte un chemin local ou une URL absolue, ce qui
permet de basculer sur les photos du fournisseur sans toucher au reste :
`node site/visuels/appliquer-urls.mjs urls.json`. Procedure complete dans
`site/visuels/photos-fournisseur.md`.
