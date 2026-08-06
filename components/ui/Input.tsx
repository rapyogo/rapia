import { cn } from "@/lib/utils";
import type {
  InputHTMLAttributes,
  Ref,
  TextareaHTMLAttributes,
} from "react";

interface InputBaseProps {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
  /** Mention affichee a cote du label quand le champ n'est pas requis. */
  optionalLabel?: string;
}

type InputAsInput = InputBaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    textarea?: false;
    fieldRef?: Ref<HTMLInputElement>;
  };

type InputAsTextarea = InputBaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
    rows?: number;
    fieldRef?: Ref<HTMLTextAreaElement>;
  };

export type InputProps = InputAsInput | InputAsTextarea;

/**
 * Champ de formulaire — label, aide, erreur et compteur dans un seul bloc.
 *
 * Le composant reste sans etat : `value` vient du parent, donc le compteur de
 * caracteres se deduit du rendu et le champ peut vivre dans un composant
 * serveur si le parent le permet.
 *
 * L'ordre de `aria-describedby` compte : l'erreur passe avant l'aide, parce
 * qu'un lecteur d'ecran lit la liste dans l'ordre donne et que le probleme doit
 * arriver avant la consigne.
 */
export function Input(props: InputProps) {
  const {
    label,
    error,
    helperText,
    id,
    className,
    textarea,
    optionalLabel,
    fieldRef,
    ...rest
  } = props;

  const { required, maxLength, value } = rest;

  // Le compteur n'apparait qu'a l'approche de la limite : affiche en permanence,
  // il transforme un champ libre en test de concision.
  const length = typeof value === "string" ? value.length : 0;
  const showCounter =
    typeof maxLength === "number" && length > maxLength * 0.7;
  const counterId = `${id}-counter`;

  const describedBy =
    [
      error ? `${id}-error` : null,
      helperText && !error ? `${id}-helper` : null,
      showCounter ? counterId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const fieldClasses = cn(
    "w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]",
    "text-[var(--color-text)]",
    "font-sans text-base leading-6",
    "transition-colors duration-200",
    "placeholder:text-[var(--color-text-muted)]",
    "focus:outline-none focus:border-[var(--color-indigo)]",
    error && "border-[var(--color-error)] focus:border-[var(--color-error)]",
    textarea && "min-h-[120px] resize-y",
    className,
  );

  const shared = {
    id,
    className: fieldClasses,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[var(--color-text)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--color-error)]" aria-hidden="true">
              *
            </span>
          )}
          {!required && optionalLabel && (
            <span className="ml-2 font-normal text-[var(--color-text-muted)]">
              {optionalLabel}
            </span>
          )}
        </label>
        {showCounter && (
          <span
            id={counterId}
            aria-live="polite"
            className={cn(
              "shrink-0 text-xs tabular-nums",
              length >= (maxLength ?? 0)
                ? "text-[var(--color-error)]"
                : "text-[var(--color-text-muted)]",
            )}
          >
            {length} / {maxLength}
          </span>
        )}
      </div>

      {textarea ? (
        <textarea
          {...shared}
          ref={fieldRef as Ref<HTMLTextAreaElement>}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          {...shared}
          ref={fieldRef as Ref<HTMLInputElement>}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && (
        <p
          id={`${id}-error`}
          className="text-sm text-[var(--color-error)]"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p
          id={`${id}-helper`}
          className="text-sm text-[var(--color-text-secondary)]"
        >
          {helperText}
        </p>
      )}
    </div>
  );
}
