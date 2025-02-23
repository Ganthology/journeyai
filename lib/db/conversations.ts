import { prisma } from "@/lib/db";
import { ConversationContent } from "@/lib/types/conversation";

export type ConversationType = "ideation" | "reflection";

export const conversationsService = {
  async getAll(userId: string) {
    return prisma.conversation.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        type: true,
        title: true,
        createdAt: true,
        Agent: {
          select: {
            name: true,
          },
        },
        Note: {
          select: {
            content: true,
          },
        },
      },
    });
  },

  async create(data: {
    userId: string;
    type: ConversationType;
    title: string;
    content?: ConversationContent;
  }) {
    // First verify the user exists, create if not
    let user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      // Create user if doesn't exist
      try {
        user = await prisma.user.create({
          data: {
            id: data.userId,
          },
        });
        console.log("Created missing user:", data.userId);
      } catch (error) {
        if (error.code === "P2002") {
          // If user was created concurrently, fetch it
          user = await prisma.user.findUnique({
            where: { id: data.userId },
          });
        } else {
          throw error;
        }
      }
    }

    // Create the conversation with transaction to ensure consistency
    return prisma.$transaction(async (tx) => {
      const conversation = await tx.conversation.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
        },
      });

      if (data.content) {
        await tx.note.create({
          data: {
            conversationId: conversation.id,
            content:
              typeof data.content === "string"
                ? data.content
                : JSON.stringify(data.content),
          },
        });
      }

      return tx.conversation.findUnique({
        where: { id: conversation.id },
        include: {
          Note: true,
        },
      });
    });
  },

  async getById(id: string, userId: string) {
    return prisma.conversation.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        Note: true,
        Agent: true,
      },
    });
  },
};
