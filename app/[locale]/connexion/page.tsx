import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import {
  PageBody,
  PageHeader,
  PageShell,
} from "@/components/layout/PageShell";
import { getSessionUser } from "@/lib/auth";
import { siteUrl } from "@/lib/site";
import { LoginForm } from "./LoginForm";

/**
 * Page de connexion à l'espace client.
 *
 * Composant serveur : il lit `?erreur=` — posé par la route de vérification
 * quand un lien a expiré — et le passe au formulaire. Le faire côté client
 * imposerait `useSearchParams`, donc une frontière Suspense, pour lire une
 * valeur connue au rendu.
 *
 * **Interdite à l'indexation.** Une page de connexion dans les résultats de
 * recherche n'apporte rien et donne à voir la surface d'authentification.
 */

const PATH = "/connexion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return {
    title: t("heading"),
    description: t("subtitle"),
    robots: { index: false, follow: false },
    alternates: { canonical: siteUrl(locale, PATH) },
  };
}

const ERRORS: Record<string, string> = {
  jeton: "errorToken",
  expire: "errorExpired",
};

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ erreur?: string; suite?: string }>;
}) {
  const { locale } = await params;
  const { erreur, suite } = await searchParams;
  const t = await getTranslations({ locale, namespace: "auth" });

  // Déjà connecté : la page de connexion n'a rien à proposer. Un aller-retour
  // silencieux vaut mieux qu'un formulaire qui redemande ce qu'on a déjà.
  const user = await getSessionUser();
  if (user) redirect(`/${locale}/espace`);

  const errorKey = erreur ? ERRORS[erreur] : undefined;

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        heading={t("heading")}
        subtitle={t("subtitle")}
        backLabel={t("back")}
        backHref={`/${locale}`}
      />
      <PageBody>
        <LoginForm
          locale={locale}
          initialError={errorKey ? t(errorKey) : undefined}
          redirectTo={suite}
        />
      </PageBody>
    </PageShell>
  );
}
