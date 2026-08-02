import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center max-w-3xl mx-auto",
        className
      )}
      {...props}
    >
      {eyebrow && (
        <p
          className="text-[var(--color-secondary)] text-sm font-medium tracking-[0.05em] uppercase mb-3"
          style={{
            fontSize: "var(--font-label-md-size)",
            fontWeight: "var(--font-label-md-weight)",
            letterSpacing: "var(--font-label-md-letter-spacing)",
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-[var(--color-on-background)] mb-4"
        style={{
          fontSize: "clamp(24px, 4vw, var(--font-headline-md-size))",
          fontWeight: "var(--font-headline-md-weight)",
          lineHeight: "var(--font-headline-md-line-height)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-[var(--color-on-surface-variant)] max-w-2xl mx-auto"
          style={{
            fontSize: "var(--font-body-lg-size)",
            lineHeight: "var(--font-body-lg-line-height)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
