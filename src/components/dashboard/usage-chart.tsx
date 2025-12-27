"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Overview</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" />
            <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" />
            <ChartTooltip
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="energy" fill="var(--color-energy)" radius={4} yAxisId="left" />
            <Bar dataKey="water" fill="var(--color-water)" radius={4} yAxisId="right" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
