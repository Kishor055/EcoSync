"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { UsageData } from "@/lib/types";
import { cn } from "@/lib/utils";

// Performance Optimization: Dynamically import Recharts to reduce initial bundle size
const ResponsiveContainer = dynamic(() => import("recharts").then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import("recharts").then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then((mod) => mod.Area), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then((mod) => mod.CartesianGrid), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), { ssr: false });

const chartConfig = {
  energy: {
    label: "Energy (kWh)",
    color: "hsl(var(--chart-1))",
  },
  water: {
    label: "Water (gal)",
    color: "hsl(var(--chart-2))",
  },
};

interface UsageChartProps {
  data: UsageData[];
  className?: string;
}

function UsageChartComponent({ data, className }: UsageChartProps) {
  const displayData = useMemo(() => {
    return data.length > 0 ? data : [
      { month: "Jan", energy: 320, water: 1500 },
      { month: "Feb", energy: 290, water: 1400 },
      { month: "Mar", energy: 310, water: 1600 },
      { month: "Apr", energy: 280, water: 1300 },
      { month: "May", energy: 340, water: 1700 },
      { month: "Jun", energy: 370, water: 1900 },
    ];
  }, [data]);

  return (
    <Card className={cn("flex flex-col h-full glass-card border-none", className)}>
      <CardHeader className="pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Usage Intelligence</CardTitle>
            <CardDescription className="font-medium text-[10px] uppercase tracking-widest opacity-60">Real-time resource telemetry.</CardDescription>
          </div>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Energy</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Water</span>
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={15}
              axisLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold' }}
              tickFormatter={(value) => value.slice(0, 3).toUpperCase()}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0E1411', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1rem' }}
              itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: '900' }}
            />
            <Area 
              type="monotone" 
              dataKey="energy" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorEnergy)" 
              isAnimationActive={true}
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="water" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorWater)" 
              isAnimationActive={true}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export const UsageChart = React.memo(UsageChartComponent);