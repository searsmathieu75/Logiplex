/**
 * Seule sortie JavaScript côté client du site.
 * Deux responsabilités : le menu mobile et l'accordéon FAQ.
 * Tout le contenu reste lisible si ce fichier ne s'exécute jamais.
 */

document.documentElement.classList.remove('no-js');

/* -------------------------------------------------------------------------
   Menu mobile
   ------------------------------------------------------------------------- */

function initMenu(): void {
  const toggle = document.getElementById('menu-toggle');
  const panel = document.getElementById('menu-mobile');
  if (!toggle || !panel) return;

  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');

  const setState = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('hidden', !open);
    if (label) {
      label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
    }
  };

  const close = (returnFocus: boolean): void => {
    setState(false);
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setState(!open);
    if (!open) {
      panel.querySelector<HTMLAnchorElement>('[data-menu-link]')?.focus();
    }
  });

  // Échap referme et rend le focus au bouton.
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      close(true);
    }
  });

  // Naviguer vers une ancre referme le panneau sans voler le focus.
  panel.querySelectorAll<HTMLAnchorElement>('[data-menu-link]').forEach((link) => {
    link.addEventListener('click', () => close(false));
  });

  // Repasser en affichage bureau annule l'état ouvert.
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) close(false);
  });
}

/* -------------------------------------------------------------------------
   Accordéon FAQ
   Le HTML sort du serveur avec aria-expanded="true" et les panneaux visibles.
   Le script les referme ensuite : sans JavaScript, la FAQ reste entièrement
   lisible plutôt que masquée.
   ------------------------------------------------------------------------- */

function initFaq(): void {
  const triggers = document.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]');
  if (triggers.length === 0) return;

  triggers.forEach((trigger) => {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!panel) return;

    const chevron = trigger.querySelector<HTMLElement>('.faq-chevron');

    const setOpen = (open: boolean): void => {
      trigger.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      if (chevron) {
        chevron.style.transform = open ? 'rotate(45deg)' : 'rotate(0deg)';
      }
    };

    setOpen(false);

    trigger.addEventListener('click', () => {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });
  });
}

initMenu();
initFaq();
