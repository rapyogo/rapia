"use client";

import { Building2, Heart, Landmark, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FOR_WHOM } from "@/lib/constants";

const audienceIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Entreprises: Building2,
  ONG: Heart,
  Institutions: Landmark,
  Professionnels: User,
};

const audienceAccents = [
  "hover:border-[var(--color-indigo)]/40",
  "hover:border-[var(--color-amber)]/40",
  "hover:border-[var(--color-emerald)]/40",
  "hover:border-[var(--color-deep)]/40",
];

export function ForWhom() {
  return (
    <section className="section section-alt" id="for-whom" aria-label="Pour qui">
      <div className="container-site">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            Publics
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {FOR_WHOM.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">{FOR_WHOM.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FOR_WHOM.audiences.map((audience, i) => {
            const Icon = audienceIcons[audience.title] || User;
            return (
              <motion.div
                key={audience.title}
                className={`bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center flex flex-col items-center group transition-all duration-300 ${audienceAccents[i]} hover:shadow-[var(--shadow-md)] hover:-translate-y-1`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-deep)]/5 text-[var(--color-deep)] flex items-center justify-center mb-5">
                  <Icon size={28} />
                </div>
                <h3 className="text-[var(--color-text)] font-bold text-lg mb-2">
                  {audience.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6 flex-1">
                  {audience.description}
                </p>
                <a
                  href={audience.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-indigo)] hover:text-[var(--color-indigo-light)] transition-colors"
                >
                  {audience.cta}
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
