import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import TrpcProvider from "../_trpc/provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { MainSidebar } from "@/components/main-sidebar";
import { TestModeProvider } from "@/lib/test-mode-context";
import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";

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

export const metadata: Metadata = {
  title: "Eco Warrior",
  description: "Fighting climate change with data and action.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  // CORRECTION: On passe la locale à getMessages()
  const messages = await getMessages({locale});
  
  return (
    <ClerkProvider>
      <html lang={locale} suppressHydrationWarning>
        <body
          className={`${montserrat.variable} ${merriweather.variable} ${sourceCodePro.variable} antialiased font-sans`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              <TrpcProvider>
                <TestModeProvider>
                  <MainSidebar>
                    <div className="flex flex-col min-h-screen">
                      <div className="flex-1">
                        {children}
                      </div>
                      <Footer />
                    </div>
                  </MainSidebar>
                  <Toaster />
                </TestModeProvider>
              </TrpcProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
