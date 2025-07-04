"use client";
import { trpc } from "@/app/_trpc/client";
import { Card } from "./ui/card";
import * as LucideIcons from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useParams } from "next/navigation";

// Composant Icon réutilisé de la timeline
const Icon = ({ name }: { name: string | null }) => {
  if (!name || !(name in LucideIcons)) {
    return <LucideIcons.Award className="h-8 w-8" />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  return <LucideIcon className="h-8 w-8" />;
};

export function BadgesGallery() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "fr";
  const myBadgesQuery = trpc.gamification.getMyBadges.useQuery();

  if (myBadgesQuery.isLoading) return <p>Chargement des badges...</p>;

  if (!myBadgesQuery.data || myBadgesQuery.data.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">
          {locale === 'fr' ? 'Vos Badges' : 'Your Badges'}
        </h2>
        <p className="text-muted-foreground">
          {locale === 'fr' 
            ? 'Vous n\'avez pas encore de badges. Effectuez des actions écologiques pour en débloquer !' 
            : 'You don\'t have any badges yet. Take ecological actions to unlock them!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">
        {locale === 'fr' ? 'Vos Badges' : 'Your Badges'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {myBadgesQuery.data?.map(({ badge, unlockedAt }) => (
          <TooltipProvider key={badge.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="flex flex-col items-center justify-center p-4 aspect-square hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="text-primary mb-2">
                    <Icon name={badge.icon} />
                  </div>
                  <p className="text-sm font-semibold text-center leading-tight">
                    {locale === 'fr' ? badge.name_fr : badge.name_en}
                  </p>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium">
                    {locale === 'fr' ? badge.description_fr : badge.description_en}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {locale === 'fr' ? 'Débloqué le' : 'Unlocked on'} {new Date(unlockedAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
} 