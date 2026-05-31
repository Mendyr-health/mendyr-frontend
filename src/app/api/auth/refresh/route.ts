import { prisma } from "@/lib/prisma";
import { verifyToken, signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth/jwt";
import { apiHandler, successResponse, errorResponse } from "@/server/middleware/api-response";
import { DEFAULT_ROLE_PERMISSIONS, REFRESH_COOKIE_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";

export const POST = apiHandler(async () => {
  const cookieStore = await cookies();
  const refreshCookie = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (!refreshCookie) {
    return errorResponse("NO_REFRESH_TOKEN", "Refresh token not found", 401);
  }

  let payload: { userId: string; tokenId: string };
  try {
    payload = await verifyToken<{ userId: string; tokenId: string }>(refreshCookie);
  } catch {
    return errorResponse("INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired", 401);
  }

  // Check if refresh token exists and is not revoked
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: payload.tokenId },
  });

  if (!storedToken || storedToken.revoked) {
    return errorResponse("TOKEN_REVOKED", "Refresh token has been revoked", 401);
  }

  if (new Date() > storedToken.expiresAt) {
    return errorResponse("TOKEN_EXPIRED", "Refresh token has expired", 401);
  }

  // Get user
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      roleAssignment: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } },
            },
          },
        },
      },
    },
  });

  if (!user) {
    return errorResponse("USER_NOT_FOUND", "User not found", 404);
  }

  if (user.status === "SUSPENDED") {
    return errorResponse("ACCOUNT_SUSPENDED", "Account is suspended", 403);
  }

  // Revoke old refresh token (rotation)
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  // Build permissions
  let permissions: string[] = [];
  if (user.roleAssignment.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    permissions = user.roleAssignment.flatMap((ra: any) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ra.role.permissions.map((rp: any) => `${rp.permission.resource}:${rp.permission.action}`)
    );
  } else {
    permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];
  }

  // Issue new token pair
  const newTokenId = nanoid(32);
  const accessToken = await signAccessToken({
    userId: user.id,
    publicId: user.publicId,
    email: user.email,
    role: user.role,
    permissions,
  });
  const newRefreshToken = await signRefreshToken({ userId: user.id, tokenId: newTokenId });

  await prisma.refreshToken.create({
    data: {
      token: newTokenId,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  await setAuthCookies(accessToken, newRefreshToken);

  return successResponse({ accessToken });
});
