import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { apiResponse, apiError } from "@/server/middleware/api-response";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return apiError("Email and password are required", "VALIDATION_ERROR", 400);
    }

    // Find user (including soft-deleted check is handled by extension)
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.passwordHash) {
      return apiError("Invalid email or password", "UNAUTHORIZED", 401);
    }

    // Check account status
    if (user.status === "SUSPENDED") {
      return apiError("Your account has been suspended. Contact support.", "FORBIDDEN", 403);
    }

    // Verify password
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      // Update failed login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: { increment: 1 } },
      });
      return apiError("Invalid email or password", "UNAUTHORIZED", 401);
    }

    // Reset login attempts and update last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lastLoginAt: new Date(),
      },
    });

    // Generate tokens
    const tokenPayload = {
      userId: String(user.id),
      publicId: user.publicId,
      email: user.email,
      role: user.role,
      permissions: [] as string[],
    };
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken({ userId: String(user.id), tokenId: user.publicId });

    const response = apiResponse({
      user: {
        publicId: user.publicId,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });

    // Set cookies
    response.cookies.set("mendyr_access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60,
      path: "/",
    });
    response.cookies.set("mendyr_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
