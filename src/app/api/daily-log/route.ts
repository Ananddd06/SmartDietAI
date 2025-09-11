import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser(); // async, gets the logged-in Clerk user

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { steps, completed, score, dietPlan, waterIntake } = body;

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Today's date in UTC (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if daily log exists for today
    const existingLog = await db.dailyLog.findFirst({
      where: {
        userId: dbUser.id,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    });

    let dailyLog;

    if (existingLog) {
      // Update existing log
      const updateData: any = {};
      if (steps !== undefined) updateData.steps = steps;
      if (completed !== undefined) updateData.completed = completed;
      if (score !== undefined) updateData.score = score;
      if (dietPlan !== undefined) updateData.dietPlan = JSON.stringify(dietPlan); // <-- serialize
      if (waterIntake !== undefined) updateData.waterIntake = waterIntake;

      dailyLog = await db.dailyLog.update({
        where: { id: existingLog.id },
        data: updateData,
      });
    } else {
      // Create new log
      dailyLog = await db.dailyLog.create({
        data: {
          userId: dbUser.id,
          steps: steps || null,
          completed: completed || false,
          score: score || 0,
          dietPlan: dietPlan ? JSON.stringify(dietPlan) : null, // <-- serialize
          waterIntake: waterIntake || null,
          date: today,
        },
      });
    }

    // Parse dietPlan back to object before sending
    const result = {
      ...dailyLog,
      dietPlan: dailyLog.dietPlan ? JSON.parse(dailyLog.dietPlan) : null,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error updating daily log:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
