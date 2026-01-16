import { Timeline } from "@/components/timeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histoire de la Science du Climat",
  description: "Découvrez les étapes clés qui ont façonné notre compréhension du changement climatique.",
};

export default function TimelinePage() {
  return (
    <div>
      <main className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Histoire de la Science du Climat</h1>
          <p className="text-lg text-muted-foreground mt-2">Découvrez les étapes clés qui ont façonné notre compréhension du changement climatique.</p>
        </div>
        <Timeline />
      </main>
    </div>
  );
}