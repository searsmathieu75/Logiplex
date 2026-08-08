export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/** Navigation principale. Le CTA est traité séparément dans Header.astro. */
export const primaryNav: readonly NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Fonctionnement', href: '/#fonctionnement' },
  { label: 'Engagements', href: '/#engagements' },
  { label: 'FAQ', href: '/#faq' },
];

export const footerNav: readonly NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
  { label: 'Confidentialité', href: '/confidentialite' },
];

/** Conversion unique du site. Aucun autre appel à l'action n'existe. */
export const cta = {
  label: 'Réserver un appel',
  longLabel: 'Réserver un appel de qualification',
  href: '/contact',
} as const;

export const contactInfo = {
  personne: 'Mathieu',
  telephone: '438 520-1423',
  telephoneHref: 'tel:+14385201423',
  /** Reste nul tant que l'adresse publique n'est pas confirmée.
      Un champ nul est omis du JSON-LD plutôt que rempli d'une valeur fictive. */
  courriel: null as string | null,
} as const;
