import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 8;
    const skip = (page - 1) * limit;

    // Get total count of published posts
    const total = await prisma.post.count({
      where: { published: true },
    });

    // Get paginated published posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
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
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Get published posts error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch published posts",
    });
  }
});
