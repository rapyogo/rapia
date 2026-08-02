"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { HERO } from "@/lib/constants";
import { cn } from "@/lib/utils";

function CTAButton({
  children,
  primary = false,
  href,
}: {
  children: React.ReactNode;
  primary?: boolean;
  href: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-[var(--radius-md)] transition-all duration-300 cursor-pointer select-none min-h-[48px]",
        primary
          ? "bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5"
          : "bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:border-white/30 backdrop-blur-sm"
      )}
    >
      {children}
    </a>
  );
}

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[var(--color-deep)] text-white"
      aria-label="Présentation de RAPIA"
    >
      {/* Fond texturé */}
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[var(--color-indigo)]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[var(--color-amber)]/5 blur-[100px]" />
      </div>

      <div className="container-site relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[90vh] py-24 md:py-32">
          {/* Colonne gauche — Texte */}
          <div className="flex flex-col justify-center max-w-xl">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-[0.08em] uppercase text-white/60 mb-8 w-fit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Sparkles size={14} className="text-[var(--color-amber)]" />
              {HERO.eyebrow}
            </motion.div>

            {/* Titre */}
            <motion.h1
              className="mb-6 leading-[1.08] tracking-[-0.025em]"
              style={{
                fontSize: "clamp(44px, 6vw, 72px)",
                fontWeight: "800",
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {HERO.title}
            </motion.h1>

            {/* Sous-titre */}
            <motion.p
              className="text-white/55 text-lg leading-relaxed mb-10 max-w-lg"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {HERO.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <CTAButton primary href="/contact">
                {HERO.primaryCta}
                <ArrowRight size={16} />
              </CTAButton>
              <CTAButton href="/#services">{HERO.secondaryCta}</CTAButton>
            </motion.div>

            {/* Crédibilité */}
            <motion.p
              className="text-sm text-white/40 font-medium tracking-[0.06em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              {HERO.credibility}
            </motion.p>
          </div>

          {/* Colonne droite — Visuel */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Logo mark agrandi avec glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-[var(--color-indigo)]/20 blur-[80px] rounded-full scale-150" />
              <img
                src="/rapia-mark.svg"
                alt=""
                className="relative w-96 h-96 opacity-90"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/40"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
