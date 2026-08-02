"use client";

import { motion } from "framer-motion";
import { USE_CASES } from "@/lib/constants";

const sectorAccents = [
  "border-l-[var(--color-indigo)]",
  "border-l-[var(--color-amber)]",
  "border-l-[var(--color-emerald)]",
  "border-l-[var(--color-deep)]",
  "border-l-[var(--color-indigo)]",
  "border-l-[var(--color-amber)]",
];

export function UseCases() {
  return (
    <section className="section section-alt" id="use-cases" aria-label="Cas d'usage">
      <div className="container-site">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            Cas concrets
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {USE_CASES.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">{USE_CASES.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {USE_CASES.cases.map((c, i) => (
            <motion.div
              key={c.sector}
              className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-border)] ${sectorAccents[i]} border-l-[3px] p-6 group hover:shadow-[var(--shadow-md)] transition-all duration-300`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="text-xs font-bold tracking-[0.08em] uppercase text-[var(--color-text-muted)]">
                {c.sector}
              </span>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                    Avant
                  </span>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {c.before}
                  </p>
                </div>
                <div className="w-8 h-[1px] bg-[var(--color-border)]" />
                <div>
                  <span className="text-xs font-semibold text-[var(--color-indigo)]">
                    Intervention IA
                  </span>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {c.intervention}
                  </p>
                </div>
                <div className="w-8 h-[1px] bg-[var(--color-border)]" />
                <div>
                  <span className="text-xs font-semibold text-[var(--color-emerald)]">
                    Résultat
                  </span>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                    {c.result}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
