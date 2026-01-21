import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Leaf, Users, Globe } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soutenir EcoWarrior",
  description: "Aidez-nous à combattre la désinformation climatique",
};

export default function PricingPage() {
  const impacts = [
    { icon: Leaf, text: "Contenu scientifique de qualité, accessible à tous" },
    { icon: Users, text: "Démystification des arguments climatosceptiques" },
    { icon: Globe, text: "Outils gratuits pour comprendre son impact" },
  ];

  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Soutenir EcoWarrior</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Tout est gratuit. Mais si vous aimez ce qu&apos;on fait, vous pouvez nous aider à aller plus loin.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-green-500 border-2">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Heart className="h-6 w-6 text-red-500" />
                Faire un don
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Votre soutien finance le développement de nouveaux outils et la création de contenu de qualité.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <p className="font-semibold text-center">Votre don permet :</p>
                <ul className="space-y-3">
                  {impacts.map((impact, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <impact.icon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{impact.text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button className="w-full" size="lg" asChild>
                <a href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" target="_blank" rel="noopener noreferrer">
                  <Heart className="mr-2 h-5 w-5" />
                  Soutenir le projet
                </a>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé via Stripe. Merci pour votre générosité ! 💚
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
