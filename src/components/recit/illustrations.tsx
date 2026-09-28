"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { ReactNode } from "react";
import { useMouvementReduit } from "./useMouvementReduit";

// Illustrations du récit, codées en SVG. Couleurs : currentColor (texte de
// l'ambiance) et var(--r-accent), pour suivre la lumière de l'histoire.
// `progression` = avancement du scroll dans la section (0 → 1).

const TRAIT = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ACCENT = "var(--r-accent)";

/* ------------------------------------------------------------------ */
/* Herbier : fougère + abeille                                         */
/* ------------------------------------------------------------------ */

const FOUGERE = [
  "M250 440 C 245 360, 230 260, 270 90",
  "M262 150 C 230 140, 205 150, 190 170 M262 150 C 290 135, 320 140, 338 158",
  "M256 200 C 215 188, 180 198, 158 226 M256 200 C 295 185, 338 192, 362 218",
  "M251 255 C 205 245, 165 258, 140 290 M251 255 C 300 240, 350 250, 378 282",
  "M248 310 C 205 305, 172 320, 152 350 M248 310 C 292 300, 335 312, 360 342",
  "M246 365 C 215 362, 192 374, 178 396 M246 365 C 278 358, 308 368, 324 390",
  "M190 170 l6 -8 M205 160 l4 -9 M220 154 l3 -9 M338 158 l-5 -9 M322 147 l-3 -9 M305 142 l-2 -9",
  "M158 226 l5 -10 M175 212 l4 -10 M195 202 l3 -10 M362 218 l-5 -10 M345 204 l-3 -10 M325 195 l-2 -10",
  "M140 290 l5 -11 M160 272 l4 -11 M185 260 l3 -11 M378 282 l-5 -11 M355 262 l-3 -11 M330 252 l-2 -11",
];

function Fougere({ dessiner }: { dessiner: boolean }) {
  return (
    <g {...TRAIT}>
      {FOUGERE.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          initial={dessiner ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.18, ease: "easeInOut" }}
        />
      ))}
    </g>
  );
}

function Abeille({ x, y, echelle = 1 }: { x: number; y: number; echelle?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${echelle})`} {...TRAIT}>
      <ellipse cx="0" cy="0" rx="22" ry="14" fill="var(--miel)" />
      <path d="M-14 -6 L-14 6 M-4 -12 L-4 12 M6 -12 L6 12" />
      <circle cx="24" cy="-2" r="7" />
      <path d="M-8 -14 C -20 -40, -40 -36, -36 -20 C -32 -10, -16 -10, -8 -14 Z" fill="var(--r-card)" />
      <path d="M4 -14 C 10 -42, 32 -40, 30 -24 C 28 -12, 12 -10, 4 -14 Z" fill="var(--r-card)" />
    </g>
  );
}

function Papillon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...TRAIT}>
      <path d="M0 -10 L0 12" />
      <path d="M0 -4 C -18 -26, -34 -10, -22 2 C -14 8, -4 4, 0 -4 Z" fill={ACCENT} fillOpacity="0.35" />
      <path d="M0 -4 C 18 -26, 34 -10, 22 2 C 14 8, 4 4, 0 -4 Z" fill={ACCENT} fillOpacity="0.35" />
      <path d="M0 4 C -12 10, -16 22, -6 20 C -2 18, 0 12, 0 4 Z" />
      <path d="M0 4 C 12 10, 16 22, 6 20 C 2 18, 0 12, 0 4 Z" />
      <path d="M0 -10 C -3 -18, -6 -20, -9 -22 M0 -10 C 3 -18, 6 -20, 9 -22" />
    </g>
  );
}

function Coccinelle({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} {...TRAIT}>
      <circle cx="0" cy="0" r="11" fill={ACCENT} />
      <path d="M0 -11 L0 11" />
      <circle cx="-5" cy="-3" r="2" fill="currentColor" />
      <circle cx="5" cy="4" r="2" fill="currentColor" />
      <circle cx="0" cy="-14" r="5" fill="currentColor" />
    </g>
  );
}

/** Ouverture : la planche se dessine au chargement. */
export function PlancheOuverture() {
  const reduit = useMouvementReduit();
  return (
    <svg viewBox="0 0 560 500" className="w-full h-auto" role="img" aria-label="Planche d'herbier : une fougère et une abeille dessinées au trait">
      <rect x="60" y="30" width="440" height="440" {...TRAIT} strokeWidth="1" />
      <rect x="72" y="42" width="416" height="416" {...TRAIT} strokeWidth="0.6" />
      <Fougere key={`fougere-${reduit}`} dessiner={!reduit} />
      <motion.g
        key={`abeille-${reduit}`}
        initial={reduit ? false : { opacity: 0, x: 60, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.6, delay: 1.6, ease: "easeOut" }}
      >
        <Abeille x={400} y={120} />
        <path d="M378 120 C 350 130, 330 150, 322 176" {...TRAIT} strokeDasharray="3 6" />
      </motion.g>
      <text x="280" y="494" textAnchor="middle" fontStyle="italic" fontSize="16" fill="currentColor" className="font-display">
        Pteridium aquilinum &amp; Apis mellifera — tant qu&apos;il en reste
      </text>
    </svg>
  );
}

/** Un insecte qui s'efface entre `debut` et `fin` de la progression. */
function Disparition({
  progression,
  debut,
  fin,
  children,
}: {
  progression: MotionValue<number>;
  debut: number;
  fin: number;
  children: ReactNode;
}) {
  const opacite = useTransform(progression, [debut, fin], [1, 0]);
  return <motion.g style={{ opacity: opacite }}>{children}</motion.g>;
}

/** Vivant : la planche se vide de ses insectes au fil du scroll. */
export function PlancheVivant({ progression }: { progression: MotionValue<number> }) {
  const reduit = useMouvementReduit();
  // Mouvement réduit : on montre directement la planche vidée à moitié.
  const insectes = [
    { cle: "abeille-1", debut: 0.36, fin: 0.44, el: <Abeille x={400} y={120} /> },
    { cle: "papillon-1", debut: 0.42, fin: 0.5, el: <Papillon x={130} y={130} /> },
    { cle: "coccinelle-1", debut: 0.48, fin: 0.56, el: <Coccinelle x={372} y={276} /> },
    { cle: "abeille-2", debut: 0.54, fin: 0.62, el: <Abeille x={150} y={400} echelle={0.7} /> },
    { cle: "papillon-2", debut: 0.6, fin: 0.68, el: <Papillon x={420} y={380} /> },
    { cle: "coccinelle-2", debut: 0.66, fin: 0.74, el: <Coccinelle x={170} y={236} /> },
  ];
  return (
    <svg viewBox="0 0 560 500" className="w-full h-auto" role="img" aria-label="Planche d'herbier dont les insectes disparaissent un à un">
      <rect x="60" y="30" width="440" height="440" {...TRAIT} strokeWidth="1" />
      <rect x="72" y="42" width="416" height="416" {...TRAIT} strokeWidth="0.6" />
      <Fougere dessiner={false} />
      {insectes.map(({ cle, debut, fin, el }, i) =>
        reduit ? (
          i % 2 === 0 ? <g key={cle}>{el}</g> : null
        ) : (
          <Disparition key={cle} progression={progression} debut={debut} fin={fin}>
            {el}
          </Disparition>
        ),
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Justice sociale : la balance                                        */
/* ------------------------------------------------------------------ */

function Maison({ x }: { x: number }) {
  return (
    <g {...TRAIT}>
      <path d={`M${x} 213 L${x} 199 L${x + 8} 191 L${x + 16} 199 L${x + 16} 213`} fill="var(--r-card)" />
      <path d={`M${x + 6} 213 L${x + 6} 206 L${x + 10} 206 L${x + 10} 213`} />
    </g>
  );
}

const INCLINAISON_MAX = (14 * Math.PI) / 180;

export function Balance({ progression }: { progression: MotionValue<number> }) {
  const reduit = useMouvementReduit();
  // Angle du fléau en radians : le côté du jet (gauche) descend.
  // Mouvement réduit : la balance est directement penchée.
  const angle = useTransform(progression, [0.3, 0.6], reduit ? [INCLINAISON_MAX, INCLINAISON_MAX] : [0, INCLINAISON_MAX]);
  // Pas de rotation CSS (peu fiable en SVG imbriqué) : on calcule les points.
  const x1 = useTransform(angle, (a) => 280 - 180 * Math.cos(a));
  const y1 = useTransform(angle, (a) => 120 + 180 * Math.sin(a));
  const x2 = useTransform(angle, (a) => 280 + 180 * Math.cos(a));
  const y2 = useTransform(angle, (a) => 120 - 180 * Math.sin(a));
  const descenteGauche = useTransform(angle, (a) => 160 * Math.sin(a));
  const monteeDroite = useTransform(angle, (a) => -160 * Math.sin(a));

  return (
    <svg viewBox="0 0 560 420" className="w-full h-auto" role="img" aria-label="Une balance : d'un côté un jet privé, de l'autre une rangée de maisons. Le jet pèse plus lourd.">
      <path d="M280 120 L280 380 M220 380 L340 380 M250 380 L280 350 L310 380" {...TRAIT} strokeWidth="2.4" />
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} {...TRAIT} strokeWidth="3" />
      <circle cx="280" cy="120" r="7" fill="currentColor" />
      <g>
        {/* Plateau gauche : le jet privé */}
        <motion.g style={{ y: descenteGauche }}>
          <path d="M120 120 L62 214 M120 120 L178 214" {...TRAIT} strokeWidth="1" />
          <path d="M56 214 Q 120 244 184 214 Z" {...TRAIT} fill="var(--r-card)" />
          <g {...TRAIT} fill={ACCENT}>
            <path d="M72 204 Q 72 194 87 194 L158 194 Q 172 194 176 201 Q 172 208 158 208 L87 208 Q 72 208 72 204 Z" />
            <path d="M112 201 L98 214 L110 214 L132 201 Z" />
            <path d="M80 196 L70 178 L80 178 L94 194 Z" />
          </g>
          <text x="120" y="272" textAnchor="middle" fontSize="26" fontWeight="600" fill={ACCENT}>1 %</text>
        </motion.g>
        {/* Plateau droit : les maisons */}
        <motion.g style={{ y: monteeDroite }}>
          <path d="M440 120 L382 214 M440 120 L498 214" {...TRAIT} strokeWidth="1" />
          <path d="M376 214 Q 440 244 504 214 Z" {...TRAIT} fill="var(--r-card)" />
          {[392, 412, 432, 452, 472].map((x) => (
            <Maison key={x} x={x} />
          ))}
          <text x="440" y="272" textAnchor="middle" fontSize="26" fontWeight="600" fill="currentColor">66 %</text>
        </motion.g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Paix : le pipeline devient barbelé                                   */
/* ------------------------------------------------------------------ */

const BRINS = (() => {
  // Deux brins torsadés de x=300 à x=540, en ondulation régulière.
  const segment = (dy: number) => {
    let d = `M300 ${180 + dy}`;
    for (let x = 300; x < 540; x += 30) {
      d += ` C ${x + 10} ${180 - dy}, ${x + 20} ${180 - dy}, ${x + 30} ${180 + dy}`;
    }
    return d;
  };
  return [segment(8), segment(-8)];
})();

const PICOTS = [330, 390, 450, 510];

export function Pipeline({ progression }: { progression: MotionValue<number> }) {
  const reduit = useMouvementReduit();
  const trace = useTransform(progression, [0.32, 0.62], [0, 1]);
  const picots = useTransform(progression, [0.58, 0.7], [0, 1]);

  return (
    <svg viewBox="0 70 560 250" className="w-full h-auto" role="img" aria-label="Un derrick pétrolier et un pipeline qui se transforme en fil barbelé">
      {/* Derrick */}
      <g {...TRAIT}>
        <path d="M30 260 L55 90 L80 260 M38 205 L72 205 M44 160 L66 160 M49 125 L61 125 M38 205 L66 160 M72 205 L44 160" />
        <path d="M20 260 L100 260" strokeWidth="2.4" />
      </g>
      {/* Pipeline */}
      <g {...TRAIT} strokeWidth="2">
        <path d="M80 170 L300 170 M80 190 L300 190" />
        {[120, 180, 240].map((x) => (
          <rect key={x} x={x} y="164" width="10" height="32" rx="2" fill="var(--r-card)" />
        ))}
        <path d="M300 164 L300 196" />
      </g>
      {/* Barbelé */}
      <g {...TRAIT} stroke={ACCENT} strokeWidth="2">
        {BRINS.map((d) => (
          <motion.path key={d} d={d} style={{ pathLength: reduit ? 1 : trace }} />
        ))}
        {PICOTS.map((x) => (
          <motion.path
            key={x}
            d={`M${x - 13} 166 L${x + 13} 194 M${x + 13} 166 L${x - 13} 194`}
            style={{ opacity: reduit ? 1 : picots }}
          />
        ))}
      </g>
      <path d="M20 300 L540 300" {...TRAIT} strokeWidth="0.8" strokeDasharray="2 8" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Climat : les bandes de température (« warming stripes »)             */
/* ------------------------------------------------------------------ */

// Palette des warming stripes d'Ed Hawkins (du plus froid au plus chaud).
const RAYURES_COULEURS = [
  "#08306b", "#08519c", "#2171b5", "#4292c6", "#6baed6", "#9ecae1", "#c6dbef", "#deebf7",
  "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d",
];

export interface AnneeTemperature {
  annee: number;
  anomalie: number;
}

function couleurAnomalie(anomalie: number, amplitude: number) {
  const t = Math.min(1, Math.max(0, (anomalie + amplitude) / (2 * amplitude)));
  const i = Math.min(RAYURES_COULEURS.length - 1, Math.floor(t * RAYURES_COULEURS.length));
  return RAYURES_COULEURS[i];
}

export function Rayures({
  donnees,
  progression,
}: {
  donnees: AnneeTemperature[];
  progression: MotionValue<number>;
}) {
  const reduit = useMouvementReduit();
  const largeur = useTransform(progression, [0.28, 0.62], [0, 560]);
  const amplitude = Math.max(...donnees.map((d) => Math.abs(d.anomalie)));
  const pas = 560 / donnees.length;
  const premiere = donnees[0]?.annee;
  const derniere = donnees[donnees.length - 1]?.annee;

  return (
    <svg
      viewBox="0 0 560 330"
      className="w-full h-auto"
      role="img"
      aria-label={`Bandes de température de la France de ${premiere} à ${derniere} : du bleu au rouge, chaque bande est une année.`}
    >
      <defs>
        <clipPath id="rayures-revele">
          <motion.rect x="0" y="0" height="280" width={reduit ? 560 : largeur} />
        </clipPath>
      </defs>
      <g clipPath="url(#rayures-revele)">
        {donnees.map((d, i) => (
          <rect
            key={d.annee}
            x={i * pas}
            y="0"
            width={pas + 0.5}
            height="280"
            fill={couleurAnomalie(d.anomalie, amplitude)}
          />
        ))}
      </g>
      <text x="0" y="310" fontSize="16" fill="currentColor">{premiere}</text>
      <text x="560" y="310" fontSize="16" textAnchor="end" fill="currentColor">{derniere}</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Final : le lever du jour                                             */
/* ------------------------------------------------------------------ */

const RAYONS = Array.from({ length: 9 }, (_, i) => {
  const angle = Math.PI + (i + 1) * (Math.PI / 10);
  return {
    x1: 280 + Math.cos(angle) * 120,
    y1: 240 + Math.sin(angle) * 120,
    x2: 280 + Math.cos(angle) * 190,
    y2: 240 + Math.sin(angle) * 190,
  };
});

export function Lever({ progression }: { progression: MotionValue<number> }) {
  const reduit = useMouvementReduit();
  const soleil = useTransform(progression, [0.05, 0.45], [330, 230]);
  const rayons = useTransform(progression, [0.3, 0.5], [0, 1]);

  return (
    <svg viewBox="0 20 560 320" className="w-full h-auto" role="img" aria-label="Le soleil se lève derrière des collines plantées d'arbres">
      <motion.g style={{ opacity: reduit ? 1 : rayons }} {...TRAIT} stroke={ACCENT} strokeWidth="2">
        {RAYONS.map((r) => (
          <line key={`${r.x1}-${r.y1}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
        ))}
      </motion.g>
      <motion.circle cx="280" r="90" fill={ACCENT} cy={reduit ? 230 : soleil} />
      {/* Les collines font l'horizon : opaques, elles cachent le soleil avant son lever */}
      <path d="M0 244 C 90 226, 170 232, 250 246 S 420 228, 560 242 L560 340 L0 340 Z" fill="var(--r-bg)" />
      <path d="M0 244 C 90 226, 170 232, 250 246 S 420 228, 560 242" {...TRAIT} strokeWidth="2" />
      <path d="M0 300 C 90 270, 170 280, 250 300 S 420 272, 560 292 L560 340 L0 340 Z" fill="currentColor" fillOpacity="0.1" />
      {/* Arbres au trait, rappel de l'herbier, posés sur la crête */}
      <g {...TRAIT}>
        <path d="M110 232 L110 190 M110 202 L97 190 M110 212 L123 199" />
        <circle cx="110" cy="176" r="18" fill="var(--r-bg)" />
        <path d="M440 234 L440 184 M440 198 L426 184 M440 208 L455 194" />
        <circle cx="440" cy="168" r="22" fill="var(--r-bg)" />
      </g>
    </svg>
  );
}
