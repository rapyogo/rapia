"use client";

import { useEffect, useState } from "react";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { cn } from "@/lib/utils";

interface ParallaxFormesProps {
  speed?: number;
  /** Côté où placer les cercles géométriques. */
  side?: "left" | "right";
  className?: string;
}

/**
 * Couche de formes géométriques en premier plan visuel.
 *
 * Grille tech + cercles/bagues flottants, tout en CSS pur.
 * Mobile : grille uniquement, pas de cercles (trop chargé).
 */
export function ParallaxFormes({
  speed = 0.6,
  side = "left",
  className,
}: ParallaxFormesProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <ParallaxLayer
      speed={speed}
      offset={140}
      mobileSpeed={0.15}
      className={cn("parallax-formes z-20 pointer-events-none", className)}
      aria-hidden="true"
    >
      {/* Grille tech — lignes fines */}
      <div
        className="absolute inset-0 parallax-formes-grid"
        style={{
          backgroundImage:
            "linear-gradient(rgba(94,83,164,0.06) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(94,83,164,0.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {!isMobile && (
        <>
          {/* Cercle principal */}
          <div
            className={cn(
              "absolute w-[500px] h-[500px] rounded-full border border-[var(--color-indigo)]/10",
              side === "left"
                ? "-top-[150px] -right-[80px]"
                : "-top-[150px] -left-[80px]",
            )}
          />
          {/* Bague secondaire — plus petite, décalée */}
          <div
            className={cn(
              "absolute w-[320px] h-[320px] rounded-full border border-[var(--color-amber)]/8",
              side === "left"
                ? "-bottom-[120px] -left-[60px]"
                : "-bottom-[120px] -right-[60px]",
            )}
          />
          {/* Ligne horizontale décorative */}
          <div
            className={cn(
              "absolute h-px w-[120%]",
              side === "left" ? "-right-[10%] top-[30%]" : "-left-[10%] top-[60%]",
            )}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(94,83,164,0.15) 40%, rgba(94,83,164,0.05) 80%, transparent)",
            }}
          />
        </>
      )}
    </ParallaxLayer>
  );
}

export default ParallaxFormes;
