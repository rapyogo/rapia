"use client";

import Image from "next/image";
import { Building2, Heart, Landmark, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const audienceIcons = [Building2, Heart, Landmark, User];
const audienceHrefs = ["/contact", "/contact", "/contact", "/#academy"];
const audiencePhotos = [
  "/images/photos/public-entreprises.webp",
  "/images/photos/public-ong.webp",
  "/images/photos/public-institutions.webp",
  "/images/photos/public-professionnels.webp",
];

interface Audience {
  title: string;
  description: string;
  cta: string;
}

const audienceAccents = [
  "hover:border-[var(--color-indigo)]/40",
  "hover:border-[var(--color-amber)]/40",
  "hover:border-[var(--color-emerald)]/40",
  "hover:border-[var(--color-deep)]/40",
];

export function ForWhom() {
  const t = useTranslations("forWhom");
  const locale = useLocale();
  const audiences = t.raw("audiences") as Audience[];

  return (
    <section className="section section-alt" id="for-whom" aria-label="Pour qui">
      <div className="container-site">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            {t("eyebrow")}
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {t("heading")}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">{t("subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {audiences.map((audience, i) => {
            const Icon = audienceIcons[i] || User;
            return (
              <motion.div
                key={audience.title}
                className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden flex flex-col group transition-all duration-300 ${audienceAccents[i]} hover:shadow-[var(--shadow-md)] hover:-translate-y-1`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-bg-alt)]">
                  <Image
                    src={audiencePhotos[i]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-deep)]/5 text-[var(--color-deep)] flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-[var(--color-text)] font-bold text-lg mb-2">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                    {audience.description}
                  </p>
                  <a
                    href={`/${locale}${audienceHrefs[i] || "/contact"}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-indigo)] hover:text-[var(--color-indigo-light)] transition-colors"
                  >
                    {audience.cta}
                    <ArrowRight size={14} />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
