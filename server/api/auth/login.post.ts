import { compare } from "bcrypt";
import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username: email }, // email field contains either email or username
        ],
      },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        message: "Email/Username atau password salah",
      });
    }

    // Verify password
    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Email/Username atau password salah",
      });
    }

    // Create token (in production, use proper JWT)
    const token = `dummy-token-${user.id}-${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
