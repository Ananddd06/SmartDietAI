import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get existing data first
    const existing = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
    });

    // Merge with existing data
    const steps = data.steps ?? existing?.steps ?? 0;
    const water = data.waterIntake ?? existing?.waterIntake ?? 0;
    const completed = data.completed ?? existing?.completed ?? false;
    const dietPlan = data.dietPlan ?? existing?.dietPlan ?? "";
    const dietScore = data.dietScore ?? existing?.dietScore ?? 0;

    // Calculate total score
    let score = 0;
    score += Math.min((steps / 10000) * 30, 30); // Steps: 30 points max
    score += Math.min((water / 2.5) * 20, 20);   // Water: 20 points max  
    score += dietScore; // Diet: up to 30 points based on completion
    if (completed) score += 20; // Completion: 20 points

    const dailyLog = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
      update: {
        steps: steps,
        waterIntake: water,
        completed: completed,
        dietPlan: dietPlan,
        score: Math.round(score),
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        date: today,
        steps: steps,
        waterIntake: water,
        completed: completed,
        dietPlan: dietPlan,
        score: Math.round(score),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(dailyLog);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
