"use client";

import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { cn } from "@/lib/utils";

interface ParallaxFondProps {
  /** Multiplicateur de vitesse. Défaut : 0.15 (très lent). */
  speed?: number;
  /** Variante visuelle pour alterner entre les actes. */
  variant?: "indigo" | "emerald" | "amber";
  className?: string;
}

const orbs: Record<"indigo" | "emerald" | "amber", string> = {
  indigo:
    "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(94,83,164,0.12) 0%, transparent 60%), " +
    "radial-gradient(ellipse 60% 60% at 80% 30%, rgba(16,184,129,0.04) 0%, transparent 50%), " +
    "radial-gradient(ellipse 70% 40% at 50% 80%, rgba(184,117,0,0.03) 0%, transparent 50%)",
  emerald:
    "radial-gradient(ellipse 80% 50% at 60% 30%, rgba(16,184,129,0.10) 0%, transparent 60%), " +
    "radial-gradient(ellipse 60% 60% at 20% 60%, rgba(94,83,164,0.06) 0%, transparent 50%), " +
    "radial-gradient(ellipse 70% 40% at 80% 40%, rgba(184,117,0,0.04) 0%, transparent 50%)",
  amber:
    "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(184,117,0,0.08) 0%, transparent 60%), " +
    "radial-gradient(ellipse 60% 60% at 20% 70%, rgba(94,83,164,0.07) 0%, transparent 50%), " +
    "radial-gradient(ellipse 70% 40% at 80% 60%, rgba(16,184,129,0.04) 0%, transparent 50%)",
};

/**
 * Fond cosmique CSS — orbes de couleur floutées en arrière-plan.
 *
 * Quatre variantes chromatiques (indigo par défaut) pour rythmer les actes.
 * Mobile : orbes atténués (opacité divisée par 2).
 */
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
      className={cn(
        "parallax-fond z-0 pointer-events-none",
        "max-md:parallax-fond-mobile",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 parallax-fond-orbes"
        style={{
          backgroundImage: orbs[variant],
        }}
      />
      {/* Micro-texture : pointillé subtil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </ParallaxLayer>
  );
}

export default ParallaxFond;
