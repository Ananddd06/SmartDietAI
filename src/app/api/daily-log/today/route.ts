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

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day

    let dailyLog = await prisma.dailyLog.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: today,
        },
      },
    });

    // Create default log if doesn't exist
    if (!dailyLog) {
      dailyLog = await prisma.dailyLog.create({
        data: {
          userId: userId,
          date: today,
          steps: 0,
          waterIntake: 0,
          score: 0,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(dailyLog);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
