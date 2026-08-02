"use client";

import { ArrowRight, MessageCircle, Plug, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import { PROBLEM_LEVELS } from "@/lib/constants";

const icons = [MessageCircle, Plug, Workflow];
const colors = [
  "bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] border-[var(--color-indigo)]/20",
  "bg-[var(--color-amber)]/10 text-[var(--color-amber)] border-[var(--color-amber)]/20",
  "bg-[var(--color-emerald)]/10 text-[var(--color-emerald)] border-[var(--color-emerald)]/20",
];

export function ProblemLevels() {
  return (
    <section className="section bg-[var(--color-bg)]" aria-label="Les trois niveaux d'intégration IA">
      <div className="container-site">
        {/* Titre */}
        <motion.div
          className="max-w-3xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            Le constat
          </p>
          <h2
            className="text-[var(--color-text)] mb-4 leading-[1.12] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "700",
            }}
          >
            {PROBLEM_LEVELS.heading}
          </h2>
        </motion.div>

        {/* Niveaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PROBLEM_LEVELS.levels.map((level, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={level.number}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 h-full transition-all duration-300 group-hover:border-[var(--color-indigo)]/30 group-hover:shadow-[var(--shadow-lg)] group-hover:-translate-y-1">
                  {/* Icône */}
                  <div
                    className={`w-14 h-14 rounded-[var(--radius-md)] flex items-center justify-center mb-6 border ${colors[i]}`}
                  >
                    <Icon size={24} />
                  </div>

                  {/* Numéro */}
                  <span className="text-xs font-bold tracking-[0.1em] text-[var(--color-text-muted)] mb-3 block">
                    NIVEAU {level.number}
                  </span>

                  {/* Titre */}
                  <h3
                    className="text-[var(--color-text)] mb-3"
                    style={{
                      fontSize: "clamp(20px, 2vw, 28px)",
                      fontWeight: "700",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {level.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">
                    {level.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Highlight */}
        <motion.div
          className="bg-[var(--color-deep)] text-white rounded-[var(--radius-lg)] px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ArrowRight size={20} className="text-[var(--color-amber)] mt-1 sm:mt-0 flex-shrink-0" />
          <p className="text-lg font-semibold">
            {PROBLEM_LEVELS.highlight}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
