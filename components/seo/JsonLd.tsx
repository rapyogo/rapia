/**
 * Injecte un graphe JSON-LD dans la page.
 *
 * `JSON.stringify` suffit à échapper les guillemets et les accents, mais pas
 * la séquence `</script>` : une chaîne de contenu qui la contiendrait
 * fermerait la balise et laisserait le reste s'exécuter comme du HTML. Les
 * textes viennent de `messages/*.json`, donc d'un fichier qu'on écrit soi-même
 * — mais c'est précisément le genre d'hypothèse qui cesse d'être vraie le jour
 * où un texte vient d'un CMS.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
