import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
      <p className="text-muted-foreground mb-6">View and download your historical usage reports.</p>
      <Card>
        <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>This section is under construction.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Detailed monthly and yearly reports of your energy and water usage will be available here. Analyze trends, compare periods, and download PDFs for your records.</p>
        </CardContent>
       </Card>
    </div>
  );
}
