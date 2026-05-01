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
import { Button } from "@/components/ui/button";
import { Lightbulb, Loader2, Sparkles, ChevronRight } from "lucide-react";
import { generateSustainabilityTips } from "@/ai/flows/generate-sustainability-tips";
import { useToast } from "@/hooks/use-toast";

const initialTips = [
    "Lower your water heater temperature to 120°F (49°C).",
    "Run your dishwasher and washing machine only with full loads.",
    "Unplug electronics when not in use to avoid 'phantom' energy loss."
];

export function AiTips() {
    const [tips, setTips] = useState<string[]>(initialTips);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerateTips = async () => {
        setIsLoading(true);
        try {
            const result = await generateSustainabilityTips({
                consumptionData: "Focus on water conservation and peak hour energy reduction for a high-efficiency home."
            });
            const newTips = result.tips.split('\n').filter(tip => tip.trim().length > 5).slice(0, 3);
            if (newTips.length > 0) setTips(newTips);
        } catch (error) {
            console.error("Failed to generate tips:", error);
            toast({
                variant: "destructive",
                title: "AI Service Busy",
                description: "Personalized suggestions are temporarily unavailable. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="lg:col-span-2 shadow-md border-primary/5 bg-gradient-to-br from-card to-muted/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Smart Optimization
                </CardTitle>
                <CardDescription>Hyper-personalized efficiency strategies</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3">
                    {tips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-background border border-primary/5 hover:border-primary/20 transition-all group">
                            <div className="bg-accent/10 p-2.5 rounded-lg group-hover:bg-accent/20 transition-colors">
                              <Lightbulb className="h-5 w-5 text-accent" />
                            </div>
                            <span className="text-sm font-medium text-foreground/80 flex-1">{tip.replace(/^[-\d.]+\s*/, '')}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateTips} disabled={isLoading} variant="outline" className="w-full bg-background hover:bg-muted font-bold tracking-tight">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                    {isLoading ? "Consulting AI..." : "Update Optimization Plan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
