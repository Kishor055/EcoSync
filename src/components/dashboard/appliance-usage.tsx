import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Appliance } from "@/lib/types";
import { 
  Zap, 
  Droplets, 
  Refrigerator, 
  WashingMachine, 
  Snowflake, 
  Flame, 
  Tv, 
  Lamp,
  Waves,
  Microwave,
  Fan,
  Coffee,
  Monitor,
  Lightbulb
} from "lucide-react";

const applianceIcons: Record<string, React.ReactNode> = {
  "Refrigerator": <Refrigerator className="h-5 w-5 text-blue-500" />,
  "Washing Machine": <WashingMachine className="h-5 w-5 text-indigo-500" />,
  "Dishwasher": <Waves className="h-5 w-5 text-cyan-500" />,
  "AC Unit": <Snowflake className="h-5 w-5 text-sky-400" />,
  "Water Heater": <Flame className="h-5 w-5 text-orange-500" />,
  "TV": <Tv className="h-5 w-5 text-purple-500" />,
  "Lighting": <Lightbulb className="h-5 w-5 text-yellow-500" />,
  "Microwave": <Microwave className="h-5 w-5 text-gray-500" />,
  "Fan": <Fan className="h-5 w-5 text-teal-500" />,
  "Coffee Maker": <Coffee className="h-5 w-5 text-amber-600" />,
  "Computer": <Monitor className="h-5 w-5 text-slate-600" />,
}

interface ApplianceUsageProps {
  appliances: Appliance[];
}

export function ApplianceUsage({ appliances }: ApplianceUsageProps) {
  return (
    <Card className="border-none shadow-md overflow-hidden">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Zap className="h-5 w-5 text-primary" />
          Appliance Consumption
        </CardTitle>
        <CardDescription className="text-muted-foreground">Estimated monthly resource allocation.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="pl-6 py-4">Appliance</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Energy (kWh)</TableHead>
              <TableHead className="text-right pr-6">Water (gal)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-medium">
                  No active monitors. Add an appliance to see live data.
                </TableCell>
              </TableRow>
            ) : (
              appliances.map((appliance) => (
                <TableRow key={appliance.id} className="hover:bg-muted/5 transition-colors">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-muted rounded-xl">
                        {applianceIcons[appliance.type] || <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{appliance.name}</div>
                        <div className="text-xs text-muted-foreground font-medium">{appliance.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={appliance.efficiencyRating === 'A' ? 'default' : 'secondary'}
                      className={cn(
                        "font-bold uppercase tracking-wider text-[10px]",
                        appliance.efficiencyRating === 'A' ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" : "bg-muted text-muted-foreground"
                      )}
                    >
                      Class {appliance.efficiencyRating}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-foreground/80">
                    {appliance.energyConsumption.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-blue-600 pr-6">
                    {appliance.waterConsumption > 0 ? appliance.waterConsumption : "0"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";
