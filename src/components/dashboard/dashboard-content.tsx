"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Target, 
  TrendingUp, 
  Droplets, 
  RefreshCw,
  CheckCircle,
  Plus
} from "lucide-react";
import { StepsTracker } from "./steps-tracker";
import { DietPlanCard } from "./diet-plan-card";
import { ProgressChart } from "./progress-chart";

interface DashboardContentProps {
  userProfile: any;
}

interface DailyLog {
  id: string;
  steps?: number;
  completed: boolean;
  score: number;
  dietPlan?: string;
  waterIntake?: number;
}

export function DashboardContent({ userProfile }: DashboardContentProps) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepsInput, setStepsInput] = useState("");
  const [waterInput, setWaterInput] = useState("");

  useEffect(() => {
    fetchDailyLog();
  }, []);

  const fetchDailyLog = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        setDailyLog(log);
        if (log.steps) setStepsInput(log.steps.toString());
        if (log.waterIntake) setWaterInput(log.waterIntake.toString());
      }
    } catch (error) {
      console.error("Error fetching daily log:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDailyLog = async (updates: Partial<DailyLog>) => {
    try {
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setDailyLog(updatedLog);
      }
    } catch (error) {
      console.error("Error updating daily log:", error);
    }
  };

  const handleStepsSubmit = () => {
    const steps = parseInt(stepsInput);
    if (!isNaN(steps)) {
      updateDailyLog({ steps });
    }
  };

  const handleWaterSubmit = () => {
    const water = parseFloat(waterInput);
    if (!isNaN(water)) {
      updateDailyLog({ waterIntake: water });
    }
  };

  const toggleCompletion = () => {
    if (dailyLog) {
      updateDailyLog({ completed: !dailyLog.completed });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your health overview for today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Steps</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyLog?.steps || 0}</div>
              <p className="text-xs text-muted-foreground">
                Goal: 10,000 steps
              </p>
              <Progress value={(dailyLog?.steps || 0) / 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyLog?.waterIntake || 0}L</div>
              <p className="text-xs text-muted-foreground">
                Goal: 2.5L
              </p>
              <Progress value={(dailyLog?.waterIntake || 0) / 2.5 * 100} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dailyLog?.score || 0}</div>
              <p className="text-xs text-muted-foreground">
                Today's points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {dailyLog?.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Plus className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dailyLog?.completed ? "Completed" : "In Progress"}
              </div>
              <Button
                variant={dailyLog?.completed ? "outline" : "default"}
                size="sm"
                className="mt-2"
                onClick={toggleCompletion}
              >
                {dailyLog?.completed ? "Mark Incomplete" : "Mark Complete"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Steps Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Steps Tracker
              </CardTitle>
              <CardDescription>
                Track your daily steps and progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter steps"
                    value={stepsInput}
                    onChange={(e) => setStepsInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleStepsSubmit}>Update</Button>
                </div>
                <StepsTracker currentSteps={dailyLog?.steps || 0} />
              </div>
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Water Intake
              </CardTitle>
              <CardDescription>
                Track your daily water consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter liters"
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleWaterSubmit}>Update</Button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[0.5, 1, 1.5, 2, 2.5].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      size="sm"
                      onClick={() => setWaterInput(amount.toString())}
                    >
                      {amount}L
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Diet Plan */}
          <DietPlanCard userProfile={userProfile} currentPlan={dailyLog?.dietPlan} />

          {/* Progress Chart */}
          <ProgressChart />
        </div>
      </div>
    </div>
  );
}