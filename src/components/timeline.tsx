"use client";

import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { trpc } from "@/app/_trpc/client";
import * as LucideIcons from "lucide-react";

// Mappage pour les icônes dynamiques
const Icon = ({ name }: { name: string | null }) => {
  if (!name || !(name in LucideIcons)) {
    return <LucideIcons.History className="h-6 w-6" />;
  }
  const LucideIcon = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
  return <LucideIcon className="h-6 w-6" />;
};

export function Timeline() {
  const eventsQuery = trpc.getTimelineEvents.useQuery();

  if (eventsQuery.isLoading) return <p className="text-center">Chargement de la chronologie...</p>;
  if (eventsQuery.error) return <p className="text-center text-red-500">Erreur lors du chargement de la chronologie: {eventsQuery.error.message}</p>;

  return (
    <VerticalTimeline>
      {eventsQuery.data?.map((event) => (
        <VerticalTimelineElement
          key={event.id}
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            border: "1px solid hsl(var(--border))",
            boxShadow: "0 4px 6px -1px hsl(var(--muted) / 0.1), 0 2px 4px -2px hsl(var(--muted) / 0.1)"
          }}
          contentArrowStyle={{ borderRight: "7px solid hsl(var(--card))" }}
          date={event.year.toString()}
          iconStyle={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            zIndex: 100,
            position: "relative",
            boxShadow: "0 0 0 4px hsl(var(--background)), inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)"
          }}
          icon={<Icon name={('icon' in event && typeof event.icon === 'string' ? event.icon : null)} />}
        >
          <h3 className="vertical-timeline-element-title font-bold text-lg text-foreground">
            {event.titleFr}
          </h3>
          <p className="text-muted-foreground mt-2">
            {event.descriptionFr}
          </p>
        </VerticalTimelineElement>
      ))}
    </VerticalTimeline>
  );
}