'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Zap, Droplets, ShieldAlert, Cpu } from "lucide-react";
import type { ApplianceType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AddApplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplianceDialog({ open, onOpenChange }: AddApplianceDialogProps) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Refrigerator" as ApplianceType,
    efficiencyRating: "A" as const,
    energyConsumption: "",
    waterConsumption: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userLoading) return;
    if (!user) return;
    if (!db) return;

    setIsLoading(true);

    try {
      const colRef = collection(db, "users", user.uid, "appliances");
      
      const applianceData = {
        name: formData.name.trim(),
        type: formData.type,
        efficiencyRating: formData.efficiencyRating,
        energyConsumption: parseFloat(formData.energyConsumption) || 0,
        waterConsumption: parseFloat(formData.waterConsumption) || 0,
        healthScore: 100,
        status: 'active',
        createdAt: serverTimestamp(),
      };

      await addDoc(colRef, applianceData);

      // Log activity
      const activityRef = collection(db, "users", user.uid, "activities");
      await addDoc(activityRef, {
        type: 'appliance_added',
        description: `Provisioned Digital Twin for ${formData.name}`,
        timestamp: new Date().toISOString(),
        impactScore: 50
      });

      toast({
        title: "Hardware Synced",
        description: `Digital Twin for ${formData.name} is now online.`,
      });

      onOpenChange(false);
      setFormData({ name: "", type: "Refrigerator", efficiencyRating: "A", energyConsumption: "", waterConsumption: "" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Provisioning Failed", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-primary/20 shadow-2xl overflow-hidden p-0 glass-card">
        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4">
              <Cpu className="h-8 w-8 text-primary" />
              Provision Node
            </DialogTitle>
            <DialogDescription className="text-sm font-medium italic">
              Register physical hardware to initialize its Digital Twin simulation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Module Identifier</Label>
              <Input
                placeholder="e.g. Master Suite AC"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/5 h-14 rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Category</Label>
                <Select value={formData.type} onValueChange={(v: ApplianceType) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="AC Unit">AC Unit</SelectItem>
                    <SelectItem value="Washing Machine">Washing Machine</SelectItem>
                    <SelectItem value="Desert Cooler">Desert Air Cooler</SelectItem>
                    <SelectItem value="EV Charger">EV Charger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Efficiency Tier</Label>
                <Select value={formData.efficiencyRating} onValueChange={(v: any) => setFormData({ ...formData, efficiencyRating: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grade A++</SelectItem>
                    <SelectItem value="B">Grade B+</SelectItem>
                    <SelectItem value="C">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                  <Zap className="h-3 w-3" /> Energy (kWh)
                </Label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={formData.energyConsumption}
                  onChange={(e) => setFormData({ ...formData, energyConsumption: e.target.value })}
                  required
                  className="bg-white/5 border-white/5 h-14 rounded-2xl"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                  <Droplets className="h-3 w-3" /> Water (gal)
                </Label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={formData.waterConsumption}
                  onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })}
                  className="bg-white/5 border-white/5 h-14 rounded-2xl"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full h-16 shadow-lg font-black uppercase tracking-widest text-xs transition-all">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Establish Connection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
