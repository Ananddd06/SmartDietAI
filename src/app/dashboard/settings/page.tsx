"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Target, ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [goals, setGoals] = useState({
    stepGoal: 10000,
    waterGoal: 2.5
  });

  useEffect(() => {
    if (isLoaded && user) {
      console.log("Clerk user data:", user); // Debug log
      setGoals({
        stepGoal: 10000,
        waterGoal: 2.5
      });
    }
  }, [isLoaded, user]);

  const updateGoals = async () => {
    try {
      console.log("Goals updated:", goals);
    } catch (error) {
      console.error("Error updating goals:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Settings className="h-8 w-8 text-gray-500 animate-spin" />
        </div>
      </div>
    );
  }

  // Get user display name
  const displayName = user?.fullName || 
                     (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName) || 
                     'Not set';

  // Get username
  const username = user?.username || user?.firstName || 'Not set';

  // Get email
  const email = user?.primaryEmailAddress?.emailAddress || 
                user?.emailAddresses?.[0]?.emailAddress || 
                'Not set';

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
        <div className="w-20 h-20 bg-gray-500 rounded-3xl flex items-center justify-center mx-auto">
          <Settings className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-light text-gray-900">Settings</h1>
      </div>

      {/* Profile Section */}
      <Card className="max-w-2xl mx-auto border-0 shadow-sm">
        <CardContent className="p-8 space-y-8">
          
          {/* Profile Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-900">Profile</h2>
                <p className="text-gray-500">Your account information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Name</label>
                <Input
                  value={displayName}
                  disabled
                  className="h-12 border-0 bg-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Username</label>
                <Input
                  value={username}
                  disabled
                  className="h-12 border-0 bg-gray-100 text-gray-600"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-600">Email</label>
                <Input
                  value={email}
                  disabled
                  className="h-12 border-0 bg-gray-100 text-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Goals Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-light text-gray-900">Goals</h2>
                <p className="text-gray-500">Set your daily targets</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Daily Steps Goal</label>
                <Input
                  type="number"
                  value={goals.stepGoal}
                  onChange={(e) => setGoals({...goals, stepGoal: parseInt(e.target.value)})}
                  className="h-12 border-0 bg-gray-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-600">Daily Water Goal (L)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={goals.waterGoal}
                  onChange={(e) => setGoals({...goals, waterGoal: parseFloat(e.target.value)})}
                  className="h-12 border-0 bg-gray-50"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-6">
            <Button 
              onClick={updateGoals}
              className="h-12 px-12 bg-gray-900 hover:bg-gray-800"
            >
              Save Goals
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
        <div className="text-center space-y-2">
          <div className="text-2xl font-light text-gray-900">{goals.stepGoal.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Step Goal</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-light text-gray-900">{goals.waterGoal}L</div>
          <div className="text-sm text-gray-500">Water Goal</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-light text-gray-900">7</div>
          <div className="text-sm text-gray-500">Days Active</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-light text-gray-900">85%</div>
          <div className="text-sm text-gray-500">Avg Score</div>
        </div>
      </div>

    </div>
  );
}
