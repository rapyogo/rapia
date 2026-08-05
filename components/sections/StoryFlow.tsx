"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSequence } from "@/components/ui/scroll-sequence";
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
}

function StoryAct({
  slug,
  chapters,
  align = "left",
  ariaLabel,
  frameCount = 50,
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
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0",
            align === "left"
              ? "bg-gradient-to-r from-[var(--color-deep)]/92 via-[var(--color-deep)]/55 to-transparent"
              : "bg-gradient-to-l from-[var(--color-deep)]/92 via-[var(--color-deep)]/55 to-transparent",
          )}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-deep)]/90 via-transparent to-[var(--color-deep)]/45"
        />

        {chapters.map((ch, i) => (
          <div
            key={i}
            data-chapter={i}
            className="container-site absolute inset-0 flex flex-col justify-center pointer-events-none"
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
  return (
    <>
      {/* Acte 2 — la surcharge */}
      <StoryAct
        slug="acte-2-surcharge"
        ariaLabel="Le constat : la surcharge opérationnelle"
        align="left"
        chapters={[
          {
            at: 0,
            until: 0.3,
            content: (
              <Line>
                Vous ne manquez pas de compétences.
                <br />
                Vous manquez{" "}
                <span className="text-[var(--color-error)]">d&apos;heures</span>.
              </Line>
            ),
          },
          {
            at: 0.38,
            until: 0.68,
            content: (
              <>
                <Line>
                  Les relances. Les saisies.
                  <br />
                  Les rapports. Les contrôles.
                </Line>
                <Sub>
                  Chaque jour, les mêmes gestes. Ils ne font pas avancer
                  l&apos;entreprise, mais personne d&apos;autre ne les fera.
                </Sub>
              </>
            ),
          },
          {
            at: 0.76,
            content: (
              <Line>
                Et le soir tombe avant
                <br />
                que le vrai travail commence.
              </Line>
            ),
          },
        ]}
      />

      {/* Acte 3 — la rencontre */}
      <StoryAct
        slug="acte-3-rencontre"
        ariaLabel="La proposition : une IA qui prend la charge"
        align="right"
        chapters={[
          {
            at: 0,
            until: 0.42,
            content: <Line>Et si vous n&apos;aviez plus à tout porter seul&nbsp;?</Line>,
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  Pas un logiciel de plus.
                  <br />
                  Un système qui fait le travail.
                </Line>
                <Sub>
                  L&apos;IA ne vient pas prendre votre place. Elle vient prendre
                  votre charge.
                </Sub>
              </>
            ),
          },
        ]}
      />

      {/* Acte 4 — la délégation */}
      <StoryAct
        slug="acte-4-delegation"
        ariaLabel="La délégation : vous décidez, le système exécute"
        align="left"
        chapters={[
          {
            at: 0,
            until: 0.42,
            content: (
              <Line>
                Vous décidez.
                <br />
                Il exécute.
              </Line>
            ),
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  Le rouge devient{" "}
                  <span className="text-[var(--color-emerald-light)]">vert</span>.
                  <br />
                  Sans que vous y touchiez.
                </Line>
                <Sub>
                  Les tâches tournent la nuit, le week-end, pendant vos réunions.
                  Vous gardez la main sur ce qui compte : les décisions.
                </Sub>
              </>
            ),
          },
        ]}
      />

      {/* Acte 5 — la liberté retrouvée */}
      <StoryAct
        slug="acte-5-liberte"
        ariaLabel="Le résultat : du temps rendu à l'essentiel"
        align="right"
        chapters={[
          {
            at: 0,
            until: 0.4,
            content: (
              <Line>
                Vous récupérez la seule chose
                <br />
                qui ne se délègue pas :
                <br />
                <span className="text-[var(--color-amber-light)]">
                  votre attention.
                </span>
              </Line>
            ),
          },
          {
            at: 0.5,
            content: (
              <>
                <Line>
                  C&apos;est ça, une IA
                  <br />
                  qui travaille pour vous.
                </Line>
                <Sub>
                  Parlons de vos opérations. Nous identifions ensemble ce qui
                  peut être automatisé dès maintenant.
                </Sub>
                <div className="mt-10 flex justify-start md:justify-end">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] hover:-translate-y-0.5 transition-all duration-300 min-h-[48px]"
                  >
                    Parler à un expert IA
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
