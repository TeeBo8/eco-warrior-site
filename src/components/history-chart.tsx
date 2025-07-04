"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslations } from 'next-intl';

type HistoryData = {
  createdAt: string;
  totalEmissions: number;
};

export function HistoryChart({ data }: { data: HistoryData[] }) {
  const t = useTranslations("CalculatorPage.history");
  
  const formattedData = data.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    emissions: item.totalEmissions.toFixed(2),
  })).reverse(); // On inverse pour avoir le plus ancien à gauche

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">{t('title')}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="emissions" name={t('chartLabel')} stroke="#16a34a" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 