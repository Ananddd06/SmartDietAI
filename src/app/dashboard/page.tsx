"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Activity, User } from "lucide-react";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        } else {
          redirect("/onboarding");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        redirect("/onboarding");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    } else if (isLoaded && !user) {
      redirect("/");
    }
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <DashboardContent userProfile={userProfile} />
        </main>
      </div>
    </div>
  );
}