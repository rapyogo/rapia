"use client";

import { Brain, Workflow, Database, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { TECHNOLOGIES } from "@/lib/constants";

const catIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  LLM: Brain,
  Automatisation: Workflow,
  Données: Database,
  Agents: Bot,
};

export function Technologies() {
  return (
    <section className="section" aria-label="Écosystème technologique">
      <div className="container-site">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            Technologies
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {TECHNOLOGIES.heading}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">{TECHNOLOGIES.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TECHNOLOGIES.categories.map((cat, i) => {
            const Icon = catIcons[cat.title] || Brain;
            return (
              <motion.div
                key={cat.title}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center group hover:border-[var(--color-indigo)]/30 hover:shadow-[var(--shadow-sm)] transition-all duration-300"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--color-indigo)]/5 text-[var(--color-indigo)] flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="text-[var(--color-text)] font-bold mb-2">{cat.title}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {cat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
