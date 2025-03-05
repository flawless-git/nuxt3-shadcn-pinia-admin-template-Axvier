import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const searchQuery = query.q as string;

    // console.log("Search query:", searchQuery);

    // First check if we have any posts
    // const totalPosts = await prisma.post.count();
    // console.log("Total posts in database:", totalPosts);

    // Check published posts
    // const publishedPosts = await prisma.post.count({
    //   where: { published: true },
    // });
    // console.log("Published posts:", publishedPosts);

    // Return empty results for empty/short queries
    if (!searchQuery?.trim()) {
      return {
        query: searchQuery,
        total: 0,
        posts: [],
      };
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
        ],
        published: true,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    // console.log("Found posts:", posts.length);

    return {
      query: searchQuery,
      total: posts.length,
      posts,
    };
  } catch (error) {
    console.error("Search error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to search posts",
    });
  }
});
