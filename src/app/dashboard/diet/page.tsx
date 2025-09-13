"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Apple, Target, Droplets, ArrowLeft } from "lucide-react";

export default function DietPage() {
  const router = useRouter();
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterInput, setWaterInput] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        setWaterIntake(log.waterIntake || 0);
        setWaterInput(log.waterIntake?.toString() || "");
        setDietPlan(log.dietPlan || "");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateWater = async () => {
    const newWater = parseFloat(waterInput);
    if (!isNaN(newWater)) {
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ waterIntake: newWater }),
        });
        if (response.ok) {
          setWaterIntake(newWater);
        }
      } catch (error) {
        console.error("Error updating water:", error);
      }
    }
  };

  const waterGoal = 2.5;
  const progressPercentage = (waterIntake / waterGoal) * 100;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Apple className="h-8 w-8 text-green-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto">
          <Apple className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-light text-gray-900">Diet</h1>
      </div>

      {/* Main Progress Circle */}
      <div className="flex justify-center">
        <div className="relative w-80 h-80">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${Math.min(progressPercentage, 100) * 2.83} 283`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-light text-gray-900">{waterIntake}L</div>
            <div className="text-sm text-gray-500 mt-1">water today</div>
            <div className="text-xs text-gray-400 mt-2">{Math.round(progressPercentage)}% of goal</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center space-y-2">
          <Target className="h-6 w-6 text-green-500 mx-auto" />
          <div className="text-2xl font-light">{waterGoal}L</div>
          <div className="text-sm text-gray-500">Goal</div>
        </div>
        <div className="text-center space-y-2">
          <Droplets className="h-6 w-6 text-blue-500 mx-auto" />
          <div className="text-2xl font-light">{Math.round((waterIntake / waterGoal) * 8)}</div>
          <div className="text-sm text-gray-500">Glasses</div>
        </div>
        <div className="text-center space-y-2">
          <Apple className="h-6 w-6 text-orange-500 mx-auto" />
          <div className="text-2xl font-light">{Math.max(0, waterGoal - waterIntake).toFixed(1)}L</div>
          <div className="text-sm text-gray-500">Remaining</div>
        </div>
      </div>

      {/* Input */}
      <Card className="max-w-md mx-auto border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-3">
            <Input
              type="number"
              step="0.1"
              placeholder="Enter liters"
              value={waterInput}
              onChange={(e) => setWaterInput(e.target.value)}
              className="flex-1 h-12 border-0 bg-gray-50 text-center text-lg"
            />
            <Button 
              onClick={updateWater}
              className="h-12 px-8 bg-green-500 hover:bg-green-600"
            >
              Update
            </Button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {[0.5, 1, 1.5, 2, 2.5].map((amount) => (
              <Button
                key={amount}
                variant="ghost"
                size="sm"
                onClick={() => setWaterInput(amount.toString())}
                className="h-10 text-xs text-gray-600 hover:bg-gray-100"
              >
                {amount}L
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
