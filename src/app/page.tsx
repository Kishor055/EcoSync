import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Droplets, Zap, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary">
          <Icons.logo className="h-8 w-8" />
          EcoSync
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6 tracking-tight">
            Smart Savings,
            <br />
            Sustainable Living.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            EcoSync helps you monitor and optimize your home's energy and water consumption, reducing your bills and your carbon footprint.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">Get Started for Free</Link>
          </Button>
        </section>

        <section className="bg-card py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-headline font-bold text-center mb-12">
              Features to Power Your Eco-Friendly Home
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Track your energy and water usage live from any device. See appliance-specific data to pinpoint what's costing you most.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Suggestions</h3>
                <p className="text-muted-foreground">
                  Receive smart alerts and personalized tips to optimize your appliance settings and reduce waste without sacrificing comfort.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                  <Droplets className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Measure Your Impact</h3>
                <p className="text-muted-foreground">
                  Watch your Sustainability Score improve as you make changes. Compare your usage to eco-friendly benchmarks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} EcoSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
