import type { Metadata } from "next";
import { Montserrat, Merriweather, Source_Code_Pro } from "next/font/google";
import "../globals.css";
import TrpcProvider from "../_trpc/provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { MainSidebar } from "@/components/main-sidebar";
import { ThemeProvider } from "next-themes";
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
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
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
              <MainSidebar>
                <div className="flex flex-col min-h-screen">
                  <div className="flex-1">
                    {children}
                  </div>
                </div>
              </MainSidebar>
              <Toaster />
            </TrpcProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
