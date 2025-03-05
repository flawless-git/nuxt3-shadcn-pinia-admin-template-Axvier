import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const id = Number(event.context.params?.id);

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }

    return post;
  } catch (error) {
    console.error("Get post error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch post",
    });
  }
});
