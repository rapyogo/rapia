import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { JsonLd } from "@/components/seo/JsonLd";
import { baseGraph, graph } from "@/lib/schema";
import { SITE_URL, siteUrl } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F9FB",
  colorScheme: "light",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  // localePrefix: "always" — chaque locale a son propre préfixe, y compris
  // la locale par défaut. Le canonical doit donc toujours le porter.
  const canonical = siteUrl(locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `RAPIA — ${locale === "fr" ? "Agence d'Intelligence Artificielle | RDC" : "Artificial Intelligence Agency | DRC"}`,
      template: `%s | RAPIA`,
    },
    description: t("description"),
    keywords: locale === "fr"
      ? ["intelligence artificielle RDC", "agence IA RDC", "formation IA RDC", "automatisation entreprise RDC", "agents IA Afrique", "conseil IA", "implémentation IA"]
      : ["AI agency DRC", "artificial intelligence DRC", "AI training DRC", "AI consultant DRC", "business automation DRC", "AI agents Africa", "artificial intelligence Africa", "AI implementation", "AI consulting", "enterprise AI training"],
    authors: [{ name: "RAPIA" }],
    icons: {
      icon: "/icone-rapia_dark-mode.webp",
      apple: "/icone-rapia_dark-mode.webp",
    },
    alternates: {
      canonical,
      languages: {
        fr: siteUrl("fr"),
        en: siteUrl("en"),
        // Sans `x-default`, un moteur choisit lui-même la langue servie aux
        // visiteurs dont la locale ne correspond à aucune des deux.
        "x-default": siteUrl("fr"),
      },
    },
    openGraph: {
      type: "website",
      siteName: "RAPIA",
      title: locale === "fr"
        ? "RAPIA — Agence d'Intelligence Artificielle | RDC"
        : "RAPIA — Artificial Intelligence Agency | DRC",
      description: locale === "fr"
        ? "Conseil. Formation. Implémentation. Automatisation. L'IA qui travaille pour votre organisation."
        : "Consulting. Training. Implementation. Automation. AI that works for your organization.",
      url: canonical,
      locale: locale === "fr" ? "fr_CD" : "en_US",
      alternateLocale: locale === "fr" ? "en_US" : "fr_CD",
      // Pas d'`images` ici : `app/[locale]/opengraph-image.tsx` fournit le
      // visuel 1200×630 et Next l'injecte, en absolu, dans og:image comme dans
      // twitter:image. Le déclarer en double laisserait deux sources à
      // corriger — l'ancienne pointait encore vers un logo carré 500×500 sur
      // un domaine mort.
    },
    twitter: {
      card: "summary_large_image",
      title: "RAPIA",
      description: locale === "fr"
        ? "Conseil. Formation. Implémentation. Automatisation. L'IA qui travaille pour votre organisation."
        : "Consulting. Training. Implementation. Automation. AI that works for your organization.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Le socle d'entités — organisation, site, fondateur, établissements — est
  // servi sur chaque page. Les pages y ajoutent leur propre nœud (`WebPage`,
  // `FAQPage`, fil d'Ariane) via leur propre `<JsonLd>`, et les `@id` les
  // recollent : c'est ce qui permet à un moteur de comprendre que la FAQ et la
  // page contact décrivent la même entreprise.
  const nodes = await baseGraph(locale);

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={graph(nodes)} />
        {/* Sans JavaScript, GSAP ne révèle jamais les chapitres 2 et 3 des
            séquences narratives : leur texte resterait invisible. On les remet
            alors dans le flux, empilés les uns sous les autres. */}
        <noscript>
          <style>{`[data-chapter]{position:relative!important;opacity:1!important;visibility:visible!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider>
          <MotionConfig reducedMotion="user">
            <SmoothScroll />
            <a href="#main-content" className="skip-to-content">
              {locale === "fr"
                ? "Aller au contenu principal"
                : "Skip to main content"}
            </a>
            {children}
          </MotionConfig>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
