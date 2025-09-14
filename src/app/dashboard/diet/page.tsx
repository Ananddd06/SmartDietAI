"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Apple, Target, Droplets, ArrowLeft, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

export default function DietPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterInput, setWaterInput] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchTodayData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchTodayData = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        setScore(log.score || 0);
        setWaterIntake(log.waterIntake || 0);
        setWaterInput(log.waterIntake?.toString() || "");
        
        // Load existing diet plan if available
        if (log.dietPlan) {
          setDietPlan(log.dietPlan);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const generateDietPlan = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/generate-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userProfile }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setDietPlan(data.dietPlan);
        
        // Save diet plan to daily log
        await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dietPlan: data.dietPlan }),
        });
      }
    } catch (error) {
      console.error("Error generating diet:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateWater = async () => {
    const water = parseFloat(waterInput);
    if (!isNaN(water) && water >= 0) {
      try {
        const response = await fetch("/api/daily-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ waterIntake: water }),
        });
        if (response.ok) {
          const updatedLog = await response.json();
          setWaterIntake(updatedLog.waterIntake);
          setScore(updatedLog.score);
        }
      } catch (error) {
        console.error("Error updating water:", error);
      }
    }
  };

  const toggleItem = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }
    setCheckedItems(newCheckedItems);
    updateScore(newCheckedItems);
  };

  const updateScore = async (completedItems: Set<string>) => {
    const totalItems = (dietPlan.match(/- /g) || []).length;
    const completedCount = completedItems.size;
    const dietScore = totalItems > 0 ? Math.round((completedCount / totalItems) * 30) : 0;
    
    try {
      const response = await fetch("/api/daily-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dietScore }),
      });
      if (response.ok) {
        const updatedLog = await response.json();
        setScore(updatedLog.score);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const renderMarkdownDiet = (markdown: string) => {
    if (!markdown) return null;

    const lines = markdown.split('\n');
    let itemIndex = 0;

    return lines.map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-semibold text-foreground mt-4 mb-2">
            {line.replace('## ', '')}
          </h3>
        );
      }
      
      if (line.startsWith('- ')) {
        const itemId = `item-${itemIndex++}`;
        const itemText = line.replace('- ', '').replace('[ ]', '').trim();
        const isChecked = checkedItems.has(itemId);
        
        return (
          <div key={index} className="flex items-center gap-2 mb-2 ml-4">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => toggleItem(itemId)}
              className="h-4 w-4"
            />
            <span className={`text-sm ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {itemText}
            </span>
            {isChecked && <CheckCircle2 className="h-4 w-4 text-green-600" />}
          </div>
        );
      }
      
      if (line.trim()) {
        return (
          <p key={index} className="text-sm text-muted-foreground mb-1 ml-4">
            {line}
          </p>
        );
      }
      
      return null;
    });
  };

  const completedPercentage = dietPlan ? Math.round((checkedItems.size / (dietPlan.match(/- /g) || []).length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64 pt-16 lg:pt-0 bg-background">
          <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8 lg:space-y-12">
            
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
              <div className="w-16 lg:w-20 h-16 lg:h-20 bg-green-500 rounded-3xl flex items-center justify-center mx-auto">
                <Apple className="h-8 lg:h-10 w-8 lg:w-10 text-white" />
              </div>
              <h1 className="text-3xl lg:text-5xl font-light text-foreground">Diet</h1>
              <p className="text-muted-foreground">Score: {score}/100</p>
            </div>

            {/* Water Intake */}
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-light text-foreground text-center">Water Intake</h3>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Enter liters"
                    value={waterInput}
                    onChange={(e) => setWaterInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={updateWater} className="bg-blue-500 hover:bg-blue-600">
                    Update
                  </Button>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{waterIntake}L</div>
                  <div className="text-sm text-muted-foreground">Goal: 2.5L</div>
                </div>
              </CardContent>
            </Card>

            {/* AI Diet Plan */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-light text-foreground flex items-center gap-2">
                    <Apple className="h-5 w-5 text-green-600" />
                    AI Diet Plan
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </h3>
                  
                  {dietPlan && (
                    <div className="text-sm text-muted-foreground">
                      {completedPercentage}% complete
                    </div>
                  )}
                </div>

                <Button 
                  onClick={generateDietPlan} 
                  disabled={loading || !userProfile}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      {dietPlan ? "Regenerate Diet Plan" : "Generate Diet Plan"}
                    </>
                  )}
                </Button>

                {dietPlan ? (
                  <div className="border rounded-lg p-4 bg-muted/30">
                    {renderMarkdownDiet(dietPlan)}
                    
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        💡 Complete diet items to earn up to 30 points towards your daily score!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Progress: {checkedItems.size} items completed
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Apple className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Click "Generate Diet Plan" to get your personalized meal plan</p>
                    <p className="text-xs mt-2">Or check your dashboard if you already generated one</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  );
}
