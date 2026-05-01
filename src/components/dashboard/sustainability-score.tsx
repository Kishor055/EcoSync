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
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { summarizeUsageReport, SummarizeUsageReportOutput } from "@/ai/flows/summarize-usage-report";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const chartData = [{ month: "current", score: 82, fill: "var(--color-chart-1)" }];
const chartConfig = {
  score: {
    label: "Score",
  },
  current: {
    label: "Overall",
    color: "hsl(var(--chart-1))",
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
        title: "Error",
        description: "Failed to generate sustainability summary. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Eco Score</CardTitle>
        <CardDescription>Your performance this month</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[200px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={15}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="fill-muted/20"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} />
            <RadialBar
              dataKey="score"
              background={{ fill: "hsl(var(--muted))" }}
              cornerRadius={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="absolute flex flex-col items-center justify-center mt-[-10px]">
          <span className="text-4xl font-bold font-headline">{chartData[0].score}</span>
          <span className="text-xs text-muted-foreground uppercase font-semibold">Points</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col gap-2 p-4 bg-muted/50 mt-4 rounded-b-lg">
        {summary ? (
          <div className="text-sm leading-relaxed mb-4 text-center italic">
            "{summary.summary}"
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
             <TrendingUp className="h-3 w-3" />
             Trending 5% better than last month
          </div>
        )}
        <Button 
          onClick={handleGenerateSummary} 
          disabled={isLoading} 
          className="w-full shadow-lg"
          variant={summary ? "outline" : "default"}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : (summary ? "Refresh Insight" : "Get AI Insights")}
        </Button>
      </CardFooter>
    </Card>
  );
}
