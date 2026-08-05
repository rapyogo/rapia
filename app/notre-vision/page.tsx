"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { PROBLEM_LEVELS, PROCESS, WHY_RAPIA, FINAL_CTA } from "@/lib/constants";

export default function NotreVisionPage() {
  return (
    <>
      {/* Retour — flottant au-dessus des sections empilées (z-index le plus haut) */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-[100] inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour
      </Link>

      <FlowArt aria-label="Notre vision — RAPIA">
        {/* 01 — Qui nous sommes */}
        <FlowSection
          aria-label="Qui nous sommes"
          style={{ backgroundColor: "#021E2D", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            01 — Qui nous sommes
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div>
            <h1 className="text-[clamp(3rem,10vw,10rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              L&apos;IA qui
              <br />
              travaille
              <br />
              pour vous
            </h1>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/70">
            RAPIA accompagne les entreprises, ONG, institutions et professionnels
            de RDC et d&apos;Afrique dans l&apos;adoption concrète de l&apos;intelligence
            artificielle — conseil, formation, implémentation et automatisation.
          </p>
        </FlowSection>

        {/* 02 — Le constat */}
        <FlowSection
          aria-label="Le constat"
          style={{ backgroundColor: "#5E53A4", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            02 — Le constat
          </p>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              Discuter
              <br />
              Connecter
              <br />
              Déléguer
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/80">
            {PROBLEM_LEVELS.heading}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <div className="flex flex-wrap gap-[3vw]">
            {PROBLEM_LEVELS.levels.map((level) => (
              <div key={level.number} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                  Niveau {level.number} — {level.title}
                </p>
                <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/65">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/80">
            {PROBLEM_LEVELS.highlight}
          </p>
        </FlowSection>

        {/* 03 — Comment nous travaillons */}
        <FlowSection
          aria-label="Comment nous travaillons"
          style={{ backgroundColor: "#FAFBFC", color: "#0F1722" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            03 — Notre méthode
          </p>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              Comprendre
              <br />
              Construire
              <br />
              Former
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-[var(--color-text-secondary)]">
            {PROCESS.subtitle}
          </p>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <div className="flex flex-wrap gap-[3vw]">
            {PROCESS.steps.map((step) => (
              <div key={step.number} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-indigo)]">
                  {step.number} — {step.title}
                </p>
                <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </FlowSection>

        {/* 04 — Pourquoi RAPIA */}
        <FlowSection
          aria-label="Pourquoi RAPIA"
          style={{ backgroundColor: "#021E2D", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            04 — Notre différence
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              Le problème
              <br />
              avant
              <br />
              l&apos;outil
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/70">
            {WHY_RAPIA.subtitle}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div className="flex flex-wrap gap-[3vw]">
            {WHY_RAPIA.arguments.slice(0, 3).map((arg) => (
              <div key={arg.title} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                  {arg.title}
                </p>
                <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/60">
                  {arg.description}
                </p>
              </div>
            ))}
          </div>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div className="flex flex-wrap gap-[3vw]">
            {WHY_RAPIA.arguments.slice(3).map((arg) => (
              <div key={arg.title} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                  {arg.title}
                </p>
                <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/60">
                  {arg.description}
                </p>
              </div>
            ))}
          </div>
        </FlowSection>

        {/* 05 — Nous rejoindre */}
        <FlowSection
          aria-label="Nous rejoindre"
          style={{ backgroundColor: "#B87500", color: "#021E2D" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">
            05 — Passer à l&apos;action
          </p>
          <hr className="my-[2vw] border-none border-t border-black/20" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              Prêt à
              <br />
              commencer ?
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-black/20" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed">
            {FINAL_CTA.text}
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#021E2D] text-white font-bold text-sm rounded-[var(--radius-md)] hover:bg-[#043A50] transition-colors"
            >
              {FINAL_CTA.primaryCta}
              <ArrowRight size={16} />
            </Link>
          </div>
        </FlowSection>
      </FlowArt>
    </>
  );
}
