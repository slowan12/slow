# Connecter DSers — et ce qu'il faut en tirer

> **État vérifié le 20/09/2026 sur `954abe-d3.myshopify.com` :** une seule application est
> installée, le connecteur Claude. **DSers n'est pas installée.**
>
> Je ne peux pas l'installer à ta place : l'installation d'une app Shopify passe par un
> consentement OAuth dans ton navigateur, sous ton compte marchand. L'API Admin ne permet pas
> à un tiers d'installer une application. Les étapes ci-dessous sont donc à faire par toi —
> elles prennent une vingtaine de minutes.

---

## 1. Pourquoi DSers plutôt qu'autre chose

DSers est le successeur officiel d'Oberlo (arrêté en 2022) et la solution AliExpress de
référence pour Shopify. Ce qui nous intéresse ici, dans l'ordre :

| Fonction | Ce qu'elle résout pour nous |
|---|---|
| **Supplier Optimizer** | Compare plusieurs fournisseurs du **même** produit. C'est l'outil d'analyse de marché côté offre : prix, délais, note, volume. |
| **Bulk order** | Passe les commandes AliExpress en lot. Sans ça, tu recopies les adresses à la main. |
| **Tracking sync** | Renvoie le numéro de suivi dans Shopify et déclenche l'e-mail d'expédition. |
| **Mapping** | Relie une variante Shopify (Noir mat / Ivoire / Laiton) à une variante fournisseur précise. À faire avant la première vente, sinon les commandes partent en erreur. |

Plans au 20/09/2026 : un plan **Basic gratuit** (jusqu'à 3 000 produits, bulk order, tracking
sync, Supplier Optimizer en version limitée) puis **19,90 $/mois** et **49,90 $/mois**, avec
14 jours d'essai. Le gratuit suffit largement pour une boutique mono-produit en phase de test.

---

## 2. Installation, pas à pas

1. **Installer l'app.** Shopify admin → Apps → rechercher « DSers », ou directement
   [apps.shopify.com/dsers](https://apps.shopify.com/dsers). Accepter les permissions.
2. **Lier le compte AliExpress.** Au premier lancement, DSers propose « Link to AliExpress ».
   Crée un compte AliExpress si tu n'en as pas — **avec l'adresse e-mail de la boutique**, pas
   une adresse personnelle.
3. **Choisir la boutique.** DSers peut gérer plusieurs boutiques ; vérifie que
   `954abe-d3.myshopify.com` est bien la boutique active.
4. **Régler les paramètres d'expédition** (Settings → Shipping) : méthode par défaut
   **AliExpress Standard Shipping** ou **Cainiao**, destination **France**. C'est là que se
   joue le délai de 8 à 15 jours annoncé sur la page Livraison.
5. **Régler le pricing** (Settings → Pricing rules) : laisse-le **désactivé**. Nos prix sont
   fixés par l'économie unitaire de `analyse/analyse-import-hiver-2026.md` §6, pas par un
   multiplicateur automatique.

### Le point à ne pas rater : le mapping

Les 4 produits existent déjà sur la boutique avec leurs SKU :

| SKU | Produit | Prix |
|---|---|---|
| `LUEUR-CWL-NOIR` / `-IVOIRE` | Lampe chauffe-bougie | 44,90 € |
| `LUEUR-CWL-LAITON` | Lampe, laiton brossé | 49,90 € |
| `LUEUR-BOX-NOIR` / `-IVOIRE` | Coffret | 59,90 € |
| `LUEUR-BOUGIE-*` | Bougie 180 g | 19,90 € |
| `LUEUR-AMP-GU10-X2` | Ampoules GU10 | 9,90 € |

Dans DSers : **Import List → Mapping → Advanced Mapping**, et relie chaque variante Shopify à
la variante fournisseur exacte (le bon coloris). Une variante non mappée = une commande qui
échoue au moment où tu as déjà payé la publicité.

---

## 3. La grille de sourcing — l'analyse de marché côté offre

C'est ici que DSers sert vraiment d'outil d'analyse. Dans le **Supplier Optimizer**, cherche
`candle warmer lamp` et remplis ce tableau pour au moins **3 fournisseurs**.

| Critère | Seuil à respecter | Fournisseur A | B | C |
|---|---|---|---|---|
| Note du vendeur | ≥ 4,7 | | | |
| Commandes sur le produit | ≥ 1 000 | | | |
| Prix unitaire | | | | |
| Frais de port vers la FR | | | | |
| **Coût rendu (prix + port)** | **≤ 13,00 €** | | | |
| Délai annoncé vers la FR | ≤ 15 j ouvrés | | | |
| Variantes dispo | Noir, ivoire, laiton | | | |
| Expédie en **DDP** ? | **Oui obligatoire** | | | |
| Fournit la déclaration CE ? | **Oui obligatoire** | | | |
| Accepte le retrait de la pub fournisseur du colis | Souhaitable | | | |

### Les deux questions à poser au fournisseur par message

Copie-les telles quelles :

> 1. Do you ship DDP (duties and taxes prepaid) to France? Since 1 July 2026 the EU applies a
>    €3 flat customs duty per tariff category on parcels under €150. I need confirmation that
>    **my customer will never receive a payment request on delivery.**
> 2. Can you provide the **EU Declaration of Conformity (CE marking)** and the name and EU
>    address of the manufacturer or importer, as required by GPSR (EU) 2023/988?

**Un fournisseur qui esquive l'une des deux est éliminé.** Ce ne sont pas des formalités : la
question 1 est le premier risque opérationnel (un client français qui reçoit un avis de
paiement de 3 € ouvre un litige), la question 2 est une obligation légale sur un appareil
électrique.

---

## 4. Le seuil qui décide

Le calcul de `analyse/analyse-import-hiver-2026.md` §6, rappelé ici pour que tu l'aies sous
les yeux en remplissant la grille :

| Ligne | Montant |
|---|---|
| Prix de vente TTC | 44,90 € |
| − TVA 20 % | −7,48 € |
| − Coût rendu | −13,00 € |
| − Droit forfaitaire | −3,00 € |
| − Frais de paiement | −1,55 € |
| **= Marge brute** | **19,87 €** |
| **ROAS point mort** | **2,26** |
| **CPA maximum** | **19 €** |

**Si le coût rendu réel que tu relèves dans DSers dépasse 16 € droit inclus, refais le calcul
avant de dépenser un euro en publicité.** Chaque euro de coût produit en plus, c'est un euro
de marge en moins, et le ROAS point mort grimpe vite.

### La tactique du lot de 2

Le droit de 3 € s'applique **par catégorie tarifaire**, pas par unité. Deux lampes identiques
dans un colis = 3 € au total, soit **1,50 € par lampe**. La promotion automatique
**« La 2ᵉ lampe à −15 % »** est déjà active sur la boutique : elle te coûte 6,74 € de remise
et te fait gagner 1,50 € de droit plus une seconde marge. Dans DSers, veille à ce que les deux
unités partent **dans le même colis** — sinon l'économie disparaît.

À l'inverse, le **Coffret** (lampe + bougies) mélange deux catégories tarifaires : **6 € de
droit au lieu de 3 €**. Soit tu l'expédies en deux colis, soit tu repositionnes son prix, soit
tu le remplaces par l'offre lot de 2. À trancher avec un transitaire.

---

## 5. Ce que DSers ne te dira pas

DSers analyse **l'offre**, pas la demande. Il te dit ce que coûte le produit et qui le vend ;
il ne te dit pas si le marché français est saturé. Cette partie reste à faire à la main :

- **Meta Ad Library**, filtre France, requêtes « chauffe-bougie » et « candle warmer ».
  Les annonceurs actifs depuis plus de 30 jours gagnent de l'argent — c'est le meilleur signal
  gratuit qui existe. Beaucoup d'annonceurs installés = angle « gadget » à éviter.
- **Google Trends**, France, 12 mois. Confirme le pic de décembre avant de caler le budget.
- **Amazon.fr et Etsy.fr**, prix pratiqués. Le client compare en trois secondes.

Le contexte de demande est solide : le marché mondial de la bougie croît d'environ 6,3 % par
an, et le segment premium français est donné en croissance à deux chiffres sur 2026-2033, avec
un pic de ventes marqué en fin d'année. Le risque du produit n'a jamais été la demande —
**c'est la saturation publicitaire**, et elle se mesure dans l'Ad Library, pas dans DSers.

---

## Sources

- [DSers sur le Shopify App Store](https://apps.shopify.com/dsers)
- [DSers Review 2026 — plans et fonctionnalités (Bettamax)](https://bettamax.com/dsers-review/)
- [DSers Dropshipping : ce que c'est et comment l'utiliser en 2026 (AliDropship)](https://alidropship.com/dsers-dropshipping/)
- [France Luxury Candle Market Size & Outlook, 2026-2033 (Grand View Research)](https://www.grandviewresearch.com/horizon/outlook/luxury-candle-market/france)
- [Candle Warmers Market — analyse 2026 (Data Insights Market)](https://www.datainsightsmarket.com/reports/candle-warmers-1283053)
- [Douane française — droit forfaitaire de 3 €](https://www.douane.gouv.fr/fiche/droit-de-douane-forfaitaire-de-3-euros-sur-les-ventes-distance-de-biens-importes)
