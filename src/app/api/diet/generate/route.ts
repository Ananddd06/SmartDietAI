// src/app/api/diet/generate/route.ts
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user profile from database
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Destructure user data for AI prompt
    const { height, weight, goal, age, gender } = dbUser;

    if (!height || !weight || !goal) {
      return NextResponse.json({ error: "Incomplete user profile" }, { status: 400 });
    }

    // Build AI prompt based on database user data
    const prompt = `Given user height (${height}cm), weight (${weight}kg), age (${age || "N/A"}), gender (${gender || "N/A"}), and goal (${goal}), generate a balanced diet plan with meals, portions, and recommended daily water intake in liters. Provide the response in JSON format:
{
  "meals": [
    {
      "name": "Breakfast",
      "description": "Detailed description of the meal",
      "calories": number,
      "portions": "Portion size"
    }
  ],
  "waterIntake": number,
  "tips": ["tip1", "tip2", "tip3"]
}`;

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-235b-a22b:free",
        messages: [
          { role: "system", content: "You are a professional nutritionist and dietitian." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_output_tokens: 1000,
      }),
    });

    const data = await response.json();
    const dietPlanText = data?.output_text || data?.choices?.[0]?.message?.content;

    if (!dietPlanText) throw new Error("No response from AI");

    // Try parsing JSON, fallback to plain text
    try {
      const dietPlan = JSON.parse(dietPlanText);
      return NextResponse.json({ plan: dietPlan });
    } catch {
      return NextResponse.json({ plan: dietPlanText });
    }

  } catch (error) {
    console.error("Error generating diet plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
