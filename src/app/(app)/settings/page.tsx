import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <p className="text-muted-foreground mb-6">Manage your account and notification preferences.</p>
      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This section is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Here you'll be able to update your profile information, change your password, and customize alert preferences for over-consumption and maintenance reminders.</p>
        </CardContent>
       </Card>
    </div>
  );
}
