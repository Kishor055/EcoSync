
'use client';

import { Search, Bell, Menu, Cpu, CloudSun, Plus } from "lucide-react";
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
  const { user } = useUser();
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
                 <span className="text-lg font-black italic uppercase tracking-tighter text-white">EcoSync Mobile</span>
              </SheetTitle>
            </SheetHeader>
            <div className="px-6 space-y-10 pb-20 overflow-y-auto no-scrollbar max-h-[calc(100vh-100px)]">
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
               <nav className="space-y-1.5">
                  <p className="px-4 mb-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/30 italic">Intelligence</p>
                  {INTELLIGENCE_LINKS.map((item) => (
                    <Link key={item.name} href={item.href} className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-muted-foreground hover:bg-white/5 transition-all group">
                      <item.icon className="h-5 w-5 opacity-50 group-hover:text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">{item.name}</span>
                    </Link>
                  ))}
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 text-[9px] font-black text-muted-foreground/40 bg-white/5">
             <span>⌘</span><span>K</span>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
           <div className="flex items-center gap-3">
              <CloudSun className="h-4 w-4 text-amber-500" />
              <span className="text-white italic">32°C</span>
              <span className="opacity-40">Delhi_NCR</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-2 md:gap-4 px-3 md:px-4 h-9 md:h-11 bg-primary/10 border border-primary/10 rounded-xl group cursor-pointer hover:bg-primary/20 transition-all">
           <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Plus className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary" />
           </div>
           <span className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest hidden sm:inline">AI Autopilot</span>
           <span className="text-[8px] md:text-[10px] font-black text-white uppercase opacity-40">Active</span>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
           <Button variant="outline" size="icon" className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white/5 border-white/10 relative hover:bg-white/10">
              <Bell className="h-4 w-4 md:h-5 md:h-5 text-white/60" />
              <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 h-1.5 w-1.5 md:h-2 md:w-2 bg-red-500 rounded-full border-2 border-[#060807]" />
           </Button>
           <div className="h-8 md:h-11 w-px bg-white/5 mx-1" />
           <div className="flex items-center gap-3 group cursor-pointer">
              <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-white/5 group-hover:ring-primary/40 transition-all">
                 <AvatarImage src={user?.photoURL || ''} />
                 <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-[10px] md:text-sm">
                   {user?.displayName?.charAt(0) || 'A'}
                 </AvatarFallback>
              </Avatar>
           </div>
        </div>
      </div>
    </header>
  );
}
