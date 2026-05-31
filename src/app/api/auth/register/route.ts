import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { apiResponse, apiError } from "@/server/middleware/api-response";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, password, role, ...extra } = body;

    // Basic validation
    if (!fullName || !email || !password) {
      return apiError("Full name, email, and password are required", "VALIDATION_ERROR", 400);
    }

    if (password.length < 8) {
      return apiError("Password must be at least 8 characters", "VALIDATION_ERROR", 400);
    }

    // Check existing user
    const existing = await prisma.user.findFirst({ where: { email: email.toLowerCase() } });
    if (existing) {
      return apiError("An account with this email already exists", "CONFLICT", 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const publicId = nanoid(21);

    // Create user + profile in a transaction
    const user = await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          publicId,
          email: email.toLowerCase(),
          phone: phone || null,
          fullName,
          passwordHash: hashedPassword,
          role: role === "NURSE" ? "NURSE" : "PATIENT",
          status: "ACTIVE",
          emailVerified: false,
        },
      });

      // Create role-specific profile
      if (role === "NURSE") {
        await tx.nurseProfile.create({
          data: {
            publicId: nanoid(21),
            userId: newUser.id,
            gender: extra.gender || null,
            dateOfBirth: extra.dateOfBirth ? new Date(extra.dateOfBirth) : null,
            address: extra.address || null,
            city: extra.city || null,
            state: extra.state || null,
            experience: extra.experience || null,
            qualifications: extra.qualifications ? extra.qualifications.split(",").map((q: string) => q.trim()) : [],
            certifications: extra.certifications ? extra.certifications.split(",").map((c: string) => c.trim()) : [],
            verificationStatus: "PENDING",
            preferredContact: extra.preferredContact || null,
          },
        });
      } else {
        await tx.patientProfile.create({
          data: {
            publicId: nanoid(21),
            userId: newUser.id,
            address: extra.address || null,
            city: extra.city || null,
            state: extra.state || null,
            registrationStatus: "PRE_REGISTERED",
          },
        });

        // Auto-add to waitlist
        const waitlistExists = await tx.waitlist.findFirst({
          where: { email: email.toLowerCase() },
        });
        if (!waitlistExists) {
          await tx.waitlist.create({
            data: {
              publicId: nanoid(21),
              email: email.toLowerCase(),
              name: fullName,
              phone: phone || null,
              source: "registration",
            },
          });
        }
      }

      return newUser;
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
    const refreshToken = await signRefreshToken({ userId: String(user.id), tokenId: publicId });

    const response = apiResponse(
      {
        user: {
          publicId: user.publicId,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
      },
      201
    );

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
    console.error("Registration error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
