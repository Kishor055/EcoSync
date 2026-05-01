"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts";
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
import { cn } from "@/lib/utils";

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
  className?: string;
}

export function UsageChart({ data, className }: UsageChartProps) {
  const displayData = data.length > 0 ? data : [
    { month: "Jan", energy: 320, water: 1500 },
    { month: "Feb", energy: 290, water: 1400 },
    { month: "Mar", energy: 310, water: 1600 },
  ];

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <CardTitle>Usage Trends</CardTitle>
        <CardDescription>Monthly energy and water consumption comparison.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.5} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis 
                yAxisId="left" 
                tickLine={false} 
                axisLine={false} 
                tick={{fontSize: 10}}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                tickLine={false} 
                axisLine={false}
                tick={{fontSize: 10}}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                content={<ChartTooltipContent />}
              />
              <Legend />
              <Bar 
                dataKey="energy" 
                name="Energy (kWh)"
                fill="hsl(var(--chart-1))" 
                radius={[4, 4, 0, 0]} 
                yAxisId="left" 
                barSize={30}
              />
              <Bar 
                dataKey="water" 
                name="Water (gal)"
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]} 
                yAxisId="right" 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
