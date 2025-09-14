"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Calendar, Loader2 } from "lucide-react";

interface ProgressData {
  date: string;
  steps: number;
  score: number;
  waterIntake: number;
  completed: boolean;
}

export function ProgressChart() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    fetchProgressData();
  }, [timeRange]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/progress?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric" 
    });
  };

  const getStats = () => {
    if (progressData.length === 0) return { avgSteps: 0, avgScore: 0, avgWater: 0, completionRate: 0 };
    
    const totalSteps = progressData.reduce((sum, day) => sum + (day.steps || 0), 0);
    const totalScore = progressData.reduce((sum, day) => sum + day.score, 0);
    const totalWater = progressData.reduce((sum, day) => sum + (day.waterIntake || 0), 0);
    const completedDays = progressData.filter(day => day.completed).length;
    
    return {
      avgSteps: Math.round(totalSteps / progressData.length),
      avgScore: Math.round(totalScore / progressData.length),
      avgWater: Math.round((totalWater / progressData.length) * 10) / 10,
      completionRate: Math.round((completedDays / progressData.length) * 100)
    };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Tracking
          </CardTitle>
          <CardDescription>
            Your health progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Your health progress over time
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line</SelectItem>
                <SelectItem value="bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {progressData.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground">No progress data available</p>
            <p className="text-sm text-muted-foreground mt-2">Start tracking your activities to see progress</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.avgSteps.toLocaleString()}</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Avg Steps</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.avgScore}</div>
                <div className="text-xs text-green-600 dark:text-green-400">Avg Score</div>
              </div>
              <div className="text-center p-3 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
                <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.avgWater}L</div>
                <div className="text-xs text-cyan-600 dark:text-cyan-400">Avg Water</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.completionRate}%</div>
                <div className="text-xs text-purple-600 dark:text-purple-400">Completion</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-foreground"
                    />
                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} className="text-foreground" />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={(value: number, name: string) => [
                        name === "steps" ? value.toLocaleString() : value,
                        name === "steps" ? "Steps" : name === "score" ? "Score" : "Water (L)"
                      ]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="waterIntake" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12, fill: 'currentColor' }}
                      className="text-foreground"
                    />
                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} className="text-foreground" />
                    <Tooltip 
                      labelFormatter={formatDate}
                      formatter={(value: number, name: string) => [
                        name === "steps" ? value.toLocaleString() : value,
                        name === "steps" ? "Steps" : name === "score" ? "Score" : "Water (L)"
                      ]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        color: 'hsl(var(--card-foreground))'
                      }}
                    />
                    <Bar dataKey="steps" fill="#3b82f6" />
                    <Bar dataKey="waterIntake" fill="#06b6d4" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {progressData.slice(-5).reverse().map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${day.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">{formatDate(day.date)}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>{day.steps?.toLocaleString() || 0} steps</span>
                      <span>{day.waterIntake || 0}L</span>
                      <span>{day.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}