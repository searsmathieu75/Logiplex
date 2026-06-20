# Logiplex — Site web

Site web complet de Logiplex, entreprise québécoise de solutions WiFi/internet
clé en main pour immeubles multilogements.

## Lancer le site en local

### Option A — Python (recommandé, aucune dépendance)

Ouvrez un terminal dans le répertoire `/home/pi/logiplex` et exécutez :

```bash
python3 -m http.server 8080
```

Ensuite ouvrez votre navigateur à l'adresse :

**http://localhost:8080/**

### Option B — Node.js (si disponible)

```bash
npx serve . -p 8080
```

Adresse : **http://localhost:8080/**

### Option C — Adresse réseau local (accès depuis un autre appareil)

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```

Puis depuis n'importe quel appareil sur le même réseau Wi-Fi :

**http://<IP_DU_PI>:8080/**

Pour trouver l'IP du Pi :

```bash
hostname -I | awk '{print $1}'
```

---

## Structure des fichiers

```
logiplex/
├── index.html          — Page principale (toutes les sections)
├── css/
│   └── style.css       — Feuille de styles complète
├── js/
│   └── main.js         — Animations, bilingue, interactions
├── AMELIORATION.md     — Journal d'auto-critique et d'itérations
└── README.md           — Ce fichier
```

---

## Fonctionnalités

- **Bilingue FR/EN** — Bascule en haut à droite, langue mémorisée
- **Animation canvas** — Réseau de connectivité animé dans le hero
- **Parallaxe souris** — Le réseau réagit au mouvement de la souris
- **Responsive** — Mobile, tablette et ordinateur
- **FAQ accordéon** — 8 questions / réponses
- **Carrousel** — 3 témoignages avec avancement automatique
- **Compteurs animés** — Statistiques qui s'animent au défilement
- **Accessibilité** — ARIA, skip-link, focus-visible, reduced-motion
- **SEO** — Meta tags, JSON-LD, canonical

---

## Notes techniques

- Aucun framework, aucune dépendance externe (hors Google Fonts)
- Compatible Chrome, Firefox, Safari, Edge (modernes)
- Le formulaire de contact simule l'envoi (pas de backend)
  → À connecter à un service SMTP ou Formspree en production
