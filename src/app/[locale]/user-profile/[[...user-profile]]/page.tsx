"use client";

import { UserProfile, useUser } from "@clerk/nextjs";
import { BillingSection } from "@/components/billing-section";
import { BadgeEuro } from "lucide-react";
import { useParams } from "next/navigation";

const UserProfilePage = () => {
  const params = useParams();
  const locale = params.locale as string;
  const { isLoaded, isSignedIn } = useUser();
  
  if (!isLoaded) {
    return <div className="flex justify-center py-12">Chargement...</div>;
  }
  
  if (!isSignedIn) {
    return <div className="flex justify-center py-12">Vous devez être connecté pour accéder à cette page.</div>;
  }
  
  return (
    <div className="flex justify-center py-12">
      <UserProfile path={`/${locale}/user-profile`} routing="path">
        {/* 👇 On injecte notre onglet personnalisé ici 👇 */}
        <UserProfile.Page
          label="Abonnement"
          labelIcon={<BadgeEuro className="h-4 w-4" />}
          url="billing"
        >
          <BillingSection />
        </UserProfile.Page>
      </UserProfile>
    </div>
  );
};

export default UserProfilePage; 