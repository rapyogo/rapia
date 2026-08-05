import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre vision",
  description:
    "Découvrez la vision de RAPIA : comment nous accompagnons les entreprises, ONG et institutions d'Afrique dans l'adoption concrète de l'intelligence artificielle.",
};

export default function NotreVisionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
