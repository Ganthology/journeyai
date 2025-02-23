import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createNotionPage } from "@/lib/notion";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return new NextResponse("Missing note ID", { status: 400 });
    }

    const note = await prisma.note.findFirst({
      where: {
        id,
        conversation: {
          userId: session.user.id,
        },
      },
      include: {
        conversation: {
          select: {
            title: true,
            type: true,
          },
        },
        resources: {
          select: {
            title: true,
          },
        },
        todos: {
          select: {
            task: true,
            completed: true,
          },
        },
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const notionUrl = await createNotionPage({
      id: note.id,
      content: note.content,
      conversation: note.conversation,
      resources: note.resources,
      todos: note.todos,
    });

    console.log("notionUrl", notionUrl);

    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: { notionUrl: "temp-notion-url" },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("[NOTE_SYNC]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
