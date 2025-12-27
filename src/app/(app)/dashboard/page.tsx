import WelcomeHeader from "@/components/dashboard/welcome-header";
import { SustainabilityScore } from "@/components/dashboard/sustainability-score";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { ApplianceUsage } from "@/components/dashboard/appliance-usage";
import { AiTips } from "@/components/dashboard/ai-tips";
import { mockUser, mockAppliances, mockUsageData } from "@/lib/data";

export default function DashboardPage() {
  return (
    <>
      <WelcomeHeader name={mockUser.name} />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <SustainabilityScore />
        <AiTips />
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <UsageChart data={mockUsageData} />
        <ApplianceUsage appliances={mockAppliances} />
      </div>
    </>
  );
}
