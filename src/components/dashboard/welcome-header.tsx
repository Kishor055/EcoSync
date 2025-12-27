import { Button } from "@/components/ui/button";

interface WelcomeHeaderProps {
  name: string;
}

export default function WelcomeHeader({ name }: WelcomeHeaderProps) {
  const [firstName] = name.split(" ");
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's a look at your home's sustainability performance.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button>Download Report</Button>
      </div>
    </div>
  );
}
