import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens, getGoogleProfile } from "@/lib/auth/google-oauth";
import { signAccessToken, signRefreshToken, setAuthCookies } from "@/lib/auth/jwt";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/constants";
import { hashPassword } from "@/lib/auth/password";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${appUrl}/login?error=google_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=no_code`);
  }

  // Validate state parameter
  const cookieStore = await cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_state`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);
    const profile = await getGoogleProfile(tokens.access_token);

    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: profile.id }, { email: profile.email }],
      },
    });

    if (!user) {
      // Create new user as patient by default
      const randomPassword = nanoid(32);
      const passwordHash = await hashPassword(randomPassword);

      user = await prisma.user.create({
        data: {
          email: profile.email,
          fullName: profile.name,
          passwordHash,
          role: "PATIENT",
          status: "PENDING_APPROVAL",
          emailVerified: profile.verified_email,
          avatarUrl: profile.picture,
          googleId: profile.id,
          patientProfile: {
            create: {
              registrationStatus: "WAITLISTED",
            },
          },
        },
      });

      // Add to waitlist
      await prisma.waitlist.upsert({
        where: { email: profile.email },
        update: {},
        create: {
          email: profile.email,
          name: profile.name,
          source: "google-signup",
        },
      });
    } else if (!user.googleId) {
      // Link Google account to existing user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: profile.id,
          avatarUrl: user.avatarUrl || profile.picture,
          emailVerified: true,
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date(), loginAttempts: 0, lockedUntil: null },
    });

    const permissions = DEFAULT_ROLE_PERMISSIONS[user.role] || [];

    // Generate tokens
    const tokenId = nanoid(32);
    const accessToken = await signAccessToken({
      userId: user.id,
      publicId: user.publicId,
      email: user.email,
      role: user.role,
      permissions,
    });
    const refreshToken = await signRefreshToken({ userId: user.id, tokenId });

    await prisma.refreshToken.create({
      data: {
        token: tokenId,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await setAuthCookies(accessToken, refreshToken);

    // Redirect to appropriate dashboard
    const dashboardPaths: Record<string, string> = {
      SUPER_ADMIN: "/super-admin",
      ADMIN: "/admin",
      NURSE: "/nurse",
      PATIENT: "/patient",
    };
    const redirectPath = dashboardPaths[user.role] || "/";

    const response = NextResponse.redirect(`${appUrl}${redirectPath}`);
    // Clear the oauth state cookie
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/login?error=google_failed`);
  }
}
