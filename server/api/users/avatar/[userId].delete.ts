import { prisma } from "~/lib/prisma";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.params?.userId;
    if (!userId) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    // Get user to check for avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    });

    // Delete avatar file if exists
    if (user?.avatar) {
      const avatarPath = path.join(process.cwd(), "public", user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Update user to remove avatar
    await prisma.user.update({
      where: { id: userId },
      data: { avatar: null },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete avatar error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete avatar",
    });
  }
});
