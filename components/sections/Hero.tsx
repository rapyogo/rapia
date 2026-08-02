"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HERO } from "@/lib/constants";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-background)]"
      aria-label="Présentation de RAPIA"
    >
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      <div className="container-site relative">
        <div className="flex flex-col items-start justify-center min-h-[85vh] py-20 md:py-32 max-w-4xl">
          {/* Eyebrow */}
          <motion.p
            className="text-[var(--color-secondary)] text-sm font-medium tracking-[0.05em] uppercase mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {HERO.eyebrow}
          </motion.p>

          {/* Title */}
          <motion.h1
            className="text-[var(--color-on-background)] mb-6 max-w-3xl"
            style={{
              fontSize: "clamp(40px, 5.5vw, var(--font-display-lg-size))",
              fontWeight: "var(--font-display-lg-weight)",
              lineHeight: "var(--font-display-lg-line-height)",
              letterSpacing: "var(--font-display-lg-letter-spacing)",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {HERO.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-[var(--color-on-surface-variant)] mb-8 max-w-2xl"
            style={{
              fontSize: "var(--font-body-lg-size)",
              lineHeight: "var(--font-body-lg-line-height)",
            }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {HERO.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button variant="primary" size="lg" href="/contact" icon={<ArrowRight size={18} />}>
              {HERO.primaryCta}
            </Button>
            <Button variant="ghost" size="lg" href="/#services">
              {HERO.secondaryCta}
            </Button>
          </motion.div>

          {/* Credibility line */}
          <motion.p
            className="text-sm text-[var(--color-on-surface-variant)] font-medium tracking-[0.05em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {HERO.credibility}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
