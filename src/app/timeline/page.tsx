import { Timeline } from "@/components/timeline";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Histoire de la Science du Climat",
  description: "Découvrez les étapes clés qui ont façonné notre compréhension du changement climatique.",
};

export default function TimelinePage() {
  return (
    <div>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Histoire de la Science du Climat</h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto px-4">
            Découvrez les étapes clés qui ont façonné notre compréhension du changement climatique.
          </p>
        </div>
        <Timeline />
      </main>
    </div>
  );
}