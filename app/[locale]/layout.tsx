import type { Metadata, Viewport } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://rapia.cd";
  // localePrefix: "always" — chaque locale a son propre préfixe, y compris
  // la locale par défaut. Le canonical doit donc toujours le porter.
  const pathPrefix = `/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
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
      canonical: `${baseUrl}${pathPrefix}`,
      languages: {
        fr: `${baseUrl}/fr`,
        en: `${baseUrl}/en`,
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
      url: `${baseUrl}${pathPrefix}`,
      images: [
        {
          url: "/logo-horisontale-rapia-dark_mode.webp",
          width: 500,
          height: 500,
          alt: "RAPIA",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "RAPIA",
      description: locale === "fr"
        ? "Conseil. Formation. Implémentation. Automatisation. L'IA qui travaille pour votre organisation."
        : "Consulting. Training. Implementation. Automation. AI that works for your organization.",
      images: ["/logo-horisontale-rapia-dark_mode.webp"],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RAPIA",
    description: locale === "fr"
      ? "Agence d'intelligence artificielle — Conseil, Formation, Implémentation, Automatisation en RDC."
      : "Artificial intelligence agency — Consulting, Training, Implementation, Automation in DRC.",
    url: "https://rapia.cd",
    email: "contact@rapyogo.com",
    address: {
      "@type": "PostalAddress",
      addressCountry: "CD",
    },
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
