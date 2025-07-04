import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type IndicatorCardProps = {
  title: string;
  value: string;
  unit: string;
  source: string;
};

export function IndicatorCard({ title, value, unit, source }: IndicatorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{value} <span className="text-2xl text-muted-foreground">{unit}</span></p>
        <p className="text-xs text-muted-foreground mt-2">Source: {source}</p>
      </CardContent>
    </Card>
  );
} 