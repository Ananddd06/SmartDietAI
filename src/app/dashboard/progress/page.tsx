"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Award, ArrowLeft } from "lucide-react";

export default function ProgressPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const maxScore = 100;
  const progressPercentage = (score / maxScore) * 100;

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <TrendingUp className="h-8 w-8 text-purple-500 animate-spin" />
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
        <div className="w-20 h-20 bg-purple-500 rounded-3xl flex items-center justify-center mx-auto">
          <TrendingUp className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-light text-gray-900">Progress</h1>
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
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-light text-gray-900">{score}</div>
            <div className="text-sm text-gray-500 mt-1">points today</div>
            <div className="text-xs text-gray-400 mt-2">{Math.round(progressPercentage)}% progress</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center space-y-2">
          <Target className="h-6 w-6 text-purple-500 mx-auto" />
          <div className="text-2xl font-light">{maxScore}</div>
          <div className="text-sm text-gray-500">Max Score</div>
        </div>
        <div className="text-center space-y-2">
          <Award className="h-6 w-6 text-yellow-500 mx-auto" />
          <div className="text-2xl font-light">{completed ? "Yes" : "No"}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="text-center space-y-2">
          <TrendingUp className="h-6 w-6 text-green-500 mx-auto" />
          <div className="text-2xl font-light">{Math.max(0, maxScore - score)}</div>
          <div className="text-sm text-gray-500">Remaining</div>
        </div>
      </div>

      {/* Action */}
      <Card className="max-w-md mx-auto border-0 shadow-sm">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-light text-gray-900">Daily Status</h3>
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
          
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-light">25</div>
              <div className="text-xs text-gray-500">Steps</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-light">15</div>
              <div className="text-xs text-gray-500">Water</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-light">30</div>
              <div className="text-xs text-gray-500">Diet</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-light">30</div>
              <div className="text-xs text-gray-500">Bonus</div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
