"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

const logos = [
  { name: "NASA", path: "/logos/nasa.svg" },
  { name: "NOAA", path: "/logos/noaa.png" },
  { name: "CNRS", path: "/logos/cnrs.svg" },
];

export function ConsensusLogos() {
  const t = useTranslations("ConsensusSection");
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold">{t('title')}</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-10 items-center justify-items-center">
          {logos.map((logo) => (
            <div key={logo.name} className="flex justify-center" title={logo.name}>
              <Image
                src={logo.path}
                alt={`${logo.name} logo`}
                width={150}
                height={60}
                className="opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 