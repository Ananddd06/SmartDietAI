"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Apple, RefreshCw, Loader2 } from "lucide-react";

interface DietPlanCardProps {
  userProfile: any;
  currentPlan?: string;
}

export function DietPlanCard({ userProfile, currentPlan }: DietPlanCardProps) {
  const [dietPlan, setDietPlan] = useState<string | null>(currentPlan || null);
  const [loading, setLoading] = useState(false);

  const generateDietPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/diet/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: userProfile.height,
          weight: userProfile.weight,
          goal: userProfile.goal,
          age: userProfile.age,
          gender: userProfile.gender,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlan(data.plan);

        // Update daily log with new diet plan
        await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dietPlan: data.plan }),
        });
      }
    } catch (error) {
      console.error("Error generating diet plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseDietPlan = (plan: string) => {
    try {
      const parsed = JSON.parse(plan);
      return parsed;
    } catch {
      return { type: "text", content: plan };
    }
  };

  const renderDietPlanContent = () => {
    if (!dietPlan) {
      return (
        <div className="text-center py-8">
          <Apple className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No diet plan generated yet</p>
          <Button onClick={generateDietPlan} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Diet Plan"
            )}
          </Button>
        </div>
      );
    }

    const parsedPlan = parseDietPlan(dietPlan);

    if (parsedPlan.type === "text") {
      return <pre className="whitespace-pre-wrap text-sm">{parsedPlan.content}</pre>;
    }

    return (
      <div className="space-y-4">
        {parsedPlan.meals && (
          <div className="space-y-3">
            <h4 className="font-medium">Recommended Meals</h4>
            {parsedPlan.meals.map((meal: any, index: number) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium">{meal.name}</h5>
                  <Badge variant="outline">{meal.calories} cal</Badge>
                </div>
                <p className="text-sm text-gray-600">{meal.description}</p>
                {meal.portions && (
                  <div className="mt-2">
                    <span className="text-xs font-medium">Portions: </span>
                    <span className="text-xs text-gray-600">{meal.portions}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {parsedPlan.waterIntake && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-1">💧 Water Intake</h5>
            <p className="text-sm text-blue-700">
              Recommended: {parsedPlan.waterIntake} liters per day
            </p>
          </div>
        )}

        {parsedPlan.tips && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h5 className="font-medium text-green-900 mb-1">💡 Tips</h5>
            <ul className="text-sm text-green-700 space-y-1">
              {parsedPlan.tips.map((tip: string, index: number) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5" />
          AI Diet Plan
        </CardTitle>
        <CardDescription>
          Personalized nutrition plan based on your profile
        </CardDescription>
      </CardHeader>

      {/* Scrollable content box */}
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {renderDietPlanContent()}
      </CardContent>

      {/* Fixed regenerate button at bottom */}
      <div className="p-4 border-t flex justify-center">
        <Button onClick={generateDietPlan} disabled={loading} variant="outline">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Plan
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
