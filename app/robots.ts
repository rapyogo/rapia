import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Les crawlers d'IA sont nommés explicitement.
 *
 * `User-agent: *` les autorise déjà — techniquement, ces règles sont
 * redondantes. Elles sont là pour lever une ambiguïté : beaucoup de sites
 * bloquent GPTBot et consorts, et une règle explicite d'autorisation est le
 * seul signal non équivoque que le contenu est destiné à être cité.
 *
 * `ClaudeBot` et `Claude-Web` sont deux agents distincts d'Anthropic, comme
 * `OAI-SearchBot` (recherche) et `GPTBot` (entraînement) chez OpenAI : couvrir
 * l'un ne couvre pas l'autre.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
