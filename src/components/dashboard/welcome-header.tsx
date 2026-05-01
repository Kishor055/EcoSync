'use client';

import { Button } from "@/components/ui/button";
import { Download, Sparkles } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
}

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const firstName = name?.split(" ")[0] || "User";
  
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-2">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Hello, {firstName} <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Your home is performing <span className="text-primary font-bold">5% better</span> than last month. Keep it up!
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="hidden sm:flex bg-card hover:bg-muted transition-all">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
        <Button className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90">
          <Sparkles className="mr-2 h-4 w-4" />
          View Analysis
        </Button>
      </div>
    </div>
  );
}
