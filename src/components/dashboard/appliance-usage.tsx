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
import { Zap, Droplets, Refrigerator, WashingMachine, Snowflake, Wind, Droplet } from "lucide-react";

const applianceIcons = {
  "Refrigerator": <Refrigerator className="h-5 w-5 text-muted-foreground" />,
  "Washing Machine": <WashingMachine className="h-5 w-5 text-muted-foreground" />,
  "Dishwasher": <Droplet className="h-5 w-5 text-muted-foreground" />,
  "AC Unit": <Snowflake className="h-5 w-5 text-muted-foreground" />,
  "Water Heater": <Droplets className="h-5 w-5 text-muted-foreground" />,
}

interface ApplianceUsageProps {
  appliances: Appliance[];
}

export function ApplianceUsage({ appliances }: ApplianceUsageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appliance Breakdown</CardTitle>
        <CardDescription>Monthly consumption by appliance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Appliance</TableHead>
              <TableHead className="text-right">Energy</TableHead>
              <TableHead className="text-right">Water</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appliances.map((appliance) => (
              <TableRow key={appliance.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {applianceIcons[appliance.type] || <Zap className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <div className="font-medium">{appliance.name}</div>
                      <div className="text-sm text-muted-foreground">{appliance.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {appliance.energyConsumption} kWh
                </TableCell>
                <TableCell className="text-right">
                  {appliance.waterConsumption > 0 ? `${appliance.waterConsumption} gal` : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
