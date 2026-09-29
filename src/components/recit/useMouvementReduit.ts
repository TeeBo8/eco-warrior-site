"use client";

import { useReducedMotion } from "framer-motion";
import { useMonte } from "@/lib/use-monte";

/**
 * `prefers-reduced-motion`, lu seulement après l'hydratation.
 * useReducedMotion vaut null au rendu serveur et true côté client pour les
 * personnes concernées : l'utiliser directement dans le rendu casse
 * l'hydratation. Ici, le premier rendu client est identique au serveur.
 */
export function useMouvementReduit(): boolean {
  const preference = useReducedMotion();
  return useMonte() && preference === true;
}
