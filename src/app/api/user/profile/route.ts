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

    const userProfile = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const userProfile = await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
      create: {
        clerkId: userId,
        email: data.email || "",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
