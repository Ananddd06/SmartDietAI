"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TrendingUp, Target, Award, ArrowLeft, Trophy, Star } from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    fetchTodayData();
  }, []);

  const fetchTodayData = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        setScore(log.score || 0);
        setCompleted(log.completed || false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompletion = async () => {
    try {
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      if (response.ok) {
        setCompleted(!completed);
      }
    } catch (error) {
      console.error("Error updating completion:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0 bg-background">
            <div className="flex items-center justify-center h-64">
              <TrendingUp className="h-8 w-8 text-purple-500 animate-spin" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0 bg-background">
          <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 lg:space-y-12">
            
            {/* Achievement Notification */}
            {showAchievement && (
              <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-2xl">
                  <CardContent className="p-6 text-center">
                    <Trophy className="h-12 w-12 text-white mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-white">🎉 Achievement Unlocked!</h3>
                    <p className="text-white/90">Perfect Score - 100 Points!</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <Star className="h-5 w-5 text-white fill-white" />
                      <Star className="h-5 w-5 text-white fill-white" />
                      <Star className="h-5 w-5 text-white fill-white" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>

            {/* Header */}
            <div className="text-center space-y-4">
              <div className="w-16 lg:w-20 h-16 lg:h-20 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto">
                <TrendingUp className="h-8 lg:h-10 w-8 lg:w-10 text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-light text-foreground">Progress</h1>
            </div>

            {/* Score Display */}
            <div className="flex justify-center">
              <div className="relative w-64 lg:w-80 h-64 lg:h-80">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted-foreground/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${score * 2.827} 282.7`}
                    className="text-purple-500 transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl lg:text-6xl font-light text-foreground">{score}</div>
                    <div className="text-sm lg:text-base text-muted-foreground">points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Status */}
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-light text-foreground">Daily Status</h3>
                  <Button 
                    onClick={toggleCompletion}
                    className={`h-12 px-8 ${completed 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    {completed ? "Mark Incomplete" : "Mark Complete"}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
