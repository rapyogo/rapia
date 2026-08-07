"use client";

import { motion } from "framer-motion";
import { Target, Layers, Users, Globe, Handshake } from "lucide-react";
import { useTranslations } from "next-intl";

const argIcons = [Globe, Target, Layers, Users, Handshake];

interface WhyArgument {
  title: string;
  description: string;
}

export function WhyRapia() {
  const t = useTranslations("whyRapia");
  const args = t.raw("arguments") as WhyArgument[];

  return (
    <section className="section" id="why-rapia" aria-label="Pourquoi RAPIA">
      <div className="container-site">
        <motion.div
          className="max-w-2xl mb-16"
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
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "700",
            }}
          >
            {t("heading")}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {args.map((arg, i) => {
            const Icon = argIcons[i] || Target;
            return (
              <motion.div
                key={arg.title}
                className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 hover:border-[var(--color-indigo)]/30 hover:shadow-[var(--shadow-md)] transition-all duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-deep)]/5 text-[var(--color-deep)] flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="text-[var(--color-text)] font-bold mb-2">{arg.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {arg.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
