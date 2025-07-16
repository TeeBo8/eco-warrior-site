'use client';

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations, useLocale } from "next-intl";
import { Linkedin, Twitter, Loader2, Leaf } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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

// Composant logo simple en attendant
const EcoWarriorLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Leaf className="h-8 w-8 text-green-600" />
    <span className="text-xl font-bold text-green-700">EcoWarrior</span>
  </div>
);

export function Footer() {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const { user } = useUser();
  const t = useTranslations('Footer');
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const { mutate, isPending } = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast({
        title: t('contact.successTitle'),
        description: t('contact.successDescription'),
      });
      reset();
    },
    onError: (error: { message: string }) => {
      toast({
        title: t('contact.errorTitle'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Ne pas afficher le footer si on n'est pas sur la page d'accueil
  // On vérifie que l'URL se termine par juste la locale (ex: /fr ou /en)
  const isHomePage = pathname.match(/^\/[a-z]{2}$/);
  
  if (!isHomePage) {
    return null;
  }

  function onSubmit(data: ContactFormValues) {
    mutate(data);
  }

  // Fonction pour gérer les clics sur les liens protégés
  const handleProtectedLinkClick = (href: string, e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      // Rediriger vers la page de connexion avec l'URL de retour
      router.push(`/${locale}/sign-in?redirect_url=${encodeURIComponent(href)}`);
    }
    // Si l'utilisateur est connecté, le lien fonctionne normalement
  };

  const navLinks = [
    { href: `/${locale}/dashboard`, label: t('links.dashboard'), protected: true },
    { href: `/${locale}/debunk`, label: t('links.myths'), protected: true },
    { href: `/${locale}/timeline`, label: t('links.timeline'), protected: true },
    { href: `/${locale}/map`, label: t('links.impactMap'), protected: true },
    { href: `/${locale}/calculator`, label: t('links.calculator'), protected: true },
    { href: `/${locale}/profile`, label: t('links.profile'), protected: true },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-black border-t border-border">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col items-center text-center">
          
          <Link href="/" className="mb-6">
            <EcoWarriorLogo />
          </Link>

          <nav className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {navLinks.map(link => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={link.protected ? (e) => handleProtectedLinkClick(link.href, e) : undefined}
                >
                    {link.label}
                </Link>
            ))}
          </nav>

          <div className="mb-8 w-full max-w-lg">
            <h3 className="mb-4 text-lg font-semibold">{t('contact.title')}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="email" className="sr-only">Email</Label>
                <Input id="email" placeholder={t('contact.emailPlaceholder')} type="email" {...register("email")} />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="message" className="sr-only">Message</Label>
                <Textarea id="message" placeholder={t('contact.messagePlaceholder')} {...register("message")} />
                {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {t('contact.sendButton')}
              </Button>
            </form>
          </div>

          <div className="mb-6 flex gap-4">
            <Button asChild variant="outline" size="icon" className="rounded-full">
              <Link 
                href="https://x.com/THIBAUL76280609" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Visiter notre profil Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon" className="rounded-full">
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

          <div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EcoWarrior. {t('rights')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 