"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { COMPANY } from "@/lib/company";
import { RECOGNITIONS, SOCIALS } from "@/lib/site";

/**
 * Pied de page du site.
 *
 * Deux principes le gouvernent :
 *
 * - **Les coordonnées viennent de `lib/company.ts`**, le même module que les
 *   emails. Le site et les messages qu'il envoie disent donc exactement la même
 *   chose, et une adresse se corrige à un seul endroit.
 * - **Rien n'est écrit en dur.** Un libellé codé en français apparaissait tel
 *   quel sur la version anglaise du site ; tout passe désormais par
 *   `messages/*.json`.
 *
 * Contraste : sur le fond Deep Profond (#001B2A), le blanc à 30 % plafonne à
 * 2,6:1 et à 40 % à 3,7:1 — sous le seuil AA de 4,5:1 exigé par PRODUCT.md.
 * Les opacités utilisées ici partent de 55 % (6,0:1). Ne pas les baisser pour
 * « adoucir » le pied de page : c'est le texte qui disparaît, pas le gris.
 */

/**
 * Ancre de chaque service, mappée par index — les libellés sont traduits et ne
 * peuvent pas servir de clé. L'ordre suit `services.items` dans
 * `messages/*.json` : Conseil, Formation, Implémentation, Automatisation.
 * Seule la formation a sa propre section.
 */
const SERVICE_ANCHORS = ["#services", "#academy", "#services", "#services"];

export function Footer() {
  const t = useTranslations("footer");
  const tServices = useTranslations("services");
  const tSite = useTranslations("site");
  const tNav = useTranslations("nav");
  const tAbout = useTranslations("about");
  const locale = useLocale();
  const prefix = `/${locale}`;

  const items = tServices.raw("items") as { title: string }[];
  // Les distinctions sont décrites une seule fois, dans le namespace `about` :
  // le pied de page et la page « À propos » citent le même libellé, et une
  // correction ne se fait qu'à un endroit.
  const recognitions = tAbout.raw("recognitions") as {
    title: string;
    year: string;
  }[];

  const linkClass =
    "text-sm text-white/65 hover:text-white transition-colors duration-200";
  const columnTitleClass =
    "text-xs font-semibold uppercase tracking-[0.1em] text-white/60 mb-5";

  return (
    <footer className="border-t border-white/10 bg-[var(--color-deep)] text-white">
      {/* La barre de navigation mobile est fixée en bas de l'écran : sans cette
          réserve, elle recouvre les mentions légales. */}
      <div className="container-site pt-16 pb-28 md:pt-20 md:pb-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marque */}
          <div>
            <a
              href={prefix}
              className="mb-4 inline-flex items-center gap-2 text-xl font-bold text-white"
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
            <p className="text-sm leading-relaxed text-white/65">
              {tSite("tagline")}
            </p>
            <p className="mt-4 text-xs text-white/55">
              {t("serviceOf")} {COMPANY.legalName}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className={columnTitleClass}>{t("servicesTitle")}</h3>
            <ul className="space-y-2.5">
              {items.map((item, i) => (
                <li key={item.title}>
                  <a
                    href={`${prefix}/${SERVICE_ANCHORS[i] ?? "#services"}`}
                    className={linkClass}
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* En savoir plus */}
          <div>
            <h3 className={columnTitleClass}>{t("aboutTitle")}</h3>
            <ul className="space-y-2.5">
              <li>
                <a href={`${prefix}/a-propos`} className={linkClass}>
                  {t("aboutLink")}
                </a>
              </li>
              <li>
                <a href={`${prefix}/faq`} className={linkClass}>
                  {t("faqLink")}
                </a>
              </li>
              <li>
                <a href={`${prefix}/#why-rapia`} className={linkClass}>
                  {t("whyRapia")}
                </a>
              </li>
              <li>
                <a href={`${prefix}/notre-vision`} className={linkClass}>
                  {t("visionLink")}
                </a>
              </li>
              <li>
                <a href={`${prefix}/#academy`} className={linkClass}>
                  RAPIA Academy
                </a>
              </li>
              <li>
                <a href={`${prefix}/contact`} className={linkClass}>
                  {tNav("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact direct */}
          <div>
            <h3 className={columnTitleClass}>{t("contactTitle")}</h3>
            <ul className="space-y-3">
              <li>
                <span className="block text-xs text-white/55">
                  {t("emailLabel")}
                </span>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="text-sm text-white hover:text-[var(--color-amber)] transition-colors duration-200"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <span className="block text-xs text-white/55">
                  {t("phoneLabel")}
                </span>
                <a
                  href={`tel:${COMPANY.phoneLink}`}
                  className="text-sm text-white hover:text-[var(--color-amber)] transition-colors duration-200"
                >
                  {COMPANY.phone}
                </a>
              </li>
            </ul>

            {/* Liens sortants — l'audit GEO relevait zéro lien externe sur tout
                le site. Les mentions existaient (GitHub, distinction GoGettaz)
                mais rien ne les reliait à la marque : ni un lecteur ni un
                moteur ne pouvait faire le rapprochement. */}
            {SOCIALS.length > 0 && (
              <>
                <h3 className={`${columnTitleClass} mt-8`}>
                  {t("followTitle")}
                </h3>
                <ul className="space-y-2.5">
                  {SOCIALS.map((social) => (
                    <li key={social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer me"
                        className={`${linkClass} inline-flex items-center gap-1.5`}
                      >
                        {social.name}
                        <ExternalLink size={13} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Implantations */}
        <div className="mt-14 border-t border-white/10 pt-10">
          <h3 className={columnTitleClass}>{t("officesTitle")}</h3>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {COMPANY.offices.map((office) => (
              <li key={office.city}>
                <p className="text-sm font-semibold text-white">
                  {office.city}
                  {office.headquarters && (
                    <span className="ml-2 text-xs font-medium text-[var(--color-amber)]">
                      {t("headquarters")}
                    </span>
                  )}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {office.address}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Distinctions — la seule preuve de crédibilité vérifiable par un
            tiers que RAPIA possède aujourd'hui, et qui n'était nulle part sur
            le site. Chaque entrée renvoie à sa source : elle se vérifie sans
            nous croire sur parole. */}
        {recognitions.length > 0 && (
          <div className="mt-12 border-t border-white/10 pt-10">
            <h3 className={columnTitleClass}>{t("recognitionLabel")}</h3>
            <ul className="flex flex-wrap gap-3">
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
                      className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-white/20 px-4 py-2.5 text-sm text-white/80 transition-colors duration-200 hover:border-[var(--color-amber)] hover:text-white"
                    >
                      <span className="font-medium">{recognition.title}</span>
                      <span className="text-white/55">{recognition.year}</span>
                      <ExternalLink size={13} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Mentions légales */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
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
          </p>
          <p className="shrink-0 text-xs text-white/55">
            &copy; {new Date().getFullYear()} {tSite("name")}. {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
