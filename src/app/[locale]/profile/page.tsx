"use client";

import { useUser } from "@clerk/nextjs";
import { BadgesGallery } from "@/components/badges-gallery";
import { ProfileStats } from "@/components/profile-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "fr";

  if (!isLoaded) {
    return <div className="flex justify-center py-8">Chargement...</div>;
  }

  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">
        {locale === 'fr' ? 'Mon Profil' : 'My Profile'}
      </h1>

      {/* Statistiques de l'utilisateur */}
      <ProfileStats />
      
      {/* Informations utilisateur */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>
            {locale === 'fr' ? 'Informations Personnelles' : 'Personal Information'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {locale === 'fr' ? 'Nom' : 'Name'}
              </label>
              <p className="text-lg">{user.fullName || user.username || 'Utilisateur'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {locale === 'fr' ? 'Email' : 'Email'}
              </label>
              <p className="text-lg">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {locale === 'fr' ? 'Membre depuis' : 'Member since'}
              </label>
              <p className="text-lg">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US') : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Galerie de badges */}
      <BadgesGallery />
    </div>
  );
} 