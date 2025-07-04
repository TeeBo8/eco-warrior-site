"use client";

import { useTestMode } from "@/lib/test-mode-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";

export function GlobalTestPanel() {
  const { testMode, setTestMode, isDeveloper } = useTestMode();
  const { user } = useUser();

  // Ne pas afficher le panneau si l'utilisateur n'est pas développeur
  if (!isDeveloper) {
    return null;
  }

  return (
    <Card className="mb-6 border-yellow-400 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          🧪 Panneau de Test Global - Mode Développeur
          <span className="text-xs text-muted-foreground">(t.leture@gmail.com)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              size="sm" 
              variant={testMode === 'dev' ? 'default' : 'outline'}
              onClick={() => setTestMode('dev')}
            >
              🔧 Mode Dev (Premium)
            </Button>
            <Button 
              size="sm" 
              variant={testMode === 'premium' ? 'default' : 'outline'}
              onClick={() => setTestMode('premium')}
            >
              ⭐ Mode Premium Simulé
            </Button>
            <Button 
              size="sm" 
              variant={testMode === 'normal' ? 'default' : 'outline'}
              onClick={() => setTestMode('normal')}
            >
              👤 Mode Utilisateur Normal
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Mode actuel :</strong> {
              testMode === 'dev' ? '🔧 Développeur (accès premium complet)' :
              testMode === 'premium' ? '⭐ Premium simulé (toutes fonctionnalités)' :
              '👤 Utilisateur normal (voir promotions premium)'
            }</p>
            <p><strong>Effet :</strong> {
              testMode === 'dev' || testMode === 'premium' ? 
              'Commentaires, sauvegarde calculs, chat illimité, historique visible' :
              'Promotions affichées, fonctionnalités premium verrouillées'
            }</p>
            <p><strong>Email connecté :</strong> {user?.emailAddresses?.[0]?.emailAddress || 'Non connecté'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 