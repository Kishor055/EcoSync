
export type Role = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  createdAt: string;
  sustainabilityDNA: {
    energyPreference: 'eco' | 'balanced' | 'performance';
    waterTarget: number;
    footprintGoal: number;
    treesPlanted: number;
    impactScore: number;
  };
}

export type ApplianceType = 
  | "Refrigerator" 
  | "Washing Machine" 
  | "Dishwasher" 
  | "AC Unit" 
  | "Water Heater"
  | "TV"
  | "Lighting"
  | "Computer"
  | "EV Charger"
  | "Furnace"
  | "Desert Cooler"
  | "Solar Array";

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  efficiencyRating: "A" | "B" | "C" | "D";
  energyConsumption: number; 
  waterConsumption: number;
  healthScore: number; // 0-100
  status: 'active' | 'maintenance' | 'eco_mode' | 'standby';
  lastUpdated?: string;
  predictiveFailureDate?: string;
}

export interface UsageData {
  id?: string;
  month: string;
  energy: number;
  water: number;
  carbonEmissions: number;
  prediction?: number;
  efficiencyScore?: number;
}

export interface ActivityLog {
  id: string;
  type: 'appliance_added' | 'goal_reached' | 'optimization_applied' | 'item_donated' | 'alert_triggered';
  description: string;
  timestamp: string;
  impactScore: number;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  imageUrl: string;
  donorId: string;
  status: 'available' | 'pending' | 'claimed';
  createdAt: string;
}

export interface FeedPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  type: 'update' | 'achievement' | 'milestone';
  createdAt: string;
}

export interface EcoMission {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  deadline: string;
  type: 'energy' | 'water' | 'community';
  icon?: any;
}
