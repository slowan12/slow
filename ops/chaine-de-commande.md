# La chaîne de commande : ce qui tiendrait, ce qui casse

Audit de ce qui se passe réellement quand un client valide un panier. Fait le 20/09/2026 sur
`954abe-d3.myshopify.com`.

## Le fournisseur — le maillon absent

**Aucune application de sourcing n'est installée.** Une seule app sur la boutique : le
connecteur Claude. Ni DSers, ni AliExpress, ni CJ, rien.

Conséquence concrète : les 4 produits sont actifs, tarifés, illustrés — et **si une commande
tombait, rien ne partirait nulle part**. Il n'y a pas de fournisseur derrière le catalogue.

**Je ne peux pas l'installer.** L'installation d'une application Shopify passe par un
consentement OAuth dans le navigateur, sous le compte marchand ; l'API Admin n'expose aucune
mutation d'installation. C'est une limite réelle, pas un contournement à trouver.

→ Vingt minutes, pas à pas, dans `ops/dsers-connexion.md`.
→ Lien direct : [apps.shopify.com/dsers](https://apps.shopify.com/dsers)

## Ce que l'audit a trouvé d'autre — et qui est corrigé

### La livraison contredisait toute la boutique

Configuration trouvée dans la zone France :

| Méthode | Condition | Prix |
|---|---|---|
| Standard | panier ≥ **50 €** | 0 € |
| Standard | dès 0 € | **8,80 €** |

**La lampe est à 44,90 €.** Elle passe donc sous le seuil de 50 €, et le client se voyait
facturer **8,80 € de port** — alors que le bandeau du site, la page Livraison, les CGV et les
descriptions produits annoncent tous « livraison offerte, sans minimum d'achat ».

Ce n'était pas qu'un détail de confort : l'économie unitaire de
`analyse/analyse-import-hiver-2026.md` absorbe le port dans les 44,90 €. Et un prix annoncé qui
diffère du prix facturé est une pratique commerciale trompeuse.

**Corrigé :** les deux méthodes sont remplacées par une seule, **« Livraison offerte » à 0 €,
sans condition de montant**.

### La boutique acceptait des commandes de 40 pays

Les zones **UE (26 pays)** et **International (14 pays)** étaient actives, à 22 € et 29 €. Or
tout le reste de la boutique — pages légales, CGV, fiches, analyse fiscale — ne parle que de
**France métropolitaine**.

Une commande japonaise ou américaine aurait été acceptée sans qu'aucun cadre légal, fiscal
(IOSS/OSS) ou logistique ne la couvre.

**Corrigé :** les méthodes de ces deux zones sont **désactivées**. Les zones elles-mêmes sont
conservées — le jour où l'extension UE est préparée (c'est le scénario recommandé par
l'analyse), il suffit de les réactiver.

## Ce qui reste bloquant avant la première vente

| # | Blocage | Où |
|---|---|---|
| 1 | **Aucun fournisseur connecté** | `ops/dsers-connexion.md` |
| 2 | **Aucun moyen de paiement** | Paramètres → Paiements |
| 3 | Boutique protégée par mot de passe | Boutique en ligne → Préférences |
| 4 | Pages légales non publiées (champs à remplir) | `boutique/pages-legales/_a-completer.md` |
| 5 | Identifiant DEEE et éco-organisme | `syderep.ademe.fr` |
| 6 | Adhésion à un médiateur de la consommation | ~50-200 €/an |
| 7 | Déclaration UE de conformité (CE) du fournisseur | À demander |
| 8 | Thème CERA non publié | Boutique en ligne → Thèmes |

Les points 1, 2, 3 et 8 sont des gestes de quelques minutes dans l'admin. Les points 5 et 6
sont des démarches avec un délai — à lancer en premier.

## Le suivi de stock

Le suivi est **désactivé** sur toutes les variantes, ce qui est le réglage correct en
dropshipping : aucune vente n'est bloquée par un compteur qui ne reflète rien. Emplacement
unique, à l'adresse de l'éditeur.

Quand DSers sera connecté, c'est lui qui portera la disponibilité réelle côté fournisseur.
Ne réactive pas le suivi Shopify par-dessus : les deux se contrediraient.
