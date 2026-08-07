import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { COMPANY } from "@/lib/company";

/**
 * Image de partage — Open Graph et Twitter.
 *
 * L'audit relevait un `og:image` à 500×630… en fait 500×500 : le logo carré,
 * servi depuis un domaine mort. Deux défauts en un — l'image ne se chargeait
 * pas, et même chargée elle aurait été recadrée par tous les réseaux, qui
 * attendent du 1200×630.
 *
 * Générée ici plutôt que dessinée dans un fichier : elle suit la locale, et
 * elle ne peut pas se désynchroniser du positionnement affiché sur le site.
 *
 * Contraintes du moteur de rendu (Satori) à connaître avant d'y toucher :
 * il ne comprend qu'un sous-ensemble de CSS — flexbox oui, grid non, et tout
 * élément à plusieurs enfants doit déclarer son `display: flex`.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RAPIA — Agence d'intelligence artificielle, RDC";

const DEEP = "#001B2A";
const AMBER = "#F59E0B";

/**
 * Le logo est lu sur le disque et encodé en data URI : Satori ne suit pas les
 * URL relatives, et une URL absolue ferait dépendre la génération de l'image
 * de la disponibilité du site — qui est précisément ce qu'on est en train de
 * réparer. En cas d'échec, la carte reste lisible sans logo.
 *
 * C'est **l'icône seule** qui est chargée, pas le logo horizontal : ce dernier
 * est livré dans un PNG carré de 500×500 où la marque n'occupe qu'une bande
 * centrale. Posé à la hauteur voulue, il rendait un logotype minuscule entouré
 * de vide. L'icône est cadrée serré ; le mot « RAPIA » est composé à côté, en
 * texte, ce qui donne la main sur la taille et l'alignement.
 */
async function iconDataUri(): Promise<string | null> {
  try {
    const file = await readFile(
      join(process.cwd(), "public", "icone-rapia_dark-mode.png"),
    );
    return `data:image/png;base64,${file.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const icon = await iconDataUri();

  const cities = COMPANY.offices.map((office) => office.city).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: DEEP,
          padding: "72px 80px",
          color: "#FFFFFF",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {/* `next/image` n'a pas cours ici : Satori rend hors du navigateur et
              ne connaît que `<img>`. La règle ne s'applique pas. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {icon && <img src={icon} width={44} height={60} alt="" />}
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: "0.01em" }}>
            RAPIA
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              maxWidth: 900,
            }}
          >
            {t("positioning")}
          </div>
          <div style={{ display: "flex", marginTop: 36 }}>
            <div style={{ width: 96, height: 5, backgroundColor: AMBER }} />
          </div>
          <div
            style={{
              fontSize: 30,
              marginTop: 32,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 900,
            }}
          >
            {t("tagline")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <div>{cities}</div>
          <div>{COMPANY.website}</div>
        </div>
      </div>
    ),
    size,
  );
}
