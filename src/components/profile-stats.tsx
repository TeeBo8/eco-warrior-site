"use client";

import { trpc } from "@/app/_trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTranslations } from "next-intl";

const StatCard = ({ title, value }: { title: string, value: string | number }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{title}</p>
  </div>
);

export function ProfileStats() {
  const t = useTranslations("ProfilePage.stats");
  const badgesQuery = trpc.gamification.getMyBadges.useQuery();
  const historyQuery = trpc.carbon.getHistory.useQuery();

  const badgeCount = badgesQuery.data?.length ?? 0;
  const lastCalculation = historyQuery.data?.[0]?.totalEmissions.toFixed(2) ?? "N/A";
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title={t('badges')} value={badgeCount} />
        <StatCard 
          title={t('lastCalculation')} 
          value={lastCalculation !== "N/A" ? `${lastCalculation} tCO₂e` : t('noCalculation')} 
        />
        <StatCard title={t('memberStatus')} value={t('premium')} />
      </CardContent>
    </Card>
  );
} 