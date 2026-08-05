"use client";

import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { cn } from "@/lib/utils";

interface ParallaxFondProps {
  /** Multiplicateur de vitesse. Défaut : 0.15 (très lent). */
  speed?: number;
  /** Teinte de l'aplat, pour rythmer les actes. */
  variant?: "indigo" | "emerald" | "amber";
  className?: string;
}

/**
 * Fond de profondeur, en aplat uni.
 *
 * Le cahier des charges interdit les gradients décoratifs et les orbes floutées :
 * la profondeur vient du décalage de vitesse au scroll, pas d'un effet lumineux.
 */
const tints: Record<"indigo" | "emerald" | "amber", string> = {
  indigo: "rgba(58, 46, 126, 0.06)",
  emerald: "rgba(16, 184, 129, 0.05)",
  amber: "rgba(245, 158, 11, 0.05)",
};

export function ParallaxFond({
  speed = 0.15,
  variant = "indigo",
  className,
}: ParallaxFondProps) {
  return (
    <ParallaxLayer
      speed={speed}
      offset={120}
      mobileSpeed={0.1}
      className={cn("parallax-fond z-0 pointer-events-none", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 parallax-fond-base" />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: tints[variant] }}
      />
    </ParallaxLayer>
  );
}

export default ParallaxFond;
