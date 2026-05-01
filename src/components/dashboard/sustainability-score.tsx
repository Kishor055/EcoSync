"use client";

import { useState } from "react";
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

const chartData = [{ month: "current", score: 82, fill: "hsl(var(--primary))" }];
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
  const [summary, setSummary] = useState<SummarizeUsageReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeUsageReport({
        energyUsage: 370,
        waterUsage: 1900,
        averageTemperature: 75,
        usageTrends: "AC unit usage is high during the day. Dishwasher is run daily.",
        conservationTips: "User has been turning off lights when leaving rooms.",
      });
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        variant: "destructive",
        title: "AI Service Busy",
        description: "The AI analyst is currently overloaded. Please try again in a few seconds.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col h-full border-primary/10 shadow-lg relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Leaf className="h-24 w-24 text-primary rotate-12" />
      </div>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-bold">Eco Score</CardTitle>
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
          <span className="text-5xl font-extrabold tracking-tighter text-primary">{chartData[0].score}</span>
          <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Eco Points</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col gap-3 p-6 bg-muted/30 mt-4">
        {summary ? (
          <div className="text-sm leading-relaxed text-center font-medium text-foreground/80 bg-background/50 p-3 rounded-lg border border-primary/5">
            "{summary.summary}"
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
             <Sparkles className="h-4 w-4" />
             AI Analyst: Peak Efficiency Detected
          </div>
        )}
        <Button 
          onClick={handleGenerateSummary} 
          disabled={isLoading} 
          className="w-full shadow-md hover:shadow-lg transition-all"
          variant={summary ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : (summary ? "Refresh Analysis" : "Get AI Insights")}
        </Button>
      </CardFooter>
    </Card>
  );
}
