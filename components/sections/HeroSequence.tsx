"use client";

import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSequence } from "@/components/ui/scroll-sequence";
import { ParallaxFond } from "@/components/ui/parallax-fond";
import { ParallaxFormes } from "@/components/ui/parallax-formes";
import { cn } from "@/lib/utils";

const FRAME_COUNT = 50;
const frameSrc = (i: number) =>
  `/images/hero-sequence/frame-${String(i).padStart(3, "0")}.webp`;

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

/** Un palier narratif superposé à la séquence. */
function Chapter({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-chapter={index}
      className={cn(
        "container-site absolute inset-0 z-40 flex flex-col justify-center pointer-events-none",
        className
      )}
    >
      <div className="pointer-events-auto max-w-3xl">{children}</div>
    </div>
  );
}

export function HeroSequence() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const prefix = `/${locale}`;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      if (chapters.length === 0) return;

      // Les chapitres 2+ démarrent masqués — autoAlpha coupe aussi les clics.
      gsap.set(chapters.slice(1), { autoAlpha: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      // Chapitre 1 — le drone survole la tour.
      tl.to("[data-scroll-hint]", { autoAlpha: 0, duration: 0.04 }, 0.02);
      tl.to(chapters[0], { autoAlpha: 0, y: -60, duration: 0.08 }, 0.24);

      // Chapitre 2 — on est entré, l'entrepreneur est à son poste.
      tl.to(chapters[1], { autoAlpha: 1, y: 0, duration: 0.08 }, 0.34)
        .to(chapters[1], { autoAlpha: 0, y: -60, duration: 0.08 }, 0.58);

      // Chapitre 3 — la pile de dossiers, puis la promesse.
      tl.to(chapters[2], { autoAlpha: 1, y: 0, duration: 0.1 }, 0.68);

      // Cale la durée totale sur 1 sans réétaler les positions ci-dessus.
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="relative bg-[var(--color-deep)]">
      <ScrollSequence
        frameCount={FRAME_COUNT}
        frameSrc={frameSrc}
        scrollLength={4}
        scrollLengthMobile={3}
        eager
        aria-label="Présentation de RAPIA"
        className="relative text-white"
      >
        {/* Couches de parallaxe */}
        <ParallaxFond variant="indigo" />
        <ParallaxFormes side="left" />

        {/* Voile de lisibilité — assombrit l'image sous le texte */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-gradient-to-r from-[var(--color-deep)]/92 via-[var(--color-deep)]/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-gradient-to-t from-[var(--color-deep)]/90 via-transparent to-[var(--color-deep)]/45"
        />

        {/* Chapitre 1 — l'accroche de marque */}
        <Chapter index={0}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-[0.08em] uppercase text-white/60 mb-8 w-fit backdrop-blur-sm">
            <Sparkles size={14} className="text-[var(--color-amber)]" />
            {t("eyebrow")}
          </div>
          <h1
            className="leading-[1.08] tracking-[-0.025em] font-extrabold"
            style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
          >
            {t("title")}
          </h1>
        </Chapter>

        {/* Chapitre 2 — le constat, sans chiffre inventé */}
        <Chapter index={1}>
          <p
            className="leading-[1.15] tracking-[-0.02em] font-bold text-white/95"
            style={{ fontSize: "clamp(30px, 4.6vw, 56px)" }}
          >
            {t("chapter2Line1")}
            <br />
            {t("chapter2Line2")}
            <br />
            <span className="text-[var(--color-amber-light)]">
              {t("chapter2Line3")}
            </span>
          </p>
        </Chapter>

        {/* Chapitre 3 — la promesse et l'action */}
        <Chapter index={2}>
          <p
            className="leading-[1.15] tracking-[-0.02em] font-bold mb-6"
            style={{ fontSize: "clamp(28px, 4.2vw, 52px)" }}
          >
            {t("chapter3Intro")}
          </p>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            {t("subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <CTAButton primary href={`${prefix}/contact`}>
              {t("primaryCta")}
              <ArrowRight size={16} />
            </CTAButton>
            <CTAButton href={`${prefix}/#services`}>{t("secondaryCta")}</CTAButton>
          </div>
          <p className="text-xs md:text-sm text-white/40 font-medium tracking-[0.06em] uppercase">
            {t("credibility")}
          </p>
        </Chapter>

        {/* Invite au scroll — disparaît dès que la séquence démarre */}
        <div
          data-scroll-hint
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
          aria-hidden="true"
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/40 animate-bounce" />
          </div>
        </div>
      </ScrollSequence>
    </div>
  );
}
