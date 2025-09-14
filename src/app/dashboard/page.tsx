"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Activity } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const profile = await response.json();
          setUserProfile(profile);
        } else {
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        router.push("/onboarding");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserProfile();
    } else if (isLoaded && !user) {
      router.push("/");
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0 bg-background">
          <DashboardContent userProfile={userProfile} />
        </main>
      </div>
    </div>
  );
}
