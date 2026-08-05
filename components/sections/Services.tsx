"use client";

import { ArrowRight, MessageSquare, BookOpen, Cpu, Cog } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  conseil: MessageSquare,
  formation: BookOpen,
  implementation: Cpu,
  automatisation: Cog,
};

const hrefMap: Record<string, string> = {
  conseil: "/contact",
  formation: "/#academy",
  implementation: "/contact",
  automatisation: "/contact",
};


const borderColors = [
  "border-l-[var(--color-indigo)]",
  "border-l-[var(--color-amber)]",
  "border-l-[var(--color-emerald)]",
  "border-l-[var(--color-deep)]",
];

const bgColors = [
  "bg-[var(--color-indigo)]/5",
  "bg-[var(--color-amber)]/5",
  "bg-[var(--color-emerald)]/5",
  "bg-[var(--color-deep)]/5",
];

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
}

export function Services() {
  const t = useTranslations("services");
  const locale = useLocale();
  const items = t.raw("items") as ServiceItem[];

  return (
    <section className="section section-alt" id="services" aria-label="Nos services">
      <div className="container-site">
        {/* En-tête */}
        <motion.div
          className="flex flex-col lg:flex-row lg:items-end gap-8 mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
              {t("eyebrow")}
            </p>
            <h2
              className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em] max-w-2xl"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: "700",
              }}
            >
              {t("heading")}
            </h2>
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg max-w-md">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Grille services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((service, i) => {
            const Icon = iconMap[service.id] || Cpu;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] ${borderColors[i]} border-l-[3px] p-8 h-full flex flex-col group transition-all duration-300 hover:shadow-[var(--shadow-md)] hover:-translate-y-1`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center ${bgColors[i]}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold tracking-[0.1em] text-[var(--color-text-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-[var(--color-text)] mt-1"
                        style={{
                          fontSize: "clamp(20px, 2vw, 24px)",
                          fontWeight: "700",
                        }}
                      >
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[var(--color-text-secondary)] mb-5">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)]">
                        <span className="w-1 h-1 rounded-full bg-[var(--color-indigo)]/60 flex-shrink-0 mt-1.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`/${locale}${hrefMap[service.id] || "/contact"}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-indigo)] hover:text-[var(--color-indigo-light)] transition-colors"
                  >
                    {service.cta}
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
