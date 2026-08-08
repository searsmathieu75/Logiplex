# Polices auto-hébergées

Ce dossier est vide pour l'instant. Le site utilise une pile de polices système
parce que `fonts.gstatic.com` était inaccessible depuis l'environnement de
génération au moment de la construction.

## Pour activer Barlow Condensed et Inter

1. Télécharger les `.woff2` depuis <https://gwfh.mranftl.com/fonts> :
   - `barlow-condensed-700.woff2` (sous-ensemble `latin` + `latin-ext`)
   - `inter-400.woff2`
   - `inter-600.woff2`
2. Les déposer dans ce dossier, avec le fichier de licence `OFL.txt`.
3. Ajouter les déclarations au début de `src/styles/global.css`, avant `@import "tailwindcss"` :

```css
@font-face {
  font-family: 'Barlow Condensed';
  src: url('/src/assets/fonts/barlow-condensed-700.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Inter';
  src: url('/src/assets/fonts/inter-600.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

Aucune classe utilitaire n'a besoin d'être modifiée : `--font-display` et
`--font-sans` nomment déjà ces deux familles en tête de pile dans le bloc `@theme`.
