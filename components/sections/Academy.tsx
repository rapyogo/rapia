"use client";

import Image from "next/image";
import { GraduationCap, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

export function Academy() {
  const t = useTranslations("academy");
  const locale = useLocale();
  const formations = t.raw("formations") as string[];

  return (
    <section className="section" id="academy" aria-label="RAPIA Academy">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Gauche */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-6">
              <GraduationCap size={14} />
              RAPIA Academy
            </p>

            <h2
              className="text-[var(--color-text)] leading-[1.1] tracking-[-0.02em] mb-4 max-w-lg"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
            >
              {t("heading")}
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8 max-w-md">
              {t("subtitle")}
            </p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-indigo)] text-white font-semibold text-sm rounded-[var(--radius-md)] hover:bg-[var(--color-indigo-light)] transition-colors"
            >
              {t("cta")}
              <ArrowRight size={16} />
            </a>
          </motion.div>

          {/* Droite — la photo puis la grille des formations */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
          <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
            <Image
              src="/images/photos/academy.webp"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formations.map((formation, i) => (
              <div
                key={formation}
                className="flex items-center gap-3 px-5 py-4 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-indigo)]/40 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-indigo)]/8 text-[var(--color-indigo)] flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-[var(--color-text)]">{formation}</span>
              </div>
            ))}
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
