import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, faqPage, graph } from "@/lib/schema";
import { ogImage, siteUrl } from "@/lib/site";

/**
 * Page FAQ — le format le plus directement citable par un moteur génératif.
 *
 * L'audit notait « pas de blocs Q/R structurés » : le contenu du site posait
 * déjà de bonnes questions en H2, mais aucune n'était appariée à une réponse
 * autoportante. Un modèle qui cite doit pouvoir extraire un couple
 * question/réponse sans reconstruire le contexte de la page.
 *
 * **Chaque réponse doit répondre.** Une entrée qui renvoie vers le formulaire
 * de contact (« parlons-en ! ») n'est citable par personne : elle occupe la
 * place d'une vraie réponse et fait baisser la valeur de tout le bloc.
 *
 * Les questions vivent dans `messages/*.json` et alimentent **à la fois** le
 * rendu visible et le JSON-LD `FAQPage`. Google sanctionne les données
 * structurées qui ne correspondent pas au contenu affiché — ici, elles ne
 * peuvent pas diverger.
 */

const PATH = "/faq";

/** Première publication de la page. Voir `webPage()` : jamais dérivée du build. */
const PUBLISHED = "2026-08-07";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
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

type FaqItem = { question: string; answer: string };

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  const prefix = `/${locale}`;

  const items = t.raw("items") as FaqItem[];

  const nodes = [
    faqPage(locale, {
      path: PATH,
      name: t("metaTitle"),
      description: t("metaDescription"),
      items,
      datePublished: PUBLISHED,
    }),
    breadcrumb(locale, [{ name: t("heading"), path: PATH }]),
  ];

  return (
    <>
      <JsonLd data={graph(nodes)} />
      <Header />
      <main id="main-content">
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

        {/* Une seule `.section` : deux `.section` empilées laissaient 192 px de
            blanc entre la liste et l'appel final, un rythme fait pour la
            landing, pas pour une page qui se lit d'une traite. */}
        <section className="section">
          <div className="container-site max-w-3xl space-y-16 md:space-y-20">
            {/* Pas d'accordéon : les réponses sont ouvertes.
                Un contenu replié derrière un clic reste lisible par les
                crawlers, mais l'audit reproche au site son faible volume de
                texte exploitable — le masquer par défaut n'aiderait ni un
                visiteur pressé ni un modèle qui résume la page. */}
            <dl className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
              {items.map((item) => (
                <div key={item.question} className="py-8">
                  <dt className="text-lg font-bold leading-snug tracking-[-0.01em] text-[var(--color-text)]">
                    {item.question}
                  </dt>
                  <dd className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="rounded-[var(--radius-lg)] bg-[var(--color-deep)] p-8 text-white md:p-10">
              <h2 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.01em]">
                {t("ctaTitle")}
              </h2>
              <p className="mt-3 max-w-xl leading-relaxed text-white/70">
                {t("ctaBody")}
              </p>
              <div className="mt-7">
                <Button variant="secondary" size="lg" href={`${prefix}/contact`}>
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
