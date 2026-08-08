# Plan de reconstruction GoWifi

## 1. Objectif et règle de décision

Le site doit permettre à un propriétaire, un gestionnaire immobilier ou un syndicat
de copropriété de comprendre en moins de 30 secondes que GoWifi prend en charge cinq
services d'immeuble sous une seule responsabilité, puis de demander un appel de
qualification.

Une seule conversion est utilisée partout : **Réserver un appel de qualification**.
Aucun prix, achat en ligne, calculateur, blogue, carrousel, témoignage fictif ou
animation décorative n'est présent.

L'ancien site statique Plexio a été supprimé. Aucun fichier HTML, CSS ou JavaScript
de cette version n'a été réutilisé. Il reste récupérable au commit `99bfdac`, marqué
par le tag `archive/plexio-static`.

## 2. Stack

- Astro 5, TypeScript strict, `output: "static"`.
- Tailwind 4 compilé localement via `@tailwindcss/vite`. Aucun CDN, aucun composant tiers.
- Une seule sortie JavaScript client : `src/scripts/interactions.ts`, limitée au menu
  mobile et à l'accordéon FAQ.
- FAQ rendue ouverte et lisible sans JavaScript; le script la referme ensuite.
- Formulaire HTML natif en `POST` vers `PUBLIC_CONTACT_FORM_ENDPOINT`.
- Honeypot `company_website`, masqué et exclu de la navigation clavier.
- URL canonique fournie par `PUBLIC_SITE_URL`.
- Build : `npm run build`, sortie dans `dist/`.

## 3. Système visuel

| Nom | Valeur | Usage |
|---|---:|---|
| Charbon infrastructure | `#111820` | Fond dominant, navigation, titres sur fond pâle |
| Blanc technique | `#F2F4F1` | Fond clair, texte principal sur fond foncé |
| Vert liaison | `#20C997` | CTA, focus, repères fonctionnels |

Les textes secondaires, bordures et séparateurs n'utilisent que ces trois couleurs
avec de l'opacité. Aucun dégradé, glassmorphism, blob ou ombre lumineuse.

Grille 4 colonnes en mobile, 12 dès la tablette. Sections alternant charbon et pâle,
sans cartes flottantes. Asymétrie constante : libellé technique sur 2 à 3 colonnes,
contenu sur 7 à 8. Échelle d'espacement de 8 px.

Élément signature : la **colonne vertébrale verticale** (`.spine` / `.spine-node`)
qui relie les cinq services, les quatre étapes et les points de problème comme un
schéma d'infrastructure. Structurelle, jamais animée.

Aucune photo. Si une photo réelle d'installation devient disponible, son emplacement
sera nommé `PLACEHOLDER_PHOTO_INSTALLATION_GOWIFI` avant intégration.

## 4. Écarts assumés par rapport au plan initial

Trois points ont été modifiés parce que le plan d'origine décrivait une situation
différente de la réalité du dépôt ou de l'environnement.

**Polices auto-hébergées → pile système.**
Le plan prévoyait Barlow Condensed 700 et Inter 400/600 en `.woff2` locaux.
`fonts.gstatic.com` est inaccessible depuis l'environnement de génération, les
fichiers n'ont pas pu être téléchargés. `global.css` déclare les deux familles en
tête de pile : déposer les `.woff2` dans `src/assets/fonts` et ajouter les `@font-face`
suffit à les activer, sans toucher à une seule classe utilitaire.

**GitHub Actions + Wrangler → intégration Git de Cloudflare Pages.**
Le projet Cloudflare Pages est déjà relié au dépôt GitHub et compile à chaque push.
Ajouter un workflow Wrangler créerait deux pipelines de déploiement concurrents et
exigerait trois secrets GitHub. Le workflow n'a pas été créé; les paramètres de build
du projet Pages existant sont utilisés à la place.

**`tailwind.config.mjs` → configuration CSS-first.**
Tailwind 4 déclare le thème dans le CSS via `@theme`. Le fichier de configuration
JavaScript n'est plus lu. La palette, les familles et l'échelle typographique vivent
dans `src/styles/global.css`.

Le plan listait par ailleurs des fichiers à supprimer (`en.html`, `hero-webgl.js`,
`serve.ps1`, `qa-webgl`, dossier `assets`) qui n'existaient pas dans ce dépôt. Les
fichiers réellement supprimés sont ceux du site Plexio : `index.html`, `css/`, `js/`,
`.netlify/`, `manifest.json`, `og-image.svg`, `sitemap.xml`, `robots.txt`,
`favicon.svg`, `_headers`, `CHANGELOG.md`, `AMELIORATION.md`, `README.md`.

## 5. Informations requises avant publication

1. Domaine officiel et URL canonique définitive.
2. Courriel public.
3. Territoire exact desservi.
4. SLA, heures de support et délai de réponse.
5. Structure de facturation et propriété du matériel.
6. Débits et capacité de l'offre internet.
7. Conservation et accès aux images de surveillance.
8. Contenu exact de la documentation remise.
9. Délais d'installation réalistes.
10. Conditions lors de la vente d'un immeuble.
11. Responsable de la protection des renseignements et durée de conservation.
12. Endpoint `POST` du formulaire.
13. Raison sociale, numéro d'entreprise, licences et assurances.

Le numéro confirmé est le **438 520-1423** et la personne-ressource est **Mathieu**.

Chaque valeur manquante apparaît telle quelle sur le site sous la forme
`[À CONFIRMER : ...]`. Ces mentions sont exclues du JSON-LD : un champ non confirmé
est absent du balisage plutôt que rempli d'une valeur inventée.
