"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DietPlanCard } from "@/components/dashboard/diet-plan-card";

export default function DietPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Diet Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <DietPlanCard userProfile={{}} /> {/* pass real userProfile later */}
        </CardContent>
      </Card>
    </div>
  );
}
