import { checkVerificationToken } from "@/lib/auth/otp";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validators";
import { apiHandler, parseBody, successResponse, errorResponse } from "@/server/middleware/api-response";

export const POST = apiHandler(async (request: Request) => {
  const body = await parseBody(request, resetPasswordSchema);

  const email = await checkVerificationToken(body.token);
  if (!email) {
    return errorResponse("INVALID_TOKEN", "Verification token is invalid or expired", 400);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return errorResponse("USER_NOT_FOUND", "User not found", 404);
  }

  const passwordHash = await hashPassword(body.password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash,
      loginAttempts: 0,
      lockedUntil: null,
    },
  });

  // Revoke all refresh tokens for security
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, revoked: false },
    data: { revoked: true },
  });

  return successResponse({ message: "Password reset successfully. Please log in." });
});
