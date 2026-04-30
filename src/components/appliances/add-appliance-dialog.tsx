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
import { Loader2 } from "lucide-react";
import type { ApplianceType } from "@/lib/types";

interface AddApplianceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddApplianceDialog({ open, onOpenChange }: AddApplianceDialogProps) {
  const { user } = useUser();
  const db = useFirestore();
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

    setIsLoading(true);
    const applianceData = {
      ...formData,
      userId: user.uid,
      energyConsumption: parseFloat(formData.energyConsumption),
      waterConsumption: parseFloat(formData.waterConsumption),
    };

    const colRef = collection(db, "users", user.uid, "appliances");
    addDoc(colRef, applianceData)
      .then(() => {
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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Appliance</DialogTitle>
            <DialogDescription>
              Enter the details of your appliance to start tracking its usage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Appliance Name</Label>
              <Input
                id="name"
                placeholder="e.g. Kitchen Fridge"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(v: ApplianceType) => setFormData({ ...formData, type: v })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="Washing Machine">Washing Machine</SelectItem>
                    <SelectItem value="Dishwasher">Dishwasher</SelectItem>
                    <SelectItem value="AC Unit">AC Unit</SelectItem>
                    <SelectItem value="Water Heater">Water Heater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="efficiency">Efficiency</Label>
                <Select 
                  value={formData.efficiencyRating} 
                  onValueChange={(v: any) => setFormData({ ...formData, efficiencyRating: v })}
                >
                  <SelectTrigger id="efficiency">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A (Most Efficient)</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D (Least Efficient)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="energy">Energy (kWh/mo)</Label>
                <Input
                  id="energy"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.energyConsumption}
                  onChange={(e) => setFormData({ ...formData, energyConsumption: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="water">Water (gal/mo)</Label>
                <Input
                  id="water"
                  type="number"
                  placeholder="0"
                  value={formData.waterConsumption}
                  onChange={(e) => setFormData({ ...formData, waterConsumption: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Appliance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}