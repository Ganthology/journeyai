import { auth as clerkAuth } from "@clerk/nextjs/server";
import { auth as getAuth } from "@clerk/nextjs/server";

export const auth = async () => {
  const { userId } = await getAuth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return {
    user: {
      id: userId,
    },
  };
};

export const authMiddleware = async () => {
  const { userId } = await clerkAuth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return {
    user: {
      id: userId,
    },
  };
};
