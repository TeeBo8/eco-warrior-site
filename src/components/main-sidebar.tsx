"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Leaf,
  ShieldCheck,
  Map,
  Calculator,
  Clock,
  FileText,
  Scan
} from "lucide-react";
import Link from "next/link";
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
      label: t('dashboardLink'),
      href: `/${locale}/dashboard`,
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      label: t('debunkLink'),
      href: `/${locale}/debunk`,
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      label: t('articlesLink'),
      href: `/${locale}/articles`,
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: t('timelineLink'),
      href: `/${locale}/timeline`,
      icon: <Clock className="h-5 w-5" />
    },
    {
      label: t('calculatorLink'),
      href: `/${locale}/calculator`,
      icon: <Calculator className="h-5 w-5" />
    },
    {
      label: t('mapLink'),
      href: `/${locale}/map`,
      icon: <Map className="h-5 w-5" />
    },
    {
      label: t('scannerLink'),
      href: `/${locale}/scanner`,
      icon: <Scan className="h-5 w-5" />
    },
  ];

  return (
    <div className={cn("rounded-md flex flex-col md:flex-row w-full flex-1 min-h-screen mx-auto")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Logo dynamique selon l'état ouvert/fermé */}
            <div className="p-2">
              {open ? <Logo locale={locale} /> : <LogoIcon locale={locale} />}
            </div>

            {/* Navigation - toujours visible */}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Section du bas */}
          <div className="flex flex-col gap-2">
            {/* Switch de langue */}
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
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className="p-2 md:p-10 flex-1 w-full">
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