"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { COMPANY } from "@/lib/company";
import { RECOGNITIONS } from "@/lib/site";
import { SocialLinks } from "@/components/ui/social-icons";

/**
 * Pied de page du site.
 *
 * Trois principes le gouvernent :
 *
 * - **Les coordonnées viennent de `lib/company.ts`**, le même module que les
 *   emails. Le site et les messages qu'il envoie disent donc exactement la même
 *   chose, et une adresse se corrige à un seul endroit.
 * - **Rien n'est écrit en dur.** Un libellé codé en français apparaissait tel
 *   quel sur la version anglaise du site ; tout passe désormais par
 *   `messages/*.json`.
 * - **Trois rangées, pas sept blocs.** Le pied de page empilait marque,
 *   services, liens, contact, réseaux, implantations, distinctions et mentions
 *   légales — huit sections superposées, chacune avec son titre en capitales,
 *   qui donnaient à la fin du site le poids d'une page entière. Le contenu n'a
 *   pas bougé, sa hiérarchie si : **navigation**, puis **où nous sommes et où
 *   nous suivre**, puis **le légal**. Ce qui se lit rarement descend et
 *   maigrit ; rien n'a été supprimé.
 *
 * Contraste : sur le fond Deep Profond (#001B2A), le blanc à 30 % plafonne à
 * 2,6:1 et à 40 % à 3,7:1 — sous le seuil AA de 4,5:1 exigé par PRODUCT.md.
 * Les opacités utilisées ici partent de 55 % (6,0:1). Ne pas les baisser pour
 * « adoucir » le pied de page : c'est le texte qui disparaît, pas le gris.
 */

export function Footer() {
  const t = useTranslations("footer");
  const tServices = useTranslations("services");
  const tSite = useTranslations("site");
  const tNav = useTranslations("nav");
  const tAbout = useTranslations("about");
  const locale = useLocale();
  const prefix = `/${locale}`;

  // Chaque service a son ancre sur /services. L'`id` vit dans le namespace
  // partagé et n'est pas traduit : il ne peut donc pas casser le lien quand la
  // copie change, contrairement au mapping par index qu'il remplace.
  const items = tServices.raw("items") as { id: string; title: string }[];
  // Les distinctions sont décrites une seule fois, dans le namespace `about` :
  // le pied de page et la page « À propos » citent le même libellé, et une
  // correction ne se fait qu'à un endroit.
  const recognitions = tAbout.raw("recognitions") as { title: string }[];

  const linkClass =
    "text-sm text-white/65 transition-colors duration-200 hover:text-white";
  const columnTitleClass =
    "mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-white/60";

  return (
    <footer className="border-t border-white/10 bg-[var(--color-deep)] text-white">
      {/* La barre de navigation mobile est fixée en bas de l'écran : sans cette
          réserve, elle recouvre les mentions légales. */}
      <div className="container-site pt-16 pb-28 md:pt-20 md:pb-12">
        {/* Rangée 1 — marque et navigation */}
        <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-16">
          <div className="max-w-xs">
            <a
              href={prefix}
              className="inline-flex items-center gap-2 text-xl font-bold text-white"
            >
              <Image
                src="/icone-rapia_dark-mode.webp"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
                aria-hidden="true"
              />
              {tSite("name")}
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {tSite("tagline")}
            </p>
            <p className="mt-4 text-xs text-white/55">
              {t("serviceOf")} {COMPANY.legalName}
            </p>
          </div>

          <nav
            aria-label={t("servicesTitle")}
            className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:max-w-2xl"
          >
            <div>
              <h3 className={columnTitleClass}>{t("servicesTitle")}</h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`${prefix}/services#${item.id}`}
                      className={linkClass}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`${prefix}/formation`} className={linkClass}>
                    {t("trainingLink")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={columnTitleClass}>{t("aboutTitle")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href={`${prefix}/a-propos`} className={linkClass}>
                    {t("aboutLink")}
                  </a>
                </li>
                <li>
                  <a href={`${prefix}/notre-vision`} className={linkClass}>
                    {t("visionLink")}
                  </a>
                </li>
                <li>
                  <a href={`${prefix}/#why-rapia`} className={linkClass}>
                    {t("whyRapia")}
                  </a>
                </li>
                <li>
                  <a href={`${prefix}/faq`} className={linkClass}>
                    {t("faqLink")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={columnTitleClass}>{t("contactTitle")}</h3>
              <ul className="space-y-2.5">
                <li>
                  <a href={`mailto:${COMPANY.email}`} className={linkClass}>
                    {COMPANY.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${COMPANY.phoneLink}`} className={linkClass}>
                    {COMPANY.phone}
                  </a>
                </li>
                <li>
                  <a href={`${prefix}/contact`} className={linkClass}>
                    {tNav("contact")}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Rangée 2 — où nous sommes, où nous suivre.
            Les implantations tenaient une section à elles seules, titre
            compris, pour trois lignes d'adresse. Elles partagent désormais la
            rangée des réseaux : deux informations de même nature — comment
            nous atteindre — sur la même ligne. */}
        <div className="mt-14 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-col gap-x-8 gap-y-2 text-xs leading-relaxed text-white/55 sm:flex-row sm:flex-wrap">
            {COMPANY.offices.map((office) => (
              <li key={office.city}>
                <span className="font-semibold text-white/80">
                  {office.city}
                </span>
                {/* Parenthèses reconstruites ici : la clé ne porte que le mot
                    (« siège » / « head office »), comme `officeLabel()` côté
                    emails. La ponctuation n'est pas de la traduction. */}
                {office.headquarters && (
                  <span className="ml-1.5 text-[var(--color-amber)]">
                    ({t("headquarters")})
                  </span>
                )}
                <span className="ml-1.5">{office.address}</span>
              </li>
            ))}
          </ul>

          {/* Les icônes ne s'affichent que pour les plateformes dont l'URL est
              renseignée dans SOCIAL_PLATFORMS (lib/site.ts). Rien à modifier
              ici le jour où un profil ouvre. */}
          <SocialLinks className="-ml-3 shrink-0 md:ml-0 md:-mr-3" />
        </div>

        {/* Rangée 3 — le légal, et les distinctions ramenées à des liens.
            Elles étaient présentées en cartouches bordés, du poids d'un bouton
            d'action : trois fausses cibles principales en bas de page. Elles
            restent vérifiables — chacune renvoie au site de l'organisme — mais
            à leur juste rang typographique. */}
        <div className="mt-8 flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-start md:justify-between">
          <p className="text-xs leading-relaxed text-white/55">
            {COMPANY.legalName}
            {COMPANY.registrations.map((reg) => (
              <span key={reg.label}>
                {" · "}
                {reg.label}
                {/* Le français insère une espace avant les deux-points,
                    l'anglais non. Les immatriculations restent identiques :
                    seule leur ponctuation suit la langue de lecture. */}
                {locale === "fr" ? " : " : ": "}
                {reg.value}
              </span>
            ))}
            {" · "}
            &copy; {new Date().getFullYear()} {tSite("name")}. {t("copyright")}
          </p>

          {recognitions.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/55 md:shrink-0 md:justify-end">
              {recognitions.map((recognition, i) => {
                // Mappé par index : le titre est traduit, il ne peut pas
                // servir de clé de correspondance avec `RECOGNITIONS`.
                const source = RECOGNITIONS[i];
                if (!source) return null;
                return (
                  <li key={recognition.title}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {recognition.title}
                      {source.year && <span> {source.year}</span>}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
