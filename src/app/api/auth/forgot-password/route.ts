import { generateOTP } from "@/lib/auth/otp";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validators";
import { apiHandler, parseBody, successResponse, errorResponse } from "@/server/middleware/api-response";

export const POST = apiHandler(async (request: Request) => {
  const body = await parseBody(request, forgotPasswordSchema);

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user) {
    try {
      const otp = await generateOTP(body.email);

      // In production, send OTP via email. For now, log it in dev.
      if (process.env.NODE_ENV === "development") {
        console.log(`[OTP] Code for ${body.email}: ${otp}`);
      }

      // TODO: Queue email via BullMQ
      // await emailQueue.add("send-otp", { email: body.email, otp, name: user.fullName });
    } catch (err) {
      if ((err as Error).message.includes("Too many OTP requests")) {
        return errorResponse("RATE_LIMITED", "Too many OTP requests. Please try again later.", 429);
      }
      throw err;
    }
  }

  return successResponse({
    message: "If an account exists with this email, you will receive an OTP shortly.",
  });
});
