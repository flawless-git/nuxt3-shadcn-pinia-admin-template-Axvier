import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  // Check if user is authenticated and is admin
  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  try {
    const query = getQuery(event);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 8;
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
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
      }),
      prisma.post.count(),
    ]);

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
    console.error("Get posts error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch posts",
    });
  }
});
