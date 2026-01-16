import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre Profil',
  description: 'Gérez les informations et les paramètres de votre compte.',
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center p-8">
        <h1 className="text-3xl font-bold mb-4">Votre Profil</h1>
        <p className="text-muted-foreground mb-6">
          Gérez les informations et les paramètres de votre compte.
        </p>
        <p className="text-sm text-muted-foreground">
          La fonctionnalité de profil sera bientôt disponible.
        </p>
      </div>
    </div>
  );
}
