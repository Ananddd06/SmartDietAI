"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ActivityPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Track your steps, workouts, and activity logs here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
