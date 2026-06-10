'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { History, CheckCircle2, Zap } from "lucide-react";
import type { ActivityLog } from "@/lib/types";

interface ActivityFeedProps {
  activities: ActivityLog[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="shadow-xl border-none bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <History className="h-5 w-5 text-primary" />
          Impact History
        </CardTitle>
        <CardDescription>Your recent sustainability milestones.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground italic text-sm">
              No recent milestones. Start tracking to see your impact!
            </div>
          ) : (
            activities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex gap-4 group">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="absolute top-10 bottom-[-24px] left-1/2 w-px bg-border group-last:hidden" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold">{activity.description}</p>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-medium">EcoBoost Active</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}