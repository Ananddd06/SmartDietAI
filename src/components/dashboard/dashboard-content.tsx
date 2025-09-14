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
  Plus,
  Trophy,
  Star
} from "lucide-react";
import { StepsTracker } from "./steps-tracker";
import { DietPlanCard } from "./diet-plan-card";
import { ProgressChart } from "./progress-chart";
import { AIDietPlan } from "./ai-diet-plan";

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
  const [showAchievement, setShowAchievement] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchDailyLog();
  }, []);

  useEffect(() => {
    if (dailyLog?.score >= 100) {
      setShowAchievement(true);
      setTimeout(() => setShowAchievement(false), 5000);
    }
  }, [dailyLog?.score]);

  // Update input fields when dailyLog changes
  useEffect(() => {
    if (dailyLog) {
      setStepsInput(dailyLog.steps?.toString() || "0");
      setWaterInput(dailyLog.waterIntake?.toString() || "0");
    }
  }, [dailyLog]);

  const fetchDailyLog = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        setDailyLog(log);
        // Update input fields with existing data
        if (log.steps) setStepsInput(log.steps.toString());
        if (log.waterIntake) setWaterInput(log.waterIntake.toString());
      }
    } catch (error) {
      console.error("Error fetching daily log:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (steps: number, water: number, completed: boolean, mealsCompleted: number = 0) => {
    let score = 0;
    
    // Steps: 30 points max (10,000 steps = 30 points)
    score += Math.min((steps / 10000) * 30, 30);
    
    // Water: 20 points max (2.5L = 20 points)
    score += Math.min((water / 2.5) * 20, 20);
    
    // Meals: 30 points max (3 meals = 30 points)
    score += Math.min((mealsCompleted / 3) * 30, 30);
    
    // Completion bonus: 20 points
    if (completed) score += 20;
    
    return Math.round(score);
  };

  const updateDailyLog = async (updates: Partial<DailyLog>) => {
    setUpdating(true);
    try {
      // Calculate new score based on updates
      const currentSteps = updates.steps ?? dailyLog?.steps ?? 0;
      const currentWater = updates.waterIntake ?? dailyLog?.waterIntake ?? 0;
      const currentCompleted = updates.completed ?? dailyLog?.completed ?? false;
      const currentMeals = updates.mealsCompleted ?? dailyLog?.mealsCompleted ?? 0;
      
      const newScore = calculateScore(currentSteps, currentWater, currentCompleted, currentMeals);
      
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updates, score: newScore }),
      });

      if (response.ok) {
        const updatedLog = await response.json();
        setDailyLog(updatedLog);
        
        // Update input fields to reflect saved data
        if (updatedLog.steps !== undefined) setStepsInput(updatedLog.steps.toString());
        if (updatedLog.waterIntake !== undefined) setWaterInput(updatedLog.waterIntake.toString());
        if (updatedLog.mealsCompleted !== undefined) setMealsCompleted(updatedLog.mealsCompleted);
      }
    } catch (error) {
      console.error("Error updating daily log:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleStepsSubmit = async () => {
    const steps = parseInt(stepsInput);
    if (!isNaN(steps) && steps >= 0) {
      setUpdating(true);
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ steps }),
        });
        if (response.ok) {
          const updatedLog = await response.json();
          setDailyLog(updatedLog);
        }
      } catch (error) {
        console.error("Error updating steps:", error);
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleWaterSubmit = async () => {
    const water = parseFloat(waterInput);
    if (!isNaN(water) && water >= 0) {
      setUpdating(true);
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ waterIntake: water }),
        });
        if (response.ok) {
          const updatedLog = await response.json();
          setDailyLog(updatedLog);
        }
      } catch (error) {
        console.error("Error updating water:", error);
      } finally {
        setUpdating(false);
      }
    }
  };

  const toggleCompletion = async () => {
    if (dailyLog) {
      setUpdating(true);
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !dailyLog.completed }),
        });
        if (response.ok) {
          const updatedLog = await response.json();
          setDailyLog(updatedLog);
        }
      } catch (error) {
        console.error("Error updating completion:", error);
      } finally {
        setUpdating(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Achievement Notification */}
        {showAchievement && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-2xl">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">🎉 Perfect Score!</h3>
                <p className="text-white/90 text-sm">100 Points Achieved!</p>
                <div className="flex justify-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-white fill-white" />
                  <Star className="h-4 w-4 text-white fill-white" />
                  <Star className="h-4 w-4 text-white fill-white" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Welcome back, {userProfile.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Steps Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Steps Tracker
              </CardTitle>
              <CardDescription>
                Track your daily steps (30 points max)
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
                  <Button onClick={handleStepsSubmit} disabled={updating}>
                    {updating ? "Updating..." : "Update"}
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{dailyLog?.steps || 0}</div>
                  <div className="text-sm text-muted-foreground">steps today</div>
                  <div className="text-xs text-green-600 mt-1">
                    +{Math.min(Math.round(((dailyLog?.steps || 0) / 10000) * 30), 30)} points
                  </div>
                </div>
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
                Track your daily water (20 points max)
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
                  <Button onClick={handleWaterSubmit} disabled={updating}>
                    {updating ? "Updating..." : "Update"}
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{dailyLog?.waterIntake || 0}L</div>
                  <div className="text-sm text-muted-foreground">water today</div>
                  <div className="text-xs text-blue-600 mt-1">
                    +{Math.min(Math.round(((dailyLog?.waterIntake || 0) / 2.5) * 20), 20)} points
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Status
              </CardTitle>
              <CardDescription>
                Mark day complete (20 points bonus)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <Button 
                  onClick={toggleCompletion}
                  disabled={updating}
                  className={`w-full ${dailyLog?.completed 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  {updating ? "Updating..." : (dailyLog?.completed ? "✓ Completed" : "Mark Complete")}
                </Button>
                <div className="text-xs text-green-600">
                  {dailyLog?.completed ? "+20 points" : "0 points"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Diet Plan */}
        <div className="mt-6">
          <AIDietPlan userProfile={userProfile} />
        </div>

        {/* Progress Chart */}
        <div className="mt-6">
          <ProgressChart />
        </div>
      </div>
    </div>
  );
}