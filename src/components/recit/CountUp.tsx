"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useMouvementReduit } from "./useMouvementReduit";

interface CountUpProps {
  valeur: number;
  prefixe?: string;
  suffixe?: string;
}

/** Compteur qui défile jusqu'à `valeur` quand il entre à l'écran. */
export function CountUp({ valeur, prefixe = "", suffixe = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true });
  const reduit = useMouvementReduit();
  const decimales = Number.isInteger(valeur) ? 0 : 1;
  const [courant, setCourant] = useState(0);

  useEffect(() => {
    if (!visible || reduit) return;
    const controles = animate(0, valeur, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: setCourant,
    });
    return () => controles.stop();
  }, [visible, reduit, valeur]);

  const formater = (n: number) =>
    n.toLocaleString("fr-FR", {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    });

  // Le lecteur d'écran lit la valeur finale, pas le défilement.
  return (
    <span ref={ref} className="tabular-nums">
      <span className="sr-only">{`${prefixe}${formater(valeur)}${suffixe}`}</span>
      <span aria-hidden="true">
        {prefixe}
        {formater(reduit ? valeur : courant)}
        {suffixe}
      </span>
    </span>
  );
}
