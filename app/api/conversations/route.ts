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
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { type, title } = body;

    if (!type || !title) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const conversation = await conversationsService.create({
      userId: session.user.id,
      type,
      title,
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("[CONVERSATIONS_POST]", error);
    return NextResponse.json([]);
  }
}
