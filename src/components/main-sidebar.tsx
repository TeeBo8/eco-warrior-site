"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  User, 
  Leaf, 
  ShieldCheck, 
  Map, 
  Calculator, 
  Clock,
  FileText
} from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { useParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { cn } from "@/lib/utils";


export function MainSidebar({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "fr";
  const t = useTranslations('Header');
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  
  const switchLanguage = () => {
    const newLocale = locale === 'fr' ? 'en' : 'fr';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  const links = [
    { 
      label: locale === 'fr' ? "Tableau de Bord" : "Dashboard", 
      href: `/${locale}/dashboard`, 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      label: locale === 'fr' ? "Mythes & Réalités" : "Myths & Realities", 
      href: `/${locale}/debunk`, 
      icon: <ShieldCheck className="h-5 w-5" /> 
    },
    { 
      label: locale === 'fr' ? "Analyses" : "Analysis", 
      href: `/${locale}/articles`, 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      label: locale === 'fr' ? "Chronologie" : "Timeline", 
      href: `/${locale}/timeline`, 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      label: locale === 'fr' ? "Calculateur" : "Calculator", 
      href: `/${locale}/calculator`, 
      icon: <Calculator className="h-5 w-5" /> 
    },
    { 
      label: locale === 'fr' ? "Carte des Impacts" : "Impact Map", 
      href: `/${locale}/map`, 
      icon: <Map className="h-5 w-5" /> 
    },
  ];

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row w-full flex-1 h-screen mx-auto overflow-hidden")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Logo dynamique selon l'état ouvert/fermé */}
            <div className="p-2">
              {open ? <Logo locale={locale} /> : <LogoIcon locale={locale} />}
            </div>
            
            {/* Navigation - visible seulement si connecté */}
            <SignedIn>
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </SignedIn>
            
            {/* Message pour utilisateurs déconnectés */}
            <SignedOut>
              <div className="mt-8 p-4 text-center text-sm text-muted-foreground">
                {open && (locale === 'fr' ? 'Connectez-vous pour accéder aux fonctionnalités' : 'Sign in to access features')}
              </div>
            </SignedOut>
          </div>

          {/* Section du bas réorganisée */}
          <div className="flex flex-col gap-2">
            <SignedIn>
              <SidebarLink 
                link={{ 
                  label: locale === 'fr' ? "Mon Profil" : "My Profile", 
                  href: `/${locale}/profile`, 
                  icon: <User className="h-5 w-5" /> 
                }} 
              />
              
              {/* Ligne de séparation */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 my-2"></div>
              
              {/* UserButton Clerk gère la déconnexion */}
              <div className="flex items-center justify-center w-full py-2">
                <UserButton afterSignOutUrl="/" userProfileUrl={`/${locale}/user-profile`} />
              </div>
            </SignedIn>
            
            <SignedOut>
              <Button asChild className="w-full">
                <Link href={`/${locale}/sign-in`}>
                  {locale === 'fr' ? "Connexion" : "Sign In"}
                </Link>
              </Button>
            </SignedOut>
            
            {/* Switch de langue - simple bouton cliquable */}
            <div className="flex items-center justify-center py-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={switchLanguage}
                className="text-sm flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                {open && (locale === 'fr' ? 'EN' : 'FR')}
              </Button>
            </div>

            {/* Bouton Devenir Membre */}
            <div className="py-2">
              <Button asChild size="sm" className="w-full">
                <a href="https://buy.stripe.com/00w7sMgs4aGbfUi3daaVa04" target="_blank" rel="noopener noreferrer">
                  {open ? t('subscribeButton') : "💳"}
                </a>
              </Button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-auto">
        <div className="p-2 md:p-10 flex-1 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
}

const Logo = ({ locale }: { locale: string }) => (
  <Link 
    href={`/${locale}`} 
    className="font-bold text-xl flex items-center text-green-600 py-1 relative z-20"
  >
    <Leaf className="h-7 w-7 mr-2" />
    EcoWarrior
  </Link>
);

// Nouveau composant pour l'icône seule
const LogoIcon = ({ locale }: { locale: string }) => (
  <Link 
    href={`/${locale}`} 
    className="font-bold flex items-center justify-center py-1 relative z-20"
  >
    <Leaf className="h-7 w-7 text-green-600" />
  </Link>
);