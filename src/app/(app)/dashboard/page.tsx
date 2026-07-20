
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
  Wind,
  BatteryCharging
} from "lucide-react";
import { useUser, useCollection } from "@/firebase";
import type { UsageData, Appliance } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SustainabilityScore = dynamic(() => import("@/components/dashboard/sustainability-score").then(mod => mod.SustainabilityScore), { 
  loading: () => <div className="h-full w-full bg-white/5 animate-pulse rounded-[4rem]" />,
  ssr: false 
});

const AreaChart = dynamic(() => import("recharts").then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import("recharts").then(mod => mod.Area), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });

export default function DashboardPage() {
  const { user } = useUser();
  const appliancesPath = useMemo(() => user?.uid ? `users/${user.uid}/appliances` : null, [user?.uid]);
  const { data: appliances } = useCollection<Appliance>(appliancesPath);
  
  const [isMounted, setIsMounted] = useState(false);
  const [sparkData, setSparkData] = useState<{val: number}[]>([]);

  useEffect(() => {
    setIsMounted(true);
    setSparkData(Array.from({ length: 7 }, () => ({ val: Math.floor(Math.random() * 40) + 10 })));
  }, []);

  const stats = useMemo(() => [
    { label: "Net Grid Load", value: "24.8 kWh", trend: "12% efficient", icon: Zap, color: "text-amber-400", isDown: true },
    { label: "Hydraulic Delta", value: "132 L", trend: "18% saved", icon: Droplets, color: "text-blue-400", isDown: true },
    { label: "Carbon Offset", value: "12.4 kg", trend: "15% increase", icon: Leaf, color: "text-primary", isDown: false },
  ], []);

  if (!isMounted) return null;

  return (
    <div className="flex-1 space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-3">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic">Command OS: <span className="eco-gradient-text">Sync</span></h1>
          <div className="flex items-center gap-5">
             <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.6em] italic opacity-80">
               Session: {user?.displayName?.split(' ')[0] || 'Architect'} • District_04 Authorized
             </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6">
           <Card className="glass-card border-none rounded-3xl p-6 flex items-center gap-6 bg-white/[0.03]">
              <div className="p-3 bg-primary/10 rounded-xl"><Wind className="h-5 w-5 text-primary" /></div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">AQI Level</p>
                 <p className="text-xl font-black italic">42 <span className="text-[9px] text-primary">Good</span></p>
              </div>
           </Card>
           <Card className="glass-card border-none rounded-3xl p-6 flex items-center gap-6 bg-white/[0.03]">
              <div className="p-3 bg-amber-500/10 rounded-xl"><CloudSun className="h-5 w-5 text-amber-500" /></div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Local Temp</p>
                 <p className="text-xl font-black italic">32°C</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10">
          {stats.map((stat, i) => (
            <Card key={i} className="glass-card rounded-[3.5rem] p-10 relative overflow-hidden group shadow-2xl tesla-shadow flex flex-col justify-between min-h-[300px]">
               <div className="flex justify-between items-start relative z-10">
                  <div className={`p-6 rounded-2xl bg-white/5 ${stat.color} border border-white/10`}><stat.icon className="h-8 w-8" /></div>
                  <Badge variant="outline" className="border-white/10 text-[9px] uppercase tracking-widest px-4 py-2 bg-white/5 font-black italic">Live Feed</Badge>
               </div>
               <div className="space-y-2 relative z-10 mt-6">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">{stat.label}</p>
                  <p className="text-5xl font-black text-white italic tracking-tighter">{stat.value}</p>
                  <div className="flex items-center gap-3 pt-6">
                    <div className="p-1.5 bg-primary/20 rounded-full">{stat.isDown ? <TrendingDown className="h-3 w-3 text-primary" /> : <TrendingUp className="h-3 w-3 text-primary" />}</div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">{stat.trend}</span>
                  </div>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={sparkData}>
                        <Area type="monotone" dataKey="val" stroke="currentColor" fill="currentColor" className={stat.color} strokeWidth={8} isAnimationActive={false} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </Card>
          ))}
        </div>
        <div className="xl:col-span-1"><SustainabilityScore /></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        <div className="xl:col-span-3">
          <Card className="glass-card rounded-[5rem] p-24 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden border-none shadow-2xl tesla-shadow">
             <div className="absolute inset-0 radial-glow opacity-60 pointer-events-none" />
             <div className="relative z-10 w-full flex flex-col items-center space-y-16">
                <div className="w-[32rem] h-[32rem] border-[4px] border-primary/20 rounded-full flex items-center justify-center relative animate-glow">
                   <div className="absolute inset-8 border border-primary/10 rounded-full animate-spin-slow opacity-20" />
                   <motion.div 
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="p-24 bg-primary/20 rounded-full border border-primary/40 backdrop-blur-3xl"
                   >
                      <Cpu className="h-32 w-32 text-primary drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                   </motion.div>
                   {[0, 120, 240].map((deg) => (
                     <div 
                        key={deg}
                        className="absolute h-10 w-10 bg-primary rounded-full shadow-[0_0_40px_rgba(16,185,129,1)] border-[6px] border-[#020403]"
                        style={{ transform: `rotate(${deg}deg) translateY(-160px)` }}
                     />
                   ))}
                </div>
                <div className="text-center space-y-4">
                   <p className="text-[12px] font-black text-primary uppercase tracking-[1em] animate-pulse italic">Digital Twin Synchronized</p>
                   <h2 className="text-6xl font-black italic uppercase tracking-tighter text-white">Infrastructure Optimal</h2>
                </div>
             </div>
          </Card>
        </div>
        <div className="xl:col-span-1">
          <Card className="glass-card rounded-[4rem] h-full p-10 border-none relative overflow-hidden shadow-2xl tesla-shadow flex flex-col space-y-10">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                   <Radar className="h-6 w-6 text-primary" />
                   <CardTitle className="text-[12px] font-black uppercase tracking-widest text-white italic">Guardian AI</CardTitle>
                </div>
                <Badge className="bg-primary/20 text-primary border-none px-6 py-2 text-[9px] font-black uppercase italic">Active</Badge>
             </div>
             <div className="space-y-8 flex-1">
                <div className="p-8 rounded-[2.5rem] bg-white/[0.04] border border-white/5 space-y-6 hover:border-primary/40 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary"><Zap className="h-5 w-5" /></div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Grid Arbitrage</p>
                   </div>
                   <p className="text-sm text-white/70 italic leading-relaxed">Shift EV Charging to <span className="text-primary font-black">01:00 AM</span> to reduce footprint by <span className="text-primary font-black">18%</span>.</p>
                   <Button variant="outline" className="w-full h-12 rounded-2xl border-primary/20 text-primary font-black uppercase tracking-widest text-[9px] hover:bg-primary/10">Apply Protocol</Button>
                </div>
                <div className="p-8 rounded-[2.5rem] bg-white/[0.04] border border-white/5 space-y-6 hover:border-amber-500/40 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500"><BatteryCharging className="h-5 w-5" /></div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Power Reserve</p>
                   </div>
                   <p className="text-sm text-white/70 italic leading-relaxed">Solar Array output is <span className="text-amber-500 font-black">+15%</span>. Recommending surplus storage sync.</p>
                   <Button variant="outline" className="w-full h-12 rounded-2xl border-amber-500/20 text-amber-500 font-black uppercase tracking-widest text-[9px] hover:bg-amber-500/10">Action Node</Button>
                </div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
