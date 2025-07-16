'use client';
import { useUser } from '@clerk/nextjs';
import { BadgesGallery } from '@/components/badges-gallery';
import { ProfileStats } from '@/components/profile-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, redirect } from 'next/navigation';

export default function ProfileContent() {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const locale = typeof params.locale === 'string' ? params.locale : 'fr';
  
  if (!isLoaded) return <div className="flex justify-center py-8">Chargement...</div>;
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{locale === 'fr' ? 'Mon Profil' : 'My Profile'}</h1>
      <ProfileStats />
      <Card className="mt-8">
        <CardHeader><CardTitle>{locale === 'fr' ? 'Mes Badges' : 'My Badges'}</CardTitle></CardHeader>
        <CardContent><BadgesGallery /></CardContent>
      </Card>
    </div>
  );
} 