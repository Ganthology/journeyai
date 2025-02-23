import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const todo = await prisma.todo.findFirst({
      where: {
        id: params.id,
        note: {
          conversation: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!todo) {
      return new NextResponse("Not found", { status: 404 });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: { completed: !todo.completed },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error("[TODO_TOGGLE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 