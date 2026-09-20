# La vitrine Shopify

## Ce qui a été fait

Le thème **« CERA — vitrine »** (anciennement « Copie de Dawn ») sur
`954abe-d3.myshopify.com`. Il est **non publié** : la boutique continue de tourner sur Dawn
par défaut tant que tu ne l'actives pas. Zéro risque.

| Fichier | Ce qu'il fait |
|---|---|
| `config/settings_data.json` | Palette CERA sur les 5 schémas de couleur, typographie, rayons, cartes, panier en tiroir |
| `templates/index.json` | La page d'accueil : 6 sections |

### La page d'accueil

1. **Bandeau plein écran** — la scène d'intérieur au crépuscule, « Faire fondre, pas brûler. »,
   deux boutons vers la fiche produit et la collection
2. **Texte** — « Ce que la flamme coûte à votre bougie »
3. **Trois colonnes** — la cire disparaît / la suie s'accroche / la vigilance vous suit
4. **Bandeau détail** — le gros plan du bain de cire, « La chaleur vient du dessus »
5. **Collection** — les 4 produits, image portrait, ajout rapide
6. **Quatre garanties** — livraison, expédition, essai, paiement

### La palette

| Schéma | Usage |
|---|---|
| 1 | Papier blanc, encre `#191A18`, bouton vert pin `#2C4739` |
| 2 | Papier cassé `#F6F6F3` — cartes produits, bandeau garanties |
| 3 | Sombre `#141613`, bouton miel `#F0C46B` — les deux bandeaux image |
| 4 | Vert pin plein |
| 5 | Vert très clair `#E9F0EA` — badges promo |

Typographie : **Archivo** pour les titres, **Lora** pour le texte courant. Ce sont des polices
de la bibliothèque Shopify, donc modifiables en deux clics dans l'éditeur de thème si elles ne
te plaisent pas.

## ⚠️ Ce que je n'ai pas pu vérifier

**Je n'ai pas vu le résultat.** La vitrine est protégée par mot de passe *et* injoignable
depuis le réseau de cet environnement — impossible d'en faire une capture. Shopify a validé
les deux fichiers à l'écriture (il a d'ailleurs refusé une première version : valeurs
numériques hors pas, description non balisée), et le thème ne signale aucune erreur de
traitement. Mais **la validation n'est pas un aperçu** : le rendu réel est à contrôler par toi.

## Prévisualiser, puis publier

1. Shopify admin → **Boutique en ligne → Thèmes**
2. Trouve **« CERA — vitrine »** dans « Autres thèmes »
3. **⋯ → Aperçu** — c'est là que tu vois vraiment le résultat
4. Si ça te va : **Publier**. Sinon, dis-moi ce qui cloche et je corrige.

Pour revenir en arrière à tout moment : republie « Dawn ». Rien n'est perdu.

## Ce qui reste à faire à la main

| | Où |
|---|---|
| Nom de la boutique (« Ma boutique ») | Paramètres → Détails de la boutique |
| Logo | Éditeur de thème → En-tête → Logo |
| Menus de navigation | Boutique en ligne → Navigation |
| Retirer le mot de passe | Boutique en ligne → Préférences |
| Fournisseur de paiement | Paramètres → Paiements |
| Pages légales à publier | Boutique en ligne → Pages (3 en brouillon) |

## Réappliquer ces fichiers

Les deux fichiers de ce dossier sont la source. Pour les repousser après modification, c'est
la mutation `themeFilesUpsert` sur le thème `gid://shopify/OnlineStoreTheme/207238496598`,
ou un copier-coller dans **Thèmes → ⋯ → Modifier le code**.

⚠️ L'éditeur de thème Shopify réécrit ces fichiers quand on modifie une section à la souris.
Si tu personnalises dans l'éditeur, ce dossier devient obsolète — resynchronise-le depuis
« Modifier le code » plutôt que d'écraser ton travail.
