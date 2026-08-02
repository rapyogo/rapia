"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NAVIGATION, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-[4px] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden fixed inset-0 top-16 z-40 bg-white animate-in slide-in-from-top-2 duration-200"
        >
          <nav className="flex flex-col p-6 gap-1" aria-label="Navigation mobile">
            {NAVIGATION.main.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="py-3 px-4 text-base font-medium text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-low)] rounded-[4px] transition-colors"
                onClick={() => setIsMenuOpen(false)}
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
                onClick={() => setIsMenuOpen(false)}
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
