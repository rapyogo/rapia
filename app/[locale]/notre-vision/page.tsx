"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";

interface Step {
  title: string;
  description: string;
}

interface Argument {
  title: string;
  description: string;
}

export default function NotreVisionPage() {
  const t = useTranslations("vision");
  const tProblem = useTranslations("problem");
  const tProcess = useTranslations("process");
  const tWhy = useTranslations("whyRapia");
  const tCta = useTranslations("finalCta");
  const locale = useLocale();
  const prefix = `/${locale}`;

  const levels = [
    { number: "01", title: tProblem("level1"), description: tProblem("level1Desc") },
    { number: "02", title: tProblem("level2"), description: tProblem("level2Desc") },
    { number: "03", title: tProblem("level3"), description: tProblem("level3Desc") },
  ];
  const steps = tProcess.raw("steps") as Step[];
  const args = tWhy.raw("arguments") as Argument[];

  return (
    <>
      {/* Retour — flottant au-dessus des sections empilées (z-index le plus haut) */}
      <Link
        href={prefix}
        className="fixed top-6 left-6 z-[100] inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-deep)] border border-white/25 text-white text-sm font-medium hover:bg-[var(--color-deep-light)] transition-colors"
      >
        <ArrowLeft size={16} />
        {t("back")}
      </Link>

      <FlowArt aria-label={t("ariaLabel")}>
        {/* 01 — Qui nous sommes */}
        <FlowSection
          aria-label={t("s1Eyebrow")}
          style={{ backgroundColor: "#021E2D", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            {t("s1Eyebrow")}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div>
            <h1 className="text-[clamp(3rem,10vw,10rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              {t("s1TitleA")}
              <br />
              {t("s1TitleB")}
              <br />
              {t("s1TitleC")}
            </h1>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/70">
            {t("s1Body")}
          </p>
        </FlowSection>

        {/* 02 — Le constat */}
        <FlowSection
          aria-label={t("s2Eyebrow")}
          style={{ backgroundColor: "#5E53A4", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
            {t("s2Eyebrow")}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              {tProblem("level1")}
              <br />
              {tProblem("level2")}
              <br />
              {tProblem("level3")}
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/80">
            {tProblem("title")}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <div className="flex flex-wrap gap-[3vw]">
            {levels.map((level) => (
              <div key={level.number} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                  {t("levelPrefix")} {level.number} — {level.title}
                </p>
                <p className="text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-white/65">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
          <hr className="my-[2vw] border-none border-t border-white/25" />
          <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/80">
            {tProblem("highlight")}
          </p>
        </FlowSection>

        {/* 03 — Comment nous travaillons */}
        <FlowSection
          aria-label={t("s3Eyebrow")}
          style={{ backgroundColor: "#FAFBFC", color: "#0F1722" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
            {t("s3Eyebrow")}
          </p>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              {t("s3TitleA")}
              <br />
              {t("s3TitleB")}
              <br />
              {t("s3TitleC")}
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-[var(--color-text-secondary)]">
            {tProcess("subtitle")}
          </p>
          <hr className="my-[2vw] border-none border-t border-black/10" />
          <div className="flex flex-wrap gap-[3vw]">
            {steps.map((step, i) => (
              <div key={step.title} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[var(--color-indigo)]">
                  {String(i + 1).padStart(2, "0")} — {step.title}
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
          aria-label={t("s4Eyebrow")}
          style={{ backgroundColor: "#021E2D", color: "#fff" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
            {t("s4Eyebrow")}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              {t("s4TitleA")}
              <br />
              {t("s4TitleB")}
              <br />
              {t("s4TitleC")}
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed text-white/70">
            {tWhy("subtitle")}
          </p>
          <hr className="my-[2vw] border-none border-t border-white/15" />
          <div className="flex flex-wrap gap-[3vw]">
            {args.slice(0, 3).map((arg) => (
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
            {args.slice(3).map((arg) => (
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
          aria-label={t("s5Eyebrow")}
          style={{ backgroundColor: "#B87500", color: "#021E2D" }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/50">
            {t("s5Eyebrow")}
          </p>
          <hr className="my-[2vw] border-none border-t border-black/20" />
          <div>
            <h2 className="text-[clamp(2.5rem,8vw,8rem)] font-extrabold leading-[0.9] uppercase tracking-tight">
              {t("s5TitleA")}
              <br />
              {t("s5TitleB")}
            </h2>
          </div>
          <hr className="my-[2vw] border-none border-t border-black/20" />
          <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.2vw,1.75rem)] font-normal leading-relaxed">
            {tCta("text")}
          </p>
          <div className="mt-8">
            <Link
              href={`${prefix}/contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#021E2D] text-white font-bold text-sm rounded-[var(--radius-md)] hover:bg-[#043A50] transition-colors"
            >
              {tCta("primaryCta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </FlowSection>
      </FlowArt>
    </>
  );
}
