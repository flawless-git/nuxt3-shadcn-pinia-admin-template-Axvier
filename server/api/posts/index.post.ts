import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    console.log("Received request body:", body);

    // Basic validation
    if (
      !body.title?.trim() ||
      body.title.length < 3 ||
      body.title.length > 255
    ) {
      throw createError({
        statusCode: 400,
        message: "Title must be between 3 and 255 characters",
      });
    }

    if (!body.content?.trim() || body.content.length < 10) {
      throw createError({
        statusCode: 400,
        message: "Content must be at least 10 characters",
      });
    }

    if (typeof body.published !== "boolean") {
      throw createError({
        statusCode: 400,
        message: "Published must be a boolean",
      });
    }

    if (!body.authorId) {
      throw createError({
        statusCode: 400,
        message: "Author ID is required",
      });
    }

    // First check if author exists
    const author = await prisma.user.findUnique({
      where: { id: body.authorId },
    });

    if (!author) {
      throw createError({
        statusCode: 400,
        message: "Author not found",
      });
    }

    // Create post using transaction
    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          title: body.title.trim(),
          content: body.content.trim(),
          published: body.published,
          authorId: body.authorId,
        },
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

      console.log("Created post:", created);
      return created;
    });

    return post;
  } catch (error) {
    console.error("Create post error:", error);

    if (error === "P2003") {
      throw createError({
        statusCode: 400,
        message: "Invalid author ID or author does not exist",
      });
    }

    throw createError({
      statusCode: 500,
      message: "Failed to create post",
    });
  } finally {
    await prisma.$disconnect();
  }
});
