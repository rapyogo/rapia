"use client";

import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tServices = useTranslations("services");
  const tSite = useTranslations("site");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const prefix = `/${locale}`;

  const items = tServices.raw("items") as { title: string }[];

  return (
    <footer className="bg-[var(--color-deep)] text-white border-t border-white/[0.06]">
      <div className="container-site py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Marque */}
          <div className="md:col-span-1">
            <a href={prefix} className="inline-flex items-center gap-2 font-bold text-xl text-white mb-4">
              <img src="/icone-rapia_dark-mode.webp" alt="" className="w-7 h-7" aria-hidden="true" />
              RAPIA
            </a>
            <p className="text-sm text-white/40 leading-relaxed">{tSite("tagline")}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">{t("servicesTitle")}</h3>
            <ul className="space-y-2.5">
              {items.map((item, i) => (
                <li key={item.title}>
                  <a
                    href={i === 1 ? `${prefix}/#academy` : `${prefix}/#services`}
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">{t("aboutTitle")}</h3>
            <ul className="space-y-2.5">
              <li><a href={`${prefix}/#why-rapia`} className="text-sm text-white/50 hover:text-white transition-colors">RAPIA</a></li>
              <li><a href={`${prefix}/notre-vision`} className="text-sm text-white/50 hover:text-white transition-colors">Notre vision</a></li>
              <li><a href={`${prefix}/#academy`} className="text-sm text-white/50 hover:text-white transition-colors">RAPIA Academy</a></li>
              <li><a href={`${prefix}/contact`} className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">{t("contactTitle")}</h3>
            <ul className="space-y-2.5">
              <li><a href={`mailto:${tContact("email")}`} className="text-sm text-white/50 hover:text-[var(--color-amber)] transition-colors">{tContact("email")}</a></li>
              <li className="text-sm text-white/40">{tSite("location")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} RAPIA. {t("copyright")}</p>
          <p className="text-xs text-white/30">{tSite("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
