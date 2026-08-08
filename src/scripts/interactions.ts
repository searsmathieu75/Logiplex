/**
 * Moteur d'interaction et d'animation du site.
 *
 * Deux règles tiennent tout le fichier :
 *   1. prefers-reduced-motion coupe chaque effet, jamais le contenu.
 *   2. Tout est réinitialisable, car les transitions de page d'Astro
 *      remplacent le DOM sans recharger le document.
 */

const reduit = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Nettoyages à exécuter avant chaque navigation. */
let arrets: (() => void)[] = [];
const surArret = (fn: () => void): void => {
  arrets.push(fn);
};

/* =========================================================================
   Menu mobile
   ========================================================================= */

function initMenu(): void {
  const toggle = document.getElementById('menu-toggle');
  const panel = document.getElementById('menu-mobile');
  if (!toggle || !panel) return;

  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');

  const setState = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('hidden', !open);
    if (label) label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
  };

  const close = (rendreFocus: boolean): void => {
    setState(false);
    if (rendreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setState(!open);
    if (!open) panel.querySelector<HTMLAnchorElement>('[data-menu-link]')?.focus();
  });

  const onKey = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close(true);
    }
  };
  document.addEventListener('keydown', onKey);
  surArret(() => document.removeEventListener('keydown', onKey));

  panel.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => close(false));
  });

  const bureau = window.matchMedia('(min-width: 768px)');
  const onBureau = (e: MediaQueryListEvent): void => {
    if (e.matches) close(false);
  };
  bureau.addEventListener('change', onBureau);
  surArret(() => bureau.removeEventListener('change', onBureau));
}

/* =========================================================================
   Accordéon FAQ
   Le serveur rend les panneaux ouverts; le script les referme.
   ========================================================================= */

function initFaq(): void {
  document.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]').forEach((trigger) => {
    const id = trigger.getAttribute('aria-controls');
    const panel = id ? document.getElementById(id) : null;
    if (!panel) return;

    const chevron = trigger.querySelector<HTMLElement>('.faq-chevron');

    const setOpen = (open: boolean): void => {
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (chevron) chevron.style.transform = open ? 'rotate(135deg)' : 'rotate(0deg)';
    };

    setOpen(false);
    trigger.addEventListener('click', () =>
      setOpen(trigger.getAttribute('aria-expanded') !== 'true'),
    );
  });
}

/* =========================================================================
   Révélations au défilement
   ========================================================================= */

function initReveal(): void {
  const cibles = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (cibles.length === 0) return;

  if (reduit()) {
    cibles.forEach((el) => el.classList.add('vu'));
    return;
  }

  const obs = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        const el = entree.target as HTMLElement;
        el.classList.add('vu');
        obs.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  cibles.forEach((el, i) => {
    // Décalage en cascade à l'intérieur d'un même groupe.
    const groupe = el.closest('[data-reveal-groupe]');
    if (groupe) {
      const freres = Array.from(groupe.querySelectorAll('[data-reveal]'));
      el.style.setProperty('--delai', `${freres.indexOf(el) * 90}ms`);
    } else if (!el.style.getPropertyValue('--delai')) {
      el.style.setProperty('--delai', `${(i % 3) * 60}ms`);
    }
    obs.observe(el);
  });

  surArret(() => obs.disconnect());
}

/* =========================================================================
   Dorsale qui se trace
   ========================================================================= */

function initSpine(): void {
  const spines = document.querySelectorAll<HTMLElement>('.spine');
  if (spines.length === 0) return;

  if (reduit()) {
    spines.forEach((s) => s.style.setProperty('--trace', '1'));
    return;
  }

  spines.forEach((s) => s.style.setProperty('--trace', '0'));

  const obs = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        (entree.target as HTMLElement).style.setProperty('--trace', '1');
        obs.unobserve(entree.target);
      });
    },
    { threshold: 0.12 },
  );

  spines.forEach((s) => obs.observe(s));
  surArret(() => obs.disconnect());
}

/* =========================================================================
   Compteurs animés
   ========================================================================= */

function initCompteurs(): void {
  const compteurs = document.querySelectorAll<HTMLElement>('[data-compteur]');
  if (compteurs.length === 0) return;

  const ecrire = (el: HTMLElement, valeur: number): void => {
    const suffixe = el.dataset.suffixe ?? '';
    el.textContent = `${Math.round(valeur).toLocaleString('fr-CA')}${suffixe}`;
  };

  if (reduit()) {
    compteurs.forEach((el) => ecrire(el, Number(el.dataset.compteur ?? 0)));
    return;
  }

  const obs = new IntersectionObserver(
    (entrees) => {
      entrees.forEach((entree) => {
        if (!entree.isIntersecting) return;
        const el = entree.target as HTMLElement;
        obs.unobserve(el);

        const cible = Number(el.dataset.compteur ?? 0);
        const duree = 1400;
        const debut = performance.now();

        const pas = (maintenant: number): void => {
          const t = Math.min((maintenant - debut) / duree, 1);
          const adouci = 1 - Math.pow(1 - t, 3);
          ecrire(el, cible * adouci);
          if (t < 1) requestAnimationFrame(pas);
        };
        requestAnimationFrame(pas);
      });
    },
    { threshold: 0.5 },
  );

  compteurs.forEach((el) => obs.observe(el));
  surArret(() => obs.disconnect());
}

/* =========================================================================
   Inclinaison des cartes au survol
   ========================================================================= */

function initTilt(): void {
  if (reduit() || window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((carte) => {
    const bouger = (e: MouseEvent): void => {
      const r = carte.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      carte.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
    };
    const partir = (): void => {
      carte.style.transform = '';
    };
    carte.addEventListener('mousemove', bouger);
    carte.addEventListener('mouseleave', partir);
  });
}

/* =========================================================================
   Parallaxe au défilement
   ========================================================================= */

function initParallaxe(): void {
  const couches = document.querySelectorAll<HTMLElement>('[data-parallaxe]');
  if (couches.length === 0 || reduit()) return;

  let ticking = false;

  const appliquer = (): void => {
    const y = window.scrollY;
    couches.forEach((couche) => {
      const facteur = Number(couche.dataset.parallaxe ?? 0.15);
      couche.style.transform = `translate3d(0, ${y * facteur}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(appliquer);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  appliquer();
  surArret(() => window.removeEventListener('scroll', onScroll));
}

/* =========================================================================
   Réseau animé du hero
   Nœuds reliés par des segments, densité proportionnelle à la surface,
   attraction douce vers le curseur. Se met en pause hors écran.
   ========================================================================= */

interface Noeud {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
}

function initReseau(): void {
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement | null;
  if (!canvas || reduit()) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const TEINTES = ['#20c997', '#00e5ff', '#3b82f6'];
  let noeuds: Noeud[] = [];
  let largeur = 0;
  let hauteur = 0;
  let raf = 0;
  let actif = true;
  const souris = { x: -9999, y: -9999 };

  const dimensionner = (): void => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    largeur = r.width;
    hauteur = r.height;
    canvas.width = Math.floor(largeur * dpr);
    canvas.height = Math.floor(hauteur * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const densite = Math.min(Math.round((largeur * hauteur) / 13000), 90);
    noeuds = Array.from({ length: densite }, () => ({
      x: Math.random() * largeur,
      y: Math.random() * hauteur,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.7 + 0.9,
    }));
  };

  const dessiner = (): void => {
    ctx.clearRect(0, 0, largeur, hauteur);

    for (const n of noeuds) {
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > largeur) n.vx *= -1;
      if (n.y < 0 || n.y > hauteur) n.vy *= -1;

      // Attraction douce vers le curseur, plafonnée pour rester lisible.
      const dx = souris.x - n.x;
      const dy = souris.y - n.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 26000 && d2 > 1) {
        const f = 0.00016;
        n.vx += dx * f;
        n.vy += dy * f;
        const v = Math.hypot(n.vx, n.vy);
        if (v > 0.85) {
          n.vx = (n.vx / v) * 0.85;
          n.vy = (n.vy / v) * 0.85;
        }
      }
    }

    // Segments entre nœuds proches
    for (let i = 0; i < noeuds.length; i++) {
      for (let j = i + 1; j < noeuds.length; j++) {
        const a = noeuds[i]!;
        const b = noeuds[j]!;
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 132) continue;
        ctx.strokeStyle = `rgba(32, 201, 151, ${(1 - dist / 132) * 0.34})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nœuds
    noeuds.forEach((n, i) => {
      ctx.fillStyle = TEINTES[i % TEINTES.length]!;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (actif) raf = requestAnimationFrame(dessiner);
  };

  const onSouris = (e: MouseEvent): void => {
    const r = canvas.getBoundingClientRect();
    souris.x = e.clientX - r.left;
    souris.y = e.clientY - r.top;
  };
  const onSortie = (): void => {
    souris.x = -9999;
    souris.y = -9999;
  };

  dimensionner();
  dessiner();

  const onResize = (): void => dimensionner();
  window.addEventListener('resize', onResize);
  canvas.addEventListener('mousemove', onSouris);
  canvas.addEventListener('mouseleave', onSortie);

  // Pause hors écran : pas de boucle RAF pour un canvas invisible.
  const vis = new IntersectionObserver((entrees) => {
    entrees.forEach((entree) => {
      if (entree.isIntersecting && !actif) {
        actif = true;
        dessiner();
      } else if (!entree.isIntersecting) {
        actif = false;
        cancelAnimationFrame(raf);
      }
    });
  });
  vis.observe(canvas);

  surArret(() => {
    actif = false;
    cancelAnimationFrame(raf);
    vis.disconnect();
    window.removeEventListener('resize', onResize);
    canvas.removeEventListener('mousemove', onSouris);
    canvas.removeEventListener('mouseleave', onSortie);
  });
}

/* =========================================================================
   Progression de lecture dans la barre supérieure
   ========================================================================= */

function initProgression(): void {
  const barre = document.getElementById('progression');
  if (!barre || reduit()) return;

  let ticking = false;
  const maj = (): void => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
    barre.style.transform = `scaleX(${p})`;
    ticking = false;
  };
  const onScroll = (): void => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(maj);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  maj();
  surArret(() => window.removeEventListener('scroll', onScroll));
}

/* =========================================================================
   Cycle de vie
   ========================================================================= */

function demarrer(): void {
  document.documentElement.classList.remove('no-js');
  initMenu();
  initFaq();
  initReveal();
  initSpine();
  initCompteurs();
  initTilt();
  initParallaxe();
  initReseau();
  initProgression();
}

function nettoyer(): void {
  arrets.forEach((fn) => fn());
  arrets = [];
}

demarrer();

// Les transitions de page d'Astro remplacent le DOM sans recharger la page :
// il faut couper les observateurs de l'ancienne page puis tout relancer.
document.addEventListener('astro:before-swap', nettoyer);
document.addEventListener('astro:page-load', demarrer);
