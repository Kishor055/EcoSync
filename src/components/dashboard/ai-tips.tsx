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
import { Lightbulb, Loader2 } from "lucide-react";
import { generateSustainabilityTips, SustainabilityTipsOutput } from "@/ai/flows/generate-sustainability-tips";
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
                consumptionData: "High AC usage during peak hours, frequent small laundry loads."
            });
            // Simple parsing of the returned string. A real app might get a structured list.
            const newTips = result.tips.split('\n').filter(tip => tip.trim().length > 0);
            setTips(newTips);

        } catch (error) {
            console.error("Failed to generate tips:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate new tips. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Optimization Suggestions</CardTitle>
                <CardDescription>Personalized tips to help you save.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 mt-1 shrink-0 text-accent" />
                            <span className="text-sm text-muted-foreground">{tip.replace(/^- /, '')}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateTips} disabled={isLoading} variant="outline" className="w-full">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isLoading ? "Generating..." : "Get New AI Tips"}
                </Button>
            </CardFooter>
        </Card>
    );
}