export type Theme = "climat" | "vivant" | "paix" | "justice-sociale";

export const THEMES: Record<Theme, { nom: string; titre: string }> = {
  vivant: { nom: "Vivant", titre: "Ce qui chante encore" },
  "justice-sociale": { nom: "Justice sociale", titre: "Qui paie l'addition" },
  paix: { nom: "Paix", titre: "L'énergie de la guerre" },
  climat: { nom: "Climat", titre: "Ce qu'on vit déjà" },
};

export interface SourceMythe {
  nom: string;
  url?: string;
}

export interface Mythe {
  slug: string;
  /** Slug de l'ancienne page /debunk/[slug], pour la redirection. */
  ancienSlug?: string;
  theme: Theme;
  niveau: "debutant" | "intermediaire" | "avance";
  mythe: string;
  realite: string;
  resume?: string;
  faits: string[];
  sources: SourceMythe[];
  /** Traduction existante, pour la future version anglaise. */
  en: { mythe: string; realite: string };
}
