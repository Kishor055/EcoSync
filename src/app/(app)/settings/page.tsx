
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { User, Bell, Shield, Mail, Loader2, CheckCircle2, Sparkles, Zap, Droplets } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [dna, setDna] = useState({
    energyPreference: 'balanced',
    waterTarget: 500,
    footprintGoal: 1200
  });

  const handleSaveProfile = async () => {
    if (!user || !db) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { 
        name: displayName,
        sustainabilityDNA: dna
      });
      toast({
        title: "Profile Synchronized",
        description: "Your digital identity and Sustainability DNA have been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      <div className="space-y-1">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">System Settings</h1>
        <p className="text-muted-foreground font-medium text-lg italic">Manage your account preferences and sustainability DNA.</p>
      </div>

      <div className="grid gap-10">
        <Card className="glass-card border-none rounded-[3rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter">
              <User className="h-6 w-6 text-primary" />
              Profile Identity
            </CardTitle>
            <CardDescription className="italic">Update your personal details for reports and AI insights.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Display Name</Label>
                <Input 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Green"
                  className="bg-white/5 border-white/5 h-14 rounded-2xl font-bold"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 ml-1">Corporate Email</Label>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10 opacity-70">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-black italic">{user?.email || "Anonymous User"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none rounded-[4rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="flex items-center gap-4 text-2xl font-black italic uppercase tracking-tighter">
              <Sparkles className="h-6 w-6 text-primary" />
              Sustainability DNA
            </CardTitle>
            <CardDescription className="italic">Fine-tune the AI core to match your environmental goals.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                     <Zap className="h-3 w-3 text-amber-500" /> Energy Preference
                  </Label>
                  <Select value={dna.energyPreference} onValueChange={(v: any) => setDna({...dna, energyPreference: v})}>
                     <SelectTrigger className="bg-white/5 border-white/5 h-14 rounded-2xl">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="eco">Eco (Max Savings)</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                     <Droplets className="h-3 w-3 text-blue-400" /> Water Target (gal)
                  </Label>
                  <Input 
                    type="number"
                    value={dna.waterTarget} 
                    onChange={(e) => setDna({...dna, waterTarget: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/5 h-14 rounded-2xl font-bold"
                  />
               </div>
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
                     <Shield className="h-3 w-3 text-primary" /> Footprint Goal (kg CO2)
                  </Label>
                  <Input 
                    type="number"
                    value={dna.footprintGoal} 
                    onChange={(e) => setDna({...dna, footprintGoal: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/5 h-14 rounded-2xl font-bold"
                  />
               </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-10">
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <Label className="text-lg font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">Consumption Alerts</Label>
                  <p className="text-sm text-muted-foreground font-medium italic">Receive notifications when usage exceeds normal thresholds.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <Label className="text-lg font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground font-medium italic">Get a summary of your eco-performance every Monday.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
              <div className="flex items-center justify-between group">
                <div className="space-y-1">
                  <Label className="text-lg font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors">AI Optimization</Label>
                  <p className="text-sm text-muted-foreground font-medium italic">Let EcoBot suggest real-time changes to your appliance settings.</p>
                </div>
                <Switch defaultChecked className="data-[state=checked]:bg-primary" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-10 pt-0 flex justify-end">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="h-16 px-12 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all">
              {isSaving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-3 h-5 w-5" />}
              Synchronize Core
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-destructive/5 border border-destructive/10 rounded-[3rem] overflow-hidden p-10 space-y-8">
          <div className="flex items-center gap-4 text-destructive">
            <Shield className="h-6 w-6" />
            <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Security Perimeter</CardTitle>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-black/40 border border-destructive/20">
            <div className="space-y-1">
              <p className="font-black text-destructive uppercase tracking-widest text-sm">Purge Digital Identity</p>
              <p className="text-sm text-muted-foreground font-medium italic">Irreversibly remove all your usage data and appliance monitors.</p>
            </div>
            <Button variant="destructive" className="h-14 px-10 rounded-xl font-black uppercase tracking-widest text-[10px]">Delete Account</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
