import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      exists: !!user,
      userId: session.user.id,
      user,
    });
  } catch (error) {
    console.error("[DEBUG_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 