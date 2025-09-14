"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Activity, Apple, Target, TrendingUp, Menu, X, Star, Users, Shield, Zap, BarChart3, Heart, Brain, Clock, ArrowRight, Play, Check, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return [ref, isVisible] as const;
};

export default function Home() {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
            <CardDescription>Continue your health journey</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/onboarding">
              <Button className="w-full" size="lg">Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold text-foreground">HealthTracker</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Reviews</a>
            <a href="#pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">Sign In</Button>
            </SignInButton>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 sm:px-6 lg:px-8 p-4">
          <nav className="flex flex-col gap-4">
            <a href="#features" className="text-sm font-medium text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-foreground">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-foreground">Reviews</a>
            <a href="#pricing" className="text-sm font-medium text-foreground">Pricing</a>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span>New: AI Health Coach 2.0 is here</span>
              <ArrowRight className="h-3 w-3" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your AI-powered
              <span className="text-primary block"> health companion</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Transform your wellness journey with personalized insights, smart tracking, and AI-driven recommendations that adapt to your lifestyle.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <SignInButton mode="modal">
                <Button size="lg" className="text-base px-8 group">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </SignInButton>
              <Button variant="outline" size="lg" className="text-base px-8 group">
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full border-2 border-background" />
                  ))}
                </div>
                <span>10,000+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                ))}
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Main Dashboard Mockup */}
              <div className="bg-background border rounded-lg shadow-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                
                {/* Tab Navigation */}
                <div className="flex gap-1 mb-4 bg-muted p-1 rounded-md">
                  {['Dashboard', 'Analytics', 'Goals'].map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`px-3 py-1 text-sm rounded transition-colors ${
                        activeTab === i ? 'bg-background shadow-sm' : 'hover:bg-background/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Dashboard Content */}
                {activeTab === 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                        <div className="text-2xl font-bold text-blue-600">8,547</div>
                        <div className="text-xs text-muted-foreground">Steps Today</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                        <div className="text-2xl font-bold text-green-600">1,847</div>
                        <div className="text-xs text-muted-foreground">Calories</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-md">
                        <div className="text-2xl font-bold text-purple-600">7.5h</div>
                        <div className="text-xs text-muted-foreground">Sleep</div>
                      </div>
                    </div>
                    <div className="h-24 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/20 dark:to-purple-950/20 rounded-md flex items-end justify-between p-2">
                      {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                        <div key={i} className={`bg-primary rounded-sm w-4`} style={{height: `${height}%`}} />
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div className="space-y-4">
                    <div className="h-32 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-950/20 dark:to-blue-950/20 rounded-md p-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-1">↗ 23%</div>
                        <div className="text-sm text-muted-foreground">Health Score Improvement</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-lg font-semibold">Weight Loss</div>
                        <div className="text-sm text-green-600">-5.2 lbs this month</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-lg font-semibold">Activity</div>
                        <div className="text-sm text-blue-600">+15% vs last week</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 2 && (
                  <div className="space-y-3">
                    {[
                      { goal: 'Lose 10 lbs', progress: 65, color: 'bg-green-500' },
                      { goal: '10k steps daily', progress: 85, color: 'bg-blue-500' },
                      { goal: 'Drink 8 glasses water', progress: 40, color: 'bg-cyan-500' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.goal}</span>
                          <span className="text-muted-foreground">{item.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.color} transition-all duration-1000`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                  <Check className="h-4 w-4" />
                </div>
                <div className="absolute -bottom-2 -left-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <Heart className="h-4 w-4" />
                </div>
              </div>

              {/* Background Decorations */}
              <div className="absolute -z-10 top-10 right-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
              <div className="absolute -z-10 bottom-10 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for better health</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and insights to help you achieve your wellness goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              icon: Activity, 
              title: "Smart Activity Tracking", 
              desc: "Automatically track steps, workouts, and daily activities with AI-powered insights",
              color: "text-blue-500",
              bgColor: "bg-blue-50 dark:bg-blue-950/20"
            },
            { 
              icon: Apple, 
              title: "Personalized Nutrition", 
              desc: "Get custom meal plans and nutrition advice based on your goals and preferences",
              color: "text-green-500",
              bgColor: "bg-green-50 dark:bg-green-950/20"
            },
            { 
              icon: Brain, 
              title: "AI Health Coach", 
              desc: "Receive intelligent recommendations and coaching tailored to your progress",
              color: "text-purple-500",
              bgColor: "bg-purple-50 dark:bg-purple-950/20"
            },
            { 
              icon: BarChart3, 
              title: "Advanced Analytics", 
              desc: "Visualize your health data with comprehensive charts and trend analysis",
              color: "text-orange-500",
              bgColor: "bg-orange-50 dark:bg-orange-950/20"
            },
            { 
              icon: Target, 
              title: "Goal Management", 
              desc: "Set, track, and achieve your health goals with our smart goal-setting system",
              color: "text-red-500",
              bgColor: "bg-red-50 dark:bg-red-950/20"
            },
            { 
              icon: Heart, 
              title: "Wellness Monitoring", 
              desc: "Monitor vital health metrics and get alerts for important changes",
              color: "text-pink-500",
              bgColor: "bg-pink-50 dark:bg-pink-950/20"
            }
          ].map((feature, i) => (
            <Card key={i} className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold mb-4">See it in action</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience how our AI-powered platform transforms your health data into actionable insights
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { metric: "Health Score", value: "94/100", change: "+12 this week", color: "text-green-500" },
                { metric: "Active Days", value: "28/30", change: "93% consistency", color: "text-blue-500" },
                { metric: "Goals Met", value: "15/18", change: "83% success rate", color: "text-purple-500" }
              ].map((stat, i) => (
                <div key={i} className="bg-background/50 backdrop-blur rounded-lg p-6 border">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mb-1">{stat.metric}</div>
                  <div className={`text-sm ${stat.color}`}>{stat.change}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-muted/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How HealthTracker works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to transform your health</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Connect & Setup", desc: "Link your devices and complete your health profile in minutes" },
              { step: "2", title: "Track & Monitor", desc: "Automatically track your activities, nutrition, and health metrics" },
              { step: "3", title: "Improve & Achieve", desc: "Follow AI-powered recommendations to reach your wellness goals" }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { number: "10K+", label: "Active Users" },
            { number: "95%", label: "Goal Achievement" },
            { number: "4.9★", label: "User Rating" },
            { number: "24/7", label: "AI Support" }
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What our users say</h2>
            <p className="text-xl text-muted-foreground">Real stories from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "Fitness Enthusiast", quote: "HealthTracker helped me lose 30 pounds and maintain a healthy lifestyle. The AI recommendations are spot-on!" },
              { name: "Mike Chen", role: "Busy Professional", quote: "Finally, a health app that understands my schedule. The personalized meal plans fit perfectly into my routine." },
              { name: "Emma Davis", role: "New Mom", quote: "Post-pregnancy fitness was challenging until I found HealthTracker. It adapted to my changing needs perfectly." }
            ].map((testimonial, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Choose your plan</h2>
          <p className="text-xl text-muted-foreground">Start free, upgrade when you're ready</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Free", price: "$0", features: ["Basic tracking", "3 goals", "Weekly reports", "Community access"] },
            { name: "Pro", price: "$9", features: ["Advanced analytics", "Unlimited goals", "AI coaching", "Custom meal plans", "Priority support"], popular: true },
            { name: "Premium", price: "$19", features: ["Everything in Pro", "1-on-1 coaching", "Advanced integrations", "Custom workouts", "Family sharing"] }
          ].map((plan, i) => (
            <Card key={i} className={`relative ${plan.popular ? 'border-primary shadow-lg' : 'border-0 shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">
                  {plan.price}<span className="text-base font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <SignInButton mode="modal">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </SignInButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your health?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already started their wellness journey with HealthTracker
          </p>
          <SignInButton mode="modal">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Start Your Free Trial
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">HealthTracker</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Your AI-powered companion for a healthier lifestyle. Transform your wellness journey with intelligent insights.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 HealthTracker. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Made with ❤️ for your health</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}