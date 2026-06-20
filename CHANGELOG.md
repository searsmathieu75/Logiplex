# LOGIPLEX — Changelog des améliorations autonomes

---

## Cycle 9 — Responsive : centrage grille marchés sur tablet (2026-06-20)
### Problème identifié
Sur tablet (601–1024px), la section `#marches` affichait 5 cartes en grille 3 colonnes : ligne 1 (3 cartes) et ligne 2 (2 cartes + cellule vide à droite). Layout asymétrique visible sur iPad / tablettes Android — la colonne 3 vide en bas donnait un aspect non-fini.
### Fix appliqué
Remplacement du `repeat(3,1fr)` à 1024px par un trick grille 6 colonnes (uniquement pour la plage 601–1024px) : chaque carte span 2 colonnes, et les cartes 4–5 sont positionnées sur les colonnes 2–4 et 4–6 → centrées avec 1 colonne vide de chaque côté. Layout parfaitement symétrique. Les breakpoints 600px (2 col) et 400px (1 col) ne sont pas affectés.
### Résultat
Sur iPad Pro (1024px) et tablettes en mode portrait (768px) : grille marchés équilibrée en 3+2 centré vs 3+2 décalé à gauche. Version CSS → v=10

---

## Cycle 8 — Clarté du message hero : 5 services complets (2026-06-20)
### Problème identifié
Le sous-titre du hero ne mentionnait que 3 des 5 services (WiFi, caméras, téléphonie IP) — omettant les **interphones intelligents** et l'**IPTV**, pourtant au cœur de l'offre Logiplex. Un prospect B2B qui scanne la page d'accueil ne voyait pas la gamme complète au premier coup d'oeil.
### Fix appliqué
- Réécriture du `data-fr` et `data-en` du `.hero-sub` pour lister les 5 services : "WiFi haute vitesse, caméras 4K, interphones intelligents, téléphonie IP et IPTV — infrastructure télécom complète clé en main pour immeubles de 10+ logements au Québec. Gérée par nos experts, 24/7."
- Mise à jour cohérente du `og:description` (Open Graph)
### Résultat
Le message est maintenant complet et spécifique au premier écran — un propriétaire d'immeuble comprend immédiatement les 5 piliers de l'offre

---

## Cycle 7 — Contraste section-tag sur fonds clairs (2026-06-20)
### Problème identifié
Les étiquettes `.section-tag` ("Avantages", "Marchés servis") dans les sections `section-light` (#pourquoi, #marches) utilisaient `color: #00E5FF` (cyan) sur fond `#F4F7FF`. Ratio de contraste ≈ 1.65:1 — échec total WCAG AA (minimum 4.5:1 requis). Le texte était quasi-illisible sur fond clair. Les pseudo-éléments `::before` / `::after` (lignes décoratives) subissaient le même problème.
### Fix appliqué
- Ajout dans `style.css` / `style.min.css` : `.section-light .section-tag { color: var(--blue-dark); }` et `::before/::after { background: var(--blue-dark); }` — `--blue-dark: #2563EB` donne un ratio ≈ 4.63:1 sur `#F4F7FF` ✓ WCAG AA
- Version CSS → v=9
### Résultat
Les sections "Avantages" et "Marchés servis" ont maintenant un contraste lisible et cohérent avec la palette B2B (bleu foncé au lieu de cyan sur fond blanc)

---

## Cycle 6 — Hero desktop : layout deux colonnes sans overlap (2026-06-20)
### Problème identifié
La `.hero-dashboard-card` était en `position:absolute; right:...; top:50%` tandis que `.hero-content` était centré avec `margin-inline:auto; max-width:820px`. Sur les écrans 1200–1500px (laptops standard), la carte chevauchait de 100–140px le bord droit du bloc héro, cachant partiellement les stats. En parallèle, un bloc `<style>` inline avec `!important` dans le `<head>` conflit avec le CSS source.
### Fix appliqué
- **`style.css` / `style.min.css`** : Carte dashboard passée de `position:absolute` à `position:relative; flex-shrink:0; align-self:center` — elle s'intègre maintenant dans le flux flex du `#hero` côté droit
- **`@media (min-width:1200px)`** : Ajout `#hero { gap: clamp(40,5vw,72px); padding-inline: clamp(48,6vw,96px) }` et `.hero-content { max-width:600px; margin-inline:0 }` pour une vraie mise en page deux colonnes
- **`@keyframes cardFloat`** : Correction — suppression de `translateY(-50%)` devenu obsolète avec `position:relative`
- **`index.html`** : Suppression du bloc `<style>` inline `!important` (hack superflu maintenant que le CSS est propre), version CSS → `v=8`
### Résultat
Hero desktop : texte centré dans sa colonne gauche (600px), carte dashboard à droite (268px), gap propre, zéro overlap sur 1200px+

---

## Cycle 0 — Corrections WCAG & Performance (session précédente)
- Suppression des rôles ARIA incorrects (`role="menubar"`, `role="menuitem"`, `role="menu"`, `role="navigation"` redondant)
- Ajout des balises `<link rel="alternate" hreflang>` (fr, en, x-default) dans le `<head>`
- Touch targets portés à 44×44px : hamburger, lang-toggle, carousel buttons, dots
- Throttle 60fps sur le canvas (`frame(now)` + `lastTime`)
- Navigation clavier ← → sur le carrousel
- `prefers-reduced-motion` : désactive l'avance automatique du carrousel
- `initNavHighlight` simplifié : 1 seul IntersectionObserver au lieu de N+1
- Minification CSS : 40.6 KB → 31.5 KB | JS : 18.0 KB → 14.0 KB

---

## Cycle 1 — Calculateur ROI + Bande de confiance (19 jun ~19h40)
### Nouvelles fonctionnalités
- **Calculateur de revenus interactif** (section #calculateur)
  - Slider 10–500 logements avec track animé (CSS custom property `--pct`)
  - Calcul en temps réel : logements × 85 $/mois → mensuel + annuel
  - Bilingue FR/EN (mise à jour via `window._calcUpdate`)
  - Design glassmorphism avec top-border gradient cyan
- **Bande de confiance géographique** (entre hero et solutions)
  - 6 villes québécoises : Montréal, Laval, Québec, Longueuil, Sherbrooke, Gatineau
  - Icônes SVG bâtiments, opacité 38% → 75% au hover
### Scores post-cycle 1 (estimé)
  - Impact visuel WOW : 7 → 8/10
  - Conversion commerciale : 6 → 8/10 (calculateur ROI = différenciateur majeur)

## Cycle 2 — Tilt 3D + Parallaxe + Partenaires (19 jun ~22h45)
- **Tilt 3D** sur les cartes solutions (mousemove → perspective/rotateX/rotateY, desktop uniquement)
- **Parallaxe scroll** sur les 3 orbes du hero (rates différents: 0.14, -0.10, 0.07)
- **Bande partenaires équipements** entre solutions et pourquoi : Cisco Meraki, Ubiquiti, Axis, 2N, Aruba HPE, Cambium
- CSS sol-card : `will-change: transform`, `transform-style: preserve-3d`, transition lissée
- Scores estimés post-cycle : Impact WOW 8→8.5, Confiance tech 6→8

## Cycle 3 — Hero Dashboard + Guillemets + Badges (19 jun ~22h50)
- **Carte dashboard flottante dans le hero** (desktop ≥1200px) : connexion active, uptime 99.8%, revenus, locataires
  - Animation `cardFloat` + dot pulsant vert, metrics cyan/vert
- **Guillemets décoratifs** en fond sur les cartes témoignages (`::before`, 9rem, cyan 7% opacity)
- **Trust badges pill** dans la section contact (redesign: fond+bordure au lieu de texte simple)
- Scores estimés post-cycle : Impact WOW 8.5→9, Hero 7→9.5/10

## Cycle 4 — Hero Layout + Dashboard Ticker (19 jun ~22h55)
- **Hero left-align sur desktop (≥1200px)** : texte aligné à gauche, max-width 680px, padding-left 5vw
  - `#hero justify-content: flex-start` pour laisser place à la carte
  - `.hero-actions` et `.hero-stats` flush left
- **Building ticker** dans la carte dashboard : 4 bâtiments tournent toutes 5.5s avec fade
  - Tour des Érables, Résidence Le Plateau, Les Condos Laval, Le Saint-Laurent
- Scores estimés : Hero layout 9→9.5, Dashboard card dynamique (engagement++)

## Cycle 5 — Micro-interactions + Accessibilité (19 jun ~23h00)
- **Sol-icon hover**: `scale(1.2) rotate(-8deg)` + drop-shadow cyan au survol (CSS pur, très WOW)
- **Steps connecting line**: animation `width: 0 → 80%` au scroll (1.4s ease), `steps-line.animated`
- **Step-number hover**: stroke + fill cyan au survol (CSS transition)
- **Copyright**: mis à jour 2025 → 2026
- **Mobile sticky CTA**: correction accessibilité (`aria-hidden` retiré, `role="complementary"` ajouté)
