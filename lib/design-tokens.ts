/**
 * Design tokens RAPIA — extraits de DESIGN.md
 * Système "Kinshasa Modern"
 *
 * Toutes les valeurs sont synchronisées avec DESIGN.md.
 * Ne modifiez pas ce fichier sans mettre à jour DESIGN.md.
 */

export const colors = {
  // Surface
  surface: "#F8F9FB",
  "surface-dim": "#D8DADC",
  "surface-bright": "#F8F9FB",
  "surface-container-lowest": "#FFFFFF",
  "surface-container-low": "#F2F4F6",
  "surface-container": "#ECEFF0",
  "surface-container-high": "#E6E8EA",
  "surface-container-highest": "#E0E3E5",
  "on-surface": "#191C1E",
  "on-surface-variant": "#42474C",

  // Background
  background: "#F8F9FB",
  "on-background": "#191C1E",

  // Inverse
  "inverse-surface": "#2D3133",
  "inverse-on-surface": "#EFF1F3",

  // Outline
  outline: "#73787C",
  "outline-variant": "#C3C7CC",
  "surface-tint": "#496173",

  // Primary (Deep Profond + Noir)
  primary: "#000000",
  "on-primary": "#FFFFFF",
  "primary-container": "#021E2D",
  "on-primary-container": "#6E8799",
  "inverse-primary": "#B0CADE",
  "primary-fixed": "#CCE6FB",
  "primary-fixed-dim": "#B0CADE",
  "on-primary-fixed": "#021E2D",
  "on-primary-fixed-variant": "#314A5A",

  // Secondary (Indigo)
  secondary: "#5E53A4",
  "on-secondary": "#FFFFFF",
  "secondary-container": "#B1A6FE",
  "on-secondary-container": "#433787",
  "secondary-fixed": "#E5DEFF",
  "secondary-fixed-dim": "#C8BFFF",
  "on-secondary-fixed": "#19055E",
  "on-secondary-fixed-variant": "#463B8B",

  // Tertiary (Amber/Gold)
  tertiary: "#000000",
  "on-tertiary": "#FFFFFF",
  "tertiary-container": "#2A1700",
  "on-tertiary-container": "#B87500",
  "tertiary-fixed": "#FFDDB8",
  "tertiary-fixed-dim": "#FFB95F",
  "on-tertiary-fixed": "#2A1700",
  "on-tertiary-fixed-variant": "#653E00",

  // Error
  error: "#BA1A1A",
  "on-error": "#FFFFFF",
  "error-container": "#FFDAD6",
  "on-error-container": "#93000A",

  // Semantic tokens (pour usage direct dans le code)
  "deep-profond": "#021E2D",
  indigo: "#5E53A4",
  amber: "#B87500",
  "border-light": "#E2E8F0",
  white: "#FFFFFF",
  "off-white": "#F4F6F8",
} as const;

export const typography = {
  "display-lg": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "56px",
    fontWeight: "700",
    lineHeight: "64px",
    letterSpacing: "-0.02em",
  },
  "display-lg-mobile": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "40px",
    fontWeight: "700",
    lineHeight: "48px",
    letterSpacing: "-0.01em",
  },
  "headline-md": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "32px",
    fontWeight: "600",
    lineHeight: "40px",
  },
  "headline-sm": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "32px",
  },
  "body-lg": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "18px",
    fontWeight: "400",
    lineHeight: "28px",
  },
  "body-md": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "24px",
  },
  "label-md": {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "20px",
    letterSpacing: "0.05em",
  },
  caption: {
    fontFamily: "Space Grotesk, sans-serif",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "16px",
  },
} as const;

export const radius = {
  sm: "0.125rem", // 2px
  DEFAULT: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  full: "9999px",
} as const;

export const spacing = {
  base: "8px",
  "container-max": "1280px",
  gutter: "24px",
  "margin-desktop": "64px",
  "margin-mobile": "20px",
  // Échelle 8px
  1: "8px",
  2: "16px",
  3: "24px",
  4: "32px",
  5: "40px",
  6: "48px",
  7: "56px",
  8: "64px",
  9: "72px",
  10: "80px",
  12: "96px",
} as const;

/** Palette de l'identité RAPIA — alias pratiques */
export const brand = {
  deep: "#021E2D", // Deep Profond — autorité, stabilité
  indigo: "#5E53A4", // Indigo — interactions, CTAs
  amber: "#B87500", // Amber/Gold — conversion, accent
  emerald: "#10B881", // Emerald — succès, croissance
  white: "#FFFFFF",
  "off-white": "#F8F9FB",
  "light-gray": "#F4F6F8",
  border: "#E2E8F0",
} as const;
