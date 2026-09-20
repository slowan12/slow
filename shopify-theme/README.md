# La vitrine Shopify

## Ce qui a été fait

Le thème **« CERA — vitrine »** (anciennement « Copie de Dawn ») sur
`954abe-d3.myshopify.com`. Il est **non publié** : la boutique continue de tourner sur Dawn
par défaut tant que tu ne l'actives pas. Zéro risque.

| Fichier | Ce qu'il fait |
|---|---|
| `config/settings_data.json` | Palette CERA sur les 5 schémas de couleur, typographie, rayons, cartes, panier en tiroir, **logo et favicon** |
| `templates/index.json` | La page d'accueil : 6 sections |
| `templates/product.json` | La fiche produit : galerie à vignettes, zoom, volets repliables, produits associés |
| `templates/collection.json` | Le catalogue : images portrait, ajout rapide, bandeau de garanties |
| `sections/header-group.json` | Bandeau d'annonce et en-tête |
| `sections/footer-group.json` | Pied de page : marque, liens d'aide, moyens de paiement |

### Le nom affiché

Le nom au niveau du compte est toujours « Ma boutique », et **l'API Shopify ne permet pas de
le changer** — la documentation est explicite sur la ressource `Shop` : *« it doesn't let you
update any information. Only the merchant can update this information from inside the Shopify
admin. »*

Mais ce n'est pas ce nom que voient tes clients. Dawn affiche **le logo** à la place de
`shop.name` dès qu'un logo est défini. Le logotype CERA est donc généré
(`site/visuels/render-logo.mjs`), téléversé, et câblé dans les réglages du thème — avec le
favicon assorti pour l'onglet du navigateur.

Il reste un seul endroit où « Ma boutique » transparaît : le **titre de l'onglet** sur les
pages autres que l'accueil, que Dawn construit avec `shop.name`, et les **e-mails de
confirmation de commande**. D'où l'intérêt de faire quand même le renommage en deux clics.

### La page d'accueil

1. **Bandeau plein écran** — la scène d'intérieur au crépuscule, « Faire fondre, pas brûler. »,
   deux boutons vers la fiche produit et la collection
2. **Texte** — « Ce que la flamme coûte à votre bougie »
3. **Trois colonnes** — la cire disparaît / la suie s'accroche / la vigilance vous suit
4. **Bandeau détail** — le gros plan du bain de cire, « La chaleur vient du dessus »
5. **Collection** — les 4 produits, image portrait, ajout rapide
6. **Quatre garanties** — livraison, expédition, essai, paiement

### La fiche produit

Galerie à vignettes avec zoom en lightbox, colonne d'achat collante au défilement, puis
trois volets repliables — caractéristiques, livraison, retours. En dessous, trois arguments
et les produits associés.

La fiche lampe porte désormais **sept visuels** : plan principal, macro de l'abat-jour, plan
détail du bain de cire, cotes, les deux autres coloris, et le duo.

⚠️ Un bloc `icon_with_text` a été refusé — il n'existe pas dans le schéma de cette version de
Dawn. Retiré ; les garanties sont portées par la section en dessous.

### La navigation

Les deux menus étaient génériques — « Accueil / Catalogue / Contact » et un pied de page
réduit à « Recherche ». Refaits via l'API :

- **Menu principal** : Accueil · La lampe · Boutique *(sous-menu des 4 produits)* · Aide
- **Pied de page** : FAQ · Livraison · Rétractation et retours · CGV · Mentions légales ·
  Nous contacter

⚠️ Quatre de ces liens pointent vers des pages **non publiées**. Elles renverront une erreur
tant que les champs entre crochets ne sont pas remplis — voir
`boutique/pages-legales/_a-completer.md`. Le menu est correct ; ce sont les pages qui attendent.

### Ce qui parlait encore anglais

Le thème affichait **« Welcome to our store »** dans le bandeau d'annonce et **« Subscribe to
our emails »** en pied de page. C'est le genre de détail qui fait amateur en trois secondes.
Remplacés, et les sélecteurs de pays et de langue sont désactivés : une boutique qui ne livre
qu'en France n'a rien à faire d'un sélecteur de devise.

### Un volet qui mentait

Le gabarit de fiche produit portait un volet « Caractéristiques » **écrit en dur avec les specs
de la lampe** — il se serait affiché à l'identique sur le coffret, la bougie et les ampoules.
Retiré : les caractéristiques appartiennent au produit, pas au gabarit. Chaque fiche porte
désormais son propre tableau dans sa description. Les volets Livraison et Retours restent au
gabarit, parce qu'eux sont réellement communs.

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
| Nom du compte (titre d'onglet, e-mails) | Paramètres → Détails de la boutique |
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
