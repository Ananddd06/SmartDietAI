import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await currentUser(); // get the logged-in Clerk user
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (err) {
    console.error("GET /api/user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email } = body;

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    });

    if (dbUser) {
      return NextResponse.json({ message: "User already exists", user: dbUser });
    }

    const newUser = await db.user.create({
      data: {
        clerkId: user.id,
        name: name || user.fullName || "Unknown",
        email: email || user.emailAddresses[0]?.emailAddress,
      },
    });

    return NextResponse.json({ message: "User created", user: newUser });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
