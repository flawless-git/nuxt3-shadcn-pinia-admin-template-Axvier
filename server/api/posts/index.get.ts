import { prisma } from "~/lib/prisma";

export default defineEventHandler(async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  } catch (error) {
    console.error("Get posts error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch posts",
    });
  }
});
