"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import type { UsageData } from "@/lib/types";

const chartConfig = {
  energy: {
    label: "Energy (kWh)",
    color: "hsl(var(--chart-1))",
  },
  water: {
    label: "Water (gal)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface UsageChartProps {
  data: UsageData[];
}

export function UsageChart({ data }: UsageChartProps) {
  // Sort data by month sequence if needed, or just display as is
  const displayData = data.length > 0 ? data : [
    { month: "Jan", energy: 0, water: 0 },
    { month: "Feb", energy: 0, water: 0 },
    { month: "Mar", energy: 0, water: 0 },
  ];

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>Monthly energy and water trends.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} stroke="hsl(var(--chart-1))" />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} stroke="hsl(var(--chart-2))" />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="energy" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} yAxisId="left" />
              <Bar dataKey="water" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} yAxisId="right" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}