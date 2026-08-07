"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const locale = useLocale();
  const prefix = `/${locale}`;
  // « À propos » pointait vers l'ancre `#why-rapia` de l'accueil : un argument
  // de vente, pas une page d'identité. Elle mène désormais à la vraie page —
  // c'est celle qu'un visiteur cherche quand il veut savoir à qui il parle, et
  // celle qu'un moteur cherche pour rattacher l'entité à une personne.
  //
  // La FAQ n'est pas ici : une barre à six entrées ne hiérarchise plus rien, et
  // la FAQ se consulte quand on a déjà une question, pas en entrant sur le site.
  const navLinks = [
    { label: t("home"), href: prefix },
    { label: t("services"), href: `${prefix}/services` },
    { label: t("training"), href: `${prefix}/formation` },
    { label: t("about"), href: `${prefix}/a-propos` },
    { label: t("contact"), href: `${prefix}/contact` },
  ];

  /**
   * Ce que le tiroir mobile contient — et surtout ce qu'il ne contient pas.
   *
   * Il reprenait `navLinks` à l'identique, c'est-à-dire exactement les quatre
   * onglets déjà affichés en permanence par la barre du bas. Ouvrir le menu ne
   * montrait donc rien de nouveau. Il porte désormais les liens **secondaires**
   * : ceux qui n'ont pas leur place dans une barre à quatre onglets mais qu'on
   * doit pouvoir atteindre.
   */
  const secondaryLinks = [
    { label: t("about"), href: `${prefix}/a-propos` },
    { label: t("faq"), href: `${prefix}/faq` },
    { label: tFooter("visionLink"), href: `${prefix}/notre-vision` },
  ];

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
        "sticky top-0 z-50 bg-[var(--color-deep)] transition-colors duration-300",
        isScrolled
          ? "border-b border-white/10"
          : "border-b border-transparent"
      )}
    >
      <div className="container-site flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href={prefix} className="flex items-center gap-2.5 font-bold select-none group" aria-label="RAPIA">
          <img src="/icone-rapia_dark-mode.webp" alt="" className="w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-105" aria-hidden="true" />
          <span className="text-white text-xl tracking-[-0.01em] font-bold">RAPIA</span>
        </a>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigation principale">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-white/55 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Button variant="primary" size="sm" href={`${prefix}/contact`}>
            {t("cta")}
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
          // `inset-x-0 bottom-0` plutôt que `inset-0` : avec `top-16`, un
          // `inset-0` laisse `right: 0` *et* `left: 0` se battre avec la barre
          // de défilement et fait déborder le tiroir de quelques pixels.
          // `pb-20` réserve la hauteur de la barre d'onglets, qui reste au
          // premier plan pour que la navigation principale reste atteignable.
          className="scroll-hidden md:hidden fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-[var(--color-deep)] pb-20"
        >
          <nav
            className="flex flex-col p-6 gap-1"
            aria-label={t("secondaryMenu")}
          >
            {secondaryLinks.map((link) => (
              <a key={link.href} href={link.href} className="py-3 px-4 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-[var(--radius-md)] transition-colors" onClick={closeMenu}>
                {link.label}
              </a>
            ))}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="mb-4 flex justify-center">
                <LanguageSwitcher />
              </div>
              <Button variant="primary" size="md" href={`${prefix}/contact`} className="w-full" onClick={closeMenu}>
                {t("cta")}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
