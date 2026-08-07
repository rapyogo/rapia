import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import {
  PageBody,
  PageHeader,
  PageShell,
} from "@/components/layout/PageShell";

/**
 * Confirmation du lien magique.
 *
 * Cette page ne consomme **rien** : elle affiche un bouton, et c'est le POST
 * vers `/api/auth/verify` qui consomme le jeton. La raison est expliquée en
 * tête de cette route — les scanners de messagerie (Microsoft 365 Safe Links,
 * antivirus de courrier) ouvrent les liens entrants avant leur destinataire.
 * Un jeton à usage unique consommé par ce passage laisserait la personne
 * devant « lien déjà utilisé » sur un lien qu'elle n'a jamais ouvert.
 *
 * Le formulaire est un `<form method="post">` natif : la connexion fonctionne
 * sans JavaScript, ce qui compte pour un public dont la connexion coupe.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("verifyHeading"),
    // Jamais indexée : l'URL porte un jeton de connexion.
    robots: { index: false, follow: false },
  };
}

export default async function VerifyPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string; suite?: string }>;
}) {
  const { locale } = await params;
  const { token, suite } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        heading={t("verifyHeading")}
        subtitle={token ? t("verifyBody") : t("verifyMissing")}
        backLabel={t("back")}
        backHref={`/${locale}`}
      />
      <PageBody>
        {token ? (
          <form
            action="/api/auth/verify"
            method="post"
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8"
          >
            <ShieldCheck
              size={28}
              aria-hidden="true"
              className="text-[var(--color-indigo)]"
            />
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="locale" value={locale} />
            {suite && <input type="hidden" name="suite" value={suite} />}
            {/* Bouton HTML natif plutôt que le composant `Button` : celui-ci
                rend un `<a>` dès qu'on lui passe un `href`, et un lien ne
                soumet pas de formulaire. Les classes reprennent la variante
                primaire à l'identique. */}
            <button
              type="submit"
              className="mt-6 inline-flex min-h-[44px] cursor-pointer select-none items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-[var(--color-indigo)] px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:bg-[var(--color-indigo-light)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo)]"
            >
              {t("verifyCta")}
            </button>
          </form>
        ) : (
          <a
            href={`/${locale}/connexion`}
            className="text-sm font-medium text-[var(--color-indigo)] hover:underline"
          >
            {t("requestNew")}
          </a>
        )}
      </PageBody>
    </PageShell>
  );
}
