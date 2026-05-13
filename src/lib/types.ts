
export type Role = 'user' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  createdAt: string;
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
  | "Furnace";

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  efficiencyRating: "A" | "B" | "C" | "D";
  energyConsumption: number; 
  waterConsumption: number;
}

export interface UsageData {
  id?: string;
  month: string;
  energy: number;
  water: number;
}

export interface ActivityLog {
  id: string;
  type: 'appliance_added' | 'goal_reached' | 'optimization_applied';
  description: string;
  timestamp: string;
  impactScore: number;
}
