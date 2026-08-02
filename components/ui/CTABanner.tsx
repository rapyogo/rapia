import { cn } from "@/lib/utils";
import { Button } from "./Button";
import type { HTMLAttributes } from "react";

interface CTABannerProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  text?: string;
  primaryCta: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  variant?: "deep" | "light";
}

export function CTABanner({
  title,
  text,
  primaryCta,
  primaryHref = "/contact",
  secondaryCta,
  secondaryHref = "/contact",
  variant = "deep",
  className,
  ...props
}: CTABannerProps) {
  const isDeep = variant === "deep";

  return (
    <div
      className={cn(
        "rounded-[8px] px-8 py-12 md:px-16 md:py-16 text-center",
        isDeep
          ? "bg-[var(--color-deep-profond)] text-white"
          : "bg-[var(--color-surface-container-low)] text-[var(--color-on-background)]",
        className
      )}
      {...props}
    >
      <h2
        className="mb-4 max-w-3xl mx-auto"
        style={{
          fontSize: "clamp(24px, 4vw, var(--font-headline-md-size))",
          fontWeight: "var(--font-headline-md-weight)",
          lineHeight: "var(--font-headline-md-line-height)",
        }}
      >
        {title}
      </h2>
      {text && (
        <p
          className={cn(
            "mb-8 max-w-2xl mx-auto",
            isDeep
              ? "text-white/70"
              : "text-[var(--color-on-surface-variant)]"
          )}
          style={{
            fontSize: "var(--font-body-lg-size)",
            lineHeight: "var(--font-body-lg-line-height)",
          }}
        >
          {text}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        <Button
          variant={isDeep ? "secondary" : "primary"}
          size="lg"
          href={primaryHref}
        >
          {primaryCta}
        </Button>
        {secondaryCta && (
          <Button
            variant={isDeep ? "ghost" : "ghost"}
            size="lg"
            href={secondaryHref}
            className={isDeep ? "border-white/30 text-white hover:bg-white/10" : ""}
          >
            {secondaryCta}
          </Button>
        )}
      </div>
    </div>
  );
}
