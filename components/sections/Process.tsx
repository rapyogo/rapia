"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Search, Lightbulb, Wrench, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stepPhotos = [
  "/images/photos/methode-1-comprendre.webp",
  "/images/photos/methode-2-identifier.webp",
  "/images/photos/methode-3-construire.webp",
  "/images/photos/methode-4-former.webp",
];

const stepIcons = [Search, Lightbulb, Wrench, GraduationCap];
const stepColors = [
  "bg-[var(--color-indigo)]/8 text-[var(--color-indigo)] border-[var(--color-indigo)]/20",
  "bg-[var(--color-amber)]/8 text-[var(--color-amber)] border-[var(--color-amber)]/20",
  "bg-[var(--color-emerald)]/8 text-[var(--color-emerald)] border-[var(--color-emerald)]/20",
  "bg-[var(--color-deep)]/8 text-[var(--color-deep)] border-[var(--color-deep)]/20",
];

interface ProcessStep {
  title: string;
  description: string;
}

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as ProcessStep[];
  const crossfadeRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useGSAP(
    () => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-crossfade]");
      if (layers.length === 0) return;

      // Une seule ScrollTrigger pilote l'opacite des quatre calques : la
      // progression 0 -> 1 est decoupee en autant de segments que d'etapes.
      ScrollTrigger.create({
        trigger: crossfadeRef.current,
        start: "top 75%",
        end: "bottom 25%",
        scrub: 0.6,
        onUpdate: (self) => {
          const exact = self.progress * (layers.length - 1);
          const index = Math.min(Math.floor(exact), layers.length - 2);
          const blend = exact - index;

          layers.forEach((layer, i) => {
            let opacity = 0;
            if (i === index) opacity = 1 - blend;
            else if (i === index + 1) opacity = blend;
            else if (i < index) opacity = 0;
            gsap.set(layer, { opacity });
          });

          setActiveStep(Math.round(exact));
        },
      });
    },
    { scope: crossfadeRef, dependencies: [steps.length] },
  );

  return (
    <section className="section section-alt" aria-label="Notre méthodologie">
      <div className="container-site">
        {/* En-tête */}
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            {t("eyebrow")}
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              fontWeight: "700",
            }}
          >
            {t("heading")}
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mt-4">{t("subtitle")}</p>
        </motion.div>

        {/* Les quatre moments, en fondu enchaine au scroll. Comme les quatre
            photos derivent du meme master, le fondu lit comme une scene qui
            evolue, pas comme un diaporama. */}
        <div ref={crossfadeRef} className="hidden md:block relative aspect-[21/9] w-full mb-16 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
          {stepPhotos.map((src, i) => (
            <Image
              key={src}
              data-crossfade={i}
              src={src}
              alt=""
              fill
              sizes="100vw"
              priority={i === 0}
              className="object-cover"
              style={{ opacity: i === 0 ? 1 : 0 }}
            />
          ))}
          <div className="absolute bottom-6 left-6 z-10 rounded-[var(--radius-md)] bg-[var(--color-deep)] px-5 py-3">
            <span className="text-xs font-bold tracking-[0.1em] text-white/50">
              {activeStep + 1} / {steps.length}
            </span>
            <p className="text-white font-semibold">{steps[activeStep]?.title}</p>
          </div>
        </div>

        {/* Timeline desktop */}
        <div className="hidden md:block relative">
          {/* Ligne de connexion */}
          <div className="absolute top-10 left-0 right-0 h-[2px] bg-[var(--color-border)]" aria-hidden="true" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = stepIcons[i];
              const number = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={number}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className={`relative z-10 w-20 h-20 rounded-[var(--radius-lg)] flex items-center justify-center mb-6 border ${stepColors[i]}`}
                  >
                    <Icon size={28} />
                  </div>
                  <span className="text-xs font-bold tracking-[0.1em] text-[var(--color-text-muted)] mb-2">
                    {number}
                  </span>
                  <h3 className="text-[var(--color-text)] font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical */}
        <div className="md:hidden space-y-8">
          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            const number = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={number}
                className="flex items-start gap-5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border ${stepColors[i]}`}
                >
                  <Icon size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold tracking-[0.1em] text-[var(--color-text-muted)]">
                    {number}
                  </span>
                  <h3 className="text-[var(--color-text)] font-bold text-lg mt-1">{step.title}</h3>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-1">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
