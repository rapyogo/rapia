"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FINAL_CTA } from "@/lib/constants";

export function FinalCTA() {
  return (
    <section className="section section-dark relative overflow-hidden" aria-label="Appel à l'action">
      {/* Orbs décoratifs */}
      <div className="absolute top-[-30%] left-[-20%] w-[500px] h-[500px] rounded-full bg-[var(--color-indigo)]/10 blur-[100px]" aria-hidden="true" />
      <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[var(--color-amber)]/5 blur-[80px]" aria-hidden="true" />

      <div className="container-site relative">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-8">
            <Sparkles size={14} className="text-[var(--color-amber)]" />
            Passage à l'action
          </div>

          <h2
            className="text-white leading-[1.08] tracking-[-0.02em] mb-6"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "800" }}
          >
            {FINAL_CTA.title}
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {FINAL_CTA.text}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-amber)] text-[var(--color-deep)] font-bold text-sm rounded-[var(--radius-md)] hover:bg-[var(--color-amber-light)] transition-all hover:-translate-y-0.5 shadow-[var(--shadow-lg)]"
            >
              {FINAL_CTA.primaryCta}
              <ArrowRight size={16} />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 font-semibold text-sm rounded-[var(--radius-md)] hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {FINAL_CTA.secondaryCta}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
