"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Apple, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Your Health Journey</CardTitle>
            <CardDescription>
              Let's get started with setting up your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding">
              <Button className="w-full" size="lg">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">HealthTracker</h1>
        </div>
        <SignInButton mode="modal">
          <Button variant="outline">Sign In</Button>
        </SignInButton>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Health with
            <span className="text-green-600"> AI-Powered</span> Insights
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your daily activities, get personalized diet plans, and achieve your wellness goals 
            with intelligent recommendations tailored just for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignInButton mode="modal">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </SignInButton>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Activity className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Activity Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your daily steps and activities with our intuitive tracking system
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Apple className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">AI Diet Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get personalized nutrition plans powered by advanced AI technology
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Goal Setting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set and track your health goals with our comprehensive scoring system
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Progress Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Visualize your progress with detailed charts and insights
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Ready to Transform Your Health?</CardTitle>
              <CardDescription className="text-gray-100">
                Join thousands of users who have already started their wellness journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton mode="modal">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                  Get Started Free
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="h-6 w-6 text-green-400" />
            <span className="text-xl font-bold">HealthTracker</span>
          </div>
          <p className="text-gray-400">
            © 2024 HealthTracker. Your journey to better health starts here.
          </p>
        </div>
      </footer>
    </div>
  );
}