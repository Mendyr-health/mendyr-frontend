import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiResponse, apiError } from "@/server/middleware/api-response";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return apiError("Name, email, subject, and message are required", "VALIDATION_ERROR", 400);
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        publicId: nanoid(21),
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        subject,
        message,
        status: "NEW",
      },
    });

    return apiResponse(
      { publicId: inquiry.publicId, message: "Your message has been sent!" },
      201
    );
  } catch (error) {
    console.error("Contact error:", error);
    return apiError("Internal server error", "INTERNAL_ERROR", 500);
  }
}
