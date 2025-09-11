import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate date range
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    switch (range) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    startDate.setHours(0, 0, 0, 0);

    // Fetch daily logs within the date range
    const dailyLogs = await db.dailyLog.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: "asc"
      }
    });

    // Format the data for the chart
    const progressData = dailyLogs.map(log => ({
      date: log.date.toISOString().split('T')[0],
      steps: log.steps || 0,
      score: log.score || 0,
      waterIntake: log.waterIntake || 0,
      completed: log.completed
    }));

    return NextResponse.json(progressData);
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}