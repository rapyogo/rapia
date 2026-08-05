export default function NotFound() {
  return (
    <html lang="fr">
      <body className="bg-[var(--color-bg)] text-[var(--color-text)] font-sans min-h-screen flex items-center justify-center">
        <main className="text-center max-w-md px-6">
          <p className="text-6xl font-bold text-[var(--color-indigo)]/20 mb-4">404</p>
          <h1 className="text-2xl font-semibold mb-3">Page introuvable</h1>
          <p className="text-[var(--color-text-secondary)] mb-8">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-[var(--radius-md)] bg-[var(--color-indigo)] text-white hover:bg-[var(--color-indigo-light)] transition-colors"
          >
            Retour à l&apos;accueil
          </a>
        </main>
      </body>
    </html>
  );
}
