'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Loader2, Zap, Droplets } from "lucide-react";
import type { ApplianceType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AddApplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplianceDialog({ open, onOpenChange }: AddApplianceDialogProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Refrigerator" as ApplianceType,
    efficiencyRating: "A" as const,
    energyConsumption: "",
    waterConsumption: "0",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;

    // Validate inputs
    const energy = parseFloat(formData.energyConsumption);
    const water = parseFloat(formData.waterConsumption);

    if (isNaN(energy)) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid number for energy consumption.",
      });
      return;
    }

    setIsLoading(true);
    const applianceData = {
      name: formData.name,
      type: formData.type,
      efficiencyRating: formData.efficiencyRating,
      energyConsumption: energy,
      waterConsumption: isNaN(water) ? 0 : water,
    };

    const colRef = collection(db, "users", user.uid, "appliances");
    
    addDoc(colRef, applianceData)
      .then(() => {
        toast({
          title: "Appliance added",
          description: `${formData.name} is now being tracked.`,
        });
        onOpenChange(false);
        setFormData({
          name: "",
          type: "Refrigerator",
          efficiencyRating: "A",
          energyConsumption: "",
          waterConsumption: "0",
        });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: colRef.path,
          operation: 'create',
          requestResourceData: applianceData
        }));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] border-primary/20 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Monitor New Device
            </DialogTitle>
            <DialogDescription>
              Register a smart appliance to start analyzing its resource footprint.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-semibold">Appliance Name</Label>
              <Input
                id="name"
                placeholder="e.g. Master Bedroom AC"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-muted/30 border-primary/10 focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type" className="font-semibold">Device Category</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(v: ApplianceType) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger id="type" className="bg-muted/30 border-primary/10">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="Washing Machine">Washing Machine</SelectItem>
                    <SelectItem value="Dishwasher">Dishwasher</SelectItem>
                    <SelectItem value="AC Unit">AC Unit</SelectItem>
                    <SelectItem value="Water Heater">Water Heater</SelectItem>
                    <SelectItem value="TV">Television</SelectItem>
                    <SelectItem value="Lighting">Smart Lighting</SelectItem>
                    <SelectItem value="Computer">Workstation/PC</SelectItem>
                    <SelectItem value="EV Charger">EV Charger</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="efficiency" className="font-semibold">Efficiency Tier</Label>
                <Select 
                  value={formData.efficiencyRating} 
                  onValueChange={(v: any) => setFormData({ ...formData, efficiencyRating: v })}
                >
                  <SelectTrigger id="efficiency" className="bg-muted/30 border-primary/10">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Class A (Eco-Pro)</SelectItem>
                    <SelectItem value="B">Class B (High)</SelectItem>
                    <SelectItem value="C">Class C (Standard)</SelectItem>
                    <SelectItem value="D">Class D (Legacy)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="energy" className="font-semibold flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary" /> Energy (kWh/mo)
                </Label>
                <Input
                  id="energy"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.energyConsumption}
                  onChange={(e) => setFormData({ ...formData, energyConsumption: e.target.value })}
                  required
                  className="bg-muted/30 border-primary/10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="water" className="font-semibold flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-blue-500" /> Water (gal/mo)
                </Label>
                <Input
                  id="water"
                  type="number"
                  placeholder="0"
                  value={formData.waterConsumption}
                  onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })}
                  className="bg-muted/30 border-primary/10"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="bg-muted/10 -mx-6 -mb-6 p-6 mt-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full shadow-lg hover:shadow-primary/20 transition-all"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate Monitoring
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}