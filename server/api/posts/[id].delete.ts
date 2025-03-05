import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    await prisma.post.delete({
      where: { id },
    });

    return {
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Delete post error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete post",
    });
  }
});
