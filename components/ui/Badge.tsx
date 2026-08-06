import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Chips & tags — categories, statuts, marqueurs.
 *
 * DESIGN.md prescrit des teintes claires des couleurs primaires (10%) avec un
 * texte sombre. Les teintes amber et emerald utilisent les encres dediees
 * (`--color-amber-ink`, `--color-emerald-ink`) : la couleur pleine ne passe pas
 * 4,5:1 en texte sur fond clair.
 */
type Tone = "neutral" | "indigo" | "amber" | "emerald" | "outline";

const toneStyles: Record<Tone, string> = {
  neutral:
    "bg-[var(--color-bg-alt)] text-[var(--color-text-secondary)] border-transparent",
  indigo:
    "bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] border-transparent",
  amber:
    "bg-[var(--color-amber)]/10 text-[var(--color-amber-ink)] border-transparent",
  emerald:
    "bg-[var(--color-emerald)]/10 text-[var(--color-emerald-ink)] border-transparent",
  outline:
    "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Pastille de 6px devant le libelle — pour les statuts, pas pour les categories. */
  dot?: boolean;
}

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1",
        "rounded-[var(--radius-sm)] text-xs font-medium leading-4",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
