"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * PREUVES & CRÉDIBILITÉ.
 *
 * **Aucun chiffre n'est inventé ici.** Chaque statistique est un emplacement
 * dont la valeur reste `null` tant qu'un chiffre vérifié n'a pas été fourni :
 * elle affiche alors un tiret et le marqueur « à confirmer », et n'anime rien.
 * Témoignages, clients, partenaires et certifications montrent un cadre vide
 * plutôt que des logos de remplissage.
 *
 * Pour publier un chiffre : renseigner sa valeur dans `VALUES` ci-dessous.
 */
const VALUES: Record<string, number | null> = {
  projets: null,
  equipes: null,
  processus: null,
  organisations: null,
};

interface Stat {
  key: string;
  label: string;
  suffix: string;
}

/** Compte une seule fois, à l'entrée dans le viewport. */
function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done.current) return;
        done.current = true;

        const DURATION = 1200;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          // Courbe reguliere, sans depassement : le brief demande du compose.
          setDisplay(Math.round(value * t));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const t = useTranslations("socialProof");
  const stats = t.raw("stats") as Stat[];
  const hasAnyStat = stats.some((s) => VALUES[s.key] !== null);

  return (
    <section className="section section-alt" aria-label="Preuves et crédibilité">
      <div className="container-site">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-indigo)] mb-4">
            {t("eyebrow")}
          </p>
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {t("heading")}
          </h2>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const value = VALUES[stat.key] ?? null;
            return (
              <motion.div
                key={stat.key}
                className="border-t border-[var(--color-border)] pt-5"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
              >
                <div
                  className="text-[var(--color-text)] tabular-nums font-bold"
                  style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
                >
                  {value !== null ? (
                    <CountUp value={value} suffix={stat.suffix} />
                  ) : (
                    <span className="text-[var(--color-text-muted)]">—</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  {stat.label}
                </div>
                {value === null && (
                  <div className="mt-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-[var(--color-amber)]">
                    {t("toConfirm")}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-14 grid gap-6 border-t border-[var(--color-border)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            t("testimonialsLabel"),
            t("clientsLabel"),
            t("partnersLabel"),
            t("certificationsLabel"),
          ].map((label) => (
            <div key={label}>
              <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {label}
              </h3>
              <div
                className="mt-3 h-20 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)]"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {!hasAnyStat && (
          <p className="mt-6 max-w-prose text-sm text-[var(--color-text-secondary)]">
            {t("emptyState")}
          </p>
        )}
      </div>
    </section>
  );
}
