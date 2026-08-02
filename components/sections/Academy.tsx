"use client";

import { GraduationCap, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ACADEMY } from "@/lib/constants";
import { motion } from "framer-motion";

export function Academy() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-container-low)]"
      id="academy"
      aria-label="RAPIA Academy — Formation"
    >
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[4px] bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                <GraduationCap size={24} />
              </div>
              <p className="text-[var(--color-secondary)] text-sm font-medium tracking-[0.05em] uppercase">
                RAPIA Academy
              </p>
            </div>

            <h2
              className="text-[var(--color-on-background)] mb-4 max-w-md"
              style={{
                fontSize: "clamp(24px, 4vw, var(--font-headline-md-size))",
                fontWeight: "var(--font-headline-md-weight)",
                lineHeight: "var(--font-headline-md-line-height)",
              }}
            >
              {ACADEMY.heading}
            </h2>
            <p
              className="text-[var(--color-on-surface-variant)] mb-8 max-w-md"
              style={{
                fontSize: "var(--font-body-lg-size)",
                lineHeight: "var(--font-body-lg-line-height)",
              }}
            >
              {ACADEMY.subtitle}
            </p>
            <Button variant="primary" size="md" href="/contact" icon={<ArrowRight size={16} />}>
              {ACADEMY.cta}
            </Button>
          </motion.div>

          {/* Right — formation grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            {ACADEMY.formations.map((formation, i) => (
              <Card
                key={formation}
                padding="sm"
                className="flex items-center gap-3 hover:border-[var(--color-secondary)]/30 transition-colors"
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-[4px] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center text-xs font-bold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-[var(--color-on-surface)]">
                  {formation}
                </span>
              </Card>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
