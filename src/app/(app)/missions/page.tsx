
'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Zap, Droplets, Users, Trophy, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useUser } from '@/firebase';

const missions = [
  {
    id: 'mission-1',
    title: 'Grid Independence Phase 1',
    description: 'Reduce peak-hour energy consumption by 20% for 7 consecutive days.',
    reward: 500,
    progress: 65,
    type: 'energy',
    deadline: '3 days left',
    icon: Zap,
    color: 'text-amber-400'
  },
  {
    id: 'mission-2',
    title: 'Hydraulic Synergy',
    description: 'Optimize washing machine cycles to save 100 gallons of water this month.',
    reward: 350,
    progress: 40,
    type: 'water',
    deadline: '12 days left',
    icon: Droplets,
    color: 'text-blue-400'
  },
  {
    id: 'mission-3',
    title: 'Community Catalyst',
    description: 'List 3 hardware assets in the marketplace to foster circular economy.',
    reward: 750,
    progress: 33,
    type: 'community',
    deadline: 'No deadline',
    icon: Users,
    color: 'text-primary'
  }
];

export default function MissionsPage() {
  const { user } = useUser();

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Eco Missions</h1>
          <p className="text-muted-foreground font-medium text-lg italic">Tactical sustainability challenges and impact-based rewards.</p>
        </div>
        <div className="p-8 glass-card rounded-[2.5rem] flex items-center gap-6 border-none tesla-shadow">
           <Trophy className="h-10 w-10 text-amber-500" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Rank</p>
              <p className="text-2xl font-black italic tracking-tighter">#128 <span className="text-xs text-primary font-black ml-2">+12 PTS</span></p>
           </div>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {missions.map((mission, idx) => (
          <motion.div 
            key={mission.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="glass-card border-none rounded-[3.5rem] overflow-hidden group hover:scale-[1.02] transition-all flex flex-col h-full shadow-2xl">
              <CardHeader className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-primary/40 transition-all">
                      <mission.icon className={`h-8 w-8 ${mission.color}`} />
                   </div>
                   <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px]">
                      +{mission.reward} PTS
                   </Badge>
                </div>
                <div className="space-y-2">
                   <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">{mission.title}</CardTitle>
                   <CardDescription className="font-medium text-muted-foreground/80 leading-relaxed italic">
                      {mission.description}
                   </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-10 flex-1 space-y-8">
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="text-primary">{mission.progress}%</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${mission.progress}%` }} 
                        className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      />
                   </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                   <Clock className="h-4 w-4" /> {mission.deadline}
                </div>
              </CardContent>

              <CardFooter className="p-10 pt-0">
                <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-black transition-all group">
                   Initialize Protocol <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="pt-12">
        <Card className="glass-card border-none rounded-[4rem] p-16 flex flex-col md:flex-row items-center gap-12 border-none tesla-shadow relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 opacity-50 blur-[120px]" />
           <div className="relative z-10 p-10 bg-primary/20 rounded-[3rem] border-2 border-primary/30 animate-glow">
              <ShieldCheck className="h-20 w-20 text-primary" />
           </div>
           <div className="relative z-10 flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                 <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary italic">AI Mission Oracle</p>
                 <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Seasonal: Zero-Emission Quest</h2>
              </div>
              <p className="text-xl font-medium italic text-muted-foreground leading-relaxed max-w-2xl">
                 Join 12,000 eco-warriors in our largest synchronization event. Shift your hardware duty cycles to maximize regional grid efficiency.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                 <Button className="h-16 px-12 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl">Join Global Fleet</Button>
                 <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[10px]">Strategic Report</Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
