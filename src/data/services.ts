export interface Service {
  /** Segment d'URL. La page vit à /{slug}. */
  readonly slug: string;
  /** Accent coloré du service. Alimente --accent : bordure, lueur, nœud. */
  readonly accent: string;
  /** Nom court, utilisé en navigation et en fil d'Ariane. */
  readonly name: string;
  /** H1 de la page de service. Unique dans tout le site. */
  readonly h1: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  /** Résumé affiché sur la grille de la page d'accueil. */
  readonly cardBlurb: string;
  /** Libellé du lien vers la page. Explicite hors contexte. */
  readonly cardLinkLabel: string;
  /** Ce que le service est, concrètement. */
  readonly definition: string;
  /** Situations où le service devient pertinent. */
  readonly situations: readonly string[];
  /** Ce qui est inclus. Valeurs à confirmer avant publication. */
  readonly included: readonly string[];
  /** Prérequis techniques du bâtiment. */
  readonly prerequisites: readonly string[];
  /** Répartition des responsabilités entre GoWifi et le client. */
  readonly responsibilities: readonly { readonly party: string; readonly scope: string }[];
}

export const services: readonly Service[] = [
  {
    slug: 'internet-partage',
    accent: '#00e5ff',
    name: 'Internet partagé',
    h1: "Une seule entrée internet, distribuée à l'ensemble de l'immeuble.",
    metaTitle: 'Internet partagé pour immeubles multilogements | GoWifi',
    metaDescription:
      "Distribution d'une connexion internet à l'échelle d'un immeuble de 6 à 200 portes : réseau intérieur, accès par logement et espaces communs. Réservez un appel de qualification.",
    cardBlurb:
      "Distribuez une connexion à l'échelle de l'immeuble avec des accès adaptés aux logements et aux espaces communs.",
    cardLinkLabel: 'Voir le service internet partagé',
    definition:
      "L'internet partagé remplace la logique d'un abonnement par logement par une seule entrée de service au bâtiment, redistribuée ensuite vers chaque unité et vers les espaces communs par un réseau intérieur que nous concevons et exploitons. Le résident branche son appareil et accède à sa portion du réseau; il ne gère aucun contrat, aucun modem et aucun rendez-vous d'installation.",
    situations: [
      "L'immeuble se construit ou se rénove et le câblage intérieur peut encore être décidé plutôt que subi.",
      "Le propriétaire veut inclure la connexion au loyer ou aux frais de copropriété comme argument de location.",
      "Les résidents se plaignent de la couverture dans les corridors, le stationnement souterrain, la buanderie ou la salle communautaire.",
      "Un service tiers du bâtiment — caméras, interphone, serrures, thermostats — a besoin d'un réseau fiable qui ne dépend pas de la connexion personnelle d'un résident.",
    ],
    included: [
      "[À CONFIRMER : débit garanti par logement et méthode de dimensionnement selon le nombre de portes]",
      "[À CONFIRMER : équipement fourni — routeur de tête, commutateurs, bornes d'accès, nombre de bornes par étage]",
      "[À CONFIRMER : isolation entre les logements et traitement de la vie privée sur le réseau partagé]",
      "[À CONFIRMER : gestion des accès résidents lors d'un déménagement — délai et procédure]",
      "[À CONFIRMER : supervision du réseau et fréquence des mises à jour de sécurité]",
    ],
    prerequisites: [
      "Un local technique ou un emplacement fermé pouvant recevoir l'équipement de tête, avec alimentation électrique dédiée.",
      "Un point d'entrée de service utilisable depuis la voie publique jusqu'au local technique.",
      "Un accès aux colonnes montantes, gaines ou plénums pour rejoindre chaque étage.",
      "[À CONFIRMER : catégorie de câblage minimale acceptée et conditions de réutilisation du câblage coaxial existant]",
    ],
    responsibilities: [
      {
        party: 'GoWifi',
        scope: "Conception du réseau, installation, mise en service, supervision et intervention sur l'équipement couvert par l'entente.",
      },
      {
        party: 'Propriétaire ou gestionnaire',
        scope: "Accès au local technique et aux aires communes, alimentation électrique, et communication aux résidents lors d'une intervention planifiée.",
      },
      {
        party: 'Résident',
        scope: "Ses propres appareils et son usage. Aucun contrat individuel, aucun équipement à installer.",
      },
    ],
  },
  {
    slug: 'surveillance-ip',
    accent: '#8b5cf6',
    name: 'Surveillance IP',
    h1: 'Des caméras qui servent réellement quand il faut retrouver un événement.',
    metaTitle: 'Surveillance IP pour immeubles multilogements | GoWifi',
    metaDescription:
      "Caméras IP, enregistrement et accès aux images pour immeubles de 6 à 200 portes, installés et pris en charge par la même équipe que le réseau. Réservez un appel de qualification.",
    cardBlurb:
      "Centralisez les caméras et l'accès aux images dans une installation pensée pour le bâtiment.",
    cardLinkLabel: 'Voir le service de surveillance IP',
    definition:
      "La surveillance IP couvre le choix des points de vue, l'installation des caméras, l'enregistrement et la manière dont une personne autorisée retrouve une séquence précise. La question déterminante n'est pas le nombre de caméras mais la chaîne complète : ce qui est réellement visible à l'image, combien de temps l'enregistrement est conservé, et qui peut y accéder sans passer par un technicien.",
    situations: [
      "Des colis disparaissent dans le hall ou des véhicules sont endommagés au stationnement, et les images actuelles sont inutilisables.",
      "Un système existe déjà mais personne dans l'immeuble ne sait comment extraire une séquence à une date donnée.",
      "L'assureur ou le syndicat exige une couverture des accès et des aires communes.",
      "Les caméras actuelles tournent sur le réseau personnel d'un concierge ou d'un résident, ce qui rend le service dépendant d'une personne.",
    ],
    included: [
      "[À CONFIRMER : durée de conservation des images et emplacement de stockage — sur site, hors site ou combiné]",
      "[À CONFIRMER : résolution, angle et performance en basse luminosité des caméras proposées]",
      "[À CONFIRMER : méthode d'accès aux images — application, poste local, navigateur — et gestion des comptes]",
      "[À CONFIRMER : procédure d'extraction d'une séquence pour un corps policier ou un assureur, et délai]",
      "[À CONFIRMER : conformité à la Loi 25 sur la protection des renseignements personnels et affichage requis]",
    ],
    prerequisites: [
      "Un réseau intérieur capable de porter le débit continu des caméras jusqu'au point d'enregistrement.",
      "Un emplacement sécurisé et ventilé pour l'enregistreur, hors de portée des zones publiques.",
      "Une alimentation PoE ou une alimentation locale à chaque point de caméra.",
      "[À CONFIRMER : zones dont la captation est interdite ou restreinte, et politique d'affichage aux entrées]",
    ],
    responsibilities: [
      {
        party: 'GoWifi',
        scope: "Positionnement des caméras, installation, configuration de l'enregistrement, création des accès et maintien du système en service.",
      },
      {
        party: 'Propriétaire ou gestionnaire',
        scope: "Décision des zones couvertes, désignation des personnes autorisées, affichage réglementaire et réponse aux demandes d'accès des résidents.",
      },
      {
        party: 'Point à trancher au contrat',
        scope: "[À CONFIRMER : qui consulte les images au quotidien et qui répond à une demande d'extraction]",
      },
    ],
  },
  {
    slug: 'interphone',
    accent: '#f59e0b',
    name: 'Interphone',
    h1: "Contrôler qui entre, sans dépendre d'un système que plus personne ne sait configurer.",
    metaTitle: 'Interphone pour immeubles multilogements | GoWifi',
    metaDescription:
      "Interphone d'entrée, appels vers les résidents et gestion des accès visiteurs pour immeubles de 6 à 200 portes. Réservez un appel de qualification.",
    cardBlurb:
      "Gérez les appels à l'entrée et l'accès des visiteurs sans ajouter un autre système isolé.",
    cardLinkLabel: "Voir le service d'interphone",
    definition:
      "L'interphone est le point de contact entre un visiteur à la porte et un résident à l'intérieur. Le service couvre le poste d'entrée, l'acheminement de l'appel vers le résident, l'ouverture de la porte, et surtout la mise à jour du répertoire : un interphone se dégrade non pas parce qu'il tombe en panne, mais parce que les noms et les numéros cessent d'être tenus à jour au fil des déménagements.",
    situations: [
      "Le panneau d'entrée affiche encore les noms d'anciens locataires et personne ne sait comment le modifier.",
      "Le système repose sur des lignes téléphoniques cuivre dont le coût mensuel augmente ou dont le service est en voie de retrait.",
      "Les livreurs n'arrivent pas à joindre les résidents et laissent les colis à l'extérieur.",
      "Le remplacement de l'interphone est envisagé en même temps que le réseau ou les caméras, et coordonner trois fournisseurs est irréaliste.",
    ],
    included: [
      "[À CONFIRMER : modèle de poste d'entrée, présence d'un écran, d'une caméra et lisibilité au soleil direct]",
      "[À CONFIRMER : acheminement des appels — ligne résidentielle, cellulaire, application ou poste intérieur]",
      "[À CONFIRMER : méthode de mise à jour du répertoire et délai après un changement de locataire]",
      "[À CONFIRMER : accès visiteurs et livreurs — code temporaire, plage horaire, journal des ouvertures]",
      "[À CONFIRMER : intégration aux serrures, gâches électriques et portes de garage existantes]",
    ],
    prerequisites: [
      "Un point réseau au poste d'entrée, ou un chemin de câble permettant de l'amener.",
      "Une gâche électrique ou un mécanisme d'ouverture compatible sur la porte concernée.",
      "Une alimentation stable au panneau d'entrée et au contrôleur de porte.",
      "[À CONFIRMER : compatibilité avec les câblages d'interphone analogique existants et cas de remplacement obligatoire]",
    ],
    responsibilities: [
      {
        party: 'GoWifi',
        scope: "Installation du poste d'entrée, raccordement au mécanisme de porte, configuration de l'acheminement des appels et maintien du système en service.",
      },
      {
        party: 'Propriétaire ou gestionnaire',
        scope: "Transmission des changements de locataires, règles d'accès des visiteurs et responsabilité des clés et codes remis.",
      },
      {
        party: 'Point à trancher au contrat',
        scope: "[À CONFIRMER : qui effectue les modifications de répertoire — le gestionnaire en autonomie ou GoWifi sur demande]",
      },
    ],
  },
  {
    slug: 'telephonie-ip',
    accent: '#3b82f6',
    name: 'Téléphonie IP',
    h1: "Les lignes dont l'immeuble a besoin, sans ligne cuivre à maintenir.",
    metaTitle: 'Téléphonie IP pour immeubles multilogements | GoWifi',
    metaDescription:
      "Lignes téléphoniques IP pour la gestion, les espaces communs, l'ascenseur et les équipements d'immeuble. Réservez un appel de qualification.",
    cardBlurb:
      "Regroupez les lignes nécessaires à la gestion, aux espaces communs et aux équipements de l'immeuble.",
    cardLinkLabel: 'Voir le service de téléphonie IP',
    definition:
      "La téléphonie IP fait passer les lignes du bâtiment par le réseau plutôt que par une paire de cuivre. Il ne s'agit pas des téléphones personnels des résidents mais des lignes que l'immeuble possède en propre : bureau de gestion, salle communautaire, ligne d'urgence d'ascenseur, panneau d'alarme, interphone. Ce sont souvent les lignes les plus coûteuses au prorata de leur usage réel.",
    situations: [
      "La facture téléphonique de l'immeuble contient des lignes dont personne ne connaît plus l'usage exact.",
      "Le fournisseur annonce le retrait progressif du service cuivre dans le secteur.",
      "Un bureau de gestion couvre plusieurs immeubles et veut un numéro unique avec acheminement selon l'immeuble appelé.",
      "Une ligne d'urgence d'ascenseur ou de panneau d'alarme doit être conservée et sa continuité prouvée à un inspecteur.",
    ],
    included: [
      "[À CONFIRMER : nombre de lignes incluses par entente et coût d'une ligne supplémentaire]",
      "[À CONFIRMER : conservation des numéros existants — portabilité, délai et frais]",
      "[À CONFIRMER : traitement des lignes critiques — ascenseur et panneau d'alarme — et comportement en cas de panne électrique]",
      "[À CONFIRMER : messagerie vocale, renvoi d'appel, groupes de sonnerie et horaires d'ouverture]",
      "[À CONFIRMER : appareils fournis ou utilisation d'une application sur appareil existant]",
    ],
    prerequisites: [
      "Une connexion internet du bâtiment avec priorisation du trafic voix.",
      "Un point réseau à chaque emplacement de poste téléphonique.",
      "[À CONFIRMER : alimentation de secours exigée pour les lignes de sécurité et durée d'autonomie requise]",
      "[À CONFIRMER : exigences du code du bâtiment applicables aux lignes d'ascenseur au Québec]",
    ],
    responsibilities: [
      {
        party: 'GoWifi',
        scope: "Mise en place des lignes, configuration de l'acheminement, portabilité des numéros et maintien du service téléphonique couvert.",
      },
      {
        party: 'Propriétaire ou gestionnaire',
        scope: "Inventaire des lignes à conserver, décision des numéros à porter et validation des règles d'acheminement.",
      },
      {
        party: 'Point à trancher au contrat',
        scope: "[À CONFIRMER : responsabilité en cas de défaillance d'une ligne d'urgence pendant une panne d'internet ou d'électricité]",
      },
    ],
  },
  {
    slug: 'iptv',
    accent: '#ec4899',
    name: 'IPTV',
    h1: 'La télévision livrée par le même réseau que le reste du bâtiment.',
    metaTitle: 'IPTV pour immeubles multilogements | GoWifi',
    metaDescription:
      "Service télévisuel géré par IP pour les logements et les espaces communs d'un immeuble multilogements. Réservez un appel de qualification.",
    cardBlurb:
      "Prévoyez un service télévisuel géré pour les logements ou les espaces communs selon les besoins du bâtiment.",
    cardLinkLabel: 'Voir le service IPTV',
    definition:
      "L'IPTV distribue la télévision par le réseau du bâtiment au lieu du câble coaxial traditionnel. Concrètement, cela supprime une infrastructure parallèle à entretenir : le même câblage sert la connexion internet, les caméras, l'interphone et la télévision. Le service prend son sens surtout dans les bâtiments où la télévision fait partie de l'offre — résidences, meublés, espaces communs — plutôt que là où chaque résident garde son propre abonnement.",
    situations: [
      "Une résidence ou un immeuble meublé inclut la télévision dans le loyer et veut un service uniforme entre les unités.",
      "La salle communautaire, le gymnase ou le hall doit afficher des chaînes ou de l'information sans décodeur individuel.",
      "Le réseau coaxial existant se dégrade et son remplacement coûte plus cher que la distribution par le réseau déjà prévu.",
      "Le bâtiment est en construction et poser une seule infrastructure plutôt que deux réduit le coût au pied carré.",
    ],
    included: [
      "[À CONFIRMER : chaînes et forfaits disponibles, et entente de distribution applicable au Québec]",
      "[À CONFIRMER : appareil requis par téléviseur — décodeur, application ou téléviseur compatible]",
      "[À CONFIRMER : nombre de flux simultanés par logement et débit consommé par flux]",
      "[À CONFIRMER : facturation — incluse au loyer, refacturée au bâtiment ou payée par le résident]",
      "[À CONFIRMER : droits de diffusion applicables aux espaces communs et aux lieux publics]",
    ],
    prerequisites: [
      "Une capacité réseau suffisante pour absorber les flux vidéo simultanés sans dégrader les autres services.",
      "Un point réseau ou une couverture sans fil stable à chaque emplacement de téléviseur.",
      "[À CONFIRMER : compatibilité avec les téléviseurs déjà en place et cas nécessitant un appareil externe]",
      "[À CONFIRMER : conditions de réutilisation du réseau coaxial existant, s'il y a lieu]",
    ],
    responsibilities: [
      {
        party: 'GoWifi',
        scope: "Dimensionnement du réseau pour la vidéo, mise en service du signal et maintien du service pour les emplacements couverts.",
      },
      {
        party: 'Propriétaire ou gestionnaire',
        scope: "Choix des emplacements desservis, décision du mode de facturation et détention des droits requis pour la diffusion en espace commun.",
      },
      {
        party: 'Point à trancher au contrat',
        scope: "[À CONFIRMER : responsabilité du contenu diffusé et des ententes de licence]",
      },
    ],
  },
];

/** Recherche par slug, utilisée par les pages de service. */
export function getService(slug: string): Service {
  const found = services.find((service) => service.slug === slug);
  if (!found) {
    throw new Error(`Service introuvable pour le slug « ${slug} ».`);
  }
  return found;
}
