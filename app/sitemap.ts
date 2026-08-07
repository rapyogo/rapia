import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_PATHS, siteUrl } from "@/lib/site";

/**
 * Le sitemap listait 6 URLs sous `rapia.cd`, un domaine qui ne résout pas :
 * inexploitable pour Google comme pour les crawlers IA. Les URLs viennent
 * désormais de `lib/site.ts`, et les chemins de `SITE_PATHS` — ajouter une
 * page au site l'ajoute au sitemap, sans y penser.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: siteUrl(locale, path),
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((alt) => [alt, siteUrl(alt, path)]),
        ),
      },
    })),
  );
}
