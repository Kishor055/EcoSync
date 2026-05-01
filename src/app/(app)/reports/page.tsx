'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUser, useCollection } from "@/firebase";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageData } from "@/lib/types";
import { BarChart3, Download, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const { user, loading: userLoading } = useUser();
  const usageDataPath = user ? `users/${user.uid}/usageData` : null;
  const { data: usageData, loading: usageLoading } = useCollection<UsageData>(usageDataPath);

  if (userLoading || usageLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  const totalEnergy = usageData.reduce((acc, curr) => acc + curr.energy, 0);
  const totalWater = usageData.reduce((acc, curr) => acc + curr.water, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Usage Reports</h1>
          <p className="text-muted-foreground">Comprehensive analysis of your home's resource consumption.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Energy (YTD)</CardDescription>
            <CardTitle className="text-2xl">{totalEnergy} kWh</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Water (YTD)</CardDescription>
            <CardTitle className="text-2xl">{totalWater} gal</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estimated Savings</CardDescription>
            <CardTitle className="text-2xl text-primary">-$124.50</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Efficiency Rank</CardDescription>
            <CardTitle className="text-2xl">Top 15%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <UsageChart 
        data={usageData.length > 0 ? usageData : []} 
        className="min-h-[400px] border-primary/10 shadow-md" 
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Detailed Breakdown
          </CardTitle>
          <CardDescription>Historical monthly data points.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Month</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Energy (kWh)</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Water (gal)</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {usageData.map((data, i) => (
                  <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{data.month}</td>
                    <td className="p-4 align-middle text-right">{data.energy}</td>
                    <td className="p-4 align-middle text-right">{data.water}</td>
                    <td className="p-4 align-middle text-right">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        Efficient
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
