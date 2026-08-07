/**
 * Identité web du site — source unique de vérité pour tout ce qui sort du
 * navigateur : canonicals, Open Graph, sitemap, robots.txt, llms.txt, JSON-LD.
 *
 * Pourquoi ce fichier existe : l'audit GEO du 05/08/2026 a trouvé le domaine
 * `rapia.cd` recopié dans quatre fichiers (layout, sitemap, robots, JSON-LD).
 * Ce domaine **ne résout pas en DNS** — NXDOMAIN. Toute la signalisation du
 * site pointait donc vers un domaine mort : canonicals ignorés, image de
 * partage cassée, sitemap inutilisable par les crawlers. La correction ne vaut
 * que si l'URL ne peut plus diverger d'un fichier à l'autre.
 *
 * **Le domaine se change ici, et nulle part ailleurs.**
 *
 * `lib/company.ts` reste la source des coordonnées légales (adresses, RCCM,
 * téléphone). Ce module-ci ne porte que la présence en ligne.
 */

/**
 * Domaine servi en production, vérifié : `ia.rapyogo.com` (alias Vercel).
 *
 * L'override par variable d'environnement sert aux previews. Il ne doit pas
 * masquer une erreur : si `NEXT_PUBLIC_SITE_URL` est absente — c'était le cas
 * en production jusqu'au 06/08/2026 — c'est cette constante qui s'applique,
 * et elle doit être juste.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://ia.rapyogo.com";

/** Chemins publics, hors préfixe de locale. `""` = accueil. */
export const SITE_PATHS = [
  "",
  "/services",
  "/formation",
  "/a-propos",
  "/faq",
  "/notre-vision",
  "/contact",
] as const;

/** URL absolue d'un chemin localisé. */
export function siteUrl(locale: string, path: string = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * Image de partage 1200×630, produite par `app/[locale]/opengraph-image.tsx`.
 *
 * Next l'injecte tout seul dans les pages qui ne déclarent pas d'`openGraph` —
 * mais **dès qu'une page en déclare un, l'objet remplace celui du parent au
 * lieu de le compléter**, et l'image disparaît silencieusement. Toute page qui
 * personnalise son Open Graph doit donc redonner cette image ici.
 */
export function ogImage(locale: string) {
  return {
    url: `${SITE_URL}/${locale}/opengraph-image`,
    width: 1200,
    height: 630,
    alt: "RAPIA — Agence d'intelligence artificielle, RDC",
  };
}

/**
 * La maison mère.
 *
 * `rapyogo.com` porte le groupe ; **chaque service a son sous-domaine**.
 * L'audit lisait cette structure comme une « dilution de l'autorité de
 * marque » et recommandait de tout consolider sur un domaine — le conseil
 * tombe à côté : c'est un portefeuille de produits, pas un site éparpillé par
 * accident. Ce qu'il faut, ce n'est pas fusionner les domaines, c'est **les
 * relier** pour qu'un moteur voie un groupe et non quatre inconnus.
 *
 * `rapyogo.com` est aujourd'hui un domaine parqué chez Hostinger — le nœud
 * central du groupe n'a pas de page. C'est le chaînon manquant le plus
 * rentable qui reste (voir docs/HANDOFF.md).
 */
export const PARENT = {
  legalName: "Rapyogo SARL",
  url: "https://rapyogo.com",
} as const;

/**
 * Les autres services du groupe.
 *
 * Ils valent mieux qu'un organigramme : ils prouvent que RAPIA n'est pas une
 * plaque de conseil, mais l'atelier IA d'un groupe qui exploite ses propres
 * produits en production. Pour une agence dont le métier est la crédibilité,
 * c'est l'argument le plus solide disponible — et il est vrai.
 *
 * `url: null` tant que le service n'a pas d'adresse publique vérifiée : le
 * bloc s'affiche alors sans lien plutôt que de renvoyer dans le vide.
 */
export const SIBLING_SERVICES = [
  { key: "viteat", name: "Viteat", url: null },
  { key: "rapycar", name: "RAPYCAR", url: "https://car.rapyogo.com" },
] as const;

/**
 * Identifiants de plateformes sociales. Sert de clé de correspondance avec les
 * pictogrammes de `components/ui/social-icons.tsx` — **le nom affiché ne peut
 * pas jouer ce rôle** : il change (« Twitter » → « X ») et rien ne garantit
 * qu'il reste identique des deux côtés.
 */
export type SocialKey =
  | "linkedin"
  | "youtube"
  | "tiktok"
  | "facebook"
  | "instagram"
  | "x"
  | "github";

export type SocialPlatform = {
  key: SocialKey;
  /** Nom affiché — sert aussi de `aria-label` sur le lien en pictogramme. */
  name: string;
  url: string | null;
};

/**
 * Profils sociaux — la place est faite pour toutes les plateformes prévues,
 * même celles qui n'ont pas encore d'adresse.
 *
 * `url: null` = plateforme prévue, non publiée. **Renseigner l'URL est le seul
 * geste nécessaire** : le pictogramme apparaît dans le pied de page et l'URL
 * part dans le `sameAs` du JSON-LD, sans toucher à un composant.
 *
 * **N'inscrire qu'une URL ouverte et vérifiée.** Une icône qui ne mène nulle
 * part est pire qu'une icône absente : elle promet une présence, et un `sameAs`
 * mort affaiblit l'entité au lieu de la confirmer. C'est pourquoi TikTok reste
 * vide malgré la mention d'un compte « RapYOGO » dans l'audit — TikTok répond
 * 200 sur n'importe quel `@handle`, existant ou non, et le compte n'a donc pas
 * pu être confirmé.
 */
export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  { key: "linkedin", name: "LinkedIn", url: null },
  { key: "youtube", name: "YouTube", url: null },
  { key: "tiktok", name: "TikTok", url: null },
  { key: "facebook", name: "Facebook", url: null },
  { key: "instagram", name: "Instagram", url: null },
  { key: "x", name: "X", url: null },
  { key: "github", name: "GitHub", url: "https://github.com/rapyogo" },
];

/** Les profils réellement publiables — ceux qui ont une URL. */
export const SOCIALS = SOCIAL_PLATFORMS.filter(
  (platform): platform is SocialPlatform & { url: string } =>
    platform.url !== null,
);

/**
 * Distinctions décernées par des tiers.
 *
 * Elles récompensent **le fondateur et le groupe Rapyogo**, pas RAPIA en tant
 * qu'agence IA : la page « À propos » le dit ainsi. Une distinction
 * agroalimentaire présentée comme un prix d'IA se retourne contre celui qui
 * l'affiche.
 *
 * `url` renvoie au **site officiel de l'organisme**, pas à une page nommant
 * l'intéressé. Le libellé du lien doit le refléter (« le programme », pas
 * « la preuve ») : un lien qui promet une vérification qu'il ne permet pas
 * fait plus de mal que pas de lien.
 *
 * `year` est omis quand l'année n'est pas établie. **Ne pas la deviner.**
 */
export const RECOGNITIONS = [
  {
    id: "gogettaz-2024",
    issuer: "GoGettaz Agripreneur Prize",
    url: "https://gogettaz.africa/",
    year: "2024",
  },
  {
    id: "startupper-totalenergies",
    issuer: "TotalEnergies Startupper de l'Année",
    url: "https://startupper.totalenergies.com/",
    year: null,
  },
  {
    id: "poesam",
    issuer: "Prix Orange de l'Entrepreneur Social (POESAM)",
    url: "https://www.orange.com/fr/prix-orange-entrepreneur-social-afrique-moyen-orient",
    year: null,
  },
] as const;

/**
 * Ce qui atteste l'entité, pour `sameAs`.
 *
 * **Les distinctions n'y figurent pas.** `sameAs` désigne d'autres adresses
 * *de la même entité* — un profil, une fiche, une page qui parle d'elle. Le
 * site d'un organisme qui a décerné un prix n'est pas RAPIA : l'y mettre
 * brouille l'identité au lieu de la confirmer. Les distinctions passent par
 * `award` sur le fondateur et par des liens sortants visibles.
 */
export const SAME_AS: string[] = [
  PARENT.url,
  ...SOCIALS.map((s) => s.url),
];

/**
 * Le fondateur — identité et rattachements, pour le schema `Person` et la page
 * « À propos ».
 *
 * L'audit GEO est formel : pour un consultant IA, **la crédibilité est le
 * produit**. Le site n'affichait aucune biographie, aucune distinction — le
 * levier le plus rentable était aussi le seul inutilisé.
 *
 * Ce module ne porte que des **noms propres** (personne, établissements,
 * organismes) : ils ne se traduisent pas. Les intitulés et la prose vivent
 * dans `messages/*.json`, comme partout ailleurs.
 *
 * Faits transmis par l'intéressé le 2026-08-07, sauf mention contraire.
 */
export const FOUNDER = {
  name: "Michel Bengana",
  /** Ville d'origine. */
  birthPlace: "Bukavu",
  /**
   * Organismes certificateurs. Repérés par l'audit GEO, **confirmés par
   * l'intéressé le 2026-08-07** : ils sont publiables tels quels.
   */
  certifications: ["Microsoft", "Anthropic"],
  /**
   * Domaine du diplôme. L'établissement n'est **pas** publié : l'audit citait
   * l'ULPGL, l'intéressé dit seulement « diplômé en psychologie ». En cas de
   * doute, on publie le fait établi, pas le fait plausible.
   */
  degreeField: "Psychologie",
  /** Programmes et réseaux dont il est issu. */
  affiliations: ["Orange Corners RDC"],
} as const;
