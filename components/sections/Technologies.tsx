"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { TECHNOLOGIES } from "@/lib/constants";
import { motion } from "framer-motion";
import { Brain, Workflow, Database, Bot } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  LLM: Brain,
  Automatisation: Workflow,
  Données: Database,
  Agents: Bot,
};

export function Technologies() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-container-low)]"
      id="technologies"
      aria-label="Notre écosystème technologique"
    >
      <div className="container-site">
        <SectionHeading
          title={TECHNOLOGIES.heading}
          subtitle={TECHNOLOGIES.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TECHNOLOGIES.categories.map((cat, i) => {
            const Icon = categoryIcons[cat.title] || Brain;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card padding="lg" className="h-full text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center mb-4">
                    <Icon size={26} />
                  </div>
                  <h3
                    className="text-[var(--color-on-background)] mb-3"
                    style={{
                      fontSize: "var(--font-headline-sm-size)",
                      fontWeight: "var(--font-headline-sm-weight)",
                    }}
                  >
                    {cat.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {cat.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
