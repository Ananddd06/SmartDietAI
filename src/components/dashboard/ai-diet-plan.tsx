"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Apple, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

interface AIDietPlanProps {
  userProfile?: any;
}

export function AIDietPlan({ userProfile }: AIDietPlanProps) {
  const [dietPlan, setDietPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [expandedMeals, setExpandedMeals] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Load existing diet plan on component mount
    loadExistingDietPlan();
  }, []);

  const loadExistingDietPlan = async () => {
    try {
      const response = await fetch("/api/daily-log/today");
      if (response.ok) {
        const log = await response.json();
        if (log.dietPlan) {
          setDietPlan(log.dietPlan);
        }
      }
    } catch (error) {
      console.error("Error loading diet plan:", error);
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
  };

  const toggleMealExpansion = (mealIndex: number) => {
    const newExpanded = new Set(expandedMeals);
    if (newExpanded.has(mealIndex)) {
      newExpanded.delete(mealIndex);
    } else {
      newExpanded.add(mealIndex);
    }
    setExpandedMeals(newExpanded);
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
        
        // Save to database
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

  const renderMarkdownDiet = (markdown: string) => {
    if (!markdown) return null;

    const lines = markdown.split('\n');
    let itemIndex = 0;
    const meals = [
      { name: 'Morning', icon: '🌅', items: [], color: 'from-orange-400 to-pink-400' },
      { name: 'Afternoon', icon: '☀️', items: [], color: 'from-yellow-400 to-orange-400' },
      { name: 'Evening', icon: '🌆', items: [], color: 'from-purple-400 to-indigo-400' },
      { name: 'Snacks', icon: '🍎', items: [], color: 'from-green-400 to-blue-400' }
    ];

    let currentMealIndex = 0;

    lines.forEach((line) => {
      if (line.startsWith('## ')) {
        const mealName = line.replace('## ', '').toLowerCase();
        if (mealName.includes('breakfast') || mealName.includes('morning')) currentMealIndex = 0;
        else if (mealName.includes('lunch') || mealName.includes('afternoon')) currentMealIndex = 1;
        else if (mealName.includes('dinner') || mealName.includes('evening')) currentMealIndex = 2;
        else if (mealName.includes('snack')) currentMealIndex = 3;
      } else if (line.startsWith('- ')) {
        const itemText = line.replace('- ', '').replace('[ ]', '').trim();
        if (itemText && currentMealIndex < 4) {
          meals[currentMealIndex].items.push({ id: `item-${itemIndex++}`, text: itemText });
        }
      }
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map((meal, index) => {
          const completedItems = meal.items.filter((item: any) => checkedItems.has(item.id)).length;
          const progress = meal.items.length > 0 ? (completedItems / meal.items.length) * 100 : 0;
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Compact Header */}
              <div className={`bg-gradient-to-r ${meal.color} p-3`}>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{meal.icon}</span>
                    <span className="font-medium text-sm">{meal.name}</span>
                  </div>
                  <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {completedItems}/{meal.items.length}
                  </div>
                </div>
                <div className="mt-2 bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Compact Items */}
              <div className="p-3 space-y-2">
                {meal.items.slice(0, expandedMeals.has(index) ? meal.items.length : 4).map((item: any) => {
                  const isChecked = checkedItems.has(item.id);
                  return (
                    <div key={item.id} className="flex items-center gap-2 group">
                      <div className="relative">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="h-4 w-4 border-2 border-gray-400 dark:border-gray-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 bg-white dark:bg-gray-700"
                        />
                      </div>
                      <span className={`text-xs flex-1 ${
                        isChecked 
                          ? 'line-through text-gray-400 dark:text-gray-500' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {item.text}
                      </span>
                      {isChecked && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                    </div>
                  );
                })}
                
                {meal.items.length > 4 && (
                  <button
                    onClick={() => toggleMealExpansion(index)}
                    className="w-full text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-center pt-2 border-t border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    {expandedMeals.has(index) 
                      ? `Show less` 
                      : `+${meal.items.length - 4} more items`
                    }
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Compact Progress Summary */}
        <div className="md:col-span-2 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                Daily Progress
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {Math.round((checkedItems.size / (markdown.match(/- /g) || []).length) * 100)}%
              </div>
              <div className="text-xs text-green-600 font-medium">
                +{Math.min(Math.round((checkedItems.size / (markdown.match(/- /g) || []).length) * 30), 30)} pts
              </div>
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((checkedItems.size / (markdown.match(/- /g) || []).length) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="h-5 w-5 text-green-600" />
          AI Generated Diet Plan
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          Personalized meal plan based on your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
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
          
          {dietPlan && (
            <Badge variant="default">
              AI Generated
            </Badge>
          )}
        </div>

        {dietPlan ? (
          <div className="space-y-4">
            {renderMarkdownDiet(dietPlan)}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Apple className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Diet Plan Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Generate your personalized AI diet plan to get started
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Sparkles className="h-4 w-4" />
              <span>Powered by AI</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
