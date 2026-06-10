'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Card, CardTitle } from "@/components/ui/card";
import { 
  Leaf, 
  Droplets, 
  Zap,
  CloudSun,
  TrendingUp,
  TrendingDown,
  Cpu,
  Radar,
  AlertCircle,
  Star,
  Trophy,
  Flame,
} from "lucide-react";
import { useUser, useCollection } from "@/firebase";
import type { UsageData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Performance Optimization: Dynamic imports for heavier components
const UsageChart = dynamic(() => import("@/components/dashboard/usage-chart").then(mod => mod.UsageChart), { 
  loading: () => <div className="h-[400px] w-full bg-white/5 animate-pulse rounded-[4.5rem]" />,
  ssr: false 
});

const SustainabilityScore = dynamic(() => import("@/components/dashboard/sustainability-score").then(mod => mod.SustainabilityScore), { 
  loading: () => <div className="h-full w-full bg-white/5 animate-pulse rounded-[4rem]" />,
  ssr: false 
});

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

const initialSparklineData = [
  { val: 12 }, { val: 28 }, { val: 18 }, { val: 34 }, { val: 22 }, { val: 45 }, { val: 38 }
];

export default function DashboardPage() {
  const { user } = useUser();
  const usagePath = useMemo(() => user?.uid ? `users/${user.uid}/usageData` : null, [user?.uid]);
  const { data: usageData } = useCollection<UsageData>(usagePath);
  const [isMounted, setIsMounted] = useState(false);
  const [sparkData, setSparkData] = useState(initialSparklineData);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setSparkData(prev => {
        const next = [...prev.slice(1), { val: Math.floor(Math.random() * 50) + 10 }];
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalCarbon = useMemo(() => {
    return usageData?.reduce((acc, curr) => acc + (curr.carbonEmissions || (curr.energy * 0.45)), 0) || 128.4;
  }, [usageData]);

  const stats = useMemo(() => [
    { label: "Net Grid Load", value: "24.8 kWh", trend: "12% efficient", icon: Zap, color: "text-amber-400", isDown: true },
    { label: "Hydraulic Delta", value: "132 L", trend: "18% saved", icon: Droplets, color: "text-blue-400", isDown: true },
    { label: "Carbon Offset", value: `${(totalCarbon / 10).toFixed(1)} kg`, trend: "15% increase", icon: Leaf, color: "text-primary", isDown: false },
  ], [totalCarbon]);

  if (!isMounted) {
    return (
      <div className="flex-1 space-y-12 pb-24 min-h-screen bg-[#020403] p-12">
        <div className="h-20 w-1/3 bg-white/5 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[4rem]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 will-change-transform">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white flex flex-wrap items-center gap-6 italic uppercase leading-none">
            Command OS: <span className="eco-gradient-text">Authorized</span>
          </h1>
          <div className="flex items-center gap-5 pl-1">
             <div className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_20px_rgba(16,185,129,1)]" />
             <p className="text-muted-foreground text-[12px] font-black uppercase tracking-[0.7em] opacity-90 italic">
               Secure Session Active • Core Sync: {user?.displayName?.split(' ')[0] || 'Architect'}
             </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-12 text-[12px] font-black text-white bg-white/[0.03] px-12 py-7 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-2xl tesla-shadow">
             <div className="flex items-center gap-6 border-r border-white/10 pr-12">
                <Radar className="h-7 w-7 text-primary animate-pulse" />
                <span className="uppercase tracking-[0.6em] text-[10px]">Grid Status</span>
             </div>
             <div className="flex items-center gap-6">
                <CloudSun className="h-8 w-8 text-amber-500" />
                <span className="tracking-[0.4em] font-black italic text-3xl">32°C</span>
                <span className="opacity-40 tracking-[0.6em] uppercase text-[9px]">District_04</span>
             </div>
          </div>
        </div>
      </div>

      {/* Hero Stats Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, i) => (
            <Card key={i} className="glass-card rounded-[4rem] p-10 relative overflow-hidden group border-none min-h-[320px] flex flex-col justify-between shadow-2xl tesla-shadow will-change-transform">
               <div className="flex justify-between items-start relative z-10">
                  <div className={`p-6 rounded-[2.2rem] bg-white/5 ${stat.color} border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                     <stat.icon className="h-9 w-9" />
                  </div>
                  <Badge variant="outline" className="border-white/20 text-[10px] uppercase tracking-[0.4em] px-5 py-2.5 bg-white/5 font-black italic">Live Telemetry</Badge>
               </div>
               <div className="space-y-3 relative z-10 mt-8">
                  <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.5em] mb-2 italic opacity-60">{stat.label}</p>
                  <p className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">{stat.value}</p>
                  <div className="flex items-center gap-5 pt-8">
                    <div className="p-2.5 bg-primary/15 rounded-full border border-primary/25 shadow-inner">
                       {stat.isDown ? <TrendingDown className="h-4 w-4 text-primary" /> : <TrendingUp className="h-4 w-4 text-primary" />}
                    </div>
                    <span className="text-[12px] font-black text-primary uppercase tracking-[0.4em] italic">{stat.trend}</span>
                  </div>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30 pointer-events-none translate-y-4 group-hover:opacity-60 transition-opacity duration-700">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={sparkData}>
                        <Area type="monotone" dataKey="val" stroke="currentColor" fill="currentColor" className={stat.color} strokeWidth={10} isAnimationActive={false} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </Card>
          ))}
        </div>

        <div className="xl:col-span-1">
          <SustainabilityScore />
        </div>
      </div>

      {/* Main Digital Twin & Alert Console Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3">
          <Card className="glass-card rounded-[5rem] p-12 md:p-24 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden border-none group shadow-2xl tesla-shadow will-change-transform">
             <div className="absolute inset-0 radial-glow opacity-100 pointer-events-none" />
             <div className="relative z-10 w-full flex flex-col items-center justify-center space-y-20">
                <div className="w-[24rem] h-[24rem] md:w-[38rem] md:h-[38rem] border-[6px] border-primary/20 rounded-full flex items-center justify-center relative animate-glow">
                   <div className="absolute inset-10 border-2 border-primary/15 rounded-full animate-spin-slow opacity-40" />
                   <div className="absolute inset-24 border-2 border-primary/10 rounded-full animate-spin-slow opacity-20" style={{ animationDirection: 'reverse' }} />
                   
                   <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="p-20 md:p-28 bg-primary/20 rounded-full border-[6px] border-primary/40 backdrop-blur-3xl shadow-[0_0_150px_rgba(16,185,129,0.5)]"
                   >
                      <Cpu className="h-28 w-28 md:h-40 md:w-40 text-primary drop-shadow-[0_0_20px_rgba(16,185,129,1)]" />
                   </motion.div>

                   {[0, 90, 180, 270].map((deg) => (
                     <div 
                        key={deg}
                        className="absolute h-10 w-10 md:h-14 md:w-14 bg-primary rounded-full shadow-[0_0_50px_rgba(16,185,129,1)] border-[8px] border-[#020403] transition-all duration-500 hover:scale-150 cursor-pointer"
                        style={{ transform: `rotate(${deg}deg) translateY(-190px)` }}
                     >
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden md:block">
                           <Badge className="bg-primary/30 text-primary text-[12px] border-none px-8 py-3 font-black uppercase tracking-widest italic tesla-shadow">NODE_{deg}_ACTIVE</Badge>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="text-center space-y-6">
                   <p className="text-[16px] md:text-[20px] font-black text-primary uppercase tracking-[0.8em] md:tracking-[1.5em] animate-pulse italic">Digital Twin Synchronized</p>
                   <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">Infrastructure Operational</h2>
                </div>
             </div>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="glass-card rounded-[4rem] h-full p-10 md:p-12 border-none relative overflow-hidden shadow-2xl tesla-shadow flex flex-col bg-white/[0.02]">
             <div className="flex items-center justify-between mb-12 relative z-10">
                <div className="flex items-center gap-5">
                   <Radar className="h-7 w-7 text-primary" />
                   <CardTitle className="text-[14px] font-black uppercase tracking-[0.8em] text-white/80 italic leading-none">Guardian AI</CardTitle>
                </div>
                <Badge className="bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border-none px-8 py-3 italic shadow-inner">Active</Badge>
             </div>
             
             <div className="space-y-10 relative z-10 flex-1 overflow-y-auto no-scrollbar">
                <div className="p-10 rounded-[3.5rem] bg-white/[0.05] border border-white/10 space-y-8 group hover:border-primary/50 transition-all duration-500 shadow-2xl">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-primary/20 rounded-2xl text-primary border border-primary/30 shadow-inner"><Zap className="h-6 w-6" /></div>
                      <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">Adaptive Logic</p>
                   </div>
                   <p className="text-[16px] text-white/90 leading-relaxed italic font-medium">Shift Laundry to <span className="text-primary font-black">23:00</span> to bypass peak tariffs and reduce load by <span className="text-primary font-black">22%</span>.</p>
                   <Button variant="outline" className="w-full h-16 rounded-[2.5rem] border-primary/30 text-primary text-[11px] font-black uppercase tracking-[0.5em] hover:bg-primary/20 transition-all duration-300">Deploy Strategy</Button>
                </div>
                
                <div className="p-10 rounded-[3.5rem] bg-white/[0.05] border border-white/10 space-y-8 group hover:border-amber-600/50 transition-all duration-500 shadow-2xl">
                   <div className="flex items-center gap-6">
                      <div className="p-5 bg-amber-600/20 rounded-2xl text-amber-500 border border-amber-600/30 shadow-inner"><AlertCircle className="h-6 w-6" /></div>
                      <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] italic">Predictive Alert</p>
                   </div>
                   <p className="text-[16px] text-white/90 leading-relaxed italic font-medium">Compressor Node detects <span className="text-amber-500 font-black">Thermal Spike</span>. Maintenance recommended in <span className="text-amber-500 font-black">72 Hours</span>.</p>
                   <Button variant="outline" className="w-full h-16 rounded-[2.5rem] border-amber-600/30 text-amber-500 text-[11px] font-black uppercase tracking-[0.5em] hover:bg-amber-600/20 transition-all duration-300">Action Node</Button>
                </div>
             </div>
          </Card>
        </div>
      </div>

      {/* Footer Achievement Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
           <Card className="glass-card rounded-[3.5rem] p-12 space-y-6 border-none hover:translate-y-[-8px] transition-all duration-500 group tesla-shadow shadow-2xl bg-white/[0.02]">
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.6em] italic group-hover:text-primary transition-colors">Impact Score</p>
              <div className="flex items-end gap-6">
                 <Leaf className="h-12 w-12 text-primary drop-shadow-[0_0_25px_rgba(16,185,129,0.8)]" />
                 <p className="text-6xl font-black italic tracking-tighter text-white">1,250 <span className="text-[14px] opacity-40">PTS</span></p>
              </div>
           </Card>
           
           <Card className="glass-card rounded-[3.5rem] p-12 flex flex-row items-center gap-10 border-none hover:translate-y-[-8px] transition-all duration-500 group tesla-shadow shadow-2xl bg-white/[0.02]">
              <div className="h-20 w-20 rounded-full bg-orange-600/20 flex items-center justify-center border border-orange-600/30 shadow-xl">
                 <Flame className="h-11 w-11 text-orange-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                 <p className="text-6xl font-black italic tracking-tighter text-white leading-none">7</p>
                 <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Day Streak</p>
              </div>
           </Card>

           <Card className="glass-card rounded-[3.5rem] p-12 flex flex-row items-center gap-10 border-none hover:translate-y-[-8px] transition-all duration-500 group tesla-shadow shadow-2xl bg-white/[0.02]">
              <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center border border-primary/25 shadow-xl">
                 <Star className="h-11 w-11 text-primary" />
              </div>
              <p className="text-[12px] font-black text-muted-foreground uppercase tracking-[0.5em] italic leading-tight">Impact Deck<br/><span className="text-primary">Master Tier</span></p>
           </Card>

           <Card className="glass-card rounded-[3.5rem] p-12 flex flex-row items-center gap-10 border-none hover:translate-y-[-8px] transition-all duration-500 group tesla-shadow shadow-2xl bg-white/[0.02]">
              <div className="h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center border border-primary/25 shadow-xl">
                 <Trophy className="h-11 w-11 text-primary" />
              </div>
              <div className="space-y-2">
                 <p className="text-5xl font-black italic tracking-tighter text-white leading-none">#128</p>
                 <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">District Rank</p>
              </div>
           </Card>
      </div>
    </div>
  );
}
