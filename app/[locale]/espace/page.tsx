import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Clock, LogOut, Mail } from "lucide-react";
import {
  BlockTitle,
  PageBody,
  PageHeader,
  PageShell,
} from "@/components/layout/PageShell";
import { getSessionUser } from "@/lib/auth";
import { sql } from "@/lib/db";

/**
 * Espace client — la page d'accueil du membre connecté.
 *
 * **La protection est ici, pas dans le proxy.** Le middleware de Next tourne
 * sur le runtime Edge, où ni `node:crypto` ni le pilote de base ne sont
 * disponibles : il ne pourrait donc que constater la présence d'un cookie,
 * sans jamais vérifier qu'il correspond à une session vivante. Un cookie
 * périmé ou fabriqué passerait. La vérification a lieu là où elle a du sens,
 * dans le composant serveur qui rend la page.
 *
 * Toute page ajoutée sous `/espace` doit refaire cet appel — ou, quand elles
 * seront plusieurs, passer par un `layout.tsx` commun qui le fait une fois.
 *
 * Le contenu est encore mince, et il l'annonce. Une liste de ce qui arrive
 * vaut mieux qu'un tableau de bord peuplé de zéros : le membre sait où il en
 * est au lieu de croire que quelque chose ne marche pas.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "space" });

  return {
    title: t("eyebrow"),
    robots: { index: false, follow: false },
  };
}

export default async function SpacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "space" });
  const tAuth = await getTranslations({ locale, namespace: "auth" });

  const user = await getSessionUser();

  if (!user) {
    // `suite` ramène ici après la connexion : sans ce paramètre, quelqu'un qui
    // arrive par un lien profond atterrit sur l'accueil de l'espace et doit
    // retrouver sa page à la main.
    redirect(`/${locale}/connexion?suite=${encodeURIComponent(`/${locale}/espace`)}`);
  }

  const rows = await sql`
    SELECT created_at FROM users WHERE id = ${user.id} LIMIT 1
  `;
  const memberSince = rows[0]?.created_at
    ? new Date(rows[0].created_at as string).toLocaleDateString(
        locale === "en" ? "en-GB" : "fr-FR",
        { year: "numeric", month: "long" },
      )
    : null;

  const firstName = user.fullName?.trim().split(/\s+/)[0];
  const coming = t.raw("coming") as string[];

  return (
    <PageShell>
      <PageHeader
        eyebrow={t("eyebrow")}
        heading={
          firstName ? t("heading", { name: firstName }) : t("headingAnonymous")
        }
        subtitle={t("subtitle")}
        backLabel={tAuth("back")}
        backHref={`/${locale}`}
      />
      <PageBody>
        <div>
          <BlockTitle>{t("accountTitle")}</BlockTitle>
          <dl className="mt-8 space-y-px overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-border)]">
            <div className="flex items-start gap-4 bg-[var(--color-surface)] p-6">
              <Mail
                size={18}
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-[var(--color-indigo)]"
              />
              <div className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                  {t("emailLabel")}
                </dt>
                {/* `break-all` : une adresse longue déborderait de la colonne
                    sur un écran étroit. */}
                <dd className="mt-1.5 break-all font-medium text-[var(--color-text)]">
                  {user.email}
                </dd>
              </div>
            </div>

            {memberSince && (
              <div className="flex items-start gap-4 bg-[var(--color-surface)] p-6">
                <Clock
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[var(--color-indigo)]"
                />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                    {t("memberSince")}
                  </dt>
                  <dd className="mt-1.5 font-medium text-[var(--color-text)]">
                    {memberSince}
                  </dd>
                </div>
              </div>
            )}
          </dl>
        </div>

        <div>
          <BlockTitle>{t("comingTitle")}</BlockTitle>
          <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
            {t("comingBody")}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coming.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)] px-4 py-3.5 text-sm leading-relaxed text-[var(--color-text-secondary)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-amber)]"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Déconnexion en POST : en GET, un préchargeur de lien ou un scanner
            suffirait à éjecter la personne de son espace. */}
        <form action="/api/auth/logout" method="post">
          <input type="hidden" name="locale" value={locale} />
          <button
            type="submit"
            className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text)]"
          >
            <LogOut size={16} aria-hidden="true" />
            {tAuth("logout")}
          </button>
        </form>
      </PageBody>
    </PageShell>
  );
}
