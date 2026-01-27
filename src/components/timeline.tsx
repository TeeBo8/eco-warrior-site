"use client";

import { trpc } from "@/app/_trpc/client";
import { TimelineCustom } from "./timeline-custom";

export function Timeline() {
  const eventsQuery = trpc.getTimelineEvents.useQuery();

  if (eventsQuery.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Chargement de la chronologie...</p>
      </div>
    );
  }

  if (eventsQuery.error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">
          Erreur lors du chargement de la chronologie: {eventsQuery.error.message}
        </p>
      </div>
    );
  }

  if (!eventsQuery.data || eventsQuery.data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Aucun événement à afficher.</p>
      </div>
    );
  }

  return (
    <TimelineCustom
      events={eventsQuery.data.map((event) => ({
        id: event.id,
        year: event.year,
        titleFr: event.titleFr,
        titleEn: event.titleEn ?? undefined,
        descriptionFr: event.descriptionFr,
        descriptionEn: event.descriptionEn ?? undefined,
        icon: 'icon' in event && typeof event.icon === 'string' ? event.icon : undefined,
        period: 'period' in event && typeof event.period === 'string'
          ? (event.period as "discovery" | "warning" | "urgency")
          : undefined,
        importance: 'importance' in event && typeof event.importance === 'string'
          ? (event.importance as "normal" | "high" | "critical")
          : undefined,
      }))}
    />
  );
}
