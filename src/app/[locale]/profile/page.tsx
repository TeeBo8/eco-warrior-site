import ProfileContent from '@/components/profile-content';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  return { title: resolvedParams.locale === 'fr' ? 'Mon Profil | EcoWarrior' : 'My Profile | EcoWarrior' };
}

export default async function ProfilePage() {
  return <ProfileContent />;
} 