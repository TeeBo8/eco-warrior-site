"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * `prefers-reduced-motion`, lu seulement après le montage.
 * useReducedMotion vaut null au rendu serveur et true côté client pour les
 * personnes concernées : l'utiliser directement dans le rendu casse
 * l'hydratation. Ici, le premier rendu client est identique au serveur.
 */
export function useMouvementReduit(): boolean {
  const preference = useReducedMotion();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  return monte && preference === true;
}
