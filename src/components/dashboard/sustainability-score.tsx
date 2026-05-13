"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Leaf } from "lucide-react";
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { summarizeUsageReport, SummarizeUsageReportOutput } from "@/ai/flows/summarize-usage-report";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useUser, useCollection } from "@/firebase";
import type { Appliance } from "@/lib/types";

const chartConfig = {
  score: {
    label: "Score",
  },
  current: {
    label: "Overall",
    color: "hsl(var(--primary))",
  },
};

interface SustainabilityScoreProps {
  className?: string;
}

export function SustainabilityScore({ className }: SustainabilityScoreProps) {
  const { user } = useUser();
  const [summary, setSummary] = useState<SummarizeUsageReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const appliancesPath = user ? `users/${user.uid}/appliances` : null;
  const { data: appliances } = useCollection<Appliance>(appliancesPath);

  // Calculate dynamic metrics based on user's appliances
  const metrics = useMemo(() => {
    const totalEnergy = appliances.reduce((sum, app) => sum + (app.energyConsumption || 0), 0);
    const totalWater = appliances.reduce((sum, app) => sum + (app.waterConsumption || 0), 0);
    const score = Math.max(65, Math.min(95, 100 - (totalEnergy / 50))); // Simplified dynamic score
    return { totalEnergy, totalWater, score };
  }, [appliances]);

  const chartData = [{ month: "current", score: metrics.score, fill: "hsl(var(--primary))" }];

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeUsageReport({
        energyUsage: metrics.totalEnergy || 350,
        waterUsage: metrics.totalWater || 1800,
        averageTemperature: 72,
        usageTrends: appliances.length > 0 
          ? `User has ${appliances.length} appliances monitored. Largest consumer is ${appliances.sort((a,b) => b.energyConsumption - a.energyConsumption)[0]?.name}.`
          : "No specific appliances monitored yet.",
        conservationTips: "User is actively tracking consumption via dashboard.",
      });
      setSummary(result);
    } catch (error: any) {
      console.error("Failed to generate summary:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: error.message?.includes('demand') 
          ? "The AI model is currently busy. Please try again in a moment."
          : "Could not connect to the analysis service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card id="ai-analysis-section" className={cn("flex flex-col h-full border-primary/10 shadow-lg relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Leaf className="h-24 w-24 text-primary rotate-12" />
      </div>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold text-foreground">Eco Score</CardTitle>
        <CardDescription>Real-time performance rating</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[220px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius="75%"
            outerRadius="100%"
            barSize={18}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="fill-muted/40"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
            <RadialBar
              dataKey="score"
              background={{ fill: "hsl(var(--muted))" }}
              cornerRadius={12}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="absolute flex flex-col items-center justify-center pt-4">
          <span className="text-5xl font-extrabold tracking-tighter text-primary">{Math.round(metrics.score)}</span>
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Eco Points</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col gap-3 p-6 bg-muted/30 mt-4 border-t">
        {summary ? (
          <div className="text-sm leading-relaxed text-center font-medium text-foreground/80 bg-background/50 p-4 rounded-xl border border-primary/10 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            "{summary.summary}"
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 italic">
             <Sparkles className="h-4 w-4 animate-pulse" />
             AI Analyst: Data synchronization complete
          </div>
        )}
        <Button 
          onClick={handleGenerateSummary} 
          disabled={isLoading} 
          className="w-full shadow-md hover:shadow-lg transition-all font-bold"
          variant={summary ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing Data..." : (summary ? "Refresh Analysis" : "Get AI Insights")}
        </Button>
      </CardFooter>
    </Card>
  );
}
