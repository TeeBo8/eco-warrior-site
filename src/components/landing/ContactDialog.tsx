'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";

const contactFormSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  message: z.string().min(10, { message: "Votre message doit contenir au moins 10 caractères." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactDialog() {
  const tContact = useTranslations("Footer.contact");
  const tGlobal = useTranslations("Footer");
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const { mutate, isPending } = trpc.contact.send.useMutation({
    onSuccess: () => {
      toast({
        title: tContact('successTitle'),
        description: tContact('successDescription'),
      });
      reset();
    },
    onError: (error: { message: string }) => {
      toast({
        title: tContact('errorTitle'),
        description: error.message ?? tContact('errorDescription'),
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ContactFormValues) {
    mutate(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="px-6 py-5 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg transition-all duration-300">
          {tContact('title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">{tContact('title')}</DialogTitle>
          <DialogDescription>{tGlobal('contact.messagePlaceholder')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{tContact('emailPlaceholder')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={tContact('emailPlaceholder')}
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{tContact('messagePlaceholder')}</Label>
            <Textarea
              id="message"
              placeholder={tContact('messagePlaceholder')}
              {...register("message")}
              aria-invalid={!!errors.message}
              className="min-h-[120px]"
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {tContact('sendButton')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

