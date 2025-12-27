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
import { Sparkles, Loader2 } from "lucide-react";
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { summarizeUsageReport, SummarizeUsageReportOutput } from "@/ai/flows/summarize-usage-report";
import { useToast } from "@/hooks/use-toast";

const chartData = [{ month: "june", score: 82, fill: "var(--color-chart-1)" }];
const chartConfig = {
  score: {
    label: "Score",
  },
  june: {
    label: "June",
    color: "hsl(var(--chart-1))",
  },
};

export function SustainabilityScore() {
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
    <Card className="flex flex-col lg:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sustainability Score</CardTitle>
        <CardDescription>Your score for June</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-full max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={270}
            innerRadius="70%"
            outerRadius="100%"
            barSize={20}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="fill-white dark:fill-black"
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            </PolarRadiusAxis>
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
      </CardContent>
      <div className="flex w-full items-center justify-center p-4">
        <div className="text-4xl font-bold font-headline">{chartData[0].score}<span className="text-xl text-muted-foreground">/100</span></div>
      </div>
      {summary && (
        <CardFooter className="flex-col gap-2 text-sm pt-4">
          <div className="leading-relaxed text-center">{summary.summary}</div>
        </CardFooter>
      )}
      <CardFooter className="flex-col gap-2 text-sm pt-4">
        <Button onClick={handleGenerateSummary} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing..." : (summary ? "Regenerate AI Summary" : "Generate AI Summary")}
        </Button>
      </CardFooter>
    </Card>
  );
}
