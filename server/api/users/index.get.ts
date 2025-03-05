import { prisma } from "~/lib/prisma";

export default defineEventHandler(async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Get users error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch users",
    });
  }
});
