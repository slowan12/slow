# Utiliser les photos du fournisseur (AliExpress)

## Ce qui bloque, et ce qui ne bloque pas

**Je ne peux pas aller chercher ces photos moi-même.** AliExpress est refusé par la politique
d'egress du réseau de cet environnement :

```
{"error_type":"EGRESS_BLOCKED","domain":"www.aliexpress.com",
 "message":"Access to www.aliexpress.com is blocked by the network egress proxy."}
```

Les CDN images (`ae01.alicdn.com`, `ae-pic-a1.aliexpress-media.com`, `img.alicdn.com`)
répondent pareil : connexion refusée.

**Mais ce blocage ne concerne que moi.** Une fois que tu as les URLs :

| Destination | Qui télécharge l'image | Ça marche ? |
|---|---|---|
| Fiches produits Shopify | Les serveurs de Shopify | ✅ |
| Le site `vitrine.html` | Le navigateur du visiteur | ✅ |
| Moi, pour retoucher/recadrer | — | ❌ |

## Récupérer les URLs

Sur la page produit AliExpress, clic droit sur une image → **« Copier l'adresse de l'image »**.
Tu obtiens une URL du type :

```
https://ae01.alicdn.com/kf/S1a2b3c4d5e6f.jpg
```

Retire le suffixe de redimensionnement s'il y en a un (`_220x220.jpg`, `.jpg_480x480.jpg`) :
sans suffixe, tu récupères la pleine résolution.

Il t'en faut idéalement **cinq à huit** : le produit sur fond neutre, un plan détail, une mise
en situation, et une photo par coloris.

## Les appliquer

### Sur le site

Écris un fichier `urls.json` :

```json
{
  "lampe-noir": "https://ae01.alicdn.com/kf/....jpg",
  "lampe-ivoire": "https://ae01.alicdn.com/kf/....jpg",
  "detail": "https://ae01.alicdn.com/kf/....jpg",
  "hero": "https://ae01.alicdn.com/kf/....jpg"
}
```

puis :

```
node appliquer-urls.mjs urls.json
```

Les clés absentes gardent le rendu actuel — tu peux donc n'en remplacer que deux ou trois.
Clés valides : `lampe-noir`, `lampe-ivoire`, `lampe-laiton`, `detail`, `hero`, `duo`,
`coffret`, `bougie-cedre`, `bougie-vanille`, `bougie-figue`, `ampoules`.

Tu peux aussi éditer directement la table `VISUELS` en tête du `<script>` de
`site/vitrine.html` : c'est le seul endroit à toucher.

### Sur Shopify

Colle-moi les URLs et je les rattache aux fiches produits — Shopify les récupère lui-même,
donc rien ne passe par le réseau bloqué. Sinon, dans l'admin : **Produits → la fiche →
Médias → Ajouter depuis une URL**.

## Deux réserves, dites une fois

**Les droits.** Ces images appartiennent au vendeur. Beaucoup de fournisseurs AliExpress les
laissent utiliser à leurs revendeurs, certains non, et quelques-unes sont elles-mêmes reprises
d'ailleurs. Demande l'autorisation par message au fournisseur — la même conversation que celle
où tu demandes le DDP et la déclaration CE (voir `ops/dsers-connexion.md`).

**La différenciation.** Ce sont les images que tous les autres revendeurs du même article
utilisent. Le client qui compare voit la même fiche trois fois. Elles font un excellent point
de départ pour lancer les tests ; elles ne font pas une marque.

Le plan reste donc le même : photos fournisseur maintenant pour valider le produit, tes propres
photos dès que l'échantillon arrive.
