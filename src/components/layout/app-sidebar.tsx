'use client';

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NAVIGATION_LINKS, INTELLIGENCE_LINKS, SYSTEM_LINKS } from "@/lib/navigation";

function AppSidebarComponent() {
  const pathname = usePathname();
  const { user } = useUser();

  // Memoize navigation groups to prevent unnecessary re-renders
  const protocolNav = useMemo(() => NAVIGATION_LINKS.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all group relative overflow-hidden",
          isActive 
            ? "bg-primary/15 text-primary border border-primary/20" 
            : "text-muted-foreground hover:bg-white/10 hover:text-white"
        )}
      >
        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1.5 bg-primary rounded-full" />}
        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "opacity-60 group-hover:opacity-100 group-hover:text-primary")} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{item.name}</span>
      </Link>
    );
  }), [pathname]);

  const intelligenceNav = useMemo(() => INTELLIGENCE_LINKS.map((item) => (
    <Link key={item.name} href={item.href} className="flex items-center gap-4 px-5 py-4 rounded-2xl text-muted-foreground hover:bg-white/10 hover:text-white transition-all group">
      <item.icon className="h-5 w-5 opacity-60 group-hover:opacity-100 group-hover:text-primary" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{item.name}</span>
    </Link>
  )), []);

  const systemNav = useMemo(() => SYSTEM_LINKS.map((item) => {
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center gap-4 rounded-2xl px-5 py-4 transition-all group",
          isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-white/10"
        )}
      >
        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "opacity-60")} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">{item.name}</span>
      </Link>
    );
  }), [pathname]);

  return (
    <aside className="flex flex-col w-[280px] h-screen bg-[#070908] border-r border-white/10 z-50 overflow-hidden">
      <div className="p-10">
        <Link href="/dashboard" className="flex items-center gap-4 group">
          <div className="h-12 w-12 bg-primary/15 rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-all">
            <Leaf className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-0.5">
            <span className="text-xl font-black tracking-tighter text-white uppercase italic">EcoSync AI</span>
            <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.5em] italic opacity-70">Command Core</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-6 no-scrollbar space-y-10">
        <nav className="space-y-1.5">
          <p className="px-5 mb-4 text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 italic">Protocol</p>
          {protocolNav}
        </nav>

        <div>
           <p className="px-5 mb-4 text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/40 italic">Intelligence</p>
           <nav className="space-y-1.5">
              {intelligenceNav}
              {systemNav}
           </nav>
        </div>
      </div>

      <div className="p-8 mt-auto">
        <div className="glass-card rounded-[2.5rem] p-6 space-y-6 border-none bg-white/[0.03] tesla-shadow">
          <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-4">
              <Avatar className="h-11 w-11 ring-2 ring-primary/30">
                <AvatarFallback className="bg-primary/15 text-primary font-black uppercase italic">
                  {user?.displayName?.charAt(0) || 'E'}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-[11px] font-black uppercase tracking-tight text-white truncate">{user?.displayName || 'Eco Architect'}</p>
                <p className="text-[9px] font-black text-primary uppercase tracking-widest italic opacity-90">Impact Tier 4</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
               <span className="text-muted-foreground/70">Eco DNA</span>
               <span className="text-primary">92.4</span>
            </div>
            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
               <div className="h-full bg-primary w-[92%] shadow-[0_0_15px_rgba(16,185,129,0.7)]" />
            </div>
            <div className="flex items-center gap-3 justify-center pt-2">
               <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.5em]">System Synced</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default React.memo(AppSidebarComponent);