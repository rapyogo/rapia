"use client";

import { GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export function Academy() {
  const t = useTranslations("academy");
  const locale = useLocale();
  const formations = t.raw("formations") as string[];

  return (
    <section className="section section-dark" id="academy" aria-label="RAPIA Academy">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Gauche */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8">
              <GraduationCap size={14} className="text-[var(--color-amber)]" />
              RAPIA Academy
            </div>

            <h2
              className="text-white leading-[1.1] tracking-[-0.02em] mb-4 max-w-lg"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
            >
              {t("heading")}
            </h2>
            <p className="text-white/50 text-lg mb-8 max-w-md">
              {t("subtitle")}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-amber)] text-[var(--color-deep)] font-semibold text-sm rounded-[var(--radius-md)] hover:bg-[var(--color-amber-light)] transition-colors"
            >
              {t("cta")}
              <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Droite — grille formations */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            {formations.map((formation, i) => (
              <div
                key={formation}
                className="flex items-center gap-3 px-5 py-4 rounded-[var(--radius-md)] bg-white/5 border border-white/5 hover:bg-white/8 hover:border-white/10 transition-all"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-indigo)]/30 text-white flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-white/80">{formation}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
