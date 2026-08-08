# GoWifi — site web

Site statique de GoWifi, services gérés pour immeubles multilogements au Québec :
internet partagé, surveillance IP, interphone, téléphonie IP et IPTV.

Astro 5 · TypeScript strict · Tailwind 4 · sortie statique · déploiement Cloudflare Pages.

Le plan de construction, les écarts assumés et la liste des informations manquantes
sont dans [`PLAN.md`](./PLAN.md).

---

## Développement local

Node.js 20.3 ou plus récent est requis.

```bash
npm install
npm run dev      # http://localhost:4321
```

Autres commandes :

```bash
npm run build    # génère dist/
npm run preview  # sert dist/ localement
npm run check    # vérification TypeScript et Astro
```

## Variables d'environnement

Copier `.env.example` vers `.env` :

```bash
PUBLIC_SITE_URL="https://monwifi.pages.dev"
PUBLIC_CONTACT_FORM_ENDPOINT=""
```

Tant que `PUBLIC_CONTACT_FORM_ENDPOINT` est vide, le formulaire affiche
« Formulaire non configuré » au lieu de simuler un envoi qui n'arrive nulle part.
Les deux variables doivent aussi être déclarées dans les paramètres du projet
Cloudflare Pages, sinon le site déployé utilise les valeurs de repli.

## Déploiement

Cloudflare Pages compile le dépôt à chaque push sur `main`. Paramètres à régler une
seule fois dans le tableau de bord, section **Paramètres → Build** :

| Paramètre | Valeur |
|---|---|
| Commande de build | `npm install && npm run build` |
| Répertoire de sortie | `dist` |
| Répertoire racine | `/` |
| Variable `NODE_VERSION` | `22` |
| Variable `PUBLIC_SITE_URL` | `https://monwifi.pages.dev` |
| Variable `PUBLIC_CONTACT_FORM_ENDPOINT` | à remplir quand l'endpoint existe |

Sans ces réglages, Cloudflare sert le dépôt tel quel et n'affiche rien, puisqu'il n'y
a plus de `index.html` à la racine.

## Structure

```
public/          Assets servis tels quels : _headers, robots.txt, favicons, og-default.png
src/data/        Contenu typé : services.ts, faq.ts, navigation.ts
src/components/  Composants Astro, aucun état, aucun JavaScript embarqué
src/layouts/     BaseLayout.astro — meta, canonical, Open Graph, JSON-LD
src/pages/       11 routes, dont sitemap.xml.ts généré depuis les routes réelles
src/scripts/     interactions.ts — menu mobile et accordéon FAQ, rien d'autre
src/styles/      global.css — palette, typographie, colonne vertébrale
```

## Modifier le contenu

Le texte des cinq services vit entièrement dans `src/data/services.ts`. Les pages
`src/pages/{slug}.astro` ne font que déléguer au composant `ServicePage.astro` : il
n'y a aucun texte à modifier à deux endroits.

Les questions de la FAQ sont dans `src/data/faq.ts`. Une entrée marquée
`incomplete: true` contient encore un `[À CONFIRMER]`.

## Ancien site

La version Plexio est conservée au commit `99bfdac`, tag `archive/plexio-static`.

```bash
git show archive/plexio-static:index.html > /tmp/ancien-index.html
```
