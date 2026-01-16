"use client";

// Section commentaires simplifiée - pas d'auth requise, juste affichage
export function CommentSection() {
  return (
    <div className="mt-8 pt-6 border-t">
      <h4 className="text-lg font-semibold mb-4">💬 Discussion Premium</h4>
      <div className="text-center p-4 bg-muted rounded-md text-muted-foreground">
        Aucun commentaire pour le moment. Soyez le premier à donner votre avis !
      </div>
    </div>
  );
}