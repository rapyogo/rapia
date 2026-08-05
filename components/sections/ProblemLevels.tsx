"use client";

import { useRef, useState } from "react";
import { ArrowRight, MessageCircle, Plug, Workflow } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const icons = [MessageCircle, Plug, Workflow];

export function ProblemLevels() {
  const t = useTranslations("problem");
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const levels = [
    { number: "01", title: t("level1"), description: t("level1Desc") },
    { number: "02", title: t("level2"), description: t("level2Desc") },
    { number: "03", title: t("level3"), description: t("level3Desc") },
  ];

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Rien à épingler : tous les niveaux sont visibles, le rail est plein.
        setActiveIdx(levels.length - 1);
        if (railRef.current) railRef.current.style.transform = "scaleY(1)";
        return;
      }

      // Le pin se termine avant la section suivante, qui pilote ses propres
      // sequences en `sticky` — les deux ne se chevauchent jamais.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + window.innerHeight * 2.2,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (railRef.current) {
            railRef.current.style.transform = `scaleY(${progress})`;
          }
          const idx = Math.min(
            levels.length - 1,
            Math.floor(progress * levels.length),
          );
          setActiveIdx(idx);
        },
      });
    },
    { scope: sectionRef, dependencies: [levels.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center bg-[var(--color-bg)] py-20"
      aria-label="Les trois niveaux d'intégration IA"
    >
      <div className="container-site w-full">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            {t("eyebrow")}
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {t("title")}
          </h2>
        </div>

        <div className="relative">
          {/* Rail de progression — se remplit au fil du scroll dans la section */}
          <div
            className="absolute left-0 top-0 hidden h-full w-px bg-[var(--color-border)] sm:block"
            aria-hidden="true"
          >
            <div
              ref={railRef}
              className="h-full w-full origin-top bg-[var(--color-amber)]"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <ol className="space-y-8 sm:pl-10">
            {levels.map((level, i) => {
              const Icon = icons[i];
              const active = i <= activeIdx;
              return (
                <li
                  key={level.number}
                  className={`grid gap-x-8 gap-y-2 border-t border-[var(--color-border)] pt-6 transition-opacity duration-500 lg:grid-cols-12 ${
                    active ? "opacity-100" : "opacity-30"
                  }`}
                >
                  <div className="flex items-baseline gap-4 lg:col-span-4">
                    <span
                      className={`text-xs font-bold tracking-[0.1em] transition-colors duration-500 ${
                        active
                          ? "text-[var(--color-amber)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {level.number}
                    </span>
                    <h3 className="flex items-center gap-3 text-[var(--color-text)] font-bold text-2xl">
                      <Icon size={20} />
                      {level.title}
                    </h3>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <p className="mt-12 flex items-start gap-3 border-l-2 border-[var(--color-amber)] pl-5 text-lg font-semibold text-[var(--color-text)] sm:ml-10">
          <ArrowRight
            size={20}
            className="mt-1 flex-shrink-0 text-[var(--color-amber)]"
          />
          {t("highlight")}
        </p>
      </div>
    </section>
  );
}
