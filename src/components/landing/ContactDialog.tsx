'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useTransition } from "react";
import { envoyerContact } from "@/app/actions/contact";

const contactFormSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactDialog() {
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      const resultat = await envoyerContact(data);
      if (resultat.ok) {
        toast({
          title: "Message envoyé !",
          description: "Merci, nous vous répondrons dès que possible.",
        });
        reset();
      } else {
        toast({ title: "Erreur", description: resultat.erreur, variant: "destructive" });
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="px-6 py-5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg transition-all duration-300">
          Contactez-nous
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">Contactez-nous</DialogTitle>
          <DialogDescription>Votre message...</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Votre adresse email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Votre adresse email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Votre message</Label>
            <Textarea
              id="message"
              placeholder="Votre message..."
              {...register("message")}
              aria-invalid={!!errors.message}
              className="min-h-[120px]"
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Envoyer le message
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
