
'use client';

import { Button } from "@/components/ui/button";
import { Download, Sparkles, FileText, UserCircle } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";

interface WelcomeHeaderProps {
  name: string;
}

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const { user } = useUser();
  const firstName = name?.split(" ")[0] || (user?.isAnonymous ? "Explorer" : "User");
  
  const handleScrollToAnalysis = () => {
    const element = document.getElementById('ai-analysis-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-2">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
          {user?.isAnonymous && <UserCircle className="h-8 w-8 text-primary opacity-50" />}
          Hello, {firstName} <span className="animate-pulse">👋</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          {user?.isAnonymous 
            ? "You are exploring EcoSync as a guest. Start tracking to see your impact!"
            : `Your home is performing 5% better than last month. Keep it up!`}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" asChild className="hidden sm:flex bg-card/10 border-white/5 hover:bg-white/5 transition-all">
          <Link href="/reports">
            <FileText className="mr-2 h-4 w-4" />
            View Reports
          </Link>
        </Button>
        <Button 
          onClick={handleScrollToAnalysis}
          className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all bg-primary hover:bg-primary/90 rounded-xl"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Quick Analysis
        </Button>
      </div>
    </div>
  );
}
