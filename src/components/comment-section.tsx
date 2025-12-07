"use client";

import { useTranslations } from "next-intl";

// Section commentaires simplifiée - pas d'auth requise, juste affichage
export function CommentSection() {
  const t = useTranslations("DebunkPage.comments");

  return (
    <div className="mt-8 pt-6 border-t">
      <h4 className="text-lg font-semibold mb-4">{t('title')}</h4>
      <div className="text-center p-4 bg-muted rounded-md text-muted-foreground">
        {t('noComments')}
      </div>
    </div>
  );
}