import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenez Membre Premium",
  description: "Soutenez notre mission et accédez à des fonctionnalités exclusives",
};

export default function PricingPage() {
  const features = [
    "Accès à toutes les données climatiques en temps réel",
    "Assistant IA personnalisé illimité",
    "Calculateur d'empreinte carbone avancé",
    "Priorité sur les nouvelles fonctionnalités"
  ];

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Devenez Membre Premium</h1>
          <p className="text-lg text-muted-foreground mt-2">Soutenez notre mission et accédez à des fonctionnalités exclusives</p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-green-500 border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">EcoGuerrier Premium</CardTitle>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                  🔥 OFFRE DE LANCEMENT
                </div>
                <div className="text-2xl text-gray-500 line-through">€9.99<span className="text-sm">/mois</span></div>
                <div className="text-4xl font-bold text-green-600">€5.00<span className="text-lg font-normal">/mois</span></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6" asChild>
                <a href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" target="_blank" rel="noopener noreferrer">
                  Profiter de l&apos;offre maintenant
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}