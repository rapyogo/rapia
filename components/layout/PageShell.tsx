import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";

/**
 * Ossature commune aux pages de contenu — À propos, Services, Formation, FAQ.
 *
 * Ces pages partagent la même charpente : en-tête + lien de retour, un corps
 * en colonne de lecture, un appel à l'action en Deep Profond, puis le pied de
 * page. La recopier à chaque fois garantissait qu'une correction de rythme ou
 * de contraste n'en atteindrait que la moitié.
 *
 * **Le rythme vertical est ici, et nulle part ailleurs.** Empiler des
 * `.section` donne 192 px de blanc entre deux blocs — le rythme de la landing,
 * où chaque section occupe un écran. Sur une page qui se lit d'une traite, ce
 * vide casse la lecture. Le corps est donc **une** `.section` dont les enfants
 * directs sont espacés par `space-y`.
 */

export function PageHeader({
  eyebrow,
  heading,
  subtitle,
  backLabel,
  backHref,
}: {
  eyebrow: string;
  heading: string;
  subtitle: string;
  backLabel: string;
  backHref: string;
}) {
  return (
    <section className="section pb-0">
      <div className="container-site max-w-3xl">
        <a
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-indigo)] hover:underline"
        >
          <ArrowLeft size={16} />
          {backLabel}
        </a>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-indigo)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[clamp(30px,5vw,54px)] font-bold leading-[1.1] tracking-[-0.02em] text-[var(--color-text)]">
          {heading}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-secondary)]">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

/** Le corps : une seule `.section`, rythme interne par `space-y`. */
export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <section className="section">
      <div className="container-site max-w-3xl space-y-16 md:space-y-20">
        {children}
      </div>
    </section>
  );
}

/**
 * Illustration en pleine largeur de la colonne de lecture.
 *
 * **`alt` est vide, et c'est délibéré.** Ces photographies n'apportent aucune
 * information que le texte voisin ne donne déjà : le titre du service est juste
 * au-dessus. Leur décrire le contenu ferait entendre à un lecteur d'écran une
 * légende qui n'existe pour personne d'autre, et il faudrait la traduire, la
 * maintenir, la resynchroniser à chaque remplacement de visuel. Une image
 * décorative se déclare décorative. Si un jour une photo **porte** une
 * information — un schéma, une capture — elle prendra un vrai `alt` et cessera
 * de passer par ce composant.
 *
 * `sizes` est calé sur la colonne (`max-w-3xl`, 768 px) : sans lui, Next sert
 * une image de pleine fenêtre à des gens dont la bande passante est la
 * contrainte première (PRODUCT.md).
 */
export function PageFigure({
  src,
  priority = false,
  className = "",
}: {
  src: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={768}
      height={512}
      sizes="(max-width: 768px) 100vw, 768px"
      priority={priority}
      className={`w-full rounded-[var(--radius-lg)] border border-[var(--color-border)] object-cover ${className}`}
    />
  );
}

/** Vignette carrée — repère visuel dans une liste, jamais un contenu. */
export function PageThumb({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      width={160}
      height={160}
      sizes="80px"
      className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] border border-[var(--color-border)] object-cover md:h-20 md:w-20"
    />
  );
}

/** Titre de bloc — même échelle sur toutes les pages de contenu. */
export function BlockTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(24px,3vw,34px)] font-bold tracking-[-0.02em] text-[var(--color-text)]">
      {children}
    </h2>
  );
}

/**
 * Appel à l'action de fin de page.
 *
 * Seul emploi autorisé du Deep Profond en aplat de fond, conformément à
 * DESIGN.md — il signale la conversion, et perd ce pouvoir dès qu'on s'en sert
 * pour décorer.
 */
export function PageCta({
  title,
  body,
  button,
  href,
}: {
  title: string;
  body: string;
  button: string;
  href: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-[var(--color-deep)] p-8 text-white md:p-10">
      <h2 className="text-[clamp(20px,2.6vw,28px)] font-bold tracking-[-0.01em]">
        {title}
      </h2>
      <p className="mt-3 max-w-xl leading-relaxed text-white/70">{body}</p>
      <div className="mt-7">
        <Button variant="secondary" size="lg" href={href}>
          {button}
        </Button>
      </div>
    </div>
  );
}

/** Page complète : en-tête de site, contenu, pied de page, barre mobile. */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
}
