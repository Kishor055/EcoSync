'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, Sparkles, CheckCircle, Recycle, AlertTriangle, Scan, Info, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { diagnoseWaste } from '@/ai/flows/diagnose-waste-flow';
import Image from 'next/image';

export default function WasteScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!preview) return;
    setIsLoading(true);
    setResult(null);

    try {
      const response = await diagnoseWaste({ photoDataUri: preview });
      setResult(response);
      toast({
        title: "Scan Successful",
        description: `Object identified as ${response.item.name}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scanning Error",
        description: "AI service is currently busy. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">AI Vision Scanner</h1>
          <p className="text-muted-foreground font-medium max-w-xl text-lg">
            Instant material classification using advanced neural networks. Identify and dispose of waste with zero friction.
          </p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 h-14 px-8 font-black uppercase tracking-widest text-[10px]">
             Impact Stats
           </Button>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <Card className="glass-card border-none rounded-[3.5rem] overflow-hidden aspect-square relative group">
            {preview ? (
              <div className="relative w-full h-full">
                <Image src={preview} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 pointer-events-none">
                   <AnimatePresence>
                     {isLoading && (
                       <motion.div 
                         initial={{ y: -400 }}
                         animate={{ y: 400 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         className="h-[4px] w-full bg-primary shadow-[0_0_30px_rgba(16,185,129,1)] z-20"
                       />
                     )}
                   </AnimatePresence>
                   <div className="absolute inset-8 border-[2px] border-primary/20 rounded-[2.5rem] border-dashed" />
                   <div className="absolute top-8 left-8 p-3 bg-primary/20 backdrop-blur-md rounded-2xl text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                     AI Neural Engine Active
                   </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-2xl font-black uppercase tracking-widest text-[9px] h-10 px-6 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-black/80"
                  onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                >
                  Reset Module
                </Button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-16 text-center space-y-10">
                <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center animate-glow border border-primary/20 relative">
                  <Scan className="h-12 w-12 text-primary" />
                  <div className="absolute -inset-4 border border-primary/10 rounded-full animate-spin-slow opacity-20" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black uppercase tracking-tight italic">Waiting for Input</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto">
                    Position the item clearly within the frame. Support for plastics, metals, paper, and electronic hardware.
                  </p>
                </div>
                <label className="cursor-pointer group">
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  <div className="bg-primary text-black px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all hover:scale-110 active:scale-95">
                    Start AI Scan
                  </div>
                </label>
              </div>
            )}
          </Card>

          <Button 
            className="w-full h-24 text-xl font-black uppercase tracking-[0.3em] rounded-[2.5rem] bg-primary text-black disabled:opacity-50 shadow-[0_0_40px_rgba(16,185,129,0.5)] group transition-all"
            disabled={!preview || isLoading}
            onClick={handleScan}
          >
            {isLoading ? <Loader2 className="mr-4 h-10 w-10 animate-spin" /> : <Sparkles className="mr-4 h-10 w-10 group-hover:rotate-12 transition-transform" />}
            {isLoading ? "Analyzing..." : "Classify with Gemini AI"}
          </Button>
        </div>

        <div className="space-y-8 flex flex-col">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8 flex-1"
              >
                <Card className="glass-card border-none rounded-[4rem] p-12 space-y-10 h-full flex flex-col">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Detection Success</p>
                      <h2 className="text-6xl font-black tracking-tighter uppercase italic">{result.item.name}</h2>
                      <div className="inline-flex px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        Material: {result.item.material}
                      </div>
                    </div>
                    <div className={`p-6 rounded-[2.5rem] ${result.item.isRecyclable ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]" : "bg-destructive/10 border-destructive/40"} border flex items-center justify-center`}>
                      <Recycle className={`h-12 w-12 ${result.item.isRecyclable ? "text-primary" : "text-destructive"}`} />
                    </div>
                  </div>

                  <div className="grid gap-8 flex-1">
                    <div className="p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 space-y-6 relative overflow-hidden group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest italic">Disposal Protocol</p>
                      </div>
                      <p className="text-lg leading-relaxed text-muted-foreground font-medium italic">{result.disposal.instructions}</p>
                      <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                         <Info className="h-20 w-20" />
                      </div>
                    </div>

                    <div className="p-8 bg-white/[0.03] rounded-[3rem] border border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest italic">Compliance & Safety</p>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground font-medium">{result.disposal.caution || "Verified: Safe for standard processing."}</p>
                    </div>
                  </div>

                  <div className="pt-8 flex items-center justify-between border-t border-white/5">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Carbon Offset Potential</p>
                      <p className="text-4xl font-black text-primary italic">+ {result.impact.co2Savings} kg <span className="text-[12px] uppercase tracking-[0.2em] font-medium">CO₂e</span></p>
                    </div>
                    <Button variant="outline" className="rounded-2xl h-14 px-10 border-primary/20 bg-primary/5 hover:bg-primary/10 font-black uppercase tracking-[0.3em] text-[10px] text-primary">
                      Log Impact
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center glass-card border-none rounded-[4rem] p-24 text-center space-y-10 opacity-30">
                <div className="relative">
                  <Sparkles className="h-24 w-24 text-muted-foreground" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-10 border-2 border-dashed border-muted-foreground/20 rounded-full"
                  />
                </div>
                <p className="text-xl font-black uppercase tracking-[0.4em] text-muted-foreground">Neural Engine Standby</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}