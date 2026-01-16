import { VisualScanner } from "@/components/visual-scanner";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Scanner Carbone Visuel",
    description: "Analysez l'empreinte carbone à partir d'images grâce à Gemini AI",
};

export default function ScannerPage() {
    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center mb-10 space-y-4">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
                    Scanner Carbone Visuel
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Propulsé par Gemini 3 Pro. Prenez une photo de n&apos;importe quel objet, repas ou activité pour révéler instantanément son impact environnemental.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    IA Multimodale Native
                </div>
            </div>

            <VisualScanner />
        </div>
    );
}
