import { auth } from "@/lib/auth";
import { notesService } from "@/lib/db/notes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const notes = await notesService.getAllByUserId(session.user.id);
    return NextResponse.json(notes);
  } catch (error) {
    console.error("[NOTES_GET]", error);
    return NextResponse.json([]);
  }
} 