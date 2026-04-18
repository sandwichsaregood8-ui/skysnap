import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to Your App</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          This is your dashboard. You can start building your application here.
        </p>
      </CardContent>
    </Card>
  );
}
