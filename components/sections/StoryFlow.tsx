"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useTranslations, useLocale } from "next-intl";
import { ScrollSequence } from "@/components/ui/scroll-sequence";
import { ParallaxFond } from "@/components/ui/parallax-fond";
import { ParallaxFormes } from "@/components/ui/parallax-formes";
import { cn } from "@/lib/utils";

/** Un palier de texte, positionné sur la progression du scrub (0 → 1). */
interface Chapter {
  content: React.ReactNode;
  /** Apparition. Le premier chapitre est visible d'emblée. */
  at: number;
  /** Disparition. Omis pour le dernier chapitre d'un acte. */
  until?: number;
}

interface StoryActProps {
  slug: string;
  chapters: Chapter[];
  align?: "left" | "right";
  ariaLabel: string;
  frameCount?: number;
  fondVariant?: "indigo" | "emerald" | "amber";
  formesSide?: "left" | "right";
}

function StoryAct({
  slug,
  chapters,
  align = "left",
  ariaLabel,
  frameCount = 50,
  fondVariant = "indigo",
  formesSide = "left",
}: StoryActProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const els = gsap.utils.toArray<HTMLElement>("[data-chapter]");
      if (els.length === 0) return;

      gsap.set(els.slice(1), { autoAlpha: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      chapters.forEach((ch, i) => {
        if (i > 0) tl.to(els[i], { autoAlpha: 1, y: 0, duration: 0.08 }, ch.at);
        if (ch.until !== undefined) {
          tl.to(els[i], { autoAlpha: 0, y: -55, duration: 0.08 }, ch.until);
        }
      });

      // Cale la durée totale sur 1 sans réétaler les positions ci-dessus.
      tl.to({}, { duration: 0.01 }, 0.99);
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className="relative bg-[var(--color-deep)]">
      <ScrollSequence
        frameCount={frameCount}
        frameSrc={(i) =>
          `/images/${slug}/frame-${String(i).padStart(3, "0")}.webp`
        }
        scrollLength={2.8}
        scrollLengthMobile={2.2}
        aria-label={ariaLabel}
        className="relative text-white"
      >
        {/* Couches de parallaxe */}
        <ParallaxFond variant={fondVariant} />
        <ParallaxFormes side={formesSide} />

        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 z-30",
            align === "left"
              ? "bg-gradient-to-r from-[var(--color-deep)]/92 via-[var(--color-deep)]/55 to-transparent"
              : "bg-gradient-to-l from-[var(--color-deep)]/92 via-[var(--color-deep)]/55 to-transparent",
          )}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-30 bg-gradient-to-t from-[var(--color-deep)]/90 via-transparent to-[var(--color-deep)]/45"
        />

        {chapters.map((ch, i) => (
          <div
            key={i}
            data-chapter={i}
            className="container-site absolute inset-0 z-40 flex flex-col justify-center pointer-events-none"
          >
            <div
              className={cn(
                "pointer-events-auto max-w-2xl",
                // L'alternance gauche/droite rythme le desktop ; sur mobile
                // tout reste aligné à gauche, plus lisible sur une colonne.
                align === "right" && "md:ml-auto md:text-right",
              )}
            >
              {ch.content}
            </div>
          </div>
        ))}
      </ScrollSequence>
    </div>
  );
}

/** Titre d'acte — même échelle typographique partout. */
function Line({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="leading-[1.12] tracking-[-0.02em] font-bold"
      style={{ fontSize: "clamp(28px, 4.4vw, 54px)" }}
    >
      {children}
    </p>
  );
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 text-white/60 text-base md:text-lg leading-relaxed">
      {children}
    </p>
  );
}

/**
 * Le récit en quatre actes : la surcharge, la rencontre, la délégation,
 * la liberté retrouvée. Les couleurs des écrans dans la vidéo passent du
 * rouge au vert — le texte s'appuie dessus.
 */
export function StoryFlow() {
  const t = useTranslations("storyFlow");
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <>
      {/* Acte 2 — la surcharge */}
      <StoryAct
        slug="acte-2-surcharge"
        ariaLabel={t("act2.ariaLabel")}
        align="left"
        fondVariant="indigo"
        formesSide="left"
        chapters={[
          {
            at: 0,
            until: 0.3,
            content: (
              <Line>
                {t("act2.line1a")}
                <br />
                {t("act2.line1b")}{" "}
                <span className="text-[var(--color-error)]">{t("act2.line1Highlight")}</span>.
              </Line>
            ),
          },
          {
            at: 0.38,
            until: 0.68,
            content: (
              <>
                <Line>
                  {t("act2.line2a")}
                  <br />
                  {t("act2.line2b")}
                </Line>
                <Sub>{t("act2.sub2")}</Sub>
              </>
            ),
          },
          {
            at: 0.76,
            content: (
              <Line>
                {t("act2.line3a")}
                <br />
                {t("act2.line3b")}
              </Line>
            ),
          },
        ]}
      />

      {/* Acte 3 — la rencontre */}
      <StoryAct
        slug="acte-3-rencontre"
        ariaLabel={t("act3.ariaLabel")}
        align="right"
        fondVariant="emerald"
        formesSide="right"
        chapters={[
          {
            at: 0,
            until: 0.42,
            content: <Line>{t("act3.line1")}</Line>,
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  {t("act3.line2a")}
                  <br />
                  {t("act3.line2b")}
                </Line>
                <Sub>{t("act3.sub")}</Sub>
              </>
            ),
          },
        ]}
      />

      {/* Acte 4 — la délégation */}
      <StoryAct
        slug="acte-4-delegation"
        ariaLabel={t("act4.ariaLabel")}
        align="left"
        fondVariant="amber"
        formesSide="left"
        chapters={[
          {
            at: 0,
            until: 0.42,
            content: (
              <Line>
                {t("act4.line1a")}
                <br />
                {t("act4.line1b")}
              </Line>
            ),
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  {t("act4.line2a")}{" "}
                  <span className="text-[var(--color-emerald-light)]">{t("act4.line2Highlight")}</span>.
                  <br />
                  {t("act4.line2b")}
                </Line>
                <Sub>{t("act4.sub")}</Sub>
              </>
            ),
          },
        ]}
      />

      {/* Acte 5 — la liberté retrouvée */}
      <StoryAct
        slug="acte-5-liberte"
        ariaLabel={t("act5.ariaLabel")}
        align="right"
        fondVariant="indigo"
        formesSide="right"
        chapters={[
          {
            at: 0,
            until: 0.4,
            content: (
              <Line>
                {t("act5.line1a")}
                <br />
                {t("act5.line1b")}
                <br />
                <span className="text-[var(--color-amber-light)]">
                  {t("act5.line1Highlight")}
                </span>
              </Line>
            ),
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  {t("act5.line2a")}
                  <br />
                  {t("act5.line2b")}
                </Line>
                <Sub>{t("act5.sub")}</Sub>
                <div className="mt-10 flex justify-start md:justify-end">
                  <a
                    href={`${prefix}/contact`}
                    className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 transition-all duration-300 min-h-[48px]"
                  >
                    {t("act5.cta")}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </>
            ),
          },
        ]}
      />
    </>
  );
}
