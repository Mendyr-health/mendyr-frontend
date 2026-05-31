import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/server/middleware/api-response";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, source } = await request.json();

    if (!email) {
      return apiError("Email is required", "VALIDATION_ERROR", 400);
    }

    // Check if already on waitlist
    const existing = await prisma.waitlist.findFirst({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return apiResponse({ message: "You're already on the waitlist!" });
    }

    const entry = await prisma.waitlist.create({
      data: {
        publicId: nanoid(21),
        email: email.toLowerCase(),
        name: name || null,
        phone: phone || null,
        source: source || "website",
      },
    });

    return apiResponse(
      { publicId: entry.publicId, message: "Successfully added to the waitlist!" },
      201
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
