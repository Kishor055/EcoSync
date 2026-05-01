'use client';

import WelcomeHeader from "@/components/dashboard/welcome-header";
import { SustainabilityScore } from "@/components/dashboard/sustainability-score";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ApplianceUsage } from "@/components/dashboard/appliance-usage";
import { AiTips } from "@/components/dashboard/ai-tips";
import { useUser, useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appliance, UsageData } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  
  const appliancesPath = user ? `users/${user.uid}/appliances` : null;
  const { data: appliances, loading: appliancesLoading } = useCollection<Appliance>(appliancesPath);

  const usageDataPath = user ? `users/${user.uid}/usageData` : null;
  const { data: usageData, loading: usageLoading } = useCollection<UsageData>(usageDataPath);

  if (userLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-64 col-span-2" />
          <Skeleton className="h-64 col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <>
      <WelcomeHeader name={user?.displayName || "Guest"} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <SustainabilityScore />
        <AiTips />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <UsageChart data={usageData.length > 0 ? usageData : []} />
        <ApplianceUsage appliances={appliances} />
      </div>
    </>
  );
}
