export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
  /** true si la réponse contient encore une donnée à confirmer.
      Ces entrées sont exclues du JSON-LD FAQPage pour ne pas publier
      de réponse incomplète dans les résultats de recherche. */
  readonly incomplete: boolean;
}

export const faq: readonly FaqEntry[] = [
  {
    question: 'Combien coûte une installation GoWifi?',
    answer:
      "Le coût dépend du nombre de portes, des services retenus, du câblage existant et des travaux requis. [À CONFIRMER : structure de facturation et éléments inclus au devis]",
    incomplete: true,
  },
  {
    question: 'À qui appartient le matériel installé?',
    answer:
      "[À CONFIRMER : achat, location ou propriété de GoWifi] Le mode de propriété et les conditions de remplacement doivent être indiqués clairement dans le devis et l'entente de service.",
    incomplete: true,
  },
  {
    question: 'Qui est responsable lorsqu’un service tombe en panne?',
    answer:
      "GoWifi devient le point de contact pour les services inclus à l'entente. [À CONFIRMER : limites de responsabilité, heures de support, escalade et SLA]",
    incomplete: true,
  },
  {
    question: 'Qu’arrive-t-il au contrat si je vends l’immeuble?',
    answer:
      "[À CONFIRMER : conditions de transfert, résiliation et traitement du matériel lors d'une vente]",
    incomplete: true,
  },
  {
    question: 'Pouvez-vous utiliser le câblage déjà en place?',
    answer:
      "Nous l'évaluons pendant l'audit. Ce qui peut être conservé est indiqué dans le devis; ce qui doit être remplacé est expliqué avant les travaux.",
    incomplete: false,
  },
  {
    question: 'Combien de temps faut-il pour installer les services?',
    answer:
      "Le délai dépend du nombre de portes, des services choisis, des accès requis et de l'état du câblage. [À CONFIRMER : fourchettes de délai réalistes]",
    incomplete: true,
  },
];
