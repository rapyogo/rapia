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
      {/* Fond : grille subtile */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-outline-variant) 1px, transparent 1px), linear-gradient(90deg, var(--color-outline-variant) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden="true"
      />

      {/* Accent décoratif : nœuds de connexion (rappel du logo) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block opacity-[0.06]" aria-hidden="true">
        <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
          <circle cx="240" cy="240" r="220" stroke="var(--color-secondary)" strokeWidth="2" />
          <circle cx="240" cy="240" r="180" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="6 10" />
          <circle cx="240" cy="80" r="12" fill="var(--color-secondary)" />
          <circle cx="380" cy="180" r="12" fill="var(--color-secondary)" />
          <circle cx="400" cy="320" r="12" fill="var(--color-secondary)" />
          <circle cx="300" cy="420" r="12" fill="var(--color-amber)" />
          <circle cx="120" cy="420" r="12" fill="var(--color-amber)" />
          <circle cx="40" cy="280" r="12" fill="var(--color-emerald)" />
          <circle cx="120" cy="100" r="12" fill="var(--color-emerald)" />
          <line x1="248" y1="90" x2="372" y2="182" stroke="var(--color-secondary)" strokeWidth="2" />
          <line x1="388" y1="190" x2="396" y2="312" stroke="var(--color-secondary)" strokeWidth="2" />
          <line x1="392" y1="328" x2="308" y2="416" stroke="var(--color-secondary)" strokeWidth="2" />
          <line x1="292" y1="420" x2="128" y2="420" stroke="var(--color-amber)" strokeWidth="2" />
          <line x1="112" y1="416" x2="48" y2="286" stroke="var(--color-amber)" strokeWidth="2" />
          <line x1="44" y1="274" x2="116" y2="106" stroke="var(--color-emerald)" strokeWidth="2" />
        </svg>
      </div>

      <div className="container-site relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20 md:py-24">
          {/* Colonne texte */}
          <div className="flex flex-col items-start justify-center max-w-2xl">
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
              className="text-[var(--color-on-background)] mb-6 max-w-xl"
              style={{
                fontSize: "clamp(36px, 5vw, var(--font-display-lg-size))",
                fontWeight: "var(--font-display-lg-weight)",
                lineHeight: "1.15",
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
              className="text-[var(--color-on-surface-variant)] mb-8 max-w-lg"
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
              className="flex flex-col sm:flex-row gap-4 mb-10"
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

            {/* Credibility */}
            <motion.p
              className="text-sm text-[var(--color-on-surface-variant)] font-medium tracking-[0.05em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {HERO.credibility}
            </motion.p>
          </div>

          {/* Colonne visuelle — logo mark agrandi */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="/rapia-mark.svg"
              alt=""
              className="w-80 h-80 opacity-90"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
