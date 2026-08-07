import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  BlockTitle,
  PageBody,
  PageCta,
  PageHeader,
  PageShell,
} from "@/components/layout/PageShell";
import { breadcrumb, graph, webPage } from "@/lib/schema";
import { ogImage, siteUrl } from "@/lib/site";

/**
 * Page Services — le détail de ce que la landing ne fait qu'annoncer.
 *
 * Le piège de cette page est la duplication interne : reprendre mot pour mot
 * la section `Services` de l'accueil aurait donné deux URLs disant la même
 * chose, et un moteur en aurait choisi une au hasard. Elle **approfondit**
 * donc — problème résolu, livrables, public — là où la landing se contente de
 * nommer. Les titres des services, eux, viennent du namespace `services`
 * partagé : ils ne peuvent pas diverger d'une page à l'autre.
 */

const PATH = "/services";
const PUBLISHED = "2026-08-07";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
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

type Detail = {
  id: string;
  problem: string;
  delivers: string[];
  forWhom: string;
};
type Step = { title: string; description: string };

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage" });
  const tServices = await getTranslations({ locale, namespace: "services" });
  const tProcess = await getTranslations({ locale, namespace: "process" });
  const prefix = `/${locale}`;

  const intro = t.raw("intro") as string[];
  const details = t.raw("items") as Detail[];
  const steps = tProcess.raw("steps") as Step[];
  // Les titres restent la propriété du namespace `services`, partagé avec la
  // landing et le pied de page. L'appariement se fait par `id`, jamais par
  // position : les deux listes sont maintenues séparément.
  const catalog = tServices.raw("items") as {
    id: string;
    title: string;
    description: string;
  }[];

  const nodes = [
    webPage(locale, {
      path: PATH,
      name: t("metaTitle"),
      description: t("metaDescription"),
      datePublished: PUBLISHED,
    }),
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

          {details.map((detail) => {
            const service = catalog.find((s) => s.id === detail.id);
            if (!service) return null;
            return (
              <article key={detail.id} id={detail.id}>
                <BlockTitle>{service.title}</BlockTitle>
                <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                  {service.description}
                </p>

                <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                    {t("labelProblem")}
                  </h3>
                  <p className="mt-3 leading-relaxed text-[var(--color-text)]">
                    {detail.problem}
                  </p>

                  <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                    {t("labelDelivers")}
                  </h3>
                  <ul className="mt-3 space-y-2.5">
                    {detail.delivers.map((item) => (
                      <li
                        key={item.slice(0, 40)}
                        className="flex gap-3 leading-relaxed text-[var(--color-text-secondary)]"
                      >
                        <Check
                          size={17}
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-[var(--color-emerald-ink)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                    {t("labelForWhom")}
                  </h3>
                  <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                    {detail.forWhom}
                  </p>
                </div>
              </article>
            );
          })}

          <div>
            <BlockTitle>{t("methodTitle")}</BlockTitle>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              {t("methodBody")}
            </p>
            <ol className="mt-8 space-y-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)]">
              {steps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-5 bg-[var(--color-surface)] p-6"
                >
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-bold tabular-nums text-[var(--color-indigo)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--color-text)]">
                      {step.title}
                    </p>
                    <p className="mt-1.5 leading-relaxed text-[var(--color-text-secondary)]">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
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
