import { prisma } from "@/lib/db";

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
      },
    });
  },

  async create(data: {
    userId: string;
    type: ConversationType;
    title: string;
  }) {
    return prisma.conversation.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
      },
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
