import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  BlockTitle,
  PageBody,
  PageCta,
  PageFigure,
  PageHeader,
  PageShell,
} from "@/components/layout/PageShell";
import { breadcrumb, graph, webPage } from "@/lib/schema";
import { COMPANY } from "@/lib/company";
import { SITE_URL, ogImage, siteUrl } from "@/lib/site";

/**
 * Page Formation — RAPIA Academy.
 *
 * Le catalogue (`academy.formations`) reste dans son namespace d'origine : il
 * alimente aussi la section de la landing, et deux listes de modules qui
 * divergeraient seraient invisibles jusqu'au jour où un client compare.
 *
 * Le schema est un `EducationalOrganization` distinct de l'agence. C'est
 * exact — Academy est une activité de formation, pas un service de conseil —
 * et c'est ce qui permet à un moteur de répondre « où se former à l'IA en
 * RDC » sans passer par la page d'accueil.
 */

const PATH = "/formation";
const PUBLISHED = "2026-08-07";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainingPage" });
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
      type: "website",
      title: t("metaTitle"),
      description: t("metaDescription"),
      url,
      images: [ogImage(locale)],
    },
  };
}

type Format = { title: string; description: string; audience: string };

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trainingPage" });
  const tAcademy = await getTranslations({ locale, namespace: "academy" });
  const prefix = `/${locale}`;

  const intro = t.raw("intro") as string[];
  const formats = t.raw("formats") as Format[];
  const delivery = t.raw("deliveryItems") as string[];
  const catalog = tAcademy.raw("formations") as string[];

  const nodes = [
    webPage(locale, {
      path: PATH,
      name: t("metaTitle"),
      description: t("metaDescription"),
      datePublished: PUBLISHED,
    }),
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#academy`,
      name: "RAPIA Academy",
      description: t("metaDescription"),
      url: siteUrl(locale, PATH),
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      email: COMPANY.email,
      telephone: COMPANY.phone,
      areaServed: { "@type": "Country", name: "CD" },
      availableLanguage: ["French", "English"],
      // Chaque module du catalogue est un cours identifiable. Pas de
      // `hasCourseInstance` : les sessions se planifient avec le client, il
      // n'y a pas de calendrier public — annoncer des dates inventées serait
      // pire que n'en annoncer aucune.
      makesOffer: catalog.map((name) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name, provider: { "@id": `${SITE_URL}/#organization` } },
      })),
    },
    breadcrumb(locale, [{ name: t("eyebrow"), path: PATH }]),
  ];

  return (
    <>
      <JsonLd data={graph(nodes)} />
      <PageShell>
        <PageHeader
          eyebrow={t("eyebrow")}
          heading={t("heading")}
          subtitle={t("subtitle")}
          backLabel={t("back")}
          backHref={prefix}
        />
        <PageBody>
          <div className="space-y-5">
            {intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="leading-relaxed text-[var(--color-text-secondary)]"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Une salle de formation réelle, en ouverture : la page vend un
              apprentissage en présence, elle doit le montrer avant de le
              décrire. `priority` parce que l'image est au-dessus de la ligne
              de flottaison sur les écrans de bureau. */}
          <PageFigure
            src="/images/photos/academy.webp"
            priority
            className="aspect-[3/2]"
          />

          <div>
            <BlockTitle>{t("formatsTitle")}</BlockTitle>
            <ul className="mt-8 space-y-4">
              {formats.map((format) => (
                <li
                  key={format.title}
                  className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
                >
                  <p className="font-bold text-[var(--color-text)]">
                    {format.title}
                  </p>
                  <p className="mt-2 leading-relaxed text-[var(--color-text-secondary)]">
                    {format.description}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="font-semibold text-[var(--color-text)]">
                      {format.audience}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <BlockTitle>{t("catalogTitle")}</BlockTitle>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              {t("catalogIntro")}
            </p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {catalog.map((module) => (
                <li
                  key={module}
                  className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-sm leading-relaxed text-[var(--color-text)]"
                >
                  <Check
                    size={16}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-[var(--color-indigo)]"
                  />
                  {module}
                </li>
              ))}
            </ul>
          </div>

          {/* Les modalités parlent de terrain — connexion, déplacement,
              locaux du client. Le visuel du contexte africain les précède
              plutôt que de les illustrer après coup. */}
          <PageFigure
            src="/images/photos/contexte-africain.webp"
            className="aspect-[3/2]"
          />

          <div>
            <BlockTitle>{t("deliveryTitle")}</BlockTitle>
            <ul className="mt-8 space-y-3">
              {delivery.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="flex gap-3 leading-relaxed text-[var(--color-text-secondary)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-amber)]"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <PageCta
            title={t("ctaTitle")}
            body={t("ctaBody")}
            button={t("ctaButton")}
            href={`${prefix}/contact`}
          />
        </PageBody>
      </PageShell>
    </>
  );
}
