# LOGIPLEX — Changelog des améliorations autonomes

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
