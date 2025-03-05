import { prisma } from "~/lib/prisma";
import { hash } from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const body = await readBody(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        message: "User ID is required",
      });
    }

    // Basic validation
    if (
      !body.username?.trim() ||
      body.username.length < 3 ||
      body.username.length > 50
    ) {
      throw createError({
        statusCode: 400,
        message: "Username must be between 3 and 50 characters",
      });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(body.username)) {
      throw createError({
        statusCode: 400,
        message: "Username can only contain letters, numbers and underscore",
      });
    }

    if (
      !body.email?.trim() ||
      body.email.length > 255 ||
      !body.email.includes("@")
    ) {
      throw createError({
        statusCode: 400,
        message: "Invalid email format",
      });
    }

    if (
      body.password &&
      (body.password.length < 6 || body.password.length > 32)
    ) {
      throw createError({
        statusCode: 400,
        message: "Password must be between 6 and 32 characters",
      });
    }

    if (!["ADMIN", "USER"].includes(body.role)) {
      throw createError({
        statusCode: 400,
        message: "Invalid role",
      });
    }

    // Check if email/username is taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email.toLowerCase() },
          { username: body.username.toLowerCase() },
        ],
        NOT: { id },
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email atau username sudah digunakan",
      });
    }

    const updateData = {
      username: body.username.toLowerCase(),
      email: body.email.toLowerCase(),
      role: body.role,
    } as {
      username: string;
      email: string;
      role: "ADMIN" | "USER";
      password?: string;
    };

    if (body.password) {
      updateData.password = await hash(body.password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Update user error:", error);
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        message: error.message || "Failed to update user",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Failed to update user",
    });
  }
});
