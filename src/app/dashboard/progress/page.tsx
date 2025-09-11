"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ProgressPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Visualize your health progress over time.</p>
        </CardContent>
      </Card>
    </div>
  );
}
