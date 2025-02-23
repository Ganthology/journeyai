import { conversationsService } from "@/lib/db/conversations";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const conversations = await conversationsService.getAll(session.user.id);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("[CONVERSATIONS_GET]", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { type, title, content } = body;

    if (!type || !title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    try {
      const conversation = await conversationsService.create({
        userId: session.user.id,
        type,
        title,
        content,
      });

      return NextResponse.json(conversation);
    } catch (error) {
      if (error instanceof Error && error.message.includes('User not found')) {
        return new NextResponse("User not found", { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[CONVERSATIONS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
