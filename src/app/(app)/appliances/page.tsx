'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Cpu, ArrowUpRight, AlertTriangle, Activity, Loader2 } from "lucide-react";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { AddApplianceDialog } from "@/components/appliances/add-appliance-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appliance } from "@/lib/types";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { predictMaintenance } from "@/ai/flows/predictive-maintenance-flow";

export default function AppliancesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [diagnosingId, setDiagnosingId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const appliancesPath = user ? `users/${user.uid}/appliances` : null;
  const { data: appliances, loading } = useCollection<Appliance>(appliancesPath);

  const handleDelete = (applianceId: string, name: string) => {
    if (!db || !user) return;
    const docRef = doc(db, "users", user.uid, "appliances", applianceId);
    
    deleteDoc(docRef)
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
    
    toast({ title: "Module Decommissioned", description: `${name} has been removed from grid.` });
  };

  const runDiagnostics = async (appliance: Appliance) => {
    if (!user || !db) return;
    setDiagnosingId(appliance.id);
    
    try {
      const result = await predictMaintenance({
        applianceType: appliance.type,
        energyUsageTrend: [appliance.energyConsumption, appliance.energyConsumption * 1.1, appliance.energyConsumption * 0.9],
        healthScore: appliance.healthScore,
        lastMaintenance: new Date().toISOString()
      });

      const docRef = doc(db, "users", user.uid, "appliances", appliance.id);
      const updateData = { 
        healthScore: Math.floor(result.failureProbability ? (1 - result.failureProbability) * 100 : appliance.healthScore),
        status: result.priority === 'critical' || result.priority === 'high' ? 'maintenance' : 'active'
      };

      updateDoc(docRef, updateData)
        .catch(async () => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({ 
            path: docRef.path, 
            operation: 'update',
            requestResourceData: updateData
          }));
        });

      toast({
        title: "Diagnostic Complete",
        description: `Neural analysis: ${result.failureReason}. Priority: ${result.priority.toUpperCase()}`,
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Diagnostic Offline", description: "AI Neural engine is temporarily unavailable." });
    } finally {
      setDiagnosingId(null);
    }
  };

  if (!isMounted || (loading && appliances.length === 0)) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-80 w-full rounded-[3rem]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Digital Twins</h1>
          <p className="text-muted-foreground font-medium text-lg italic">Real-time virtual hardware monitoring and predictive health.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="h-16 px-10 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">
          <Plus className="mr-3 h-5 w-5" />
          Sync Hardware
        </Button>
      </div>

      {appliances.length === 0 ? (
        <Card className="glass-card border-none rounded-[4rem] flex flex-col items-center justify-center p-32 text-center border-dashed border-2 border-white/5 opacity-40">
          <Cpu className="h-24 w-24 text-muted-foreground mb-8" />
          <CardTitle className="text-4xl font-black uppercase tracking-tighter italic">No Active Modules</CardTitle>
          <CardDescription className="mt-4 text-lg">Ecosystem idle. Register hardware to begin AI optimization.</CardDescription>
          <Button variant="outline" className="mt-12 h-14 rounded-2xl border-white/10 font-black uppercase tracking-widest text-[10px]" onClick={() => setIsAddDialogOpen(true)}>
            Deploy First Node
          </Button>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {appliances.map((appliance, idx) => (
              <motion.div 
                key={appliance.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card border-none rounded-[3.5rem] overflow-hidden group hover:border-primary/30 transition-all relative shadow-2xl">
                  <div className="absolute top-0 right-0 p-8">
                    <div className={`h-3 w-3 rounded-full animate-pulse ${appliance.healthScore > 80 ? 'bg-primary' : appliance.healthScore > 50 ? 'bg-amber-500' : 'bg-destructive'}`} />
                  </div>
                  
                  <CardHeader className="p-10 pb-4 flex flex-row items-start justify-between space-y-0">
                    <div className="space-y-2">
                       <div className="p-3 bg-white/5 rounded-2xl w-fit border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                          <Cpu className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">{appliance.name}</CardTitle>
                       <CardDescription className="font-black text-[10px] uppercase tracking-widest text-primary/60">{appliance.type}</CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="px-10 pb-6 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Energy Load</p>
                          <p className="text-lg font-black text-white italic">{appliance.energyConsumption} <span className="text-[10px] opacity-40">kWh</span></p>
                       </div>
                       <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Hydraulic</p>
                          <p className="text-lg font-black text-blue-400 italic">{appliance.waterConsumption || 0} <span className="text-[10px] opacity-40">gal</span></p>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Twin Health</p>
                          <p className={`text-[10px] font-black uppercase ${appliance.healthScore > 80 ? 'text-primary' : 'text-amber-500'}`}>{appliance.healthScore}%</p>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${appliance.healthScore}%` }} 
                            className={`h-full ${appliance.healthScore > 80 ? 'bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} 
                          />
                       </div>
                    </div>

                    {appliance.healthScore < 60 && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                         <AlertTriangle className="h-4 w-4 text-amber-500" />
                         <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Maintenance Required</p>
                      </div>
                    )}
                  </CardContent>

                  <div className="p-8 pt-0 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => runDiagnostics(appliance)}
                      disabled={diagnosingId === appliance.id}
                      variant="outline" 
                      className="flex-1 h-12 rounded-2xl bg-white/5 border-white/10 font-black uppercase tracking-widest text-[9px] group"
                    >
                      {diagnosingId === appliance.id ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Activity className="mr-2 h-3 w-3" />}
                      Run Simulation <ArrowUpRight className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-12 w-12 rounded-2xl text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(appliance.id, appliance.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AddApplianceDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  );
}
