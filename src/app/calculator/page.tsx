import { CarbonCalculatorForm } from "@/components/carbon-calculator-form";
import { Metadata } from "next";
import { CalculatorHero } from "@/components/calculator/calculator-hero";
import { CalculatorMethodology } from "@/components/calculator/calculator-methodology";

export const metadata: Metadata = {
  title: "Calculez votre Empreinte Carbone",
  description: "Estimez votre impact environnemental annuel et suivez votre progression vers un mode de vie plus durable grâce à notre calculateur intelligent.",
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-12 px-4">
        <CalculatorHero />
        <CarbonCalculatorForm />
        <CalculatorMethodology />
      </main>
    </div>
  );
}
