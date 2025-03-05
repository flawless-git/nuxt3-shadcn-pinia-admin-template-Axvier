import { prisma } from "~/lib/prisma";
import { hash } from "bcrypt";

export default defineEventHandler(async (event) => {
  try {
    // Validate request body exists
    const body = await readBody(event);
    if (!body) {
      throw createError({
        statusCode: 400,
        message: "Request body is required",
      });
    }

    const { username, email, password, role } = body;

    // Basic validation
    if (
      !username ||
      typeof username !== "string" ||
      username.length < 3 ||
      username.length > 50 ||
      !/^[a-zA-Z0-9_]+$/.test(username)
    ) {
      throw createError({
        statusCode: 400,
        message:
          "Invalid username. Must be 3-50 characters and contain only letters, numbers and underscore",
      });
    }

    if (
      !email ||
      typeof email !== "string" ||
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw createError({
        statusCode: 400,
        message: "Invalid email address",
      });
    }

    if (
      !password ||
      typeof password !== "string" ||
      password.length < 6 ||
      password.length > 32
    ) {
      throw createError({
        statusCode: 400,
        message: "Password must be between 6 and 32 characters",
      });
    }

    if (!role || !["ADMIN", "USER"].includes(role)) {
      throw createError({
        statusCode: 400,
        message: "Invalid role. Must be either ADMIN or USER",
      });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: "Email atau username sudah digunakan",
      });
    }

    // Create user
    try {
      const hashedPassword = await hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: hashedPassword,
          role,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      console.error("Database error:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to create user in database",
      });
    }
  } catch (error) {
    console.error("Create user error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create user",
    });
  }
});
