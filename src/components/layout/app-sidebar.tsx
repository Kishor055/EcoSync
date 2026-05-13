'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Settings,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Appliances', href: '/appliances', icon: Zap },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-card md:block shadow-sm">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary group">
            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Icons.logo className="h-6 w-6" />
            </div>
            <span className="tracking-tight">EcoSync</span>
          </Link>
        </div>
        <div className="flex-1 mt-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between group rounded-xl px-3 py-2.5 transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4 w-4", isActive ? "" : "group-hover:text-primary")} />
                    <span className="font-semibold tracking-tight">{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-50" />}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card className="bg-primary/5 border-primary/10 overflow-hidden relative">
            <div className="absolute -top-4 -right-4 h-16 w-16 bg-primary/10 rounded-full blur-2xl" />
            <CardHeader className="p-4 pt-4">
              <CardTitle className="text-sm font-bold">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs leading-relaxed">
                Unlock advanced AI features and unlimited appliance tracking.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button size="sm" className="w-full font-bold shadow-sm">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
