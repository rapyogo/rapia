"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll fluide global (Lenis), synchronisé avec GSAP ScrollTrigger.
 *
 * Points d'implémentation à connaître avant d'y toucher :
 *
 * - **Lenis et ScrollTrigger partagent la même horloge.** Lenis est avancé
 *   depuis le ticker GSAP plutôt que depuis son propre `requestAnimationFrame` :
 *   deux boucles concurrentes produiraient un décalage d'une frame entre la
 *   position de scroll et les séquences canvas, visible comme un tremblement.
 * - `lagSmoothing(0)` : sans lui, GSAP « rattrape » les frames perdues et fait
 *   sauter les séquences après un freeze.
 * - **`scroll-behavior: smooth` doit rester absent du CSS** — il entre en
 *   conflit avec Lenis sur les ancres. La navigation par ancre est gérée ici.
 * - `prefers-reduced-motion` : Lenis n'est pas monté du tout, le navigateur
 *   garde son scroll natif.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Le tactile garde son inertie native : la surcharger donne une
      // sensation de flottement sur mobile.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Navigation par ancre — Lenis remplace le saut natif.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest?.(
        'a[href*="#"]',
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.pathname !== window.location.pathname) return;
      if (!url.hash || url.hash === "#") return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      // Décalage de la hauteur du header sticky, sinon la cible passe dessous.
      lenis.scrollTo(target as HTMLElement, { offset: -80 });
      history.pushState(null, "", url.hash);
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
