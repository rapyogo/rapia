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
 * Profils externes de la marque.
 *
 * Deux usages qui n'en font qu'un : les liens sortants du pied de page et le
 * `sameAs` du JSON-LD. L'audit relevait **zéro lien externe** sur tout le site
 * — les mentions tierces existaient (GoGettaz, GitHub, TikTok) mais rien ne
 * les reliait à la marque, ni pour un lecteur ni pour un moteur.
 *
 * **N'ajouter ici qu'une URL vérifiée.** Un `sameAs` qui pointe vers un profil
 * inexistant affaiblit l'entité au lieu de la confirmer.
 */
export const SOCIALS = [
  { name: "GitHub", url: "https://github.com/rapyogo" },
] as const;

/*
 * TikTok volontairement absent. L'audit mentionne un compte « RapYOGO », mais
 * TikTok répond 200 sur n'importe quel `@handle`, y compris inexistant : le
 * profil n'a donc pas pu être vérifié depuis ici. Ajouter la ligne
 * `{ name: "TikTok", url: "https://www.tiktok.com/@<handle exact>" }` dès que
 * le handle est confirmé — même chose pour LinkedIn et YouTube quand les pages
 * existeront.
 */

/**
 * Distinctions et mentions par des tiers — les seules preuves de crédibilité
 * que RAPIA possède aujourd'hui, et qui n'étaient nulle part sur le site.
 *
 * Règle produit : **rien ne s'invente ici.** Une distinction se cite avec
 * l'URL qui permet de la vérifier, sinon elle ne se cite pas.
 */
export const RECOGNITIONS = [
  {
    id: "gogettaz-2024",
    issuer: "GoGettaz Africa",
    url: "https://gogettaz.africa/",
    year: "2024",
  },
] as const;

/** Tout ce qui atteste l'entité, pour `sameAs`. */
export const SAME_AS: string[] = [
  ...SOCIALS.map((s) => s.url),
  ...RECOGNITIONS.map((r) => r.url),
];

/**
 * Le fondateur — identité et rattachements, pour le schema `Person` et la page
 * « À propos ».
 *
 * L'audit GEO est formel : pour un consultant IA, **la crédibilité est le
 * produit**. Le site n'affichait aucune biographie, aucun diplôme, aucune
 * certification — le levier le plus rentable était aussi le seul inutilisé.
 *
 * Ce module ne porte que des **noms propres** (personne, établissements,
 * organismes) : ils ne se traduisent pas. Les intitulés et la prose vivent
 * dans `messages/*.json`, comme partout ailleurs.
 *
 * Source de ces faits : l'audit GEO du 05/08/2026. **À faire confirmer par
 * l'intéressé avant toute nouvelle publication** — une certification annoncée
 * et non détenue coûte plus cher que l'absence de page « À propos ».
 */
export const FOUNDER = {
  name: "Michel Bengana",
  /** Organismes certificateurs, dans l'ordre d'affichage. */
  certifications: ["Microsoft", "Anthropic"],
  /** Établissement du diplôme le plus élevé. */
  almaMater: "Université Libre des Pays des Grands Lacs (ULPGL)",
  /** Programmes et réseaux dont il est issu. */
  affiliations: ["Orange Corners"],
} as const;
