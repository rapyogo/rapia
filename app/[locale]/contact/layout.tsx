import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumb, graph, webPage } from "@/lib/schema";
import { ogImage, siteUrl } from "@/lib/site";

/**
 * La page contact est un composant client (état du formulaire) : elle n'a
 * jamais pu exporter de métadonnées, et personne n'avait ajouté ce layout.
 *
 * Résultat relevé par l'audit : elle servait le titre, la description, le
 * canonical et les balises OG de la page d'accueil. Un moteur ne pouvait ni
 * distinguer les deux pages, ni comprendre que celle-ci porte les coordonnées.
 *
 * Le schema `ContactPage` fait ce dernier travail explicitement — les
 * coordonnées elles-mêmes sont déjà déclarées une fois pour toutes dans le
 * `ContactPoint` de l'organisation, servi par le layout de locale.
 */

const PATH = "/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
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

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

  const nodes = [
    webPage(locale, {
      type: "ContactPage",
      path: PATH,
      name: t("metaTitle"),
      description: t("metaDescription"),
    }),
    breadcrumb(locale, [{ name: t("heading"), path: PATH }]),
  ];

  return (
    <>
      <JsonLd data={graph(nodes)} />
      {children}
    </>
  );
}
