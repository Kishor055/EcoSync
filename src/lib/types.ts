export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export type ApplianceType = "Refrigerator" | "Washing Machine" | "Dishwasher" | "AC Unit" | "Water Heater";

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  efficiencyRating: "A" | "B" | "C" | "D";
  energyConsumption: number; // in kWh
  waterConsumption: number; // in Gallons
}

export interface UsageData {
  month: string;
  energy: number;
  water: number;
}
