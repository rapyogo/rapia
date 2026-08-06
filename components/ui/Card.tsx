import { cn } from "@/lib/utils";
import type { ComponentPropsWithRef, HTMLAttributes } from "react";

type Padding = "none" | "sm" | "md" | "lg";

/**
 * `ComponentPropsWithRef` plutôt que `HTMLAttributes` : React 19 passe `ref`
 * comme une prop ordinaire, et un appelant a besoin de la carte pour y déplacer
 * le focus (message de confirmation, panneau qui vient d'apparaître).
 */
interface CardProps extends ComponentPropsWithRef<"div"> {
  hover?: boolean;
  padding?: Padding;
}

const paddingStyles: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

/**
 * Surface blanche bordee 1px.
 *
 * `hover` applique l'elevation de niveau 2 decrite dans DESIGN.md : montee de
 * 4px et bordure qui vire a l'indigo. Pas d'ombre — la profondeur vient de
 * l'aplat et du trait.
 *
 * Pour separer les metadonnees du contenu, composer avec `CardHeader` /
 * `CardBody` / `CardFooter` et passer `padding="none"` : les sous-composants
 * portent alors leur propre rythme.
 */
export function Card({
  hover = false,
  padding = "md",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]",
        paddingStyles[padding],
        hover && [
          "transition-[transform,border-color] duration-300 [transition-timing-function:var(--ease-out)]",
          "hover:-translate-y-1 hover:border-[var(--color-indigo)]/40",
        ],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** Bandeau de metadonnees, sur le neutre clair prescrit par DESIGN.md. */
export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3",
        "rounded-t-[var(--radius-lg)] border-b border-[var(--color-border)]",
        "bg-[var(--color-surface-hover)] px-6 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] px-6 py-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
