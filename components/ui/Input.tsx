import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputBaseProps {
  label: string;
  error?: string;
  helperText?: string;
  id: string;
}

type InputAsInput = InputBaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    textarea?: false;
  };

type InputAsTextarea = InputBaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    textarea: true;
    rows?: number;
  };

export type InputProps = InputAsInput | InputAsTextarea;

export function Input(props: InputProps) {
  const { label, error, helperText, id, className, textarea, ...rest } =
    props;

  const inputClasses = cn(
    "w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]",
    "text-[var(--color-text)]",
    "font-sans text-base leading-6",
    "transition-colors duration-200",
    "placeholder:text-[var(--color-text-muted)]",
    "focus:outline-none focus:border-[var(--color-indigo)]",
    error && "border-[var(--color-error)] focus:border-[var(--color-error)]",
    textarea && "min-h-[120px] resize-y",
    className
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-[var(--color-text)]"
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          className={inputClasses}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={inputClasses}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[var(--color-error)]" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={`${id}-helper`} className="text-sm text-[var(--color-text-secondary)]">
          {helperText}
        </p>
      )}
    </div>
  );
}
