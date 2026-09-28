export type Ambiance = "jour" | "soir" | "crepuscule" | "nuit" | "aube";

/** Ce que le visiteur a choisi à l'ouverture : « ce que tu aimes ». */
export type Choix = "coin" | "sante" | "enfants" | "portemonnaie";

export interface Source {
  label: string;
  href: string;
}

export interface ChapitreContenu {
  id: "vivant" | "justice-sociale" | "paix" | "climat";
  numero: string;
  theme: string;
  titre: string;
  ambiance: Ambiance;
  accroche: string;
  fait: {
    /** Valeur animée (compteur). Sinon, `affichage` est montré tel quel. */
    valeur?: number;
    affichage?: string;
    prefixe?: string;
    suffixe?: string;
    texte: string;
    source: Source;
  };
  complement?: {
    texte: string;
    source?: Source;
  };
  objection: {
    question: string;
    reponse: string;
    lien?: { href: string; label: string };
  };
  bascule: string;
  /** Une phrase par choix de l'ouverture. */
  rappels: Record<Choix, string>;
  hub?: { href: string; label: string };
}

export interface Exemple {
  theme: string;
  titre: string;
  lieu: string;
  texte: string;
  source: Source;
}
