"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, Wrench, GraduationCap } from "lucide-react";
import { PROCESS } from "@/lib/constants";

const stepIcons = [Search, Lightbulb, Wrench, GraduationCap];
const stepColors = [
  "bg-[var(--color-indigo)]/10 text-[var(--color-indigo)]",
  "bg-[var(--color-amber)]/10 text-[var(--color-amber)]",
  "bg-[var(--color-emerald)]/10 text-[var(--color-emerald)]",
  "bg-[var(--color-deep)]/10 text-[var(--color-deep)]",
];

export function Process() {
  return (
    <section className="section section-dark" aria-label="Notre méthodologie">
      <div className="container-site">
        {/* En-tête */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-white/40 mb-4">
            Méthodologie
          </p>
          <h2
            className="text-white leading-[1.12] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "700",
            }}
          >
            {PROCESS.heading}
          </h2>
          <p className="text-white/50 text-lg mt-4">{PROCESS.subtitle}</p>
        </motion.div>

        {/* Timeline desktop */}
        <div className="hidden md:block relative">
          {/* Ligne de connexion */}
          <div className="absolute top-10 left-0 right-0 h-[2px] bg-white/10" aria-hidden="true" />

          <div className="grid grid-cols-4 gap-8">
            {PROCESS.steps.map((step, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div
                    className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-sm ${stepColors[i]}`}
                  >
                    <Icon size={28} />
                  </div>
                  <span className="text-xs font-bold tracking-[0.1em] text-white/30 mb-2">
                    {step.number}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-8">
          {PROCESS.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div
                key={step.number}
                className="flex items-start gap-5"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border border-white/10 ${stepColors[i]}`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-[0.1em] text-white/30">
                    {step.number}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-1">{step.title}</h3>
                  <p className="text-white/50 text-sm mt-1">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
