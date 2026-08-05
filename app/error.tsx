"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-sans min-h-screen flex items-center justify-center">
        <main className="text-center max-w-md px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)] mb-6">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-2xl font-semibold mb-3">Une erreur est survenue</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] transition-colors cursor-pointer"
            >
              Réessayer
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-md)] border border-[var(--color-border)] hover:bg-[var(--color-bg-alt)] transition-colors"
            >
              Retour à l&apos;accueil
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}

function AlertCircle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
