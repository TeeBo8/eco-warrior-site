'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CheckCircle2,
  Loader2,
  Mail,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

const newsletterSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function NewsletterCTA() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'already'>('idle');

  const subscribeMutation = trpc.post.subscribeNewsletter.useMutation({
    onSuccess: (data) => {
      if (data.alreadySubscribed) {
        setSubmitStatus('already');
      } else {
        setSubmitStatus('success');
      }
      form.reset();
    },
  });

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setSubmitStatus('idle');
    await subscribeMutation.mutateAsync({
      email: data.email,
      source: 'debunk-myth-of-month',
    });
  };

  return (
    <Card className="overflow-hidden border-2 border-dashed border-green-300 dark:border-green-700 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Icône et texte */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">
                Newsletter mensuelle
              </span>
            </div>

            <h3 className="text-2xl font-bold mb-2">
              Le <span className="text-green-600">Mythe du Mois</span>
            </h3>

            <p className="text-muted-foreground mb-4 max-w-md">
              Chaque mois, recevez un mythe climatique décrypté avec ses sources,
              pour devenir incollable sur les vrais enjeux du climat.
            </p>

            {/* Avantages */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
              <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>100% gratuit</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span>1 email / mois</span>
              </div>
              <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                <Mail className="h-4 w-4" />
                <span>Désinscription facile</span>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="w-full md:w-auto md:min-w-[320px]">
            <AnimatePresence mode="wait">
              {submitStatus === 'success' || submitStatus === 'already' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-3 flex items-center justify-center">
                    <CheckCircle2 className="h-7 w-7 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-1">
                    {submitStatus === 'already' ? 'Déjà inscrit !' : 'Inscription réussie !'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {submitStatus === 'already'
                      ? 'Vous êtes déjà abonné à notre newsletter.'
                      : 'Rendez-vous dans votre boîte mail pour le prochain mythe !'}
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...form.register('email')}
                        type="email"
                        placeholder="votre@email.com"
                        className="pl-10 h-12"
                      />
                    </div>
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium"
                      disabled={subscribeMutation.isPending}
                    >
                      {subscribeMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Inscription...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Je m&apos;inscris gratuitement
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    En vous inscrivant, vous acceptez de recevoir notre newsletter mensuelle.
                    Pas de spam, promis !
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
