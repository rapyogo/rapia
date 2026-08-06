import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Etat vide — composition, pas configuration.
 *
 * L'API suit celle de shadcn/ui (`Empty` / `EmptyHeader` / `EmptyMedia` /
 * `EmptyTitle` / `EmptyDescription` / `EmptyContent`) parce qu'elle laisse
 * chaque appelant composer ce dont il a besoin sans empiler les props. Le style,
 * lui, est entierement Corporate Clair : surface blanche, bordure 1px, aucun
 * gradient ni ombre portee.
 *
 * Un etat vide n'est pas un trou en attendant le contenu : il dit ce qui
 * manquera la, pourquoi ce n'est pas encore la, et ce que le visiteur peut
 * faire entre-temps.
 */

type DivProps = HTMLAttributes<HTMLDivElement>;

export function Empty({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[var(--radius-lg)]",
        "border border-[var(--color-border)] bg-[var(--color-surface)] p-6",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function EmptyHeader({ className, children, ...props }: DivProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Porte l'icone. `variant="icon"` la pose dans une tuile teintee de 40px —
 * un aplat, jamais un halo.
 */
export function EmptyMedia({
  variant = "default",
  className,
  children,
  ...props
}: DivProps & { variant?: "default" | "icon" }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        variant === "icon" &&
          "flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-bg-alt)] text-[var(--color-indigo)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * `as` existe parce qu'un état vide placé dans une section structurée porte un
 * vrai niveau de titre : quatre volets de preuve sont quatre `h3`, pas quatre
 * paragraphes en gras. Le défaut reste `p` pour les usages isolés, où inventer
 * un niveau de titre casserait le plan du document.
 */
export function EmptyTitle({
  as: Tag = "p",
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "p" | "h2" | "h3" | "h4" }) {
  return (
    <Tag
      className={cn(
        "text-sm font-semibold text-[var(--color-text)]",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function EmptyDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "max-w-prose text-sm leading-6 text-[var(--color-text-secondary)]",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function EmptyContent({ className, children, ...props }: DivProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}
