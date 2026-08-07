import { getTranslations } from "next-intl/server";
import { COMPANY } from "@/lib/company";
import { FOUNDER, RECOGNITIONS, SAME_AS, SITE_URL, siteUrl } from "@/lib/site";

/**
 * Données structurées JSON-LD — un seul endroit pour tout le site.
 *
 * L'audit GEO notait 30/100 sur ce poste : un unique bloc `Organization` sur
 * l'accueil, rien sur les autres pages. Or le contenu se prêtait déjà au
 * schema riche — trois villes, quatre services, des H2 en forme de questions.
 * Il n'y avait rien à écrire, seulement à déclarer.
 *
 * ## Le principe du graphe
 *
 * Chaque page émet **un seul** `<script type="application/ld+json">` contenant
 * un `@graph`. Les entités s'y référencent par `@id` plutôt que de se
 * recopier : l'organisation est décrite une fois, le reste y renvoie. Deux
 * descriptions partielles de la même entité valent moins qu'une complète — un
 * moteur qui ne sait pas les fusionner en garde une au hasard.
 *
 * Les `@id` sont des URI stables. **Ne pas les changer** : ils sont ce qui
 * permet de recoller les entités d'une page à l'autre.
 */

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const FOUNDER_ID = `${SITE_URL}/#founder`;

/** Rattache une page à son entreprise et à son site. */
function pageRefs(locale: string, path: string) {
  return {
    url: siteUrl(locale, path),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: locale,
  };
}

/**
 * Les trois implantations, en `LocalBusiness`.
 *
 * Une organisation à adresse unique suffit rarement pour une requête locale
 * (« agence IA à Lubumbashi ») : le moteur doit voir un établissement par
 * ville. Chacun garde son `@id` propre et pointe vers l'organisation mère.
 */
function offices(locale: string) {
  return COMPANY.offices.map((office) => ({
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#office-${office.city.toLowerCase()}`,
    name: `${COMPANY.brand} — ${office.city}`,
    parentOrganization: { "@id": ORGANIZATION_ID },
    url: siteUrl(locale, "/contact"),
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressLocality: office.city,
      addressCountry: "CD",
    },
    areaServed: { "@type": "AdministrativeArea", name: office.city },
  }));
}

/**
 * L'organisation, le site, le fondateur et les établissements — le socle
 * présent sur **toutes** les pages.
 */
export async function baseGraph(locale: string) {
  const t = await getTranslations({ locale, namespace: "site" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  const services = tServices.raw("items") as {
    id: string;
    title: string;
    description: string;
  }[];

  const headquarters =
    COMPANY.offices.find((o) => o.headquarters) ?? COMPANY.offices[0];

  return [
    {
      // `ProfessionalService` hérite de `LocalBusiness` **et** d'`Organization` :
      // un seul type couvre l'entreprise et le commerce local, sans dupliquer
      // l'entité en deux nœuds concurrents.
      "@type": ["ProfessionalService", "Organization"],
      "@id": ORGANIZATION_ID,
      // Le nom déclaré est celui sous lequel la marque se présente
      // partout — en-tête, pied de page, e-mails : « RAPIA ». La graphie
      // « RapIA » de `COMPANY.brand` passe en `alternateName`, pas l'inverse :
      // une entité se nomme comme le public la lit.
      name: t("name"),
      legalName: COMPANY.legalName,
      alternateName: COMPANY.brand,
      description: t("description"),
      slogan: t("positioning"),
      // La racine, pas l'URL localisée : les deux locales décrivent la même
      // entité sous le même `@id`, et deux `url` concurrentes obligeraient un
      // moteur à en choisir une.
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-horisontale-rapia-ligth_mode.png`,
      },
      image: `${SITE_URL}/opengraph-image`,
      email: COMPANY.email,
      telephone: COMPANY.phone,
      sameAs: SAME_AS,
      address: {
        "@type": "PostalAddress",
        streetAddress: headquarters.address,
        addressLocality: headquarters.city,
        addressCountry: "CD",
      },
      areaServed: [
        { "@type": "Country", name: "République démocratique du Congo" },
        { "@type": "Place", name: "Afrique" },
      ],
      knowsLanguage: ["fr", "en"],
      founder: { "@id": FOUNDER_ID },
      // Les immatriculations RDC valent identification officielle : elles
      // distinguent Rapyogo SARL de toute autre entité portant le même nom.
      identifier: COMPANY.registrations.map((reg) => ({
        "@type": "PropertyValue",
        name: reg.label,
        value: reg.value,
      })),
      contactPoint: {
        "@type": "ContactPoint",
        contactType: locale === "fr" ? "Service commercial" : "Sales",
        email: COMPANY.email,
        telephone: COMPANY.phone,
        availableLanguage: ["French", "English"],
        areaServed: "CD",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: tServices("heading"),
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": `${SITE_URL}/#service-${service.id}`,
            name: service.title,
            description: service.description,
            serviceType: service.title,
            provider: { "@id": ORGANIZATION_ID },
            areaServed: { "@type": "Country", name: "CD" },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: COMPANY.brand,
      description: t("description"),
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: ["fr", "en"],
    },
    {
      "@type": "Person",
      "@id": FOUNDER_ID,
      name: FOUNDER.name,
      jobTitle: tAbout("founderRole"),
      worksFor: { "@id": ORGANIZATION_ID },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: FOUNDER.almaMater,
      },
      affiliation: FOUNDER.affiliations.map((name) => ({
        "@type": "Organization",
        name,
      })),
      knowsAbout: services.map((service) => service.title),
      hasCredential: FOUNDER.certifications.map((issuer) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "certification",
        recognizedBy: { "@type": "Organization", name: issuer },
      })),
      award: RECOGNITIONS.map((r) => `${r.issuer} ${r.year}`),
    },
    ...offices(locale),
  ];
}

/** Fil d'Ariane. L'accueil est toujours le premier maillon. */
export function breadcrumb(
  locale: string,
  trail: { name: string; path: string }[],
) {
  const home = { name: "RAPIA", path: "" };
  return {
    "@type": "BreadcrumbList",
    "@id": `${siteUrl(locale, trail[trail.length - 1]?.path ?? "")}#breadcrumb`,
    itemListElement: [home, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(locale, item.path),
    })),
  };
}

/**
 * Une page ordinaire. `type` accepte les sous-types de `WebPage`
 * (`AboutPage`, `ContactPage`, `FAQPage`…) : un moteur qui sait qu'une page
 * *est* une page de contact peut en extraire les coordonnées sans les deviner.
 */
export function webPage(
  locale: string,
  {
    type = "WebPage",
    path,
    name,
    description,
    datePublished,
  }: {
    type?: string;
    path: string;
    name: string;
    description: string;
    /**
     * Date de première publication, au format `AAAA-MM-JJ`.
     *
     * Écrite en dur par la page qui la connaît, **jamais dérivée de la date
     * de build** : un redéploiement sans changement de contenu ferait alors
     * rajeunir la page à chaque fois. Une fraîcheur inventée se détecte et se
     * paie plus cher que pas de date du tout.
     */
    datePublished?: string;
  },
) {
  return {
    "@type": type,
    "@id": `${siteUrl(locale, path)}#webpage`,
    name,
    description,
    ...(datePublished ? { datePublished } : {}),
    ...pageRefs(locale, path),
  };
}

/**
 * Questions/réponses.
 *
 * Le format `FAQPage` est le plus directement réutilisable par un moteur
 * génératif : une question, une réponse autoportante. C'est aussi le plus
 * facile à discréditer — une réponse qui renvoie ailleurs (« contactez-nous »)
 * ne cite rien. **Chaque réponse doit répondre.**
 */
export function faqPage(
  locale: string,
  {
    path,
    name,
    description,
    items,
    datePublished,
  }: {
    path: string;
    name: string;
    description: string;
    items: { question: string; answer: string }[];
    datePublished?: string;
  },
) {
  // Un seul nœud, pas deux. Émettre `WebPage(type: FAQPage)` **et** un
  // `FAQPage` séparé donnait deux entités concurrentes prétendant décrire la
  // même URL : un moteur en garde une, et rien ne dit laquelle. Les
  // métadonnées de page et les questions vivent donc sur le même nœud.
  return {
    "@type": "FAQPage",
    "@id": `${siteUrl(locale, path)}#webpage`,
    name,
    description,
    ...(datePublished ? { datePublished } : {}),
    ...pageRefs(locale, path),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Emballe un ensemble de nœuds dans un `@graph` prêt à sérialiser. */
export function graph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
