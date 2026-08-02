/**
 * Contenu statique et configuration du site RAPIA.
 * Centralise tout le texte pour faciliter la maintenance et l'i18n future.
 */

export const SITE = {
  name: "RAPIA",
  tagline: "Conseil. Formation. Implémentation. Automatisation.",
  description:
    "RAPIA accompagne les entreprises, organisations et professionnels à intégrer l'intelligence artificielle dans leurs opérations.",
  url: "https://rapia.cd",
  email: "contact@rapyogo.com",
  location: "République Démocratique du Congo",
} as const;

export const NAVIGATION = {
  main: [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "/#services" },
    { label: "Formation", href: "/#academy" },
    { label: "À propos", href: "/#why-rapia" },
    { label: "Contact", href: "/contact" },
  ],
  mobile: [
    { label: "Accueil", href: "/", icon: "Home" },
    { label: "Services", href: "/#services", icon: "Briefcase" },
    { label: "Formation", href: "/#academy", icon: "GraduationCap" },
    { label: "Contact", href: "/contact", icon: "Mail" },
  ],
  cta: {
    label: "Parler à un expert IA",
    href: "/contact",
  },
} as const;

export const HERO = {
  eyebrow: "AGENCE D'INTELLIGENCE ARTIFICIELLE | RDC",
  title: "L'IA ne doit pas seulement répondre. Elle doit travailler pour vous.",
  subtitle:
    "RAPIA aide les entreprises, organisations et professionnels à intégrer l'intelligence artificielle dans leurs opérations, former leurs équipes et construire des systèmes capables d'automatiser des tâches réelles.",
  primaryCta: "Parler à un expert IA",
  secondaryCta: "Explorer nos solutions",
  credibility: "Conseil • Formation • Implémentation • Automatisation",
} as const;

export const PROBLEM_LEVELS = {
  heading: "Avoir ChatGPT n'est pas encore avoir intégré l'IA.",
  levels: [
    {
      number: "01",
      title: "Discuter",
      description:
        "L'utilisateur pose des questions à une IA. C'est le niveau de base que la plupart des organisations connaissent aujourd'hui.",
    },
    {
      number: "02",
      title: "Connecter",
      description:
        "L'IA commence à communiquer avec les outils et données de l'organisation. Les réponses deviennent contextualisées et pertinentes.",
    },
    {
      number: "03",
      title: "Déléguer",
      description:
        "Des agents IA exécutent des tâches et des workflows complets avec supervision humaine. L'IA devient un membre actif de l'équipe.",
    },
  ],
  highlight:
    "RAPIA accompagne les organisations vers les niveaux 2 et 3.",
} as const;

export const SERVICES = {
  heading: "Ce que nous faisons",
  subtitle:
    "Quatre piliers pour transformer l'intelligence artificielle en résultats concrets.",
  items: [
    {
      id: "conseil",
      number: "01",
      title: "Conseil IA",
      description:
        "Identifier les tâches, processus et fonctions dans lesquels l'IA peut créer le plus de valeur.",
      features: [
        "Audit IA",
        "Stratégie d'adoption",
        "Cartographie des processus",
        "Identification des opportunités",
        "Feuille de route IA",
      ],
      cta: "Découvrir le conseil",
      href: "/#contact",
    },
    {
      id: "formation",
      number: "02",
      title: "Formation IA",
      description:
        "Former les équipes à une utilisation professionnelle, sécurisée et productive de l'intelligence artificielle.",
      features: [
        "Formation entreprise",
        "Ateliers pratiques",
        "Formation dirigeants",
        "Ingénierie des prompts",
        "Utilisation professionnelle des assistants IA",
      ],
      cta: "Voir les formations",
      href: "/#academy",
    },
    {
      id: "implementation",
      number: "03",
      title: "Implémentation IA",
      description:
        "Construire et intégrer des systèmes IA adaptés aux besoins réels de l'organisation.",
      features: [
        "Assistants IA",
        "Systèmes RAG",
        "Bases de connaissances",
        "Intégration de modèles IA",
        "Systèmes documentaires intelligents",
      ],
      cta: "Parler d'un projet",
      href: "/contact",
    },
    {
      id: "automatisation",
      number: "04",
      title: "Automatisation & Agents IA",
      description:
        "Automatiser les tâches répétitives et construire des agents capables d'exécuter des workflows.",
      features: [
        "Automatisation des processus",
        "Agents IA",
        "Qualification de prospects",
        "Traitement documentaire",
        "Support client et reporting",
      ],
      cta: "Automatiser un processus",
      href: "/contact",
    },
  ],
} as const;

export const PROCESS = {
  heading: "Comment nous travaillons",
  subtitle:
    "Une méthodologie éprouvée pour passer du problème à la solution, avec les équipes au centre.",
  steps: [
    {
      number: "01",
      title: "Comprendre",
      description:
        "Nous analysons vos objectifs, vos processus et vos difficultés.",
    },
    {
      number: "02",
      title: "Identifier",
      description:
        "Nous identifions les tâches et processus présentant le meilleur potentiel d'utilisation de l'IA.",
    },
    {
      number: "03",
      title: "Construire",
      description: "Nous concevons et implémentons la solution adaptée.",
    },
    {
      number: "04",
      title: "Former",
      description:
        "Nous accompagnons les équipes afin que la technologie soit réellement adoptée.",
    },
  ],
} as const;

export const USE_CASES = {
  heading: "Cas d'usage concrets",
  subtitle:
    "L'IA n'est pas un concept abstrait. Voici comment elle transforme des secteurs entiers.",
  cases: [
    {
      sector: "Ressources Humaines",
      before: "Tri manuel de CV et documents RH chronophage.",
      intervention:
        "Automatisation du tri, synthèse de documents et aide à la préparation des fiches.",
      result:
        "Traitement accéléré, équipe RH recentrée sur l'humain.",
    },
    {
      sector: "Commercial",
      before: "Prospects non qualifiés, temps perdu en recherche d'informations.",
      intervention:
        "Qualification automatique des prospects et préparation des informations nécessaires.",
      result:
        "Commerciaux mieux préparés, cycle de vente raccourci.",
    },
    {
      sector: "Service Client",
      before: "Questions fréquentes qui saturent les équipes support.",
      intervention:
        "Assistant IA capable de répondre aux questions fréquentes et d'escalader les cas complexes.",
      result:
        "Temps de réponse réduit, satisfaction client améliorée.",
    },
    {
      sector: "ONG",
      before: "Collecte et analyse manuelles des données de projets.",
      intervention:
        "Accélération de la collecte, de l'analyse et de la synthèse des informations.",
      result:
        "Reporting plus rapide, meilleure allocation des ressources.",
    },
    {
      sector: "Finance & Administration",
      before: "Tâches documentaires et rapports manuels répétitifs.",
      intervention:
        "Automatisation des tâches documentaires, rapports et workflows internes.",
      result:
        "Réduction des erreurs, gain de temps significatif.",
    },
    {
      sector: "Direction",
      before: "Décisions basées sur des informations fragmentées.",
      intervention:
        "Systèmes de synthèse et d'analyse pour une vue d'ensemble rapide.",
      result:
        "Décisions plus rapides, mieux informées.",
    },
  ],
} as const;

export const ACADEMY = {
  heading: "Former les humains qui travailleront avec l'IA.",
  subtitle:
    "RAPIA Academy : des formations conçues pour tous les niveaux, du dirigeant à l'équipe opérationnelle.",
  formations: [
    "Fondamentaux de l'IA",
    "IA générative",
    "ChatGPT, Claude, Gemini et autres LLM",
    "Automatisation",
    "Agents IA",
    "IA pour dirigeants",
    "IA pour équipes administratives",
    "IA pour ONG",
    "IA pour entrepreneurs",
  ],
  cta: "Voir les formations",
} as const;

export const WHY_RAPIA = {
  heading: "Pourquoi RAPIA ?",
  subtitle:
    "Dans un marché saturé de promesses, voici ce qui fait la différence.",
  arguments: [
    {
      title: "Compréhension du terrain africain",
      description:
        "Nos solutions sont pensées en fonction des réalités opérationnelles des organisations en RDC et en Afrique.",
    },
    {
      title: "Approche orientée résultats",
      description:
        "Nous ne commençons pas par l'outil. Nous commençons par le problème.",
    },
    {
      title: "Formation + Implémentation",
      description:
        "Nous ne nous contentons pas de construire une solution. Nous aidons également les équipes à l'adopter.",
    },
    {
      title: "Technologies multiples",
      description:
        "RAPIA est agnostique vis-à-vis des outils. Le meilleur modèle dépend du problème à résoudre.",
    },
    {
      title: "Accompagnement humain",
      description:
        "L'objectif n'est pas de remplacer les équipes. L'objectif est de leur permettre de travailler mieux, plus rapidement et avec davantage de capacité.",
    },
  ],
} as const;

export const TECHNOLOGIES = {
  heading: "Notre écosystème technologique",
  subtitle:
    "Nous choisissons la technologie en fonction du problème, pas l'inverse.",
  categories: [
    {
      title: "LLM",
      description:
        "ChatGPT, Claude, Gemini, Mistral, DeepSeek et autres modèles pertinents.",
    },
    {
      title: "Automatisation",
      description:
        "Workflows, API, intégrations et automatisations sur mesure.",
    },
    {
      title: "Données",
      description:
        "Bases de données, documents, knowledge bases et systèmes RAG.",
    },
    {
      title: "Agents",
      description:
        "Agents IA capables d'exécuter des tâches et des workflows de manière autonome.",
    },
  ],
} as const;

export const FOR_WHOM = {
  heading: "Pour qui ?",
  subtitle: "Quelle que soit votre organisation, nous avons une approche adaptée.",
  audiences: [
    {
      title: "Entreprises",
      description:
        "Améliorez votre productivité et automatisez vos opérations.",
      cta: "Parler à un expert",
      href: "/contact",
    },
    {
      title: "ONG",
      description:
        "Optimisez vos processus, la documentation, le reporting et la gestion des connaissances.",
      cta: "Découvrir comment",
      href: "/contact",
    },
    {
      title: "Institutions",
      description:
        "Formez vos équipes et structurez une stratégie d'adoption de l'IA.",
      cta: "Former mes équipes",
      href: "/contact",
    },
    {
      title: "Professionnels",
      description:
        "Développez des compétences directement applicables dans votre travail.",
      cta: "Voir les formations",
      href: "/#academy",
    },
  ],
} as const;

export const SOCIAL_PROOF = {
  heading: "Ils nous font confiance",
  subtitle:
    "Des organisations qui ont choisi d'intégrer l'IA avec RAPIA.",
  placeholder: true,
} as const;

export const CONTENT_SECTION = {
  heading: "Comprendre l'IA avant de l'adopter.",
  subtitle:
    "Articles, analyses et ressources pour démystifier l'intelligence artificielle.",
  categories: [
    "Intelligence artificielle",
    "Automatisation",
    "Agents IA",
    "Productivité",
    "Transformation numérique",
    "IA en Afrique",
    "Formation",
  ],
  placeholder: true,
} as const;

export const FINAL_CTA = {
  title: "Votre organisation utilise-t-elle vraiment l'IA ?",
  text: "Parlons de vos processus, de vos difficultés et des opportunités que l'intelligence artificielle peut créer dans votre organisation.",
  primaryCta: "Demander un diagnostic IA",
  secondaryCta: "Nous contacter",
} as const;

export const CONTACT = {
  heading: "Parlons de votre projet",
  subtitle:
    "Dites-nous ce que vous souhaitez améliorer grâce à l'IA. Nous vous répondons sous 24h.",
  email: "contact@rapyogo.com",
  formLabels: {
    name: "Nom",
    organization: "Organisation",
    email: "Email",
    phone: "Téléphone",
    orgType: "Type d'organisation",
    need: "Besoin principal",
    message: "Message",
  },
  orgTypes: [
    "Entreprise",
    "ONG",
    "Institution publique",
    "Startup",
    "Professionnel indépendant",
    "Autre",
  ],
  needs: [
    "Former mon équipe",
    "Automatiser un processus",
    "Mettre en place un système IA",
    "Développer un agent IA",
    "Élaborer une stratégie IA",
    "Autre",
  ],
  mainQuestion: "Que souhaitez-vous améliorer grâce à l'IA ?",
  submitCta: "Envoyer ma demande",
} as const;
