import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Boxes,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, graph, webPage } from "@/lib/schema";
import { COMPANY } from "@/lib/company";
import {
  FOUNDER,
  PARENT,
  RECOGNITIONS,
  SIBLING_SERVICES,
  ogImage,
  siteUrl,
} from "@/lib/site";

/**
 * Page « À propos » — la réponse au point le plus lourd de l'audit GEO.
 *
 * Le site notait 35/100 en E-E-A-T pour une raison simple : il ne documentait
 * rien. Pas de biographie, pas de certification, pas de distinction, aucune
 * date. Pour une agence de conseil dont le produit *est* la crédibilité, c'est
 * le seul poste où l'effort se convertit directement en citations.
 *
 * La section « Ce que nous ne publions pas » n'est pas une précaution
 * juridique : c'est la preuve elle-même. Un site qui explique pourquoi il n'a
 * pas de témoignage est plus crédible qu'un site qui en invente — et c'est la
 * règle produit la plus stricte du projet (PRODUCT.md).
 */

const PATH = "/a-propos";

/** Première publication de la page. Voir `webPage()` : jamais dérivée du build. */
const PUBLISHED = "2026-08-07";

/**
 * Icônes des titres, mappées **par index** sur `about.credentials` — comme
 * partout dans le projet, les libellés sont traduits et ne peuvent pas servir
 * de clé. L'ordre : deux certifications professionnelles, un diplôme
 * universitaire, un programme d'accompagnement. Trois natures différentes ;
 * la même icône pour les quatre les aurait fait passer pour quatre diplômes.
 */
const CREDENTIAL_ICONS = [BadgeCheck, BadgeCheck, GraduationCap, Users];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const url = siteUrl(locale, PATH);

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        fr: siteUrl("fr", PATH),
        en: siteUrl("en", PATH),
        "x-default": siteUrl("fr", PATH),
      },
    },
    openGraph: {
      type: "profile",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
      images: [ogImage(locale)],
    },
  };
}

type Credential = { title: string; detail: string };
/** `year` n'est plus ici : il vit dans `RECOGNITIONS` et vaut `null` quand
 *  l'année n'est pas établie. Une distinction sans date reste citable ; une
 *  distinction datée au hasard ne l'est plus. */
type Recognition = { title: string; detail: string; linkLabel: string };
type GroupService = {
  key: string;
  name: string;
  description: string;
  linkLabel?: string;
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const prefix = `/${locale}`;

  const agencyBody = t.raw("agencyBody") as string[];
  // Le nom du fondateur vit dans `lib/site.ts` avec les autres faits, pas dans
  // les fichiers de traduction : il ne se traduit pas et ne doit pas pouvoir
  // diverger entre le français et l'anglais.
  const founderBody = (t.raw("founderBody") as string[]).map((paragraph) =>
    paragraph.replace("{name}", FOUNDER.name),
  );
  const credentials = t.raw("credentials") as Credential[];
  const groupServices = t.raw("groupServices") as GroupService[];
  const recognitions = t.raw("recognitions") as Recognition[];
  const honestyItems = t.raw("honestyItems") as string[];

  const nodes = [
    webPage(locale, {
      type: "AboutPage",
      path: PATH,
      name: t("metaTitle"),
      description: t("metaDescription"),
      datePublished: PUBLISHED,
    }),
    breadcrumb(locale, [{ name: t("heading"), path: PATH }]),
  ];

  const sectionTitle =
    "text-[var(--color-text)] font-bold tracking-[-0.02em] text-[clamp(24px,3vw,34px)]";

  return (
    <>
      <JsonLd data={graph(nodes)} />
      <Header />
      <main id="main-content">
        {/* En-tête */}
        <section className="section pb-0">
          <div className="container-site max-w-3xl">
            <a
              href={prefix}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-indigo)] hover:underline"
            >
              <ArrowLeft size={16} />
              {t("back")}
            </a>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-indigo)]">
              {t("eyebrow")}
            </p>
            <h1 className="mt-4 text-[clamp(30px,5vw,54px)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-text)]">
              {t("heading")}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-secondary)]">
              {t("subtitle")}
            </p>
          </div>
        </section>

        {/* Une seule `.section` pour tout le corps, avec un rythme interne.
            Empiler des `.section` donnait 192 px de blanc entre chaque bloc —
            le rythme de la landing, où chaque section est un écran autonome.
            Sur une page qui se lit d'une traite, ce vide casse la lecture. */}
        <section className="section">
          <div className="container-site max-w-3xl space-y-16 md:space-y-20">
            {/* L'agence */}
            <div>
              <h2 className={sectionTitle}>{t("agencyTitle")}</h2>
            <div className="mt-6 space-y-5">
              {agencyBody.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="leading-relaxed text-[var(--color-text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
              {COMPANY.offices.map((office) => (
                <div
                  key={office.city}
                  className="bg-[var(--color-surface)] p-5"
                >
                  <dt className="text-sm font-bold text-[var(--color-text)]">
                    {office.city}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {office.address}
                  </dd>
                </div>
              ))}
              </dl>
            </div>

            {/* L'écosystème du groupe — la meilleure preuve E-E-A-T
                disponible, et elle est vraie : l'agence qui conseille sur l'IA
                en exploite en production dans les produits de son groupe.
                L'audit lisait les quatre domaines comme une dilution ; ce sont
                des services distincts, et les relier vaut mieux que les
                fusionner. */}
            <div>
              <h2 className={sectionTitle}>{t("groupTitle")}</h2>
              <p className="mt-6 leading-relaxed text-[var(--color-text-secondary)]">
                {t("groupBody")}
              </p>

              <a
                href={PARENT.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-indigo)] hover:underline"
              >
                {t("groupParentLabel")} — {PARENT.legalName}
                <ExternalLink size={14} aria-hidden="true" />
              </a>

              <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {groupServices.map((service) => {
                  // Mappé par clé, pas par index : les services du groupe
                  // n'ont pas d'ordre imposé et peuvent être réordonnés dans
                  // la traduction sans casser les liens.
                  const source = SIBLING_SERVICES.find(
                    (s) => s.key === service.key,
                  );
                  return (
                    <li
                      key={service.key}
                      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-indigo)]/8 text-[var(--color-indigo)]">
                        <Boxes size={17} />
                      </div>
                      <p className="font-bold text-[var(--color-text)]">
                        {service.name}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {service.description}
                      </p>
                      {/* Sans URL publique, le service est cité sans lien
                          plutôt que renvoyé dans le vide. */}
                      {source?.url && service.linkLabel && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-indigo)] hover:underline"
                        >
                          {service.linkLabel}
                          <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Le fondateur */}
            <div>
              <h2 className={sectionTitle}>{t("founderTitle")}</h2>
            <p className="mt-4 text-sm font-semibold text-[var(--color-text)]">
              {FOUNDER.name}
              <span className="ml-2 font-normal text-[var(--color-text-secondary)]">
                — {t("founderRole")}
              </span>
            </p>
            <div className="mt-5 space-y-5">
              {founderBody.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="leading-relaxed text-[var(--color-text-secondary)]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <h3 className="mt-12 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
              {t("credentialsTitle")}
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {credentials.map((credential, index) => {
                const Icon = CREDENTIAL_ICONS[index] ?? BadgeCheck;
                return (
                <li
                  key={credential.title}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-deep)]/5 text-[var(--color-deep)]">
                    <Icon size={17} />
                  </div>
                  <p className="font-bold text-[var(--color-text)]">
                    {credential.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {credential.detail}
                  </p>
                </li>
                );
              })}
              </ul>
            </div>

            {/* Distinctions */}
            <div>
              <h2 className={sectionTitle}>{t("recognitionsTitle")}</h2>
              {/* Dire ce que la distinction récompense vraiment. Un prix
                  agroalimentaire présenté comme un prix d'IA se retourne
                  contre celui qui l'affiche — et un lecteur le voit. */}
              <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                {t("recognitionsIntro")}
              </p>
            <ul className="mt-6 space-y-4">
              {recognitions.map((recognition, index) => {
                // Les distinctions sont mappées par index sur `RECOGNITIONS` :
                // le titre est traduit et ne peut pas servir de clé.
                const source = RECOGNITIONS[index];
                return (
                  <li
                    key={recognition.title}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-amber)]/12 text-[var(--color-amber-ink)]">
                        <Award size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-text)]">
                          {recognition.title}
                          {source?.year && (
                            <span className="ml-2 text-sm font-medium text-[var(--color-text-secondary)]">
                              {source.year}
                            </span>
                          )}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                          {recognition.detail}
                        </p>
                        {source && (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-indigo)] hover:underline"
                          >
                            {recognition.linkLabel}
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
              </ul>
            </div>

            {/* Ce que nous ne publions pas */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-emerald)]/12 text-[var(--color-emerald-ink)]">
                <ShieldCheck size={18} />
              </div>
              <h2 className="text-[clamp(20px,2.4vw,26px)] font-bold tracking-[-0.01em] text-[var(--color-text)]">
                {t("honestyTitle")}
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                {t("honestyBody")}
              </p>
              <ul className="mt-6 space-y-3">
                {honestyItems.map((item) => (
                  <li
                    key={item.slice(0, 40)}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--color-text-secondary)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-emerald)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Conversion — seul emploi du Deep Profond en fond du site */}
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-deep)] p-8 text-white md:p-10">
              <h2 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.01em]">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-white/70">
                {t("ctaBody")}
              </p>
              <div className="mt-7">
                <Button
                  variant="secondary"
                  size="lg"
                  href={`${prefix}/contact`}
                >
                  {t("ctaButton")}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
