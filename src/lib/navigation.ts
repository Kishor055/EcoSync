
import { 
  LayoutDashboard, 
  Cpu, 
  Activity, 
  Camera, 
  Globe, 
  ShieldCheck, 
  BarChart3, 
  ZapOff, 
  Droplets,
  Settings,
  Target,
  Zap
} from "lucide-react";

export const NAVIGATION_LINKS = [
  { name: 'Command OS', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Digital Twins', href: '/appliances', icon: Cpu },
  { name: 'Hardware Mesh', href: '/iot', icon: Activity },
  { name: 'Eco Missions', href: '/missions', icon: Target },
  { name: 'AI Vision', href: '/scanner', icon: Camera },
  { name: 'Marketplace', href: '/marketplace', icon: Globe },
  { name: 'Global Feed', href: '/community', icon: ShieldCheck },
];

export const INTELLIGENCE_LINKS = [
  { name: 'Usage Intel', href: '/reports', icon: BarChart3 },
  { name: 'Grid Control', href: '#', icon: Zap },
  { name: 'Hydraulic Save', href: '#', icon: Droplets },
];

export const SYSTEM_LINKS = [
  { name: 'Settings', href: '/settings', icon: Settings },
];
