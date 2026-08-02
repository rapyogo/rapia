"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS } from "@/lib/constants";
import { motion } from "framer-motion";

export function Process() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-container-low)]"
      id="process"
      aria-label="Notre méthodologie"
    >
      <div className="container-site">
        <SectionHeading
          title={PROCESS.heading}
          subtitle={PROCESS.subtitle}
          align="center"
        />

        {/* Timeline desktop */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div
            className="absolute top-[56px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-[2px] bg-[var(--color-border-light)]"
            aria-hidden="true"
          />

          <div className="grid grid-cols-4 gap-6">
            {PROCESS.steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                {/* Step circle */}
                <div
                  className="relative z-10 w-14 h-14 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center mb-5"
                  style={{
                    fontSize: "var(--font-headline-sm-size)",
                    fontWeight: "var(--font-headline-sm-weight)",
                  }}
                >
                  {step.number}
                </div>

                <h3
                  className="text-[var(--color-on-background)] mb-2"
                  style={{
                    fontSize: "var(--font-headline-sm-size)",
                    fontWeight: "var(--font-headline-sm-weight)",
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Timeline mobile (vertical) */}
        <div className="md:hidden relative">
          <div
            className="absolute left-[27px] top-0 bottom-0 w-[2px] bg-[var(--color-border-light)]"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-8">
            {PROCESS.steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex items-start gap-6 pl-4"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-[var(--color-secondary)] text-white flex items-center justify-center"
                  style={{
                    fontSize: "var(--font-label-md-size)",
                    fontWeight: "600",
                  }}
                >
                  {step.number}
                </div>
                <div className="pt-2">
                  <h3
                    className="text-[var(--color-on-background)] mb-1"
                    style={{
                      fontSize: "var(--font-headline-sm-size)",
                      fontWeight: "var(--font-headline-sm-weight)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
