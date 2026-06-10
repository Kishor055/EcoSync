'use client';

import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, Send, Trophy, Flame, UserPlus, Sparkles, TrendingUp } from 'lucide-react';
import { useCollection, useUser } from '@/firebase';
import type { FeedPost } from '@/lib/types';
import Image from 'next/image';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const postVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export default function CommunityPage() {
  const { user } = useUser();
  const { data: posts, loading } = useCollection<FeedPost>('feed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 max-w-7xl mx-auto pb-20">
      <div className="lg:col-span-3 space-y-12">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic eco-gradient-text">Eco Ecosystem</h1>
          <p className="text-muted-foreground font-medium text-lg">Real-time sustainability feed and global peer interactions.</p>
        </div>

        <Card className="glass-card border-none rounded-[3rem] p-4">
          <CardContent className="pt-6">
            <div className="flex gap-6">
              <Avatar className="h-14 w-14 ring-4 ring-primary/20">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-primary/10 text-primary font-black">EX</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-6">
                <Input 
                  placeholder="Share a sustainability achievement..." 
                  className="bg-white/5 border-none h-16 rounded-[2rem] px-8 text-lg font-medium focus-visible:ring-primary/20 placeholder:italic"
                />
                <div className="flex justify-between items-center px-4">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 rounded-xl px-4">📷 Media</Button>
                    <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 rounded-xl px-4">🏆 Achievement</Button>
                  </div>
                  <Button className="h-12 px-10 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-xl">
                    Broadcast
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-10"
        >
          {loading ? (
            [1,2].map(i => <div key={i} className="h-80 glass-card animate-pulse rounded-[3rem]" />)
          ) : (
            posts.map((post) => (
              <motion.div key={post.id} variants={postVariants}>
                <Card className="glass-card border-none rounded-[3.5rem] overflow-hidden group">
                  <CardHeader className="p-8 flex flex-row items-center gap-6">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarImage src={post.userAvatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black">{post.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl font-black tracking-tight uppercase italic">{post.userName}</CardTitle>
                        {post.type === 'achievement' && <Badge className="bg-primary text-black font-black uppercase tracking-widest text-[8px] h-5">Verified Impact</Badge>}
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] opacity-40 mt-1">
                        {new Date(post.createdAt).toDateString()} • Sustainable District 4
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/5">
                       <UserPlus className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-6">
                    <p className="text-xl font-medium leading-relaxed italic text-white/90">"{post.content}"</p>
                    {post.imageUrl && (
                      <div className="relative h-96 w-full rounded-[2.5rem] overflow-hidden group">
                        <Image 
                          src={post.imageUrl} 
                          alt="Post content" 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-2">
                           <div className="p-2 bg-primary/20 backdrop-blur-md rounded-lg">
                              <Sparkles className="h-4 w-4 text-primary" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-white">Impact Multiplier x1.2</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="px-10 py-8 border-t border-white/5 bg-white/[0.02] flex gap-10">
                    <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                      <Heart className="h-5 w-5" /> {post.likes} <span className="opacity-40 font-medium">Endorse</span>
                    </button>
                    <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle className="h-5 w-5" /> Comment
                    </button>
                    <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                      <Share2 className="h-5 w-5" /> Relay
                    </button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <div className="hidden lg:block space-y-8">
        <Card className="glass-card border-none rounded-[3rem] overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center relative">
            <Trophy className="h-12 w-12 text-black drop-shadow-lg" />
            <div className="absolute inset-0 bg-white/10 opacity-20" />
          </div>
          <CardHeader className="p-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Leaderboard</p>
              <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Eco Champions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 group cursor-pointer">
                <div className="h-10 w-10 flex items-center justify-center font-black italic text-primary group-hover:scale-125 transition-transform">
                  0{i}
                </div>
                <Avatar className="h-12 w-12 border border-white/10">
                  <AvatarFallback className="font-black text-xs">U{i}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-black uppercase tracking-tighter truncate">Env Leader {i}</p>
                  <div className="flex items-center gap-2">
                     <TrendingUp className="h-3 w-3 text-primary" />
                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Score: {9800 - i * 150}</p>
                  </div>
                </div>
                <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
              </div>
            ))}
            <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 bg-white/5 font-black uppercase tracking-widest text-[9px] hover:bg-white/10 mt-4">
              View All Rankings
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-none rounded-[3rem] p-8 space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-xl">
                 <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Weekly Tip</p>
           </div>
           <p className="text-sm font-medium leading-relaxed italic text-muted-foreground">
             "Collective recycling in your district has reduced CO₂ emissions by 4.2 tons this month. Keep participating!"
           </p>
        </Card>
      </div>
    </div>
  );
}
