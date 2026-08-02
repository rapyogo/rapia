import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-secondary)] text-white hover:bg-[#4A4290] active:bg-[#3A3270] shadow-sm",
  secondary:
    "bg-[var(--color-amber)] text-[var(--color-deep-profond)] hover:bg-[#9A5A00] active:bg-[#8A5000] font-semibold shadow-sm",
  ghost:
    "bg-transparent text-[var(--color-secondary)] border border-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/5 active:bg-[var(--color-secondary)]/10",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm gap-1.5",
  md: "px-6 py-3 text-sm font-medium gap-2",
  lg: "px-8 py-4 text-base font-medium gap-2.5",
};

function getButtonClasses(
  variant: Variant,
  size: Size,
  className?: string,
  loading?: boolean
): string {
  return cn(
    "inline-flex items-center justify-center rounded-[4px] transition-all duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-secondary)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer select-none",
    "min-h-[44px] min-w-[44px]",
    variantStyles[variant],
    sizeStyles[size],
    loading && "cursor-wait opacity-70",
    className
  );
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    target?: undefined;
    rel?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = getButtonClasses(variant, size, className, loading);

  if ("href" in props && props.href) {
    const { href, target, rel, ...rest } = props as ButtonAsLink;
    return (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {icon}
        {children}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button
      disabled={loading || (rest as ButtonAsButton).disabled}
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle
            cx="8"
            cy="8"
            r="6"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="28"
            strokeDashoffset="8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
