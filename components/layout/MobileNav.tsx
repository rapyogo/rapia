"use client";

import { usePathname } from "next/navigation";
import { Home, Briefcase, GraduationCap, Mail } from "lucide-react";
import { NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Home, Briefcase, GraduationCap, Mail,
};

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-deep)]/95 backdrop-blur-xl border-t border-white/[0.06] safe-area-bottom"
      aria-label="Navigation mobile"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {NAVIGATION.mobile.map((link) => {
          const Icon = iconMap[link.icon];
          const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

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
