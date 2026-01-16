import { CarbonCalculatorForm } from "@/components/carbon-calculator-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculez votre Empreinte Carbone",
  description: "Estimez votre impact environnemental annuel et suivez votre progression vers un mode de vie plus durable grâce à notre calculateur intelligent.",
};

export default function CalculatorPage() {
  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Calculez votre Empreinte Carbone</h1>
          <p className="text-lg text-muted-foreground mt-2">Estimez votre impact annuel sur la planète en quelques clics.</p>
        </div>
        <CarbonCalculatorForm />

        <div className="mt-16 bg-muted/30 p-8 rounded-2xl border border-border">
          <h2 className="text-2xl font-bold mb-4">Méthodologie Scientifique</h2>
          <p className="text-muted-foreground mb-6">Ce calculateur s&apos;appuie sur la Base Carbone de l&apos;ADEME et les rapports du GIEC. Nous prenons en compte l&apos;analyse du cycle de vie complet.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">Transport : inclut la combustion et la production du carburant/véhicule.</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">Alimentation : inclut la production agricole, la transformation et le transport.</p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50">
              <p className="font-medium text-primary">Énergie : basé sur l&apos;intensité carbone moyenne du réseau électrique.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}