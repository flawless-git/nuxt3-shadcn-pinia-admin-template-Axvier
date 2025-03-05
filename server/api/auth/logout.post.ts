export default defineEventHandler(() => {
  // In a real app, you might want to invalidate the token
  // For now, just return success response
  return {
    success: true,
    message: "Logged out successfully",
  };
});
