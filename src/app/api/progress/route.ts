import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';
    
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const dailyLogs = await prisma.dailyLog.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Format data for chart
    const progressData = dailyLogs.map(log => ({
      date: log.date.toISOString().split('T')[0],
      steps: log.steps,
      score: log.score,
      waterIntake: log.waterIntake,
      completed: log.completed,
    }));

    return NextResponse.json(progressData);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
