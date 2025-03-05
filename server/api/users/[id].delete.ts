import { prisma } from "~/lib/prisma";
export default defineEventHandler(async (event) => {
  try {
    const id = event.context.params?.id;
    if (!id) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    // Delete user's posts first
    await prisma.post.deleteMany({
      where: { authorId: id },
    });

    // Then delete the user
    const user = await prisma.user.delete({
      where: { id },
    });

    return user;
  } catch (error) {
    console.error("Delete user error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete user",
    });
  }
});
