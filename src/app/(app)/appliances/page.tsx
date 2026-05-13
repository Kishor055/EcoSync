'use client';

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Zap, Droplets } from "lucide-react";
import { useUser, useCollection, useFirestore } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { AddApplianceDialog } from "@/components/appliances/add-appliance-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appliance } from "@/lib/types";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from "@/hooks/use-toast";

export default function AppliancesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const appliancesPath = user ? `users/${user.uid}/appliances` : null;
  const { data: appliances, loading } = useCollection<Appliance>(appliancesPath);

  const handleDelete = (applianceId: string, name: string) => {
    if (!db || !user) return;
    const docRef = doc(db, "users", user.uid, "appliances", applianceId);
    deleteDoc(docRef)
      .then(() => {
        toast({
          title: "Appliance removed",
          description: `${name} has been successfully deleted.`,
        });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Appliances</h1>
          <p className="text-muted-foreground">Manage and track your home energy consumers.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="shadow-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Appliance
        </Button>
      </div>

      {appliances.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
          <Zap className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <CardTitle className="text-foreground">No appliances added yet</CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Start by adding your first smart appliance to track your consumption.
          </CardDescription>
          <Button variant="outline" className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
            Add Your First Device
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appliances.map((appliance) => (
            <Card key={appliance.id} className="relative group overflow-hidden border-primary/10 hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-foreground">{appliance.name}</CardTitle>
                  <CardDescription className="font-medium text-primary/70">{appliance.type}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(appliance.id, appliance.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5">
                    <Zap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Energy</p>
                      <p className="font-bold text-foreground">{appliance.energyConsumption} kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-500/5">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight">Water</p>
                      <p className="font-bold text-foreground">{appliance.waterConsumption || 0} gal</p>
                    </div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-tight mb-2">Efficiency Rating</p>
                    <div className="flex gap-2">
                      {['A', 'B', 'C', 'D'].map((r) => (
                        <div 
                          key={r}
                          className={`h-8 w-10 rounded-md flex items-center justify-center text-xs font-black border transition-all ${r === appliance.efficiencyRating ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105' : 'bg-muted/50 text-muted-foreground border-transparent opacity-50'}`}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AddApplianceDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
}
