'use client';

import WelcomeHeader from "@/components/dashboard/welcome-header";
import { SustainabilityScore } from "@/components/dashboard/sustainability-score";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ApplianceUsage } from "@/components/dashboard/appliance-usage";
import { AiTips } from "@/components/dashboard/ai-tips";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { SustainabilityChat } from "@/components/ai/sustainability-chat";
import { useUser, useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appliance, UsageData, ActivityLog } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  
  // Use null paths when user is loading to avoid "empty path" errors
  const appliancesPath = user?.uid ? `users/${user.uid}/appliances` : null;
  const { data: appliances, loading: appliancesLoading } = useCollection<Appliance>(appliancesPath);

  const usageDataPath = user?.uid ? `users/${user.uid}/usageData` : null;
  const { data: usageData, loading: usageLoading } = useCollection<UsageData>(usageDataPath);

  const activitiesPath = user?.uid ? `users/${user.uid}/activities` : null;
  const { data: activities } = useCollection<ActivityLog>(activitiesPath);

  if (userLoading) {
    return (
      <div className="space-y-8 p-4 max-w-7xl mx-auto">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-[450px] rounded-2xl" />
          <Skeleton className="h-[450px] lg:col-span-2 rounded-2xl" />
        </div>
        <div className="grid gap-8 lg:grid-cols-4">
          <Skeleton className="h-[300px] lg:col-span-3 rounded-2xl" />
          <Skeleton className="h-[300px] lg:col-span-1 rounded-2xl" />
        </div>
      </div>
    );
  }

  const welcomeName = user?.isAnonymous ? "Guest" : (user?.displayName || "User");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 max-w-7xl mx-auto">
      <WelcomeHeader name={welcomeName} />
      
      <div className="grid gap-8 lg:grid-cols-3 items-stretch">
        <SustainabilityScore className="lg:col-span-1" />
        <UsageChart data={usageData} className="lg:col-span-2" />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <AiTips />
            <ActivityFeed activities={activities || []} />
          </div>
          <ApplianceUsage appliances={appliances} />
        </div>
        <div className="lg:col-span-1">
          <SustainabilityChat />
        </div>
      </div>
    </div>
  );
}
