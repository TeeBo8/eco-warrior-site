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
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";


export function MainSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Tableau de Bord",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      label: "Mythes & Réalités",
      href: "/debunk",
      icon: <ShieldCheck className="h-5 w-5" />
    },
    {
      label: "Analyses",
      href: "/articles",
      icon: <FileText className="h-5 w-5" />
    },
    {
      label: "Chronologie",
      href: "/timeline",
      icon: <Clock className="h-5 w-5" />
    },
    {
      label: "Calculateur",
      href: "/calculator",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      label: "Carte des Impacts",
      href: "/map",
      icon: <Map className="h-5 w-5" />
    },
    {
      label: "Scanner Visuel",
      href: "/scanner",
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
              {open ? <Logo /> : <LogoIcon />}
            </div>

            {/* Navigation - toujours visible */}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1">
        <div className={cn(
          "flex-1 w-full",
          // Pas de padding sur la landing page (home)
          pathname === "/" ? "" : "p-2 md:p-10"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}

const Logo = () => (
  <Link
    href="/"
    className="font-bold text-xl flex items-center text-green-600 py-1 relative z-20"
  >
    <Leaf className="h-7 w-7 mr-2" />
    EcoWarrior
  </Link>
);

// Nouveau composant pour l'icône seule
const LogoIcon = () => (
  <Link
    href="/"
    className="font-bold flex items-center justify-center py-1 relative z-20"
  >
    <Leaf className="h-7 w-7 text-green-600" />
  </Link>
);