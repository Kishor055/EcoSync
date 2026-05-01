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
  Droplet, 
  Tv, 
  Lamp,
  Waves
} from "lucide-react";

const applianceIcons = {
  "Refrigerator": <Refrigerator className="h-5 w-5 text-blue-500" />,
  "Washing Machine": <WashingMachine className="h-5 w-5 text-indigo-500" />,
  "Dishwasher": <Waves className="h-5 w-5 text-cyan-500" />,
  "AC Unit": <Snowflake className="h-5 w-5 text-sky-400" />,
  "Water Heater": <Flame className="h-5 w-5 text-orange-500" />,
}

interface ApplianceUsageProps {
  appliances: Appliance[];
}

export function ApplianceUsage({ appliances }: ApplianceUsageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Appliance Consumption
        </CardTitle>
        <CardDescription>Breakdown of energy and water usage per device.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appliance</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
              <TableHead className="text-right">Energy (kWh)</TableHead>
              <TableHead className="text-right">Water (gal)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No appliances added yet.
                </TableCell>
              </TableRow>
            ) : (
              appliances.map((appliance) => (
                <TableRow key={appliance.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-full">
                        {applianceIcons[appliance.type] || <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium">{appliance.name}</div>
                        <div className="text-xs text-muted-foreground">{appliance.type}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={appliance.efficiencyRating === 'A' ? 'default' : 'secondary'}>
                      Rating {appliance.efficiencyRating}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {appliance.energyConsumption}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {appliance.waterConsumption > 0 ? appliance.waterConsumption : "-"}
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
