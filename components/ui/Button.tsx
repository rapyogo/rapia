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
    "bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]",
  secondary:
    "bg-[var(--color-amber)] text-[var(--color-deep)] hover:bg-[var(--color-amber-light)] font-bold shadow-[var(--shadow-md)]",
  ghost:
    "bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/30",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2.5 text-xs gap-1.5",
  md: "px-6 py-3 text-sm gap-2",
  lg: "px-8 py-4 text-sm gap-2.5",
};

function getButtonClasses(variant: Variant, size: Size, className?: string, loading?: boolean): string {
  return cn(
    "inline-flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-300",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-indigo)]",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer select-none font-semibold",
    "min-h-[44px] min-w-[44px]",
    "hover:-translate-y-0.5",
    variantStyles[variant],
    sizeStyles[size],
    loading && "cursor-wait opacity-70 !translate-y-0",
    className
  );
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = "primary", size = "md", loading = false, icon, className, children, ...props }: ButtonProps) {
  const classes = getButtonClasses(variant, size, className, loading);

  if ("href" in props && props.href) {
    const { href, target, rel, ...rest } = props as ButtonAsLink;
    return (
      <a href={href} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} className={classes} onClick={"onClick" in rest ? (rest as any).onClick : undefined}>
        {loading ? <Spinner /> : icon}
        {children}
      </a>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button disabled={loading || (rest as ButtonAsButton).disabled} className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  );
}
