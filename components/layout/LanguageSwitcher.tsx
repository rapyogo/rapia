"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = locale === "fr" ? "en" : "fr";

  const handleSwitch = () => {
    router.replace(pathname, { locale: switchTo });
  };

  return (
    <button
      onClick={handleSwitch}
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.06em] text-white/50 hover:text-white transition-colors cursor-pointer",
        "px-2 py-1 rounded-[var(--radius-sm)] hover:bg-white/5",
        className,
      )}
      aria-label={
        locale === "fr" ? "Switch to English" : "Passer en français"
      }
    >
      {switchTo.toUpperCase()}
    </button>
  );
}

export default LanguageSwitcher;
