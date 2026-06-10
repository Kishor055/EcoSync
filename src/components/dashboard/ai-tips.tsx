
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
import { Lightbulb, Loader2, Sparkles, ChevronRight, Zap } from "lucide-react";
import { generateSustainabilityTips } from "@/ai/flows/generate-sustainability-tips";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const initialTips = [
    "Lower water heater temp to 120°F.",
    "Run full dishwasher loads only.",
    "Unplug electronics to avoid phantom loss."
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
                title: "Intelligence Offline",
                description: "EcoSync AI core is temporarily busy.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="glass-card border-none rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
               <Sparkles className="h-12 w-12 text-primary" />
            </div>
            <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-primary/20 rounded-xl">
                      <Zap className="h-4 w-4 text-primary" />
                   </div>
                   <CardTitle className="text-xl font-black italic uppercase tracking-tighter">Intelligence Feed</CardTitle>
                </div>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Hyper-personalized optimization</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={tips.join(',')}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {tips.map((tip, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors">
                              <Lightbulb className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-tight text-white/80 flex-1 leading-tight">{tip.replace(/^[-\d.]+\s*/, '')}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
            </CardContent>
            <CardFooter className="px-8 pb-8">
                <Button onClick={handleGenerateTips} disabled={isLoading} className="w-full h-12 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : <Sparkles className="mr-2 h-4 w-4 text-primary" />}
                    {isLoading ? "Consulting AI..." : "Recalibrate Plan"}
                </Button>
            </CardFooter>
        </Card>
    );
}
