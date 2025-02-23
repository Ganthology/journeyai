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

    const id = request?.nextUrl?.searchParams?.get("id");

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
        resources: true,
        todos: true,
      },
    });

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const notionUrl = await createNotionPage(note);

    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: { notionUrl },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    console.error("[NOTE_SYNC]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
