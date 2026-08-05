"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface ScrollSequenceProps {
  /** Nombre total de frames de la séquence. */
  frameCount: number;
  /** Construit l'URL d'une frame à partir de son index (1-based). */
  frameSrc: (index: number) => string;
  /** Longueur de scroll de la séquence, en multiples de la hauteur d'écran. */
  scrollLength?: number;
  /** Idem sur mobile (< 768px) — plus court pour éviter un scroll interminable. */
  scrollLengthMobile?: number;
  /** Frame affichée quand l'animation est désactivée (reduced motion). */
  staticFrame?: number;
  /** Progression du scrub (0 → 1), à chaque frame rendue. */
  onProgress?: (progress: number) => void;
  /** Contenu superposé au canvas, dans le conteneur sticky. */
  children?: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Séquence d'images pilotée au scroll, rendue sur un canvas.
 *
 * Le conteneur interne est `sticky` plutôt que pinné par GSAP : le layout reste
 * géré par le navigateur, GSAP ne s'occupe que du scrub de l'index de frame.
 */
export function ScrollSequence({
  frameCount,
  frameSrc,
  scrollLength = 4,
  scrollLengthMobile = 2.5,
  staticFrame = 1,
  onProgress,
  children,
  className,
  "aria-label": ariaLabel,
}: ScrollSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(-1);

  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      setReducedMotion(motionMq.matches);
      setIsMobile(mobileMq.matches);
    };
    sync();
    motionMq.addEventListener("change", sync);
    mobileMq.addEventListener("change", sync);
    return () => {
      motionMq.removeEventListener("change", sync);
      mobileMq.removeEventListener("change", sync);
    };
  }, []);

  /** Dessine une frame en mode « cover », recadrée au centre. */
  const draw = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index - 1];
    if (!canvas || !img?.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;

    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    currentFrame.current = index;
  }, []);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Plafonné à 2 : au-delà, le coût de rendu dépasse le gain visuel.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    if (currentFrame.current > 0) draw(currentFrame.current);
  }, [draw]);

  // Préchargement : la première frame débloque l'affichage, le reste suit.
  useEffect(() => {
    let cancelled = false;

    const load = (index: number) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(index);
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
        imagesRef.current[index - 1] = img;
      });

    (async () => {
      await load(staticFrame);
      if (cancelled) return;
      resize();
      draw(staticFrame);
      setReady(true);

      for (let i = 1; i <= frameCount; i++) {
        if (cancelled) return;
        if (i !== staticFrame) await load(i);
      }
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
    };
  }, [frameCount, frameSrc, staticFrame, draw, resize]);

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useGSAP(
    () => {
      if (!sectionRef.current || !ready || reducedMotion) return;

      const state = { frame: 1 };

      gsap.to(state, {
        frame: frameCount,
        ease: "none",
        snap: "frame",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => onProgress?.(self.progress),
        },
        onUpdate: () => {
          const next = Math.round(state.frame);
          if (next !== currentFrame.current) draw(next);
        },
      });
    },
    { scope: sectionRef, dependencies: [ready, reducedMotion, frameCount] },
  );

  const length = isMobile ? scrollLengthMobile : scrollLength;

  return (
    <section
      ref={sectionRef}
      aria-label={ariaLabel}
      className={className}
      style={{ height: reducedMotion ? "100vh" : `${length * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
        {children}
      </div>
    </section>
  );
}

export default ScrollSequence;
