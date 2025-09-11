import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Match your Clerk user with DB user
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyLog = await db.dailyLog.findFirst({
      where: {
        userId: dbUser.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    if (!dailyLog) {
      return NextResponse.json({
        id: "",
        userId: dbUser.id,
        date: today.toISOString(),
        steps: null,
        completed: false,
        score: 0,
        dietPlan: null,
        waterIntake: null,
        createdAt: today.toISOString(),
        updatedAt: today.toISOString(),
      });
    }

    return NextResponse.json(dailyLog);
  } catch (error) {
    console.error("Error fetching today's daily log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
