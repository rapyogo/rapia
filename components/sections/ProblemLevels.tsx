"use client";

import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PROBLEM_LEVELS } from "@/lib/constants";
import { motion } from "framer-motion";

export function ProblemLevels() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-container-low)]"
      id="problem-levels"
      aria-label="Les trois niveaux d'intégration de l'IA"
    >
      <div className="container-site">
        <SectionHeading title={PROBLEM_LEVELS.heading} align="center" />

        {/* Niveaux */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PROBLEM_LEVELS.levels.map((level, i) => (
            <motion.div
              key={level.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card
                hover
                padding="lg"
                className="flex flex-col h-full border-l-[3px] border-l-[var(--color-secondary)]"
              >
                <Badge color="indigo" className="mb-4 self-start">
                  Niveau {level.number}
                </Badge>
                <h3
                  className="text-[var(--color-on-background)] mb-3"
                  style={{
                    fontSize: "var(--font-headline-sm-size)",
                    fontWeight: "var(--font-headline-sm-weight)",
                    lineHeight: "var(--font-headline-sm-line-height)",
                  }}
                >
                  {level.title}
                </h3>
                <p className="text-[var(--color-on-surface-variant)] flex-1">
                  {level.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Highlight */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p
            className="inline-flex items-center gap-2 text-[var(--color-secondary)] font-semibold px-6 py-3 rounded-[4px] bg-[var(--color-secondary)]/5"
            style={{
              fontSize: "var(--font-body-lg-size)",
              lineHeight: "var(--font-body-lg-line-height)",
            }}
          >
            <ArrowRight size={18} />
            {PROBLEM_LEVELS.highlight}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
