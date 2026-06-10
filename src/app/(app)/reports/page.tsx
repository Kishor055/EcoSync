'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useUser, useCollection } from "@/firebase";
import { UsageChart } from "@/components/dashboard/usage-chart";
import { Skeleton } from "@/components/ui/skeleton";
import type { UsageData } from "@/lib/types";
import { BarChart3, Download, Filter, TrendingDown, Zap, Droplets, Calendar, Sparkles, ArrowUpRight, Leaf, ShieldAlert, Activity, Globe, History, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function ReportsPage() {
  const { user, loading: userLoading } = useUser();
  const usageDataPath = user ? `users/${user.uid}/usageData` : null;
  const { data: usageData, loading: usageLoading } = useCollection<UsageData>(usageDataPath);

  if (userLoading || usageLoading) {
    return (
      <div className="space-y-12 pb-20">
        <Skeleton className="h-20 w-[400px] rounded-3xl" />
        <Skeleton className="h-[600px] w-full rounded-[4rem]" />
      </div>
    );
  }

  const totalEnergy = usageData.reduce((acc, curr) => acc + curr.energy, 0);
  const totalWater = usageData.reduce((acc, curr) => acc + (curr.water || 0), 0);
  const totalCarbon = usageData.reduce((acc, curr) => acc + (curr.carbonEmissions || (curr.energy * 0.45)), 0);
  
  // Predictive Forecast logic
  const projectedSavings = (totalCarbon * 0.15).toFixed(1);

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Impact Intelligence</h1>
          <p className="text-muted-foreground font-medium text-lg italic">Strategic carbon analytics and multi-year environmental trajectory.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 font-black uppercase tracking-widest text-[10px] gap-2">
            <Calendar className="h-4 w-4" /> Trajectory
          </Button>
          <Button className="h-14 px-10 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl gap-2">
            <Download className="h-4 w-4" /> Global Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Aggregate Carbon", value: `${totalCarbon.toFixed(1)} kg`, icon: Leaf, color: "text-primary", bg: "bg-primary/10" },
          { label: "Aggregate Energy", value: `${totalEnergy} kWh`, icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
          { label: "Predictive Saving", value: `${projectedSavings} kg`, icon: BrainCircuit, color: "text-emerald-400", bg: "bg-emerald-400/10" },
          { label: "Water Intensity", value: `${totalWater} L`, icon: Droplets, color: "text-blue-400", bg: "bg-blue-400/10" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card border-none rounded-[2.5rem] p-8 group relative overflow-hidden tesla-shadow">
               <div className="relative z-10 space-y-4">
                  <div className={`h-12 w-12 ${stat.bg} rounded-2xl flex items-center justify-center border border-white/5`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">{stat.label}</p>
                    <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
                  </div>
               </div>
               <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity">
                 <stat.icon className="h-24 w-24" />
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="glass-card border-none rounded-[4rem] p-12 h-full">
            <div className="flex items-center justify-between mb-12">
               <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <History className="h-5 w-5 text-primary" />
                     <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">Carbon Trajectory</CardTitle>
                  </div>
                  <CardDescription className="font-medium italic">Multi-variable month-over-month resource efficiency telemetry.</CardDescription>
               </div>
               <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic">Grid Impact: Optimized</Badge>
            </div>
            <div className="h-[450px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData.length > 0 ? usageData : [
                  { month: 'Jan', energy: 320, carbonEmissions: 144 },
                  { month: 'Feb', energy: 280, carbonEmissions: 126 },
                  { month: 'Mar', energy: 310, carbonEmissions: 139 },
                  { month: 'Apr', energy: 270, carbonEmissions: 121 },
                  { month: 'May', energy: 340, carbonEmissions: 153 },
                  { month: 'Jun', energy: 300, carbonEmissions: 135 },
                ]}>
                  <defs>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'black' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0C110E', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '1.5rem', padding: '1.5rem' }}
                    itemStyle={{ color: '#10B981', fontWeight: 'black', fontSize: '10px', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="carbonEmissions" stroke="#10B981" strokeWidth={5} fillOpacity={1} fill="url(#colorCarbon)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          <Card className="glass-card border-none rounded-[3.5rem] p-12 bg-gradient-to-br from-primary/10 to-transparent space-y-10 tesla-shadow">
            <div className="space-y-3">
               <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Carbon Roadmap</p>
               </div>
               <CardTitle className="text-3xl font-black italic uppercase tracking-tighter leading-tight">Zero-Waste Strategic Plan</CardTitle>
            </div>
            
            <div className="space-y-8">
              {[
                { label: "Target: Zero Waste", progress: 82, color: "bg-primary" },
                { label: "Grid Independence", progress: 64, color: "bg-amber-500" },
                { label: "Resource Synergy", progress: 45, color: "bg-blue-400" },
              ].map((goal, i) => (
                <div key={i} className="space-y-5">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                    <span>{goal.label}</span>
                    <span className={goal.color.replace('bg-', 'text-')}>{goal.progress}% Synergy</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${goal.progress}%` }} 
                      className={`h-full ${goal.color} rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]`} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <Separator className="bg-white/5" />

            <div className="p-10 rounded-[3rem] bg-white/[0.04] border border-white/5 space-y-6 group hover:border-primary/40 transition-all shadow-xl">
               <div className="flex items-center gap-4">
                 <BrainCircuit className="h-6 w-6 text-primary" />
                 <span className="text-[11px] font-black uppercase tracking-[0.3em] italic">EcoSync Forecast</span>
               </div>
               <p className="text-[13px] font-medium leading-relaxed italic text-white/80">
                 "Predicted carbon offset for <span className="text-primary font-black">Q4 2024</span>: <span className="text-white font-black">240 kg CO₂e</span> through automated duty-cycle arbitrage."
               </p>
               <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-primary gap-3 group-hover:gap-5 transition-all">
                 Establish Roadmap <ArrowUpRight className="h-4 w-4" />
               </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
