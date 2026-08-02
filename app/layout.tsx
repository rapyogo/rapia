import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8F9FB",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rapia.cd"),
  title: {
    default: "RAPIA — Agence d'Intelligence Artificielle | RDC",
    template: "%s | RAPIA",
  },
  description:
    "RAPIA accompagne les entreprises, ONG et organisations à intégrer l'intelligence artificielle. Conseil, formation, implémentation et automatisation en RDC.",
  keywords: [
    "intelligence artificielle RDC",
    "agence IA RDC",
    "formation IA RDC",
    "automatisation entreprise RDC",
    "agents IA Afrique",
    "conseil IA",
    "implémentation IA",
  ],
  authors: [{ name: "RAPIA" }],
  openGraph: {
    type: "website",
    siteName: "RAPIA",
    title: "RAPIA — Agence d'Intelligence Artificielle | RDC",
    description:
      "Conseil. Formation. Implémentation. Automatisation. L'IA qui travaille pour votre organisation.",
    url: "https://rapia.cd",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RAPIA — Intelligence Artificielle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RAPIA — Agence d'Intelligence Artificielle | RDC",
    description:
      "Conseil. Formation. Implémentation. Automatisation. L'IA qui travaille pour votre organisation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RAPIA",
  description:
    "Agence d'intelligence artificielle — Conseil, Formation, Implémentation, Automatisation en RDC.",
  url: "https://rapia.cd",
  email: "contact@rapyogo.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <MotionConfig reducedMotion="user">
          <a href="#main-content" className="skip-to-content">
            Aller au contenu principal
          </a>
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
