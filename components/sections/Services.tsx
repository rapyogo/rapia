"use client";

import { ArrowRight, MessageSquare, BookOpen, Cpu, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/lib/constants";
import { motion } from "framer-motion";

const icons: Record<string, React.ComponentType<{ size?: number }>> = {
  conseil: MessageSquare,
  formation: BookOpen,
  implementation: Cpu,
  automatisation: Workflow,
};

export function Services() {
  return (
    <section className="section-padding" id="services" aria-label="Nos services">
      <div className="container-site">
        <SectionHeading
          eyebrow="Ce que nous faisons"
          title={SERVICES.heading}
          subtitle={SERVICES.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.items.map((service, i) => {
            const Icon = icons[service.id] || Cpu;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card hover padding="lg" className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-[4px] bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                      <Icon size={24} />
                    </div>
                    <div>
                      <Badge color="indigo" className="mb-1">
                        {service.number}
                      </Badge>
                      <h3
                        className="text-[var(--color-on-background)]"
                        style={{
                          fontSize: "var(--font-headline-sm-size)",
                          fontWeight: "var(--font-headline-sm-weight)",
                          lineHeight: "var(--font-headline-sm-line-height)",
                        }}
                      >
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-[var(--color-on-surface-variant)] mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-[var(--color-on-surface-variant)]"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]/50 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant="ghost"
                    size="sm"
                    href={service.href}
                    icon={<ArrowRight size={14} />}
                    className="self-start"
                  >
                    {service.cta}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
