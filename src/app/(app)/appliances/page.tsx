import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AppliancesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Appliances</h1>
      <p className="text-muted-foreground mb-6">Manage your connected appliances.</p>
       <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This section is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Here you'll be able to add, remove, and manage your smart appliances to get detailed insights and control over your home's consumption.</p>
        </CardContent>
       </Card>
    </div>
  );
}
