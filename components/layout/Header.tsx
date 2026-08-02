"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAVIGATION, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion Échap pour fermer le drawer
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    menuBtnRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, closeMenu]);

  // Focus trap dans le drawer mobile
  useEffect(() => {
    if (!isMenuOpen || !drawerRef.current) return;

    const drawer = drawerRef.current;
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus le premier élément à l'ouverture
    firstFocusable?.focus();

    const handleTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTrap);
    return () => document.removeEventListener("keydown", handleTrap);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[var(--color-border-light)] shadow-sm"
          : "bg-[var(--color-background)] border-b border-transparent"
      )}
    >
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-[var(--color-on-background)] hover:opacity-80 transition-opacity select-none"
          aria-label="RAPIA — Accueil"
        >
          <img
            src="/rapia-mark.svg"
            alt=""
            className="w-8 h-8 flex-shrink-0"
            aria-hidden="true"
          />
          <span
            className="text-[var(--color-deep-profond)]"
            style={{
              fontSize: "var(--font-headline-sm-size)",
              fontWeight: "var(--font-headline-sm-weight)",
              letterSpacing: "-0.01em",
            }}
          >
            RAPIA
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {NAVIGATION.main.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" size="sm" href={NAVIGATION.cta.href}>
            {NAVIGATION.cta.label}
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-[4px] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          ref={menuBtnRef}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className="md:hidden fixed inset-0 top-16 z-40 bg-white"
        >
          <nav className="flex flex-col p-6 gap-1" aria-label="Navigation mobile">
            {NAVIGATION.main.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 px-4 text-base font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] rounded-[4px] transition-colors"
                onClick={() => closeMenu()}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-[var(--color-border-light)]">
              <Button
                variant="primary"
                size="md"
                href={NAVIGATION.cta.href}
                className="w-full"
                onClick={() => closeMenu()}
              >
                {NAVIGATION.cta.label}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
