import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Get and validate ID
    const id = Number(event.context.params?.id);
    if (!id || isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: "Invalid post ID",
      });
    }

    // Get body
    const body = await readBody(event);

    // Check if post exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: "Post not found",
      });
    }

    // Update post
    const post = await prisma.post.update({
      where: { id },
      data: body,
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

    return post;
  } catch (error) {
    console.error("Update post error:", error);

    throw createError({
      statusCode: 500,
      message: "Failed to update post",
    });
  }
});
