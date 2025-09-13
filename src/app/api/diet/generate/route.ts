// src/app/api/diet/generate/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { height, weight, goal, age, gender } = dbUser;

    if (!height || !weight || !goal) {
      return NextResponse.json({ error: "Incomplete user profile" }, { status: 400 });
    }

    // Shorter, more focused prompt for faster response
    const prompt = `Create a simple daily diet plan for: ${height}cm, ${weight}kg, ${age}y, ${gender}, goal: ${goal}. 
JSON format:
{
  "meals": [
    {"name": "Breakfast", "description": "brief", "calories": 400},
    {"name": "Lunch", "description": "brief", "calories": 500},
    {"name": "Dinner", "description": "brief", "calories": 450}
  ],
  "waterIntake": 2.5,
  "tips": ["tip1", "tip2"]
}`;

    // Optimized API call with faster model and settings
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free", // Faster, smaller model
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower for faster, more consistent responses
        max_tokens: 500,   // Reduced token limit
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const dietPlanText = data?.choices?.[0]?.message?.content;

    if (!dietPlanText) {
      // Fallback diet plan if API fails
      return NextResponse.json({
        plan: {
          meals: [
            { name: "Breakfast", description: "Oatmeal with fruits", calories: 400 },
            { name: "Lunch", description: "Grilled chicken salad", calories: 500 },
            { name: "Dinner", description: "Fish with vegetables", calories: 450 }
          ],
          waterIntake: 2.5,
          tips: ["Eat regularly", "Stay hydrated"]
        }
      });
    }

    try {
      const dietPlan = JSON.parse(dietPlanText);
      return NextResponse.json({ plan: dietPlan });
    } catch {
      return NextResponse.json({ plan: { text: dietPlanText } });
    }

  } catch (error) {
    console.error("Error generating diet plan:", error);
    
    // Return fallback plan on error
    return NextResponse.json({
      plan: {
        meals: [
          { name: "Breakfast", description: "Healthy breakfast", calories: 400 },
          { name: "Lunch", description: "Balanced lunch", calories: 500 },
          { name: "Dinner", description: "Light dinner", calories: 450 }
        ],
        waterIntake: 2.5,
        tips: ["Eat balanced meals", "Drink plenty of water"]
      }
    });
  }
}
