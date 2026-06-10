'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, User, UserPlus, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useFirestore } from '@/firebase';
import { AuthService } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Valid enterprise email required.'),
  password: z.string().min(6, 'Minimum 6 characters for security.'),
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const authService = new AuthService(auth, db);

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      await authService.signupWithEmail(values.email, values.password, values.name);
      toast({
        title: "Registration Success",
        description: "Your digital eco-identity has been established.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not complete signup.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuestLogin() {
    setIsLoading(true);
    try {
      await authService.loginAnonymously();
      toast({
        title: "Guest Access Enabled",
        description: "Welcome! You are exploring as a guest.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Guest Access Error", description: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[480px] p-10 pro-card glass flex flex-col gap-8 border-white/5"
    >
      <div className="flex flex-col gap-2 text-center">
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-2xl"
          >
            <Icons.logo className="h-10 w-10 text-primary" />
          </motion.div>
        </div>
        <h1 className="text-4xl font-black tracking-tight eco-text-gradient uppercase italic">Join EcoSync</h1>
        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Establish Your Sustainability Profile</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Full Name</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="e.g. Alex Green" 
                      className="h-14 pl-14 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all text-sm font-bold" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Corporate Email</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="name@ecosync.io" 
                      className="h-14 pl-14 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all text-sm font-bold" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary/80 ml-1">Access Key</FormLabel>
                <FormControl>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="h-14 pl-14 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all text-sm font-bold" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-bold" />
              </FormItem>
            )}
          />
          
          <div className="pt-2 flex flex-col gap-3">
            <Button type="submit" className="w-full h-14 rounded-2xl font-black shadow-2xl shadow-primary/20 eco-gradient border-none uppercase tracking-widest text-sm" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus className="mr-2 h-5 w-5" />}
              Create Identity
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full h-12 rounded-2xl border-white/5 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary transition-all"
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Continue as Guest
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center pt-2">
        <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">
          Already verified?{" "}
          <Link href="/login" className="text-primary hover:text-accent transition-colors underline decoration-primary/30 underline-offset-4">
            Secure Sign-In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
