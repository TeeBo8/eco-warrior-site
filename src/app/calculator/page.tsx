import { CarbonCalculatorForm } from "@/components/carbon-calculator-form";
import { Metadata } from "next";
import { CalculatorHero } from "@/components/calculator/calculator-hero";
import { CalculatorMethodology } from "@/components/calculator/calculator-methodology";
import { GradientMeshBackground } from "@/components/calculator/gradient-mesh-background";
import { GradientSeparator } from "@/components/calculator/gradient-separator";

export const metadata: Metadata = {
  title: "Calculez votre Empreinte Carbone",
  description: "Estimez votre impact environnemental annuel et suivez votre progression vers un mode de vie plus durable grâce à notre calculateur intelligent.",
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient mesh animé */}
      <GradientMeshBackground />

      <main className="relative z-10 container mx-auto py-12 px-4">
        <CalculatorHero />

        <GradientSeparator className="my-8" />

        <CarbonCalculatorForm />

        <GradientSeparator className="my-12" />

        <CalculatorMethodology />
      </main>
    </div>
  );
}
