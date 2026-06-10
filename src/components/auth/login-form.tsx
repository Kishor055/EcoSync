'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Mail, Lock, LogIn, ShieldCheck, UserCircle, ShieldAlert } from 'lucide-react';

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

const loginSchema = z.object({
  email: z.string().email('Enter a valid enterprise email.'),
  password: z.string().min(6, 'Security requirement: 6+ characters.'),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const authService = new AuthService(auth, db);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      await authService.loginWithEmail(values.email, values.password);
      toast({
        title: "Session Authorized",
        description: "Welcome back to the EcoSync ecosystem.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authorization Failed",
        description: error.message || "Invalid credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true);
    try {
      await authService.loginWithGoogle();
      toast({
        title: "SSO Success",
        description: "Authenticated via Google Cloud Identity.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: "destructive", title: "OAuth Error", description: error.message });
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
        description: "Welcome, Eco Explorer! Enjoy the platform.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      let description = error.message || "Guest access is currently unavailable.";
      if (error.code === 'auth/configuration-not-found') {
        description = "ACTION REQUIRED: Enable 'Anonymous' sign-in in your Firebase Console.";
      }
      toast({ variant: "destructive", title: "Guest Access Error", description });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-[480px] p-10 pro-card glass flex flex-col gap-8 border-white/5"
    >
      <div className="flex flex-col gap-2 text-center">
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="p-5 bg-primary/10 rounded-[2rem] border border-primary/20 shadow-2xl shadow-primary/10"
          >
            <Icons.logo className="h-12 w-12 text-primary" />
          </motion.div>
        </div>
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight eco-text-gradient uppercase italic">EcoSync</h1>
          <p className="text-muted-foreground text-xs font-black tracking-[0.3em] uppercase opacity-60 flex items-center justify-center gap-2">
            <ShieldCheck className="h-3 w-3" /> Intelligence & Sustainability
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all font-black uppercase tracking-widest gap-2 text-[10px]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icons.google className="h-4 w-4" />}
            Google SSO
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGuestLogin} 
            disabled={isLoading}
            className="h-14 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 transition-all font-black uppercase tracking-widest gap-2 text-[10px]"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCircle className="h-4 w-4 text-primary" />}
            Guest Access
          </Button>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5" /></div>
          <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-muted-foreground">
            <span className="bg-[#020202] px-6">Enterprise Login</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 ml-1">Work Email</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="name@enterprise.com" 
                        className="h-14 pl-14 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all text-sm font-medium" 
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
                  <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70 ml-1">Security Key</FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="h-14 pl-14 rounded-2xl bg-white/5 border-white/5 focus-visible:ring-primary/20 focus-visible:bg-white/10 transition-all text-sm font-medium" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold" />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-14 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 eco-gradient border-none group mt-2" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />}
              Authorize Session
            </Button>
          </form>
        </Form>
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-muted-foreground font-black uppercase tracking-widest">
          Unauthorized?{" "}
          <Link href="/signup" className="text-primary hover:text-accent transition-colors underline decoration-primary/30 underline-offset-4">
            Create Identity
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
