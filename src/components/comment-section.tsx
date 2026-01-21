"use client";

// Section commentaires simplifiée - pas d'auth requise, juste affichage
export function CommentSection() {
  return (
    <div className="mt-8 pt-6 border-t">
      <h4 className="text-lg font-semibold mb-4">💬 Discussion</h4>
      <div className="text-center p-4 bg-muted rounded-md text-muted-foreground">
        Les commentaires arrivent bientôt !
      </div>
    </div>
  );
}