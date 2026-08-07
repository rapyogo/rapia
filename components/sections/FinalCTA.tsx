"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export function FinalCTA() {
  const t = useTranslations("finalCta");
  const locale = useLocale();

  return (
    <section className="section section-dark" aria-label="Appel à l'action">
      <div className="container-site">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-white/50 mb-6">
            {t("eyebrow")}
          </p>

          <h2
            className="text-white leading-[1.08] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800" }}
          >
            {t("title")}
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t("text")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-amber)] text-[var(--color-deep)] font-bold text-sm rounded-[var(--radius-md)] hover:bg-[var(--color-amber-light)] transition-colors"
            >
              {t("primaryCta")}
              <ArrowRight size={16} />
            </a>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 text-white border border-white/25 font-semibold text-sm rounded-[var(--radius-md)] hover:bg-white/10 transition-colors"
            >
              {t("secondaryCta")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
