"use client";

import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { USE_CASES } from "@/lib/constants";
import { motion } from "framer-motion";
import { useState } from "react";

const sectorColors: Record<string, "indigo" | "amber" | "emerald" | "deep"> = {
  "Ressources Humaines": "indigo",
  "Commercial": "amber",
  "Service Client": "emerald",
  "ONG": "deep",
  "Finance & Administration": "indigo",
  "Direction": "amber",
};

export function UseCases() {
  const [activeCase, setActiveCase] = useState<number | null>(null);

  return (
    <section className="section-padding" id="use-cases" aria-label="Cas d'usage concrets">
      <div className="container-site">
        <SectionHeading
          title={USE_CASES.heading}
          subtitle={USE_CASES.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {USE_CASES.cases.map((c, i) => (
            <motion.div
              key={c.sector}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onMouseEnter={() => setActiveCase(i)}
              onMouseLeave={() => setActiveCase(null)}
            >
              <Card
                hover
                padding="lg"
                className="h-full flex flex-col relative overflow-hidden cursor-default"
              >
                <Badge
                  color={sectorColors[c.sector] || "indigo"}
                  className="mb-3 self-start"
                >
                  {c.sector}
                </Badge>

                {/* Default view: problem */}
                <div
                  className={`transition-all duration-300 ${
                    activeCase === i
                      ? "opacity-0 h-0 overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
                    <span className="font-medium text-[var(--color-on-surface)] block mb-1">
                      Avant
                    </span>
                    {c.before}
                  </p>
                </div>

                {/* Hover view: intervention + result */}
                <div
                  className={`transition-all duration-300 ${
                    activeCase === i
                      ? "opacity-100"
                      : "opacity-0 h-0 overflow-hidden"
                  }`}
                >
                  <p className="text-sm leading-relaxed mb-3">
                    <span className="font-medium text-[var(--color-secondary)] block mb-1">
                      Intervention IA
                    </span>
                    {c.intervention}
                  </p>
                  <p className="text-sm leading-relaxed text-[var(--color-emerald)]">
                    <span className="font-medium block mb-1">
                      Résultat
                    </span>
                    {c.result}
                  </p>
                </div>

                <div className="mt-auto pt-4 flex items-center gap-1 text-xs text-[var(--color-secondary)] font-medium">
                  <span>Survoler pour voir l'impact</span>
                  <ArrowRight size={12} />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
