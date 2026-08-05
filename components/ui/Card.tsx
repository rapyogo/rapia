import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

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
        hover &&
          "transition-colors duration-300 hover:border-[var(--color-indigo)]/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
