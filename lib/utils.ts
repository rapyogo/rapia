import { type ClassValue, clsx } from "clsx";

/**
 * Fusionne des classes CSS conditionnelles avec clsx.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Tronque un texte à une longueur maximale et ajoute des points de suspension.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Formate un numéro de téléphone pour l'affichage.
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, "$1 $2 $3 $4");
}
