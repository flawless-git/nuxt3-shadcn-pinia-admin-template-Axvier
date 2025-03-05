import fs from "fs";
import path from "path";
import { prisma } from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    const userId = event.context.params?.userId;

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        message: "No avatar file uploaded",
      });
    }

    const avatarFile = formData[0];
    if (!avatarFile.filename) {
      throw createError({
        statusCode: 400,
        message: "Invalid file upload",
      });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(avatarFile.type || "")) {
      throw createError({
        statusCode: 400,
        message: "Invalid file type. Only JPEG, PNG and WebP are allowed.",
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${Date.now()}-${avatarFile.filename}`;
    const filepath = path.join(uploadDir, filename);
    const avatarPath = `/uploads/avatars/${filename}`;

    // Save file
    fs.writeFileSync(filepath, avatarFile.data);

    // Update user avatar in database
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarPath },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
      },
    });

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error("Avatar upload error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to upload avatar",
    });
  }
});
