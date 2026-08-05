"use client";

import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Home, Briefcase, GraduationCap, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = [Home, Briefcase, GraduationCap, Mail];

export function MobileNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const prefix = `/${locale}`;
  const pathname = usePathname();

  const links = [
    { label: t("home"), href: prefix },
    { label: t("services"), href: `${prefix}/#services` },
    { label: t("training"), href: `${prefix}/#academy` },
    { label: t("contact"), href: `${prefix}/contact` },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-deep)] border-t border-white/10 safe-area-bottom"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link, i) => {
          const Icon = icons[i];
          const isActive =
            link.href === prefix
              ? pathname === prefix
              : pathname.startsWith(link.href.split("#")[0]);

          return (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-3 py-1 rounded-[var(--radius-md)] transition-colors",
                isActive ? "text-[var(--color-amber)]" : "text-white/35 hover:text-white/60"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {Icon && <Icon size={20} />}
              <span className="text-[10px] font-semibold">{link.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
