import { prisma } from "@/lib/db";

export const notesService = {
  async getByConversationId(conversationId: string, userId: string) {
    const note = await prisma.note.findFirst({
      where: {
        conversationId,
        conversation: {
          userId,
        },
      },
    });

    if (note) {
      try {
        // Try to parse the content as JSON
        note.content = JSON.parse(note.content);
      } catch {
        // If parsing fails, content is already a string
      }
    }

    return note;
  },

  async getAllByUserId(userId: string) {
    const notes = await prisma.note.findMany({
      where: {
        conversation: {
          userId,
        },
      },
      include: {
        conversation: {
          select: {
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notes.map(note => ({
      ...note,
      content: tryParseJSON(note.content),
    }));
  },
};

// Helper function to try parsing JSON
function tryParseJSON(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
} 