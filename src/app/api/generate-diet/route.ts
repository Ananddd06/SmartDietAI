import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userProfile } = await request.json();

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen-2.5-72b-instruct:free",
        messages: [
          {
            role: "user",
            content: `Generate a personalized daily diet plan for:
            - Age: ${userProfile.age}
            - Gender: ${userProfile.gender}
            - Height: ${userProfile.height}cm
            - Weight: ${userProfile.weight}kg
            - Goal: ${userProfile.goal}

            Format as markdown with:
            ## Breakfast (8:00 AM)
            - [ ] Item 1
            - [ ] Item 2
            
            ## Lunch (1:00 PM)
            - [ ] Item 1
            - [ ] Item 2
            
            ## Dinner (7:00 PM)
            - [ ] Item 1
            - [ ] Item 2
            
            Include calories and nutritional benefits. Keep it simple and practical.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const dietPlan = data.choices?.[0]?.message?.content || "Failed to generate diet plan";

    return NextResponse.json({ dietPlan });
  } catch (error) {
    console.error("Error generating diet:", error);
    return NextResponse.json({ error: "Failed to generate diet plan" }, { status: 500 });
  }
}
