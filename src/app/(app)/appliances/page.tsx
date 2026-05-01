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

export default function AppliancesPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const appliancesPath = user ? `users/${user.uid}/appliances` : null;
  const { data: appliances, loading } = useCollection<Appliance>(appliancesPath);

  const handleDelete = (applianceId: string) => {
    if (!db || !user) return;
    const docRef = doc(db, "users", user.uid, "appliances", applianceId);
    deleteDoc(docRef).catch(async (err) => {
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
          <h1 className="text-2xl font-bold tracking-tight">My Appliances</h1>
          <p className="text-muted-foreground">Manage and track your home energy consumers.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Appliance
        </Button>
      </div>

      {appliances.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Zap className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <CardTitle>No appliances added yet</CardTitle>
          <CardDescription className="mt-2">
            Start by adding your first smart appliance to track your consumption.
          </CardDescription>
          <Button variant="outline" className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
            Add Your First Device
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appliances.map((appliance) => (
            <Card key={appliance.id} className="relative group">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{appliance.name}</CardTitle>
                  <CardDescription>{appliance.type}</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(appliance.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Energy</p>
                      <p className="font-medium">{appliance.energyConsumption} kWh</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-muted-foreground text-xs uppercase font-semibold">Water</p>
                      <p className="font-medium">{appliance.waterConsumption || 0} gal</p>
                    </div>
                  </div>
                  <div className="col-span-2 mt-2">
                    <p className="text-muted-foreground text-xs uppercase font-semibold">Efficiency Rating</p>
                    <div className="flex gap-1 mt-1">
                      {['A', 'B', 'C', 'D'].map((r) => (
                        <div 
                          key={r}
                          className={`h-6 w-8 rounded flex items-center justify-center text-xs font-bold border ${r === appliance.efficiencyRating ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-transparent'}`}
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
