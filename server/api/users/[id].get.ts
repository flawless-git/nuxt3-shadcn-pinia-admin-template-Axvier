import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    return user;
  } catch (error) {
    console.error("Get user error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch user",
    });
  }
});
