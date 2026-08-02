"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAVIGATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) closeMenu();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Focus trap
  useEffect(() => {
    if (!isMenuOpen || !drawerRef.current) return;
    const drawer = drawerRef.current;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-[var(--color-deep)]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_24px_rgba(2,30,45,0.3)]"
          : "bg-[var(--color-deep)] border-b border-transparent"
      )}
    >
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 font-bold select-none group" aria-label="RAPIA — Accueil">
          <img src="/rapia-mark.svg" alt="" className="w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
          <span className="text-white text-xl tracking-[-0.01em] font-bold">RAPIA</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {NAVIGATION.main.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-white/55 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:block">
          <Button variant="primary" size="sm" href={NAVIGATION.cta.href}>
            {NAVIGATION.cta.label}
          </Button>
        </div>

        {/* Burger mobile */}
        <button
          ref={menuBtnRef}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Drawer mobile */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="md:hidden fixed inset-0 top-16 z-40 bg-[var(--color-deep)]"
        >
          <nav className="flex flex-col p-6 gap-1" aria-label="Navigation mobile">
            {NAVIGATION.main.map((link) => (
              <a key={link.href} href={link.href} className="py-3 px-4 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-[var(--radius-md)] transition-colors" onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button variant="primary" size="md" href={NAVIGATION.cta.href} className="w-full" onClick={closeMenu}>
                {NAVIGATION.cta.label}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
