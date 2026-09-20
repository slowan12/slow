# Lueur Maison — boutique Shopify hiver 2026

Kit complet pour lancer une boutique mono-produit autour d'une **lampe chauffe-bougie**,
produit retenu après comparaison de 6 candidats hivernaux.

**Boutique concernée :** `954abe-d3.myshopify.com` — plan Basic, EUR, France.
Les produits ont été créés **en brouillon** : rien n'est visible publiquement tant que tu ne
les passes pas en « Actif ».

## Ce qui a été créé sur Shopify

| Élément | Prix | Statut |
|---|---|---|
| Lampe Chauffe-Bougie Lueur (3 coloris) | 44,90 € / 49,90 € | Brouillon |
| Coffret Lueur (lampe + 2 bougies) | 59,90 € | Brouillon |
| Bougie parfumée 180 g (3 parfums) | 19,90 € | Brouillon |
| Ampoules GU10, lot de 2 | 9,90 € | Brouillon |
| Collection « Collection Hiver — Lueur Maison » | — | Créée |
| Collection « Idées cadeaux » (automatique, par tag) | — | Créée |

**Il manque les images** : `create-product` n'accepte que des URL publiques, et utiliser les
visuels du fournisseur pose un problème de droits comme de différenciation. Photographie ton
échantillon — c'est de toute façon ce qui convertit le mieux.

## Le dépôt

```
analyse/analyse-produits.md     Comparaison des 6 produits, matrice de scoring, économie unitaire
marketing/angles-publicitaires.md  4 angles, budget de test, règles de coupe
marketing/scripts-ugc.md        5 scripts vidéo prêts à tourner
boutique/faq.md                 FAQ à coller sur la fiche produit
boutique/emails-relance.md      Séquences panier abandonné et post-achat
boutique/pages-legales/         Modèles : mentions légales, livraison, rétractation
ops/checklist-lancement.md      Ordre d'exécution avant la première pub
ops/conformite-ce-gpsr.md       CE, GPSR, DEEE — obligatoire sur un produit électrique
shopify-import/produits.csv     Sauvegarde / réimport du catalogue
```

## Le résumé en trois chiffres

- **22,87 €** de marge brute par lampe vendue à 44,90 € (TVA 20 % et frais de paiement déduits).
- **1,96** de ROAS au point mort. En dessous, tu perds de l'argent.
- **22 €** de CPA maximum. Au-delà, coupe.

## Les trois choses à faire avant de dépenser en publicité

1. **Commander un échantillon.** Tu ne peux pas vendre un appareil électrique que tu n'as pas
   tenu en main, ni filmer des créas sans lui.
2. **Obtenir la déclaration UE de conformité** du fournisseur (marquage CE). Sans ce document,
   ne vends pas — voir `ops/conformite-ce-gpsr.md`.
3. **Vérifier la saturation actuelle** dans la Meta Ad Library, filtre France. C'est le risque
   numéro un de ce produit, et il est documenté sans être minimisé dans l'analyse.

## Avertissements

- Les chiffres de l'analyse sont des **estimations de marché** issues de la recherche sectorielle
  2026, pas des données scrapées en direct. Les vérifications de `analyse/analyse-produits.md`
  §6 sont à faire avant tout engagement budgétaire.
- « Lueur Maison » est une **proposition de nom**. Vérifie la disponibilité sur
  [data.inpi.fr](https://data.inpi.fr) et celle du domaine avant de l'utiliser.
- Les pages légales sont des **modèles à compléter et à faire relire**, pas des documents validés.
- Rien ici n'est un conseil juridique, comptable ou financier.
