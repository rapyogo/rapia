"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ParallaxLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Multiplicateur de vitesse (0.15 = très lent, 0.60 = rapide, 1.0 = normal). */
  speed: number;
  /** Amplitude maximale du décalage en pixels. */
  offset?: number;
  /** Multiplicateur réduit sur mobile (< 768px). */
  mobileSpeed?: number;
}

/**
 * Calque qui se déplace à une vitesse différente du scroll, créant un effet
 * de parallaxe par rapport aux autres couches du conteneur sticky.
 *
 * Lit la CSS custom property `--parallax-progress` (0 → 1) injectée par le
 * ScrollTrigger parent, et applique un `translateY` proportionnel.
 *
 * Respecte `prefers-reduced-motion` : transform désactivé.
 */
export function ParallaxLayer({
  speed,
  offset = 100,
  mobileSpeed,
  className,
  children,
  ...rest
}: ParallaxLayerProps) {
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

  if (reducedMotion) {
    return <div className={cn("absolute inset-0", className)} {...rest}>{children}</div>;
  }

  const effectiveSpeed = isMobile && mobileSpeed !== undefined ? mobileSpeed : speed;
  const translateCalc = `calc(var(--parallax-progress, 0) * ${effectiveSpeed} * ${offset} * -1px)`;

  return (
    <div
      className={cn("absolute parallax-layer", className)}
      style={{
        transform: `translate3d(0, ${translateCalc}, 0)`,
        willChange: "transform",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default ParallaxLayer;
