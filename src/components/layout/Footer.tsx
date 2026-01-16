'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Linkedin, Twitter, Loader2, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";

// Schéma de validation pour le formulaire de contact
const contactFormSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères." }),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

// Composant logo simple
const EcoWarriorLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Leaf className="h-8 w-8 text-green-600" />
    <span className="text-xl font-bold text-green-700">EcoWarrior</span>
  </div>
);

export function Footer() {
  const pathname = usePathname();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const { mutate, isPending } = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast({
        title: "Message envoyé !",
        description: "Merci, nous vous répondrons dès que possible.",
      });
      reset();
    },
    onError: (error: { message: string }) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Ne pas afficher le footer si on n'est pas sur la page d'accueil
  const isHomePage = pathname === "/";

  if (!isHomePage) {
    return null;
  }

  function onSubmit(data: ContactFormValues) {
    mutate(data);
  }

  const navLinks = [
    { href: "/dashboard", label: "Tableau de Bord" },
    { href: "/debunk", label: "Mythes & Réalités" },
    { href: "/timeline", label: "Chronologie" },
    { href: "/map", label: "Carte des Impacts" },
    { href: "/calculator", label: "Calculateur" },
  ];

  return (
    <footer className="w-full">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <EcoWarriorLogo />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Contact Form - Compact */}
        <div className="w-full max-w-md">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Contactez-nous</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <Input
                id="email"
                placeholder="Votre adresse email"
                type="email"
                {...register("email")}
                className="bg-card/80 backdrop-blur-sm border-border/60"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="message" className="sr-only">Message</Label>
              <Textarea
                id="message"
                placeholder="Votre message..."
                {...register("message")}
                className="bg-card/80 backdrop-blur-sm border-border/60 min-h-[100px]"
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Envoyer le message
            </Button>
          </form>
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <Button asChild variant="outline" size="icon" className="rounded-full border-border/60 bg-card/80 backdrop-blur-sm hover:bg-card">
            <Link
              href="https://x.com/THIBAUL76280609"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visiter notre profil Twitter"
            >
              <Twitter className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="icon" className="rounded-full border-border/60 bg-card/80 backdrop-blur-sm hover:bg-card">
            <Link
              href="https://www.linkedin.com/in/thibault-leture-5740242a1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visiter notre profil LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Copyright & Project Mention */}
        <div className="space-y-2 pt-4 border-t border-border/30">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoWarrior. Tous droits réservés.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Projet personnel développé avec Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}