import type { User, Appliance, UsageData } from "@/lib/types";

export const mockUser: User = {
  id: "user-1",
  name: "Alex Green",
  email: "alex.green@example.com",
  avatarUrl: "https://picsum.photos/seed/100/40/40",
};

export const mockAppliances: Appliance[] = [
  {
    id: "app-1",
    name: "Main Refrigerator",
    type: "Refrigerator",
    efficiencyRating: "A",
    energyConsumption: 55.2,
    waterConsumption: 0,
  },
  {
    id: "app-2",
    name: "Laundry Room Washer",
    type: "Washing Machine",
    efficiencyRating: "B",
    energyConsumption: 15.8,
    waterConsumption: 450,
  },
  {
    id: "app-3",
    name: "Kitchen Dishwasher",
    type: "Dishwasher",
    efficiencyRating: "A",
    energyConsumption: 12.5,
    waterConsumption: 180,
  },
  {
    id: "app-4",
    name: "Living Room AC",
    type: "AC Unit",
    efficiencyRating: "C",
    energyConsumption: 120.7,
    waterConsumption: 0,
  },
  {
    id: "app-5",
    name: "Main Water Heater",
    type: "Water Heater",
    efficiencyRating: "B",
    energyConsumption: 95.3,
    waterConsumption: 0,
  },
];

export const mockUsageData: UsageData[] = [
  { month: "Jan", energy: 320, water: 1500 },
  { month: "Feb", energy: 290, water: 1400 },
  { month: "Mar", energy: 310, water: 1600 },
  { month: "Apr", energy: 280, water: 1300 },
  { month: "May", energy: 340, water: 1700 },
  { month: "Jun", energy: 370, water: 1900 },
];
