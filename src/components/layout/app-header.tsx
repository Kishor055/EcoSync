
'use client';

import { Search, Bell, Menu, Cpu, CloudSun, Plus, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/firebase";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NAVIGATION_LINKS, INTELLIGENCE_LINKS } from "@/lib/navigation";

export default function AppHeader() {
  const { user } = userUser();
  const pathname = usePathname();

  return (
    <header className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8 bg-transparent sticky top-0 z-40 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-4 md:gap-12 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-white/80 hover:bg-white/5">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#070908] border-white/5 p-0 w-[280px]">
            <SheetHeader className="p-8 text-left">
              <SheetTitle className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Cpu className="h-6 w-6 text-primary" />
                 </div>
                 <span className="text-lg font-black italic uppercase tracking-tighter text-white">EcoSync AI</span>
              </SheetTitle>
            </SheetHeader>
            <div className="px-6 space-y-10 pb-20 overflow-y-auto no-scrollbar">
               <nav className="space-y-1.5">
                  <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Protocol</p>
                  {NAVIGATION_LINKS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all group",
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/10" 
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "opacity-50")} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{item.name}</span>
                      </Link>
                    );
                  })}
               </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative w-full max-w-[400px] group hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="search"
            placeholder="Search system..."
            className="w-full bg-white/5 border-white/5 pl-12 h-10 md:h-11 rounded-xl text-xs font-medium focus-visible:ring-primary/20 placeholder:text-muted-foreground/40"
          />
        </div>

        <div className="hidden xl:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
           <div className="flex items-center gap-3">
              <Wind className="h-4 w-4 text-primary" />
              <span className="text-white italic">AQI: 42</span>
           </div>
           <div className="flex items-center gap-3">
              <CloudSun className="h-4 w-4 text-amber-500" />
              <span className="text-white italic">32°C</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-4 px-4 h-11 bg-primary/10 border border-primary/20 rounded-xl group cursor-pointer hover:bg-primary/20 transition-all">
           <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Plus className="h-3 w-3 text-primary" />
           </div>
           <span className="text-[10px] font-black text-primary uppercase tracking-widest hidden sm:inline">AI Autopilot</span>
           <span className="text-[10px] font-black text-white uppercase opacity-40">Active</span>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl bg-white/5 border-white/10 relative hover:bg-white/10">
              <Bell className="h-5 w-5 text-white/60" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-red-500 rounded-full border-2 border-[#060807]" />
           </Button>
           <Avatar className="h-10 w-10 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-sm">
                {user?.displayName?.charAt(0) || 'A'}
              </AvatarFallback>
           </Avatar>
        </div>
      </div>
    </header>
  );
}
