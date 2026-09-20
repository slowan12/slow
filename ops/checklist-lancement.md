# Checklist de lancement — CERA

Ordre d'exécution. Ne lance pas de publicité tant que la section 1 n'est pas cochée en entier.

## 1. Bloquants absolus (avant toute publicité)

- [ ] **Commander un échantillon** et le recevoir. Vérifier : qualité réelle, hauteur, bruit du
      ventilateur éventuel, conformité de la prise (type E française), présence du marquage CE.
- [ ] **Récupérer la déclaration UE de conformité** auprès du fournisseur (directives Basse
      Tension 2014/35/UE et CEM 2014/30/UE). Sans ce document, ne vends pas.
- [ ] **Photos et vidéos maison.** Les visuels du fournisseur sont utilisés par 200 autres
      boutiques, et souvent sans droits cédés. Tourne les tiennes avec l'échantillon.
- [ ] **Vérifier que les visuels actuels ressemblent à ce que le fournisseur expédie.**
      Les images en ligne sont des rendus (`site/visuels/render-photo.mjs`), pas des
      photographies, et ils représentent un modèle précis : **abat-jour cylindrique en
      tissu, pot en verre ambré, socle rond avec molette de variateur**. Si la lampe reçue
      a un abat-jour en métal, un pot incolore ou une autre commande, les images
      annoncent autre chose que le produit : c'est une pratique commerciale trompeuse
      (art. L121-2 du code de la consommation) et la première cause de retours. Dans ce
      cas, deux options : changer de fournisseur pour un modèle conforme aux visuels, ou
      refaire les visuels d'après l'échantillon.
- [ ] **Mentions légales complètes** (voir `boutique/pages-legales/`), incluant le nom et
      l'adresse de la personne responsable UE au sens du règlement GPSR.
- [ ] **Statut juridique créé** (micro-entreprise suffit pour démarrer) + compte bancaire dédié.
- [ ] **Shopify Payments activé** + PayPal. En France, ajouter **Bancontact non, mais Cartes
      Bleues oui** — et surtout vérifier que le paiement en 3× (Klarna/Alma) est proposé au-dessus
      de 50 €, ça compte sur le coffret.

## 2. Configuration Shopify

- [ ] **Vérifier que chaque collection est publiée sur le canal « Boutique en ligne ».**
      Une collection créée par l'API ne l'est sur aucun canal par défaut, et les produits
      publiés n'y changent rien : la vitrine ne la trouve pas, les liens du menu ne mènent
      nulle part, et le thème affiche ses produits de démonstration (des t-shirts à 19,99 €)
      à la place des tiens. Ça s'est produit ici. À revérifier à chaque nouvelle collection.

- [ ] Nom de domaine acheté et connecté (ex. `cera-maison.fr`). **Vérifier d'abord la
      disponibilité de la marque sur [data.inpi.fr](https://data.inpi.fr)** — le nom « CERA
      Maison » est une proposition, pas une garantie de disponibilité.
- [ ] Thème installé et personnalisé (Dawn suffit largement pour démarrer).
- [ ] **Frais de port : offerts, intégrés au prix.** Un frais de port surprise au checkout est la
      première cause d'abandon de panier en France.
- [ ] Zone de livraison : France métropolitaine uniquement au démarrage. La Corse et les DOM
      coûtent plus cher et allongent les délais.
- [ ] TVA configurée selon ton statut (franchise en base = pas de TVA collectée).
- [ ] Pages légales publiées et liées dans le pied de page.
- [ ] E-mails de relance panier abandonné activés (3 e-mails : 1 h, 24 h, 72 h).

## 3. Fiche produit

- [ ] 6 à 8 photos, dont une à l'échelle (la lampe à côté d'une main ou d'un livre).
- [ ] Une vidéo de 10 s en haut de la galerie.
- [ ] Section FAQ intégrée (voir `boutique/faq.md`).
- [ ] **Délai de livraison affiché clairement**, pas caché dans les CGV.
- [ ] Avis clients : n'en invente aucun. Démarre sans avis et collecte les vrais (Judge.me ou
      Loox, version gratuite). De faux avis, c'est jusqu'à 300 000 € d'amende en France.

## 4. Après les 10 premières commandes

- [ ] Vérifier le délai de livraison réellement constaté et corriger l'affichage s'il est optimiste.
- [ ] Demander une photo à chaque client satisfait → créas gratuites et authentiques.
- [ ] Calculer le CPA réel et le comparer au seuil de 22 € de `analyse/analyse-produits.md`.
- [ ] Si le taux de retour dépasse 5 %, chercher la cause avant de scaler.

## 5. Ce qu'il ne faut pas faire

- ❌ Lancer sans échantillon. Tu vendras un produit que tu ne connais pas.
- ❌ Scaler un ROAS de 2,0. C'est le point mort, pas un profit.
- ❌ Multiplier les produits. Une boutique mono-produit bien faite bat un catalogue de 40 articles.
- ❌ Copier les visuels d'un concurrent. C'est de la contrefaçon, et Meta bannit le compte.
