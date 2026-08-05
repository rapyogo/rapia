"use client";

import { useEffect, useState } from "react";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { cn } from "@/lib/utils";

interface ParallaxFormesProps {
  speed?: number;
  /** Côté où placer les formes géométriques. */
  side?: "left" | "right";
  className?: string;
}

/**
 * Couche de formes géométriques : grille et cercles en traits fins.
 *
 * Vocabulaire « systèmes et connexions » du cahier des charges — des lignes et
 * des nœuds, jamais de robot, de cerveau numérique ni de circuit imprimé.
 * Traits pleins uniquement : ni gradient, ni glow.
 * Mobile : grille seule, les cercles surchargent un petit écran.
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
      {/* Grille — SVG de lignes fines. Pas un gradient : le cahier des charges
          les interdit, et un trait SVG est de toute facon plus net au rendu. */}
      <div
        className="absolute inset-0 parallax-formes-grid"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cpath d='M80 0H0v80' fill='none' stroke='%233A2E7E' stroke-opacity='0.06' stroke-width='1'/%3E%3C/svg%3E")`,
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
              "absolute w-[320px] h-[320px] rounded-full border border-[var(--color-amber)]/10",
              side === "left"
                ? "-bottom-[120px] -left-[60px]"
                : "-bottom-[120px] -right-[60px]",
            )}
          />
          {/* Ligne de liaison — trait plein, pas de dégradé */}
          <div
            className={cn(
              "absolute h-px w-[120%] bg-[var(--color-indigo)]/10",
              side === "left" ? "-right-[10%] top-[30%]" : "-left-[10%] top-[60%]",
            )}
          />
        </>
      )}
    </ParallaxLayer>
  );
}

export default ParallaxFormes;
