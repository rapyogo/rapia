---
name: Kinshasa Modern
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#42474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#73787c'
  outline-variant: '#c3c7cc'
  surface-tint: '#496173'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#021e2d'
  on-primary-container: '#6e8799'
  inverse-primary: '#b0cade'
  secondary: '#5e53a4'
  on-secondary: '#ffffff'
  secondary-container: '#b1a6fe'
  on-secondary-container: '#433787'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce6fb'
  primary-fixed-dim: '#b0cade'
  on-primary-fixed: '#021e2d'
  on-primary-fixed-variant: '#314a5a'
  secondary-fixed: '#e5deff'
  secondary-fixed-dim: '#c8bfff'
  on-secondary-fixed: '#19055e'
  on-secondary-fixed-variant: '#463b8b'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is rooted in the intersection of cutting-edge technology and professional excellence in the Democratic Republic of Congo. It moves away from cold, sci-fi tropes of AI, instead embracing a **Modern Corporate** aesthetic that is warm, human-centric, and results-oriented.

The visual narrative focuses on "Intelligence Opérationnelle"—AI that works in the real world. This is achieved through a precise, grid-based layout, expansive whitespace to signify clarity of thought, and high-quality photography of professional African environments. Subtle graphic patterns inspired by connectivity and organic flows provide a rhythmic texture that suggests transformation and growth without cluttering the interface.

## Colors

The palette is anchored by **Deep Profond** (#001B2A), conveying authority and stability. The **Indigo** (#3A2E7E) serves as the primary driver for interactive elements, bridging the gap between deep tech and professional service. 

**Amber/Gold** (#F59E0B) is used sparingly for high-impact calls to action and to highlight key insights, symbolizing the "spark" of intelligence. **Emerald Green** (#10B881) is reserved for success states, growth metrics, and sustainability indicators. Neutrals should remain clean and cool-toned to ensure the primary colors feel premium and focused.

## Typography

**Space Grotesk** is the sole typeface, utilized for its unique ability to appear both technical (monospaced-like rhythm) and friendly (open apertures). 

- **Headlines:** Use Bold and SemiBold weights with tighter letter-spacing to create a sense of impact and precision.
- **Body:** Use Regular weight with generous line-heights to maintain readability in data-heavy or educational contexts.
- **Data & Labels:** Labels should often use Medium or SemiBold weights with slight tracking (letter-spacing) to emphasize their role as navigational or structural markers.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid Grid**. On desktop, content is contained within a 1280px max-width 12-column grid. The spacing system is based on an 8px linear scale (8, 16, 24, 32, 48, 64, 80, 96).

- **Margins:** Large exterior margins (64px+) on desktop are essential to evoke the "premium" feel.
- **Gutters:** 24px gutters provide enough air for complex data sets and card layouts.
- **Vertical Rhythm:** Use larger vertical spacing (80px+) between major sections to allow the eye to rest and digest information.

## Elevation & Depth

This design system avoids heavy shadows. Depth is communicated through **Tonal Layering** and **Low-Contrast Outlines**.

1.  **Level 0 (Base):** Pure white (#FFFFFF) or very light grey (#F4F6F8).
2.  **Level 1 (Cards):** White background with a 1px border in #E2E8F0. No shadow or an extremely subtle 4% opacity neutral shadow.
3.  **Level 2 (Interactive/Floating):** Use a soft "Atmospheric Blur" for overlays, where the background is slightly visible but blurred, keeping the focus on the foreground without using harsh dark gradients.
4.  **Feature Callouts:** Use Deep Profond (#001B2A) as a high-contrast container for critical information or conversion sections.

## Shapes

The shape language is **Professional-Soft**. We use a 0.25rem (4px) base radius for small elements like inputs and tags, scaling up to 0.5rem (8px) for larger cards. This creates a crisp, architectural feel that suggests precision while remaining modern and accessible. Avoid fully pill-shaped buttons unless used for secondary "ghost" buttons.

## Components

### Buttons
- **Primary:** Solid Indigo (#3A2E7E) with white text. High-contrast, sharp corners (4px radius).
- **Secondary:** Amber/Gold (#F59E0B) with Deep Profond text. Used exclusively for conversion "moments."
- **Ghost:** Transparent background with Indigo border and text.

### Input Fields
- White background with a 1px border (#E2E8F0). On focus, the border shifts to Indigo with a 2px outer "glow" in 10% Indigo.

### Cards
- Clean white surfaces with 1px borders. Header areas within cards should use a light neutral background (#F8FAFC) to separate metadata from content.

### Chips & Tags
- Used for categories (e.g., "Automation", "Strategy"). Use light tints of the primary colors (e.g., 10% Emerald Green) with dark text to maintain legibility and a modern, airy feel.

### Data Visualization
- Graphs should utilize the Amber and Emerald accents against the Deep Blue background for maximum professional impact and clarity.