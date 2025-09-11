import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get today's date in UTC
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's daily log
    const dailyLog = await db.dailyLog.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!dailyLog) {
      // Return empty log if none exists
      return NextResponse.json({
        id: "",
        userId: user.id,
        date: today.toISOString(),
        steps: null,
        completed: false,
        score: 0,
        dietPlan: null,
        waterIntake: null,
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      });
    }

    return NextResponse.json(dailyLog);
  } catch (error) {
    console.error("Error fetching today's daily log:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}