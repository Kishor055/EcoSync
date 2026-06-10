
'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, Package, Tag, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

interface ListItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ListItemDialog({ open, onOpenChange }: ListItemDialogProps) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Appliances",
    condition: "Good",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userLoading || !user || !db) return;

    setIsLoading(true);

    const itemData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      condition: formData.condition,
      imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
      donorId: user.uid,
      status: 'available',
      createdAt: serverTimestamp(),
    };

    const colRef = collection(db, "marketplace");
    addDoc(colRef, itemData)
      .then(() => {
        toast({ title: "Item Listed", description: "Your item is now live in the eco-marketplace." });
        onOpenChange(false);
        setFormData({ title: "", description: "", category: "Appliances", condition: "Good" });
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ 
          path: colRef.path, 
          operation: 'create',
          requestResourceData: itemData
        }));
      })
      .finally(() => setIsLoading(false));

    // Async log activity - non blocking
    const activityRef = collection(db, "users", user.uid, "activities");
    addDoc(activityRef, {
      type: 'item_donated',
      description: `Listed ${formData.title} for donation`,
      timestamp: new Date().toISOString(),
      impactScore: 25
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-primary/20 shadow-2xl p-0 overflow-hidden glass-card">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              List an Item
            </DialogTitle>
            <DialogDescription className="font-medium italic">
              Share your unwanted appliances or eco-gear with the community.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Item Title</Label>
              <Input
                placeholder="e.g. Energy Efficient Microwave"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                disabled={isLoading}
                className="bg-white/5 border-white/5 h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Appliances">Appliances</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Eco-Gear">Eco-Gear</SelectItem>
                    <SelectItem value="Solar">Solar Parts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Condition</Label>
                <Select value={formData.condition} onValueChange={(v) => setFormData({ ...formData, condition: v })}>
                  <SelectTrigger className="bg-white/5 border-white/5 h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">Brand New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair / Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-[10px] font-black uppercase tracking-widest opacity-60">Description</Label>
              <Textarea
                placeholder="Tell us about the item's features and history..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="min-h-[100px] bg-white/5 border-white/5 rounded-xl"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !user} className="w-full h-14 shadow-lg font-black uppercase tracking-widest text-xs">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
              List Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
