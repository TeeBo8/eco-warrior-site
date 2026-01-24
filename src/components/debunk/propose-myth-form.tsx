'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Loader2,
  MessageSquarePlus,
  Send,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { trpc } from '@/app/_trpc/client';

// Schéma de validation
const proposeMythSchema = z.object({
  myth: z
    .string()
    .min(10, 'Le mythe doit contenir au moins 10 caractères')
    .max(300, 'Le mythe ne doit pas dépasser 300 caractères'),
  category: z.enum(['science', 'energie', 'solutions', 'economie'], {
    required_error: 'Veuillez sélectionner une catégorie',
  }),
  source: z
    .string()
    .max(500, 'La source ne doit pas dépasser 500 caractères')
    .optional(),
  email: z
    .string()
    .email('Veuillez entrer une adresse email valide')
    .optional()
    .or(z.literal('')),
});

type ProposeMythFormData = z.infer<typeof proposeMythSchema>;

const CATEGORIES = [
  { id: 'science', label: 'Science du climat', icon: FlaskConical, color: 'bg-blue-500' },
  { id: 'energie', label: 'Énergie', icon: Zap, color: 'bg-yellow-500' },
  { id: 'solutions', label: 'Solutions', icon: Lightbulb, color: 'bg-green-500' },
  { id: 'economie', label: 'Économie', icon: TrendingUp, color: 'bg-purple-500' },
] as const;

export function ProposeMythForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const proposeMythMutation = trpc.post.proposeMythSuggestion.useMutation({
    onSuccess: () => {
      setSubmitStatus('success');
      form.reset();
    },
    onError: () => {
      setSubmitStatus('error');
    },
  });

  const form = useForm<ProposeMythFormData>({
    resolver: zodResolver(proposeMythSchema),
    defaultValues: {
      myth: '',
      category: undefined,
      source: '',
      email: '',
    },
  });

  const onSubmit = async (data: ProposeMythFormData) => {
    setSubmitStatus('idle');
    await proposeMythMutation.mutateAsync({
      myth: data.myth,
      category: data.category,
      source: data.source || undefined,
      email: data.email || undefined,
    });
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSubmitStatus('idle');
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-lg hover:border-green-500 transition-all bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg group-hover:text-green-600 transition-colors">
              <MessageSquarePlus className="h-5 w-5" />
              Proposer un mythe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Vous avez entendu un argument climatosceptique ? Proposez-le pour qu&apos;on le vérifie !
            </p>
            <Button variant="outline" className="w-full group-hover:bg-green-600 group-hover:text-white transition-colors">
              <Lightbulb className="h-4 w-4 mr-2" />
              Soumettre une idée
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-green-600" />
            Proposer un mythe à vérifier
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Merci pour votre contribution !</h3>
              <p className="text-muted-foreground mb-4">
                Notre équipe va examiner votre proposition et pourrait l&apos;ajouter à notre base de données.
              </p>
              <Button onClick={() => handleOpenChange(false)}>
                Fermer
              </Button>
            </motion.div>
          ) : submitStatus === 'error' ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Une erreur est survenue</h3>
              <p className="text-muted-foreground mb-4">
                Impossible d&apos;envoyer votre proposition. Veuillez réessayer.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => setSubmitStatus('idle')}>
                  Réessayer
                </Button>
                <Button onClick={() => handleOpenChange(false)}>
                  Fermer
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {/* Info box */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  <strong>Comment ça marche ?</strong> Décrivez le mythe tel que vous l&apos;avez entendu.
                  Notre équipe le vérifiera avec des sources scientifiques avant publication.
                </p>
              </div>

              {/* Champ mythe */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Le mythe à vérifier <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...form.register('myth')}
                  placeholder="Ex: &quot;Les volcans émettent plus de CO2 que l'humanité&quot;"
                  className="w-full min-h-[100px] p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {form.formState.errors.myth && (
                  <p className="text-sm text-red-500">{form.formState.errors.myth.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {form.watch('myth')?.length || 0}/300 caractères
                </p>
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Catégorie <span className="text-red-500">*</span>
                </label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(value) => form.setValue('category', value as ProposeMythFormData['category'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center gap-2">
                          <cat.icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              {/* Source (optionnel) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Où avez-vous entendu ce mythe ? <Badge variant="secondary" className="ml-2 text-xs">Optionnel</Badge>
                </label>
                <Input
                  {...form.register('source')}
                  placeholder="Ex: Article Facebook, discussion avec un ami, émission TV..."
                />
                {form.formState.errors.source && (
                  <p className="text-sm text-red-500">{form.formState.errors.source.message}</p>
                )}
              </div>

              {/* Email (optionnel) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Votre email <Badge variant="secondary" className="ml-2 text-xs">Optionnel</Badge>
                </label>
                <Input
                  {...form.register('email')}
                  type="email"
                  placeholder="Pour être notifié quand le mythe sera traité"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Nous ne partagerons jamais votre email avec des tiers.
                </p>
              </div>

              {/* Boutons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleOpenChange(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={proposeMythMutation.isPending}
                >
                  {proposeMythMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Soumettre
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
