"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Choix unique parmi quelques options courtes, presentees en chips.
 *
 * Deux choix expliques :
 *
 * - **Boutons `aria-pressed`, pas un `radiogroup`.** Ces champs sont facultatifs
 *   et un vrai groupe radio ne se deselectionne pas : une fois clique, le
 *   visiteur ne peut plus revenir en arriere. Ici, recliquer l'option active la
 *   retire — d'ou des boutons a bascule dans un `role="group"`.
 * - **La coche est rendue, pas simulee par la couleur.** Le seul aplat indigo ne
 *   distingue pas l'etat actif pour un daltonien deuteranope ; l'icone si.
 */
interface ChoiceChipsProps {
  legend: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  /** Annonce « facultatif » a cote de la legende. */
  optionalLabel?: string;
}

export function ChoiceChips({
  legend,
  options,
  value,
  onChange,
  optionalLabel,
}: ChoiceChipsProps) {
  const legendId = useId();

  return (
    <fieldset>
      <legend
        id={legendId}
        className="mb-3 text-sm font-medium text-[var(--color-text)]"
      >
        {legend}
        {optionalLabel && (
          <span className="ml-2 font-normal text-[var(--color-text-muted)]">
            {optionalLabel}
          </span>
        )}
      </legend>
      <div
        role="group"
        aria-labelledby={legendId}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              // Recliquer l'option active la retire.
              onClick={() => onChange(selected ? "" : option)}
              className={cn(
                "inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-md)] border px-4 py-2",
                "text-sm transition-colors duration-200 cursor-pointer",
                selected
                  ? "border-[var(--color-indigo)] bg-[var(--color-indigo)]/10 font-medium text-[var(--color-indigo)]"
                  : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-indigo)]/50 hover:text-[var(--color-text)]",
              )}
            >
              {selected && <Check size={15} aria-hidden="true" />}
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
