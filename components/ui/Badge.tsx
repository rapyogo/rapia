import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: "indigo" | "amber" | "emerald" | "deep" | "neutral";
}

const colorStyles: Record<NonNullable<BadgeProps["color"]>, string> = {
  indigo:
    "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  amber: "bg-[var(--color-amber)]/10 text-[var(--color-amber)]",
  emerald:
    "bg-[var(--color-emerald)]/10 text-[var(--color-emerald)]",
  deep: "bg-[var(--color-deep-profond)]/10 text-[var(--color-deep-profond)]",
  neutral:
    "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]",
};

export function Badge({
  color = "indigo",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-[4px]",
        "text-xs font-medium tracking-[0.05em] uppercase",
        "whitespace-nowrap",
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
