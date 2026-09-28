import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import TrpcProvider from "./_trpc/provider";
import { MainSidebar } from "@/components/main-sidebar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { BookmarksProvider } from "@/components/articles";

const montserrat = Montserrat({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
        className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} ${playfairDisplay.variable} antialiased font-sans`}
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
