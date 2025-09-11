import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, age, gender, height, weight, goal } = await req.json();

    const existingUser = await db.user.findUnique({ where: { clerkId: user.id } });

    if (existingUser) {
      const updatedUser = await db.user.update({
        where: { clerkId: user.id },
        data: {
          name,
          age: age ? parseInt(age) : null,
          gender,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          goal,
        },
      });
      return NextResponse.json({ success: true, user: updatedUser });
    }

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name,
        age: age ? parseInt(age) : null,
        gender,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        goal,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
