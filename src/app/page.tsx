'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldCheck, Globe, Zap, Users, Sparkles } from "lucide-react";
import { useAuth, useFirestore } from "@/firebase";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LandingPage() {
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const handleGuestAccess = async () => {
    setIsLoading(true);
    try {
      const authService = new AuthService(auth, db);
      await authService.loginAnonymously();
      router.push('/dashboard');
    } catch (error: any) {
      if (error.message.includes('Anonymous')) {
        setShowTroubleshoot(true);
      }
      toast({
        variant: "destructive",
        title: "Authorization Required",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px]" />
      </div>

      <header className="container mx-auto px-10 h-32 flex items-center justify-between relative z-50">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 shadow-[0_0_25px_rgba(16,185,129,0.3)] group-hover:scale-110 transition-transform">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <span className="text-3xl font-black tracking-tighter uppercase italic eco-gradient-text">EcoSync</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-12 text-xs font-black uppercase tracking-[0.4em] text-muted-foreground/60">
          <Link href="#" className="hover:text-primary transition-colors">Intelligence</Link>
          <Link href="#" className="hover:text-primary transition-colors">Ecosystem</Link>
          <Link href="#" className="hover:text-primary transition-colors">Impact</Link>
          <Link href="#" className="hover:text-primary transition-colors">Network</Link>
        </nav>
        <div className="flex items-center gap-6">
          <Button variant="ghost" asChild className="font-black uppercase tracking-widest text-[10px] h-12 px-8 hover:bg-white/5">
            <Link href="/login">Auth Access</Link>
          </Button>
          <Button onClick={handleGuestAccess} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-[0.2em] text-[10px] h-14 px-10 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95">
            Initialize Dashboard
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-10 pt-20 pb-40 lg:grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <ShieldCheck className="h-4 w-4" />
              Next-Gen Sustainability Protocol
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] uppercase italic text-white drop-shadow-2xl">
                SMART <br />
                <span className="eco-gradient-text">SAVINGS.</span>
              </h1>
              <h1 className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] uppercase italic text-white/40">
                SUSTAINABLE <br />
                LIVING.
              </h1>
            </div>

            <p className="text-2xl text-gray-100 font-medium leading-relaxed max-w-xl italic border-l-4 border-primary/40 pl-8">
              EcoSync optimizes your home&apos;s energy and water consumption with enterprise-grade AI, reducing your footprint and utility costs in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button size="lg" onClick={handleGuestAccess} className="h-20 px-12 rounded-3xl bg-primary text-black font-black uppercase tracking-[0.3em] text-xs group shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-105 transition-all">
                Enter Ecosystem
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-20 px-12 rounded-3xl border-white/10 bg-white/5 backdrop-blur-3xl hover:bg-white/10 text-white font-black uppercase tracking-[0.3em] text-xs transition-all">
                The Protocol
              </Button>
            </div>

            {showTroubleshoot && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-[2.5rem] bg-destructive/10 border border-destructive/20 space-y-4 max-w-lg"
              >
                <div className="flex items-center gap-3 text-destructive">
                   <ShieldCheck className="h-5 w-5" />
                   <p className="text-xs font-black uppercase tracking-widest">Action Required: Enable Guest Access</p>
                </div>
                <p className="text-sm font-medium leading-relaxed text-muted-foreground">
                  The portal requires &quot;Anonymous Sign-in&quot; to be enabled in the Firebase Console for secure guest exploration.
                </p>
                <Button variant="outline" className="w-full h-12 rounded-xl border-destructive/30 bg-destructive/5 hover:bg-destructive/10 text-destructive font-black uppercase tracking-widest text-[9px]" asChild>
                  <a href="https://console.firebase.google.com/u/0/project/studio-1279970876-eb44b/authentication/providers" target="_blank" rel="noopener noreferrer">
                    Open Firebase Settings
                  </a>
                </Button>
                <p className="text-[10px] text-muted-foreground/60 italic w-full text-center">
                  Settings {"→"} Authentication {"→"} Sign-in method {"→"} Add new provider {"→"} Anonymous
                </p>
              </motion.div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 pt-12">
              {[
                { label: "Warriors", val: "10K+" },
                { label: "Items Recycled", val: "25K+" },
                { label: "Trees Placed", val: "5K+" },
                { label: "Eco-Hubs", val: "120+" }
              ].map((s, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-4xl font-black text-white italic tracking-tighter">{s.val}</p>
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative aspect-square mt-20 lg:mt-0"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[140px] animate-pulse" />
            <div className="relative w-full h-full p-12">
              <Image 
                src="https://picsum.photos/seed/ecosync-earth/1000/1000" 
                alt="Futuristic Earth Sustainability" 
                fill 
                className="object-contain animate-glow brightness-125"
                priority
                data-ai-hint="glowing green earth hand"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 glass-card p-10 rounded-[3rem] space-y-4 animate-bounce-slow">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/20 rounded-xl">
                   <Sparkles className="h-5 w-5 text-primary" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Live Impact</p>
               </div>
               <p className="text-2xl font-black italic tracking-tighter uppercase">+ 128.7 kg CO₂</p>
               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Global Carbon Offset Today</p>
            </div>
          </motion.div>
        </section>

        <section className="py-40 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-10">
            <Globe className="w-full h-full text-primary" />
          </div>
          <div className="container mx-auto px-10 relative z-10">
            <div className="text-center space-y-6 mb-32">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.6em] italic">The Ecosystem Modules</p>
              <h2 className="text-6xl font-black uppercase tracking-tighter italic">World-Class AI Features</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: Zap, title: "Precision Analytics", desc: "Granular consumption tracking with real-time enterprise telemetry." },
                { icon: Globe, title: "Unified Network", desc: "Connect with eco-warriors and participate in global sustainability challenges." },
                { icon: Users, title: "Neural Optimization", desc: "Smart AI recommendations tailored to your unique architectural footprint." }
              ].map((f, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="glass-card p-12 rounded-[3.5rem] space-y-8 group"
                >
                  <div className="w-20 h-20 bg-primary/20 rounded-[2rem] flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                    <f.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">{f.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed text-lg italic opacity-80">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-10 py-20 text-center flex flex-col items-center gap-8 border-t border-white/5 relative z-50">
        <Link href="/" className="flex items-center gap-3">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="text-xl font-black tracking-tighter uppercase italic eco-gradient-text">EcoSync</span>
        </Link>
        <p className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground/40">
          &copy; {new Date().getFullYear()} ECOSYNC ENTERPRISE PRO. NEURAL SUSTAINABILITY.
        </p>
      </footer>
    </div>
  );
}