import { getCurrentUser } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";

export const GET = apiHandler(async (request: Request) => {
  const payload = await getCurrentUser(request);
  if (!payload) {
    return errorResponse("UNAUTHORIZED", "Not authenticated", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      publicId: true,
      email: true,
      phone: true,
      fullName: true,
      role: true,
      status: true,
      emailVerified: true,
      avatarUrl: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    return errorResponse("USER_NOT_FOUND", "User not found", 404);
  }

  return successResponse(user);
});
