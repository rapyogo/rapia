"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { WHY_RAPIA } from "@/lib/constants";
import { motion } from "framer-motion";
import { Target, Users, Layers, Cpu, Handshake } from "lucide-react";

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  "Compréhension du terrain africain": Target,
  "Approche orientée résultats": Cpu,
  "Formation + Implémentation": Layers,
  "Technologies multiples": Users,
  "Accompagnement humain": Handshake,
};

export function WhyRapia() {
  return (
    <section className="section-padding" id="why-rapia" aria-label="Pourquoi choisir RAPIA">
      <div className="container-site">
        <SectionHeading
          title={WHY_RAPIA.heading}
          subtitle={WHY_RAPIA.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_RAPIA.arguments.map((arg, i) => {
            const Icon = icons[arg.title] || Target;
            return (
              <motion.div
                key={arg.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card padding="lg" className="h-full">
                  <div className="w-10 h-10 rounded-[4px] bg-[var(--color-deep-profond)]/10 text-[var(--color-deep-profond)] flex items-center justify-center mb-4">
                    <Icon size={20} />
                  </div>
                  <h3
                    className="text-[var(--color-on-background)] mb-2"
                    style={{
                      fontSize: "var(--font-body-lg-size)",
                      fontWeight: "600",
                    }}
                  >
                    {arg.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                    {arg.description}
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
