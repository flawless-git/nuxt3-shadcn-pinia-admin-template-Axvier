import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.userId;
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    return user?.avatar;
  } catch (error) {
    console.error("Get avatar error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to get avatar",
    });
  }
});
