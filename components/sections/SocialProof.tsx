"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Quote, Building2, Handshake, BadgeCheck } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/Empty";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/**
 * PREUVES & CRÉDIBILITÉ.
 *
 * **Aucun chiffre n'est inventé ici.** Chaque statistique est un emplacement
 * dont la valeur reste `null` tant qu'un chiffre vérifié n'a pas été fourni.
 *
 * Pour publier un chiffre : renseigner sa valeur dans `VALUES` ci-dessous. La
 * grille de statistiques n'apparaît qu'à partir du premier chiffre confirmé —
 * quatre tuiles affichant un tiret ne prouvent rien et se lisent comme un
 * gabarit oublié en production.
 *
 * Les quatre volets de preuve, eux, sont toujours rendus : ils nomment ce qui
 * manque et la règle que RAPIA s'impose avant de le publier. Une absence
 * expliquée soutient le positionnement « crédibilité par la clarté » ; un cadre
 * vide le contredit.
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

interface Proof {
  key: string;
  label: string;
  body: string;
}

/** Icônes mappées par index — jamais par libellé, celui-ci étant traduit. */
const PROOF_ICONS = [Quote, Building2, Handshake, BadgeCheck];

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
  const locale = useLocale();
  const stats = t.raw("stats") as Stat[];
  const proofs = t.raw("proofs") as Proof[];
  const hasAnyStat = stats.some((s) => VALUES[s.key] !== null);
  const hasPendingStat = stats.some((s) => VALUES[s.key] === null);

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
          <p className="mt-5 text-lg leading-8 text-[var(--color-text-secondary)]">
            {t("intro")}
          </p>
        </div>

        {hasAnyStat && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const value = VALUES[stat.key] ?? null;
              return (
                <motion.div
                  key={stat.key}
                  className="border-t border-[var(--color-border)] pt-5"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55 }}
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
                    <div className="mt-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-[var(--color-amber-ink)]">
                      {t("toConfirm")}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {proofs.map((proof, i) => {
            const Icon = PROOF_ICONS[i] ?? Quote;
            return (
              <motion.div
                key={proof.key}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5 }}
              >
                <Empty className="h-full">
                  <EmptyHeader>
                    <div className="flex items-center gap-3">
                      <EmptyMedia variant="icon">
                        <Icon size={18} strokeWidth={1.75} />
                      </EmptyMedia>
                      <EmptyTitle as="h3">{proof.label}</EmptyTitle>
                      <Badge tone="amber" dot className="ml-auto">
                        {t("pending")}
                      </Badge>
                    </div>
                    <EmptyDescription>{proof.body}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </motion.div>
            );
          })}
        </div>

        {/* Cette mise au point n'a de sens qu'à côté de chiffres partiellement
            publiés : elle explique les tirets restants. Tant qu'aucune
            statistique n'existe, l'introduction le dit déjà — la répéter ici
            ferait dire deux fois la même chose à deux endroits de la section. */}
        {hasAnyStat && hasPendingStat && (
          <p className="mt-6 max-w-prose text-sm text-[var(--color-text-secondary)]">
            {t("emptyState")}
          </p>
        )}

        {/* Callout de conversion — seul emploi autorisé du Deep Profond. */}
        <div className="mt-12 rounded-[var(--radius-lg)] bg-[var(--color-deep)] px-6 py-8 md:px-10 md:py-10">
          <div className="max-w-2xl">
            <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">
              {t("ctaTitle")}
            </h3>
            <p className="mt-3 text-base leading-7 text-white/75">
              {t("ctaBody")}
            </p>
            <Button
              href={`/${locale}/contact`}
              variant="secondary"
              size="md"
              className="mt-6"
            >
              {t("ctaLabel")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
