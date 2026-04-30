'use client';

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface WelcomeHeaderProps {
  name: string;
}

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const firstName = name?.split(" ")[0] || "User";
  
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's a look at your home's sustainability performance for this month.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="hidden sm:flex">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
        <Button className="w-full sm:w-auto">
          View Detailed Reports
        </Button>
      </div>
    </div>
  );
}