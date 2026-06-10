'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Recycle, Heart, MapPin, Loader2, Filter, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { useCollection, useUser, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { MarketplaceItem } from '@/lib/types';
import Image from 'next/image';
import { ListItemDialog } from '@/components/marketplace/list-item-dialog';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function MarketplacePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { data: items, loading } = useCollection<MarketplaceItem>('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [isListDialogOpen, setIsListDialogOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
    item.status !== 'claimed'
  );

  const handleClaim = async (itemId: string, title: string) => {
    if (!user || !db) {
      toast({ variant: "destructive", title: "Auth Sync Required", description: "Enable guest access in settings." });
      return;
    }
    setClaimingId(itemId);
    const docRef = doc(db, 'marketplace', itemId);
    updateDoc(docRef, { status: 'claimed' })
      .then(() => {
        toast({ title: "Transaction Successful", description: `You have secured: ${title}.` });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: { status: 'claimed' }
        }));
      })
      .finally(() => setClaimingId(null));
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Eco Marketplace</h1>
          <p className="text-muted-foreground font-medium text-lg">Circular economy interface for sustainable hardware exchange.</p>
        </div>
        <Button onClick={() => setIsListDialogOpen(true)} className="h-16 px-10 rounded-2xl bg-primary text-black font-black uppercase tracking-[0.2em] text-xs shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all group">
          <Plus className="mr-3 h-5 w-5" />
          List Asset
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative group w-full md:w-[500px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search items, categories, or tech specs..." 
            className="h-14 pl-12 glass-card border-white/5 rounded-2xl focus:ring-primary/20 text-sm font-bold tracking-tight"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 gap-2 font-black uppercase tracking-widest text-[10px]">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="flex-1 md:flex-none h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 gap-2 font-black uppercase tracking-widest text-[10px]">
             My Listings
          </Button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-[450px] bg-white/5 animate-pulse rounded-[3rem]" />)
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-32 text-center glass-card rounded-[4rem] border-dashed border-2 border-white/5">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground opacity-10 mb-8" />
            <p className="text-3xl font-black uppercase tracking-tighter italic text-muted-foreground">Marketplace Clear</p>
            <p className="text-sm text-muted-foreground/60 mt-4 font-medium">Global resource allocation optimized. No items currently listed.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.9 }}>
                <Card className="glass-card overflow-hidden rounded-[3rem] group hover:border-primary/40 transition-all flex flex-col h-full border-none">
                  <div className="relative h-64 w-full overflow-hidden">
                    <Image 
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-6 right-6">
                      <Badge className="bg-primary/20 backdrop-blur-xl border-primary/40 text-primary px-4 py-1.5 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg">
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="flex-grow p-8 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-2xl font-black italic uppercase leading-[0.9] tracking-tighter">
                        {item.title}
                      </CardTitle>
                      <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                         <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-muted-foreground font-medium leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                          <MapPin className="h-3 w-3" /> Area 01
                       </div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                          {item.category}
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-8 pt-4 gap-4 bg-white/[0.02] border-t border-white/5">
                    <Button 
                      className="flex-1 h-14 rounded-2xl bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent font-black uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all"
                      disabled={claimingId === item.id}
                      onClick={() => handleClaim(item.id, item.title)}
                    >
                      {claimingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Acquire Asset"}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-red-500/10 hover:text-red-500 transition-colors border border-white/5">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      <ListItemDialog open={isListDialogOpen} onOpenChange={setIsListDialogOpen} />
    </div>
  );
}