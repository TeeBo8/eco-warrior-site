import type { Metadata } from "next";
import { Work_Sans, Fraunces, Source_Code_Pro, Anton, Caveat, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import TrpcProvider from "./_trpc/provider";
import { MainSidebar } from "@/components/main-sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { BookmarksProvider } from "@/components/articles";

// Direction artistique : Herbier vivant (jour) / Nuit & aube (nuit) / Affiche de lutte (La Rue)
const workSans = Work_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Polices d'ambiance, chargées seulement là où elles servent (preload désactivé)
const anton = Anton({
  variable: "--font-lutte",
  subsets: ["latin"],
  weight: "400",
  preload: false,
});

const caveat = Caveat({
  variable: "--font-main",
  subsets: ["latin"],
  preload: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-aube",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "EcoWarrior — Chaque argument climatosceptique, sa réponse sourcée",
    template: "%s | EcoWarrior",
  },
  description: "Des réponses sourcées à chaque argument climatosceptique : données NASA, NOAA, GIEC, outils interactifs et mythes décortiqués.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${workSans.variable} ${fraunces.variable} ${sourceCodePro.variable} ${anton.variable} ${caveat.variable} ${bricolage.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <TrpcProvider>
            <BookmarksProvider>
              <MainSidebar>
                <div className="flex flex-col min-h-screen">
                  <div className="flex-1">
                    {children}
                  </div>
                </div>
              </MainSidebar>
              <Toaster />
            </BookmarksProvider>
          </TrpcProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
