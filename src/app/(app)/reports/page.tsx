'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUser, useCollection } from "@/firebase";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageData } from "@/lib/types";
import { BarChart3, Download, Filter, TrendingDown, Zap, Droplets, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const averageEnergy = usageData.length ? (totalEnergy / usageData.length).toFixed(1) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Usage Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your home's resource efficiency over time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-card">
            <Filter className="mr-2 h-4 w-4" />
            Time Range
          </Button>
          <Button variant="default" size="sm" className="shadow-lg">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1 font-medium">
              <Zap className="h-3 w-3 text-primary" /> Total Energy
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{totalEnergy} <span className="text-sm font-normal text-muted-foreground">kWh</span></CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1 font-medium">
              <Droplets className="h-3 w-3 text-blue-500" /> Total Water
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{totalWater} <span className="text-sm font-normal text-muted-foreground">gal</span></CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1 font-medium text-primary">
              <TrendingDown className="h-3 w-3" /> Efficiency Gain
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">+12.4%</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1 font-medium">
              <Calendar className="h-3 w-3" /> Avg. Monthly
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{averageEnergy} <span className="text-sm font-normal text-muted-foreground">kWh</span></CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UsageChart 
            data={usageData.length > 0 ? usageData : []} 
            className="min-h-[450px] border-primary/10 shadow-lg" 
          />
        </div>
        <Card className="lg:col-span-1 border-primary/10 bg-muted/5">
          <CardHeader>
            <CardTitle className="text-lg">Resource Summary</CardTitle>
            <CardDescription>Year-to-date performance against your goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Energy Goal (400kWh)</span>
                <span className="text-muted-foreground">92% reached</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[92%] transition-all duration-1000" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Water Goal (2000gal)</span>
                <span className="text-muted-foreground">75% reached</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[75%] transition-all duration-1000" />
              </div>
            </div>
            <Separator className="my-4" />
            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 italic text-sm text-muted-foreground">
              "You are on track to save approximately $450 in utility costs this year if current trends continue."
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Data Points
            </CardTitle>
            <CardDescription>A granular look at your historical consumption data.</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Month</th>
                  <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Energy (kWh)</th>
                  <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Water (gal)</th>
                  <th className="h-12 px-4 text-right align-middle font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Efficiency Status</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {usageData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-muted-foreground italic">No historical data found.</td>
                  </tr>
                ) : (
                  usageData.map((data, i) => (
                    <tr key={i} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle font-bold text-foreground">{data.month}</td>
                      <td className="p-4 align-middle text-right font-mono font-medium">{data.energy}</td>
                      <td className="p-4 align-middle text-right font-mono font-medium text-blue-600">{data.water}</td>
                      <td className="p-4 align-middle text-right">
                        <Badge variant={data.energy < 300 ? "default" : "secondary"} className="font-bold">
                          {data.energy < 300 ? "High Efficiency" : "Standard"}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
